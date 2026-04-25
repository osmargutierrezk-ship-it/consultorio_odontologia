// src/middleware/errorHandler.js

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err.message);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
