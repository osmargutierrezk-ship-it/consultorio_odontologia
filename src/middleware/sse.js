// src/middleware/sse.js

/** Map of clientId → res (SSE response object) */
const clients = new Map();

/**
 * Broadcast a JSON event to all connected SSE clients
 * @param {string} event  - event name
 * @param {object} data   - payload
 */
function broadcast(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const [, res] of clients) {
    try {
      res.write(payload);
    } catch (_) {
      // client disconnected
    }
  }
}

module.exports = { clients, broadcast };
