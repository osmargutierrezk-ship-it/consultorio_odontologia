// ============================================================
//  LumiPlus – server.js
//  Node.js + Express + MySQL2
// ============================================================

const express = require('express');
const mysql   = require('mysql2/promise');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Conexión a MySQL ─────────────────────────────────────────
const pool = mysql.createPool({
  host     : process.env.DB_HOST     || 'localhost',
  user     : process.env.DB_USER     || 'root',
  password : process.env.DB_PASSWORD || '',
  database : process.env.DB_NAME     || 'lumiplus_db',
  waitForConnections: true,
  connectionLimit   : 10,
});

// ── Helpers ──────────────────────────────────────────────────
function validarCita(body) {
  const { nombre, apellido, telefono, email, fecha_cita, hora_cita, tipo_consulta } = body;
  if (!nombre || !apellido || !telefono || !fecha_cita || !hora_cita || !tipo_consulta)
    return 'Faltan campos obligatorios.';
  if (!['odontologica', 'psicologica'].includes(tipo_consulta))
    return 'tipo_consulta debe ser "odontologica" o "psicologica".';
  return null;
}

// ── Rutas de la API ──────────────────────────────────────────

/**
 * POST /api/citas
 * Crea o actualiza el paciente y registra la cita.
 * Body JSON:
 *   nombre, apellido, telefono, email (opt), fecha_nac (opt),
 *   fecha_cita, hora_cita, motivo (opt), tipo_consulta
 */
app.post('/api/citas', async (req, res) => {
  const error = validarCita(req.body);
  if (error) return res.status(400).json({ ok: false, mensaje: error });

  const {
    nombre, apellido, telefono, email = null,
    fecha_nac = null, fecha_cita, hora_cita,
    motivo = null, tipo_consulta,
  } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Upsert paciente por email (o insertar nuevo si no hay email)
    let pacienteId;
    if (email) {
      const [rows] = await conn.execute(
        'SELECT id FROM pacientes WHERE email = ?', [email]
      );
      if (rows.length > 0) {
        pacienteId = rows[0].id;
        await conn.execute(
          'UPDATE pacientes SET nombre=?, apellido=?, telefono=?, fecha_nac=? WHERE id=?',
          [nombre, apellido, telefono, fecha_nac, pacienteId]
        );
      } else {
        const [result] = await conn.execute(
          'INSERT INTO pacientes (nombre, apellido, telefono, email, fecha_nac) VALUES (?,?,?,?,?)',
          [nombre, apellido, telefono, email, fecha_nac]
        );
        pacienteId = result.insertId;
      }
    } else {
      const [result] = await conn.execute(
        'INSERT INTO pacientes (nombre, apellido, telefono, email, fecha_nac) VALUES (?,?,?,?,?)',
        [nombre, apellido, telefono, null, fecha_nac]
      );
      pacienteId = result.insertId;
    }

    // Insertar cita
    const [citaResult] = await conn.execute(
      `INSERT INTO citas (paciente_id, tipo_consulta, fecha_cita, hora_cita, motivo)
       VALUES (?, ?, ?, ?, ?)`,
      [pacienteId, tipo_consulta, fecha_cita, hora_cita, motivo]
    );

    await conn.commit();

    res.status(201).json({
      ok     : true,
      mensaje: `Cita ${tipo_consulta} agendada exitosamente.`,
      cita_id: citaResult.insertId,
    });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ ok: false, mensaje: 'Error interno al agendar la cita.' });
  } finally {
    conn.release();
  }
});

/**
 * GET /api/citas
 * Devuelve todas las citas. Filtros opcionales:
 *   ?tipo=odontologica|psicologica
 *   ?estado=pendiente|confirmada|cancelada|completada
 *   ?fecha=YYYY-MM-DD
 */
app.get('/api/citas', async (req, res) => {
  const { tipo, estado, fecha } = req.query;
  let sql    = 'SELECT * FROM v_citas_detalle WHERE 1=1';
  const args = [];

  if (tipo)   { sql += ' AND tipo_consulta = ?'; args.push(tipo);   }
  if (estado) { sql += ' AND estado = ?';        args.push(estado); }
  if (fecha)  { sql += ' AND fecha_cita = ?';    args.push(fecha);  }

  try {
    const [rows] = await pool.execute(sql, args);
    res.json({ ok: true, total: rows.length, citas: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener citas.' });
  }
});

/**
 * PATCH /api/citas/:id/estado
 * Actualiza el estado de una cita.
 * Body: { estado: 'confirmada' | 'cancelada' | 'completada' }
 */
app.patch('/api/citas/:id/estado', async (req, res) => {
  const { estado } = req.body;
  const validStates = ['pendiente', 'confirmada', 'cancelada', 'completada'];
  if (!validStates.includes(estado))
    return res.status(400).json({ ok: false, mensaje: 'Estado inválido.' });

  try {
    const [result] = await pool.execute(
      'UPDATE citas SET estado = ? WHERE id = ?',
      [estado, req.params.id]
    );
    if (result.affectedRows === 0)
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