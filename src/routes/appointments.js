// src/routes/appointments.js

const router = require('express').Router();
const ctrl = require('../controllers/appointmentController');

// Create appointment
router.post('/', ctrl.create);

// List appointments (filter by ?telefono=xxx)
router.get('/', ctrl.list);

// Get single appointment
router.get('/:id', ctrl.getOne);

// Update status (for admin system)
router.put('/:id/status', ctrl.updateStatus);

module.exports = router;
