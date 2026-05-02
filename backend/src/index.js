require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const servicesRouter = require('./routes/services');
const specialistsRouter = require('./routes/specialists');
const appointmentsRouter = require('./routes/appointments');
const contactRouter = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, '../public');

const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        // Permitir JS de Google Maps
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://maps.googleapis.com",
          "https://www.google.com"
        ],

        // Permitir iframes (MAPA)
        frameSrc: [
          "'self'",
          "https://www.google.com"
        ],

        // Permitir imágenes del mapa
        imgSrc: [
          "'self'",
          "data:",
          "https://maps.googleapis.com",
          "https://maps.gstatic.com"
        ],

        // Permitir requests (API maps)
        connectSrc: [
          "'self'",
          "https://maps.googleapis.com"
        ],

        // estilos (Google usa inline styles)
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com"
        ],

        // fuentes
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com"
        ],
      },
    },
  })
);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origen no permitido por CORS'));
  },
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.' },
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/services', servicesRouter);
app.use('/api/specialists', specialistsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/contact', contactRouter);

app.use(express.static(publicDir));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }

  return res.sendFile(path.join(publicDir, 'index.html'));
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 LumiPlus fullstack corriendo en puerto ${PORT}`);
});

module.exports = app;
