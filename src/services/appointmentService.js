// src/services/appointmentService.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Convert "YYYY-MM-DD" + "HH:MM" to total minutes since midnight for comparison
 */
function toMinutes(hora) {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Check if two time ranges overlap.
 * Range A: [startA, startA + durA)
 * Range B: [startB, startB + durB)
 * Overlap if: startA < startB + durB AND startB < startA + durA
 */
function hasTimeOverlap(startA, durA, startB, durB) {
  const endA = startA + durA;
  const endB = startB + durB;
  return startA < endB && startB < endA;
}

/**
 * Check for scheduling conflicts on the same date.
 * Returns true if there IS a conflict.
 */
async function hasConflict(fecha, hora, duracion, excludeId = null) {
  const existingAppointments = await prisma.appointment.findMany({
    where: {
      fecha,
      estado: { not: 'rechazada' },
      ...(excludeId && { id: { not: excludeId } }),
    },
  });

  const newStart = toMinutes(hora);

  for (const appt of existingAppointments) {
    const existingStart = toMinutes(appt.hora);
    if (hasTimeOverlap(newStart, duracion, existingStart, appt.duracion)) {
      return true;
    }
  }

  return false;
}

/**
 * Create a new appointment
 */
async function createAppointment(data) {
  const {
    nombre,
    telefono,
    tipo_consulta,
    fecha,
    hora,
    duracion = 60,
    acepta_notificaciones = false,
    push_subscription = null,
  } = data;

  // Conflict check
  const conflict = await hasConflict(fecha, hora, duracion);
  if (conflict) {
    const error = new Error('Ya existe una cita en ese horario');
    error.status = 409;
    throw error;
  }

  const appointment = await prisma.appointment.create({
    data: {
      nombre,
      telefono,
      tipo_consulta,
      fecha,
      hora,
      duracion,
      acepta_notificaciones,
      push_subscription: push_subscription ? JSON.stringify(push_subscription) : null,
    },
  });

  return appointment;
}

/**
 * List appointments — optionally filter by phone number
 */
async function listAppointments(telefono = null) {
  const where = telefono ? { telefono } : {};
  return prisma.appointment.findMany({
    where,
    orderBy: [{ fecha: 'asc' }, { hora: 'asc' }],
  });
}

/**
 * Get a single appointment by ID
 */
async function getAppointmentById(id) {
  const appointment = await prisma.appointment.findUnique({ where: { id } });
  if (!appointment) {
    const error = new Error('Cita no encontrada');
    error.status = 404;
    throw error;
  }
  return appointment;
}

/**
 * Update appointment status — used by external admin system
 */
async function updateAppointmentStatus(id, estado) {
  const validStates = ['pendiente', 'aceptada', 'rechazada'];
  if (!validStates.includes(estado)) {
    const error = new Error(`Estado inválido. Valores permitidos: ${validStates.join(', ')}`);
    error.status = 400;
    throw error;
  }

  const appointment = await getAppointmentById(id);

  return prisma.appointment.update({
    where: { id },
    data: { estado },
  });
}

module.exports = {
  createAppointment,
  listAppointments,
  getAppointmentById,
  updateAppointmentStatus,
};
