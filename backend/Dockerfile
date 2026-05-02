FROM node:20-alpine

WORKDIR /app

# Install dependencies first (layer caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source code
COPY src ./src

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000

# Run migrations then start server
CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]
