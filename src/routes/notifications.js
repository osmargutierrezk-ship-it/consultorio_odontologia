// src/routes/notifications.js

const router = require('express').Router();
const ctrl = require('../controllers/notificationController');

// Get VAPID public key (browser needs this to subscribe)
router.get('/vapid-public-key', ctrl.getVapidKey);

// Test push notification
router.post('/test', ctrl.testPush);

module.exports = router;
