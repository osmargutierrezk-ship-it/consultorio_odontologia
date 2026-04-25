# ── Build stage ──────────────────────────────────────────────────────────────
# IMPORTANT: Use node:20-slim (Debian) NOT node:20-alpine
# Alpine uses musl + OpenSSL 3.x which is incompatible with Prisma's engine binaries
FROM node:20-slim AS base

WORKDIR /app

# Install OpenSSL (required by Prisma engine)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev for prisma CLI)
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# ── Production stage ──────────────────────────────────────────────────────────
FROM node:20-slim AS production

WORKDIR /app

# Install OpenSSL (required by Prisma engine at runtime)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy node_modules and generated client from build stage
COPY --from=base /app/node_modules ./node_modules

# Copy application source
COPY . .

# Expose port
EXPOSE 3000

# Start (will run prisma db push + server)
CMD ["node", "server.js"]
