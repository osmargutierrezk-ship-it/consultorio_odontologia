// src/controllers/appointmentController.js

const appointmentService = require('../services/appointmentService');
const notificationService = require('../services/notificationService');
const { broadcast } = require('../middleware/sse');

/**
 * POST /api/appointments
 */
async function create(req, res, next) {
  try {
    const {
      nombre,
      telefono,
      tipo_consulta,
      fecha,
      hora,
      duracion,
      acepta_notificaciones,
      push_subscription,
    } = req.body;

    // Basic validation
    if (!nombre || !telefono || !tipo_consulta || !fecha || !hora) {
      const err = new Error('Faltan campos requeridos: nombre, telefono, tipo_consulta, fecha, hora');
      err.status = 400;
      return next(err);
    }

    if (!['odontologica', 'psicologica'].includes(tipo_consulta)) {
      const err = new Error('tipo_consulta debe ser: odontologica o psicologica');
      err.status = 400;
      return next(err);
    }

    // Validate date format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      const err = new Error('Formato de fecha inválido. Use YYYY-MM-DD');
      err.status = 400;
      return next(err);
    }

    // Validate time format HH:MM
    if (!/^\d{2}:\d{2}$/.test(hora)) {
      const err = new Error('Formato de hora inválido. Use HH:MM');
      err.status = 400;
      return next(err);
    }

    const appointment = await appointmentService.createAppointment({
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      tipo_consulta,
      fecha,
      hora,
      duracion: duracion || 60,
      acepta_notificaciones: Boolean(acepta_notificaciones),
      push_subscription: push_subscription || null,
    });

    // Broadcast to all SSE clients
    broadcast('appointment:created', {
      id: appointment.id,
      nombre: appointment.nombre,
      telefono: appointment.telefono,
      fecha: appointment.fecha,
      hora: appointment.hora,
      estado: appointment.estado,
    });

    res.status(201).json({
      success: true,
      message: 'Cita creada correctamente',
      appointment,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/appointments?telefono=xxx
 */
async function list(req, res, next) {
  try {
    const { telefono } = req.query;
    const appointments = await appointmentService.listAppointments(telefono || null);
    res.json({ success: true, appointments });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/appointments/:id
 */
async function getOne(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      const err = new Error('ID inválido');
      err.status = 400;
      return next(err);
    }
    const appointment = await appointmentService.getAppointmentById(id);
    res.json({ success: true, appointment });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/appointments/:id/status
 * Used by external admin system to update appointment status
 */
async function updateStatus(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      const err = new Error('ID inválido');
      err.status = 400;
      return next(err);
    }

    const { estado } = req.body;
    if (!estado) {
      const err = new Error('El campo "estado" es requerido');
      err.status = 400;
      return next(err);
    }

    const updatedAppointment = await appointmentService.updateAppointmentStatus(id, estado);

    // Send push notification based on new status
    if (estado === 'aceptada') {
      notificationService.notifyAppointmentAccepted(updatedAppointment).catch(console.error);
    } else if (estado === 'rechazada') {
      notificationService.notifyAppointmentRejected(updatedAppointment).catch(console.error);
    }

    // Broadcast status change to all SSE clients
    broadcast('appointment:updated', {
      id: updatedAppointment.id,
      telefono: updatedAppointment.telefono,
      estado: updatedAppointment.estado,
      fecha: updatedAppointment.fecha,
      hora: updatedAppointment.hora,
    });

    res.json({
      success: true,
      message: `Estado actualizado a: ${estado}`,
      appointment: updatedAppointment,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list, getOne, updateStatus };
