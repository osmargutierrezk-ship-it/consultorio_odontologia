# ─────────────────────────────────────────────────────────────────
# Stage 1: Dependencies
# ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Copy only package files to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev --ignore-scripts && \
    npm cache clean --force

# ─────────────────────────────────────────────────────────────────
# Stage 2: Production image
# ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

# Security: run as non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser  -u 1001 -S appuser -G appgroup

WORKDIR /app

# Copy production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY --chown=appuser:appgroup server.js  ./server.js
COPY --chown=appuser:appgroup schema.sql ./schema.sql
COPY --chown=appuser:appgroup public/    ./public/

# Metadata
LABEL maintainer="DentalPro DevTeam"
LABEL version="1.0.0"
LABEL description="DentalPro Clínica – Web App"

# Environment defaults (override in Render dashboard)
ENV NODE_ENV=production \
    PORT=3000

EXPOSE 3000

# Switch to non-root user
USER appuser

# Healthcheck for container orchestrators
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Start the server
CMD ["node", "server.js"]
