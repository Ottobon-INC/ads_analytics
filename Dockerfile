# ==============================================================================
# Multi-Stage Dockerfile for Ad Analytics Dashboard (React + Vite + Nginx)
# Stage 1: Build static assets using Node.js
# Stage 2: Serve optimized assets with ultra-lightweight Nginx Alpine
# ==============================================================================

# --- Stage 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions first to leverage Docker layer caching
COPY package.json package-lock.json ./

# Clean install all dependencies (including devDependencies for Vite build)
RUN npm ci

# Copy source code and config files
COPY . .

# Build the production bundle into /app/dist
RUN npm run build

# --- Stage 2: Production Serving ---
FROM nginx:alpine AS runner

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Health check to ensure Nginx is actively responding
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
