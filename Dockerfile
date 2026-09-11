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
FROM nginx:alpine AS runner

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration configured for port 8081
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port 8081
EXPOSE 8081

# Health check to ensure Nginx is actively responding on port 8081
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:8081/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
