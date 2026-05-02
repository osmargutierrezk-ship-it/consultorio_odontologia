const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

const contactValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Nombre requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('message').trim().isLength({ min: 10 }).withMessage('Mensaje muy corto'),
];

// POST /api/contact
router.post('/', contactValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, phone, message } = req.body;
    const contact = await prisma.contact.create({
      data: { name, email, phone: phone || null, message },
    });

    res.status(201).json({
      success: true,
      message: '¡Mensaje enviado! Nos pondremos en contacto contigo pronto.',
      data: contact,
    });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
});

// GET /api/contact - clinic info
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Clínica LumiPlus',
      address: '6ta calle 63-01, Pinares del Norte, zona 18, Guatemala',
      phone: '4711-7609',
      whatsapp: '50247117609',
      hours: {
        weekdays: 'Lun - Vie: 8:00 - 18:00',
        saturday: 'Sáb: 8:00 - 13:00',
      },
      social: {
        facebook: 'https://facebook.com/ClinicaLumiPlus',
        instagram: 'https://instagram.com/lumiplus_gt',
      },
      coordinates: {
        lat: 14.6349,
        lng: -90.4803,
      },
    },
  });
});

module.exports = router;
