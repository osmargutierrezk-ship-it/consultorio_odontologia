// src/app.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const appointmentRoutes = require('./routes/appointments');
const notificationRoutes = require('./routes/notifications');
const errorHandler = require('./middleware/errorHandler');
const { clients } = require('./middleware/sse');

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Static Frontend ───────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../public')));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', notificationRoutes);

// ─── SSE — Real-time updates ───────────────────────────────────────────────────
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable Nginx buffering on Render
  res.flushHeaders();

  const clientId = Date.now() + Math.random();
  clients.set(clientId, res);

  // Send initial ping
  res.write('event: connected\ndata: {"status":"ok"}\n\n');

  // Heartbeat every 25s to keep connection alive through proxies
  const heartbeat = setInterval(() => {
    try {
      res.write(':heartbeat\n\n');
    } catch (_) {
      clearInterval(heartbeat);
    }
  }, 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    clients.delete(clientId);
  });
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'LumiPlus API',
    timestamp: new Date().toISOString(),
  });
});

// ─── Catch-all → serve frontend ───────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
