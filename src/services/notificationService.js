// src/services/notificationService.js

const webpush = require('web-push');

let vapidConfigured = false;

function initVapid() {
  const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_EMAIL } = process.env;

  if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY && VAPID_EMAIL) {
    webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
    vapidConfigured = true;
    console.log('✅ VAPID configurado para Web Push');
  } else {
    console.warn('⚠️  VAPID keys no configuradas — las notificaciones push están deshabilitadas');
  }
}

// Initialize on module load
initVapid();

/**
 * Get the VAPID public key (shared with browser to subscribe)
 */
function getVapidPublicKey() {
  return process.env.VAPID_PUBLIC_KEY || null;
}

/**
 * Send a push notification to a subscriber
 * @param {string|object} subscription - Push subscription (JSON string or object)
 * @param {object} payload             - { title, body, url? }
 */
async function sendPushNotification(subscription, payload) {
  if (!vapidConfigured) {
    console.warn('Push no enviado: VAPID no configurado');
    return false;
  }

  try {
    const sub = typeof subscription === 'string' ? JSON.parse(subscription) : subscription;
    await webpush.sendNotification(sub, JSON.stringify(payload));
    console.log(`📲 Push enviado a: ${sub.endpoint.substring(0, 50)}...`);
    return true;
  } catch (err) {
    console.error('Error enviando push:', err.message);
    return false;
  }
}

/**
 * Notify a client that their appointment was accepted
 */
async function notifyAppointmentAccepted(appointment) {
  if (!appointment.acepta_notificaciones || !appointment.push_subscription) {
    return false;
  }

  return sendPushNotification(appointment.push_subscription, {
    title: '✅ Cita Confirmada — LumiPlus',
    body: `Hola ${appointment.nombre}, tu cita del ${appointment.fecha} a las ${appointment.hora} ha sido aceptada.`,
    url: '/',
    icon: '/assets/logo.svg',
  });
}

/**
 * Notify a client that their appointment was rejected
 */
async function notifyAppointmentRejected(appointment) {
  if (!appointment.acepta_notificaciones || !appointment.push_subscription) {
    return false;
  }

  return sendPushNotification(appointment.push_subscription, {
    title: '❌ Cita No Disponible — LumiPlus',
    body: `Lo sentimos ${appointment.nombre}, tu cita del ${appointment.fecha} a las ${appointment.hora} no pudo ser confirmada. Por favor agenda nuevamente.`,
    url: '/',
    icon: '/assets/logo.svg',
  });
}

module.exports = {
  getVapidPublicKey,
  sendPushNotification,
  notifyAppointmentAccepted,
  notifyAppointmentRejected,
};
