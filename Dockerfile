# ==============================================================================
# Multi-Stage Dockerfile for Ad Analytics Dashboard (React + Vite + Nginx)
# Configured for Port 8081
# ==============================================================================

# --- Stage 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions first to leverage Docker layer caching
COPY package.json package-lock.json ./

# Install dependencies cleanly (with fallback for cross-platform lockfile resilience)
RUN npm ci || npm install

# Copy source code and config files
COPY . .

# Build the production bundle into /app/dist
RUN npm run build

# --- Stage 2: Production Serving ---
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package.json and install production dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy server script and built assets
COPY server.js ./
COPY --from=builder /app/dist ./dist

# Expose HTTP port 8081
EXPOSE 8081

# Health check to ensure Node is actively responding on port 8081
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:8081/ || exit 1

# Start the Node.js server
CMD ["node", "server.js"]
