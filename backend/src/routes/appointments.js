const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

const appointmentValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Nombre requerido (2-100 caracteres)'),
  body('phone').trim().isLength({ min: 8, max: 20 }).withMessage('Teléfono requerido'),
  body('date').isISO8601().withMessage('Fecha inválida'),
  body('service').trim().notEmpty().withMessage('Servicio requerido'),
  body('email').optional().isEmail().withMessage('Email inválido'),
];

// POST /api/appointments
router.post('/', appointmentValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, phone, email, date, service, message, specialistId } = req.body;

    const appointment = await prisma.appointment.create({
      data: {
        name,
        phone,
        email: email || null,
        date: new Date(date),
        service,
        message: message || null,
        specialistId: specialistId ? parseInt(specialistId) : null,
        status: 'pending',
      },
    });

    res.status(201).json({
      success: true,
      message: '¡Cita agendada exitosamente! Nos pondremos en contacto contigo pronto.',
      data: appointment,
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Error al agendar la cita' });
  }
});

// GET /api/appointments (admin)
router.get('/', async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { createdAt: 'desc' },
      include: { specialist: true },
    });
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener citas' });
  }
});

module.exports = router;
