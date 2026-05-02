const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/services
router.get('/', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { id: 'asc' },
    });
    res.json({ success: true, data: services });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Error al obtener servicios' });
  }
});

// GET /api/services/:slug
router.get('/:slug', async (req, res) => {
  try {
    const service = await prisma.service.findUnique({
      where: { slug: req.params.slug },
    });
    if (!service) return res.status(404).json({ error: 'Servicio no encontrado' });
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener servicio' });
  }
});

module.exports = router;
