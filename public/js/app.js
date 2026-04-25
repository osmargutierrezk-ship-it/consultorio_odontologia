// public/js/app.js
// LumiPlus — Frontend Application

const API = '/api';
let pushSubscription = null;
let sseSource = null;

// ─── Utilities ─────────────────────────────────────────────────────────────────

function $(selector) { return document.querySelector(selector); }
function $$(selector) { return [...document.querySelectorAll(selector)]; }

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map((c) => c.charCodeAt(0)));
}

// ─── Toast System ─────────────────────────────────────────────────────────────

function showToast(message, type = 'info', duration = 4000) {
  const container = $('#toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;

  const icon = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' }[type] || 'ℹ️';
  toast.innerHTML = `<span class="toast__icon">${icon}</span><span class="toast__msg">${message}</span>`;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast--visible'));

  setTimeout(() => {
    toast.classList.remove('toast--visible');
    toast.classList.add('toast--hidden');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

function createToastContainer() {
  const c = document.createElement('div');
  c.id = 'toast-container';
  document.body.appendChild(c);
  return c;
}

// ─── Service Worker & Push ─────────────────────────────────────────────────────

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register('/sw.js');
    console.log('SW registered:', reg.scope);
    return reg;
  } catch (err) {
    console.warn('SW registration failed:', err);
    return null;
  }
}

async function subscribeToPush() {
  try {
    const res = await fetch(`${API}/notifications/vapid-public-key`);
    if (!res.ok) return null;
    const { publicKey } = await res.json();
    if (!publicKey) return null;

    const reg = await navigator.serviceWorker.ready;
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    pushSubscription = subscription.toJSON();
    console.log('Push subscription created');
    return pushSubscription;
  } catch (err) {
    console.warn('Push subscription failed:', err.message);
    return null;
  }
}

async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

// ─── SSE Connection ────────────────────────────────────────────────────────────

function connectSSE(phoneFilter) {
  if (sseSource) sseSource.close();

  sseSource = new EventSource(`${API}/events`);

  sseSource.addEventListener('appointment:updated', (e) => {
    const data = JSON.parse(e.data);

    // Only react if this appointment belongs to the current user (same phone)
    if (phoneFilter && data.telefono !== phoneFilter) return;

    // Update appointment card in DOM if visible
    updateAppointmentCard(data);

    // Show toast
    const statusMessages = {
      aceptada: { msg: `Tu cita del ${data.fecha} a las ${data.hora} fue ✅ aceptada`, type: 'success' },
      rechazada: { msg: `Tu cita del ${data.fecha} a las ${data.hora} fue ❌ rechazada`, type: 'error' },
      pendiente: { msg: `Estado de cita actualizado a pendiente`, type: 'info' },
    };
    const sm = statusMessages[data.estado];
    if (sm) showToast(sm.msg, sm.type, 6000);
  });

  sseSource.addEventListener('appointment:created', () => {
    // Refresh list if watching
    if (phoneFilter && $('#my-appointments-section').classList.contains('visible')) {
      loadMyAppointments(phoneFilter);
    }
  });

  sseSource.onerror = () => {
    setTimeout(() => connectSSE(phoneFilter), 5000);
  };
}

function updateAppointmentCard(data) {
  const card = $(`[data-appointment-id="${data.id}"]`);
  if (!card) return;

  const badge = card.querySelector('.status-badge');
  if (badge) {
    badge.className = `status-badge status-badge--${data.estado}`;
    const labels = { pendiente: 'Pendiente', aceptada: 'Aceptada', rechazada: 'Rechazada' };
    badge.textContent = labels[data.estado] || data.estado;
  }
}

// ─── Form Handling ─────────────────────────────────────────────────────────────

async function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('[type="submit"]');
  const originalText = btn.innerHTML;

  btn.disabled = true;
  btn.innerHTML = '<span class="btn-spinner"></span> Agendando...';

  const formData = new FormData(form);
  const nombre = formData.get('nombre')?.trim();
  const telefono = formData.get('telefono')?.trim();
  const tipo_consulta = formData.get('tipo_consulta');
  const fecha = formData.get('fecha');
  const hora = formData.get('hora');
  const acepta_notificaciones = formData.get('acepta_notificaciones') === 'on';

  // Handle notifications
  if (acepta_notificaciones) {
    const granted = await requestNotificationPermission();
    if (granted) {
      await subscribeToPush();
      if (pushSubscription) showToast('Notificaciones activadas correctamente', 'success', 3000);
    } else {
      showToast('Permiso de notificaciones denegado — se agendará sin notificaciones', 'warning');
    }
  }

  try {
    const response = await fetch(`${API}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        telefono,
        tipo_consulta,
        fecha,
        hora,
        duracion: 60,
        acepta_notificaciones,
        push_subscription: pushSubscription,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      showToast(result.error || 'Error al crear la cita', 'error');
    } else {
      showToast('¡Cita creada exitosamente! Estado: Pendiente', 'success', 5000);
      form.reset();
      pushSubscription = null;

      // Save phone to localStorage for quick lookup
      localStorage.setItem('lumiplus_telefono', telefono);

      // Show the "my appointments" section automatically
      setTimeout(() => loadAndShowMyAppointments(telefono), 800);
    }
  } catch (err) {
    showToast('Error de conexión. Intenta nuevamente.', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

// ─── My Appointments ───────────────────────────────────────────────────────────

async function loadMyAppointments(telefono) {
  const container = $('#appointments-list');
  container.innerHTML = '<div class="appointments-loading"><div class="spinner-large"></div></div>';

  try {
    const res = await fetch(`${API}/appointments?telefono=${encodeURIComponent(telefono)}`);
    const { appointments } = await res.json();

    if (!appointments || appointments.length === 0) {
      container.innerHTML = `
        <div class="appointments-empty">
          <div class="appointments-empty__icon">📅</div>
          <p>No tienes citas registradas con este número</p>
        </div>`;
      return;
    }

    container.innerHTML = appointments.map(renderAppointmentCard).join('');

    // Connect SSE with phone filter
    connectSSE(telefono);
  } catch (err) {
    container.innerHTML = '<div class="appointments-empty"><p>Error al cargar citas</p></div>';
  }
}

function renderAppointmentCard(appt) {
  const tipoLabel = appt.tipo_consulta === 'odontologica' ? '🦷 Odontológica' : '🧠 Psicológica';
  const statusLabels = { pendiente: 'Pendiente', aceptada: 'Aceptada', rechazada: 'Rechazada' };

  // Format date nicely
  const [y, m, d] = appt.fecha.split('-');
  const dateObj = new Date(+y, +m - 1, +d);
  const dateStr = dateObj.toLocaleDateString('es-GT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return `
    <div class="appointment-card" data-appointment-id="${appt.id}">
      <div class="appointment-card__header">
        <div class="appointment-card__tipo">${tipoLabel}</div>
        <span class="status-badge status-badge--${appt.estado}">${statusLabels[appt.estado]}</span>
      </div>
      <div class="appointment-card__body">
        <div class="appointment-card__info">
          <div class="info-item">
            <span class="info-label">📅 Fecha</span>
            <span class="info-value">${dateStr}</span>
          </div>
          <div class="info-item">
            <span class="info-label">🕐 Hora</span>
            <span class="info-value">${appt.hora} hrs (${appt.duracion} min)</span>
          </div>
          <div class="info-item">
            <span class="info-label">👤 Nombre</span>
            <span class="info-value">${appt.nombre}</span>
          </div>
        </div>
      </div>
    </div>`;
}

function loadAndShowMyAppointments(telefono) {
  const section = $('#my-appointments-section');
  section.classList.add('visible');
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  loadMyAppointments(telefono);
}

async function handleMyAppointmentsSearch(e) {
  e.preventDefault();
  const telefono = $('#search-telefono').value.trim();
  if (!telefono) return;
  localStorage.setItem('lumiplus_telefono', telefono);
  await loadMyAppointments(telefono);
  connectSSE(telefono);
}

// ─── Navigation tabs ───────────────────────────────────────────────────────────

function initTabs() {
  const tabs = $$('[data-tab]');
  const panels = $$('[data-panel]');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach((t) => t.classList.toggle('active', t === tab));
      panels.forEach((p) => p.classList.toggle('active', p.dataset.panel === target));
    });
  });
}

// ─── Date constraints ──────────────────────────────────────────────────────────

function initDateConstraints() {
  const fechaInput = $('#fecha');
  if (fechaInput) {
    const today = new Date().toISOString().split('T')[0];
    fechaInput.min = today;
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────

async function init() {
  // Register service worker
  await registerServiceWorker();

  // Init tabs
  initTabs();

  // Date constraints
  initDateConstraints();

  // Form submit
  const appointmentForm = $('#appointment-form');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', handleFormSubmit);
  }

  // My appointments search
  const searchForm = $('#search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', handleMyAppointmentsSearch);
  }

  // Auto-fill phone if returning user
  const savedPhone = localStorage.getItem('lumiplus_telefono');
  if (savedPhone) {
    const searchInput = $('#search-telefono');
    if (searchInput) searchInput.value = savedPhone;
    const phoneInput = $('#telefono');
    if (phoneInput) phoneInput.value = savedPhone;
  }

  // Notification checkbox toggle
  const notifCheckbox = $('#acepta_notificaciones');
  const notifHint = $('#notif-hint');
  if (notifCheckbox && notifHint) {
    notifCheckbox.addEventListener('change', () => {
      notifHint.classList.toggle('visible', notifCheckbox.checked);
    });
  }

  // Start SSE with saved phone
  if (savedPhone) connectSSE(savedPhone);
}

document.addEventListener('DOMContentLoaded', init);
