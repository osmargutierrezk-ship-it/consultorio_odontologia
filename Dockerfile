# ─────────────────────────────────────────────────────────────
# Stage 1: Build React frontend
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./

ARG VITE_API_URL=/api
ARG VITE_GOOGLE_MAPS_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GOOGLE_MAPS_KEY=$VITE_GOOGLE_MAPS_KEY

RUN npm run build

# ─────────────────────────────────────────────────────────────
# Stage 2: Backend runtime + servir frontend
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# OpenSSL requerido por Prisma en Alpine
RUN apk add --no-cache openssl

# 1. Copiar package.json
COPY backend/package*.json ./

# 2. Copiar prisma ANTES de npm ci (postinstall necesita el schema)
COPY backend/prisma ./prisma

# 3. Instalar dependencias (dispara postinstall → prisma generate)
RUN npm ci --omit=dev

# 4. Generar cliente Prisma explícitamente (doble seguro)
RUN npx prisma generate

# 5. Copiar código fuente del backend
COPY backend/src ./src

# 6. Copiar build del frontend → Express lo sirve desde /app/public
COPY --from=frontend-builder /app/frontend/dist ./public

# Usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000

# Migrar DB automáticamente y arrancar
CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]
