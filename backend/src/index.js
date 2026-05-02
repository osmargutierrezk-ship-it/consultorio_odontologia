require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const servicesRouter = require('./routes/services');
const specialistsRouter = require('./routes/specialists');
const appointmentsRouter = require('./routes/appointments');
const contactRouter = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.' },
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/services', servicesRouter);
app.use('/api/specialists', specialistsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/contact', contactRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 LumiPlus API corriendo en puerto ${PORT}`);
});

module.exports = app;
