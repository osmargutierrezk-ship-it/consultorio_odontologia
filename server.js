// ============================================================
//  LumiPlus – server.js
//  Node.js + Express + PostgreSQL (Render DATABASE_URL)
// ============================================================

const express    = require('express');
const { Pool }   = require('pg');
const cors       = require('cors');
const path       = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Conexión a PostgreSQL via DATABASE_URL ───────────────────
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
};

// Habilita SSL solo en producción o cuando se requiere explícitamente.
if (process.env.NODE_ENV === 'production' || process.env.DB_SSL === 'true') {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);

pool.connect()
  .then(c => { console.log('✅  Conectado a PostgreSQL'); c.release(); })
  .catch(err => console.error('❌  Error de conexión a DB:', err.message));

// ── Helpers ──────────────────────────────────────────────────
function validarCita(body) {
  const { nombre, apellido, telefono, fecha_cita, hora_cita, tipo_consulta } = body;
  if (!nombre || !apellido || !telefono || !fecha_cita || !hora_cita || !tipo_consulta)
    return 'Faltan campos obligatorios.';
  if (!['odontologica', 'psicologica'].includes(tipo_consulta))
    return 'tipo_consulta debe ser "odontologica" o "psicologica".';
  return null;
}

// ── Rutas de la API ──────────────────────────────────────────

/**
 * POST /api/citas
 */
app.post('/api/citas', async (req, res) => {
  const error = validarCita(req.body);
  if (error) return res.status(400).json({ ok: false, mensaje: error });

  const {
    nombre, apellido, telefono,
    email     = null,
    fecha_nac = null,
    fecha_cita, hora_cita,
    motivo    = null,
    tipo_consulta,
  } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let pacienteId;
    if (email) {
      const existing = await client.query(
        'SELECT id FROM pacientes WHERE email = $1', [email]
      );
      if (existing.rows.length > 0) {
        pacienteId = existing.rows[0].id;
        await client.query(
          'UPDATE pacientes SET nombre=$1, apellido=$2, telefono=$3, fecha_nac=$4 WHERE id=$5',
          [nombre, apellido, telefono, fecha_nac, pacienteId]
        );
      } else {
        const r = await client.query(
          `INSERT INTO pacientes (nombre, apellido, telefono, email, fecha_nac)
           VALUES ($1,$2,$3,$4,$5) RETURNING id`,
          [nombre, apellido, telefono, email, fecha_nac]
        );
        pacienteId = r.rows[0].id;
      }
    } else {
      const r = await client.query(
        `INSERT INTO pacientes (nombre, apellido, telefono, fecha_nac)
         VALUES ($1,$2,$3,$4) RETURNING id`,
        [nombre, apellido, telefono, fecha_nac]
      );
      pacienteId = r.rows[0].id;
    }

    const cita = await client.query(
      `INSERT INTO citas (paciente_id, tipo_consulta, fecha_cita, hora_cita, motivo)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [pacienteId, tipo_consulta, fecha_cita, hora_cita, motivo]
    );

    await client.query('COMMIT');

    res.status(201).json({
      ok     : true,
      mensaje: `Cita ${tipo_consulta} agendada exitosamente.`,
      cita_id: cita.rows[0].id,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ ok: false, mensaje: 'Error interno al agendar la cita.' });
  } finally {
    client.release();
  }
});

/**
 * GET /api/citas
 * Filtros: ?tipo=odontologica|psicologica  ?estado=pendiente  ?fecha=YYYY-MM-DD
 */
app.get('/api/citas', async (req, res) => {
  const { tipo, estado, fecha } = req.query;
  const conditions = [];
  const args       = [];

  if (tipo)   { args.push(tipo);   conditions.push(`tipo_consulta = $${args.length}`); }
  if (estado) { args.push(estado); conditions.push(`estado = $${args.length}`);        }
  if (fecha)  { args.push(fecha);  conditions.push(`fecha_cita = $${args.length}`);    }

  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  const sql   = `SELECT * FROM v_citas_detalle ${where} ORDER BY fecha_cita, hora_cita`;

  try {
    const { rows } = await pool.query(sql, args);
    res.json({ ok: true, total: rows.length, citas: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener citas.' });
  }
});

/**
 * PATCH /api/citas/:id/estado
 */
app.patch('/api/citas/:id/estado', async (req, res) => {
  const { estado } = req.body;
  const validStates = ['pendiente', 'confirmada', 'cancelada', 'completada'];
  if (!validStates.includes(estado))
    return res.status(400).json({ ok: false, mensaje: 'Estado inválido.' });

  try {
    const { rowCount } = await pool.query(
      'UPDATE citas SET estado = $1 WHERE id = $2',
      [estado, req.params.id]
    );
    if (rowCount === 0)
      return res.status(404).json({ ok: false, mensaje: 'Cita no encontrada.' });
    res.json({ ok: true, mensaje: 'Estado actualizado.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar estado.' });
  }
});

// ── Fallback → index.html ────────────────────────────────────
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Arranque ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  LumiPlus server corriendo en http://localhost:${PORT}`);
});