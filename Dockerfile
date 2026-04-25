# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS base

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev for prisma CLI)
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# ── Production stage ──────────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Copy node_modules and generated client
COPY --from=base /app/node_modules ./node_modules

# Copy application source
COPY . .

# Expose port
EXPOSE 3000

# Start (will run db push + server)
CMD ["node", "server.js"]
