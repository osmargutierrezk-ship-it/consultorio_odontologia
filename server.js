'use strict';

require('dotenv').config();
const express      = require('express');
const { Pool }     = require('pg');
const cors         = require('cors');
const helmet       = require('helmet');
const rateLimit    = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const path         = require('path');
const fs           = require('fs');

// ─── APP SETUP ────────────────────────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 3000;

// ─── DATABASE POOL ────────────────────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }   // Render requiere SSL
    : false,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

// Verificar conexión al iniciar
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌  Error conectando a PostgreSQL:', err.message);
  } else {
    console.log('✅  Conectado a PostgreSQL');
    release();
    initDB();
  }
});

// Crear tabla si no existe (idempotente)
async function initDB() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(sql);
    console.log('✅  Schema de base de datos listo');
  } catch (e) {
    // Si el archivo no está presente en el build, crear tabla mínima
    await pool.query(`
      CREATE TABLE IF NOT EXISTS citas (
        id             SERIAL PRIMARY KEY,
        nombre_completo VARCHAR(150) NOT NULL,
        telefono       VARCHAR(20)  NOT NULL,
        email          VARCHAR(150) NOT NULL,
        fecha          DATE         NOT NULL,
        hora           TIME         NOT NULL,
        motivo         VARCHAR(100) NOT NULL,
        estado         VARCHAR(20)  NOT NULL DEFAULT 'pendiente',
        notas          TEXT,
        created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅  Tabla citas creada (fallback)');
  }
}

// ─── MIDDLEWARES ──────────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'", "'unsafe-inline'", "cdn.tailwindcss.com", "unpkg.com", "cdnjs.cloudflare.com"],
      styleSrc:    ["'self'", "'unsafe-inline'", "fonts.googleapis.com", "cdnjs.cloudflare.com"],
      fontSrc:     ["'self'", "fonts.gstatic.com", "cdnjs.cloudflare.com"],
      imgSrc:      ["'self'", "data:", "https:"],
      frameSrc:    ["'self'", "https://www.google.com"],
      connectSrc:  ["'self'"],
    },
  },
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET', 'POST'],
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiter para el endpoint de citas
const citasLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutos
  max: 10,
  message: { error: 'Demasiadas solicitudes. Por favor espera unos minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── VALIDACIONES ─────────────────────────────────────────────────────────────
const citaValidations = [
  body('nombre_completo')
    .trim().notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3, max: 150 }).withMessage('Nombre entre 3 y 150 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/).withMessage('Nombre inválido'),

  body('telefono')
    .trim().notEmpty().withMessage('El teléfono es obligatorio')
    .matches(/^[\+\d\s\-\(\)]{7,20}$/).withMessage('Teléfono inválido'),

  body('email')
    .trim().notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),

  body('fecha')
    .notEmpty().withMessage('La fecha es obligatoria')
    .isDate().withMessage('Formato de fecha inválido')
    .custom(val => {
      const hoy = new Date(); hoy.setHours(0,0,0,0);
      const d   = new Date(val + 'T00:00:00');
      if (d < hoy) throw new Error('La fecha no puede ser en el pasado');
      // Max 6 meses en adelante
      const max = new Date(); max.setMonth(max.getMonth() + 6);
      if (d > max) throw new Error('Fecha muy lejana (máx 6 meses)');
      return true;
    }),

  body('hora')
    .notEmpty().withMessage('La hora es obligatoria')
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('Hora inválida')
    .custom(val => {
      const [h] = val.split(':').map(Number);
      if (h < 8 || h >= 18) throw new Error('Horario disponible: 08:00–18:00');
      return true;
    }),

  body('motivo')
    .trim().notEmpty().withMessage('El motivo es obligatorio')
    .isLength({ max: 100 }).withMessage('Motivo máximo 100 caracteres'),

  body('notas')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Notas máximo 500 caracteres'),
];

// ─── ROUTES ───────────────────────────────────────────────────────────────────

// Health-check (Render lo usa para verificar el servicio)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// POST /api/citas — Crear nueva cita
app.post('/api/citas', citasLimiter, citaValidations, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: 'Datos inválidos',
      detalles: errors.array().map(e => ({ campo: e.path, mensaje: e.msg })),
    });
  }

  const { nombre_completo, telefono, email, fecha, hora, motivo, notas } = req.body;

  try {
    // Evitar duplicados el mismo día/hora
    const dup = await pool.query(
      `SELECT id FROM citas WHERE fecha = $1 AND hora = $2 AND estado != 'cancelada'`,
      [fecha, hora]
    );
    if (dup.rows.length > 0) {
      return res.status(409).json({
        error: 'Ese horario ya está reservado. Por favor elige otra hora.',
      });
    }

    const result = await pool.query(
      `INSERT INTO citas (nombre_completo, telefono, email, fecha, hora, motivo, notas)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, nombre_completo, fecha, hora, estado, created_at`,
      [nombre_completo, telefono, email, fecha, hora, motivo, notas || null]
    );

    return res.status(201).json({
      mensaje: '¡Cita registrada exitosamente! Te contactaremos para confirmar.',
      cita: result.rows[0],
    });
  } catch (err) {
    console.error('DB Error /api/citas:', err);
    return res.status(500).json({ error: 'Error interno del servidor. Intenta más tarde.' });
  }
});

// GET /api/citas/disponibilidad — Horas ocupadas para una fecha
app.get('/api/citas/disponibilidad', async (req, res) => {
  const { fecha } = req.query;
  if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return res.status(400).json({ error: 'Fecha inválida' });
  }
  try {
    const result = await pool.query(
      `SELECT hora::text FROM citas WHERE fecha = $1 AND estado != 'cancelada'`,
      [fecha]
    );
    const ocupadas = result.rows.map(r => r.hora.substring(0, 5));
    return res.json({ fecha, horasOcupadas: ocupadas });
  } catch (err) {
    console.error('DB Error /api/citas/disponibilidad:', err);
    return res.status(500).json({ error: 'Error interno' });
  }
});

// SPA fallback — sirve index.html para cualquier ruta no reconocida
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── ERROR HANDLER ────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ─── START ────────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🦷  Clínica Dental API corriendo en http://0.0.0.0:${PORT}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
