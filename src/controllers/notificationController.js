// src/controllers/notificationController.js

const notificationService = require('../services/notificationService');

/**
 * GET /api/notifications/vapid-public-key
 */
async function getVapidKey(req, res) {
  const key = notificationService.getVapidPublicKey();
  if (!key) {
    return res.status(503).json({
      success: false,
      error: 'Servicio de notificaciones no configurado en este servidor',
    });
  }
  res.json({ success: true, publicKey: key });
}

/**
 * POST /api/notifications/test
 * Test endpoint — sends a test push to a given subscription
 */
async function testPush(req, res, next) {
  try {
    const { subscription } = req.body;
    if (!subscription) {
      return res.status(400).json({ success: false, error: 'Falta subscription' });
    }

    const sent = await notificationService.sendPushNotification(subscription, {
      title: '🔔 LumiPlus — Notificaciones Activas',
      body: 'Las notificaciones están configuradas correctamente.',
      icon: '/assets/logo.svg',
    });

    res.json({ success: sent });
  } catch (err) {
    next(err);
  }
}

module.exports = { getVapidKey, testPush };
