const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/specialists
router.get('/', async (req, res) => {
  try {
    const specialists = await prisma.specialist.findMany({
      where: { isActive: true },
      orderBy: { id: 'asc' },
    });
    res.json({ success: true, data: specialists });
  } catch (error) {
    console.error('Error fetching specialists:', error);
    res.status(500).json({ error: 'Error al obtener especialistas' });
  }
});

// GET /api/specialists/:id
router.get('/:id', async (req, res) => {
  try {
    const specialist = await prisma.specialist.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!specialist) return res.status(404).json({ error: 'Especialista no encontrado' });
    res.json({ success: true, data: specialist });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener especialista' });
  }
});

module.exports = router;
