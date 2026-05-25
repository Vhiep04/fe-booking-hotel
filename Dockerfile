# ─────────────────────────────────────────
# Stage 1: Build
# ─────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies (postinstall runs `nuxt prepare` automatically)
RUN npm ci

# Copy source code
COPY . .

# Build arguments for public env vars (can be overridden at build time)
ARG NUXT_PUBLIC_API_HOST=http://localhost:5000
ARG NUXT_PUBLIC_API_BASE=https://localhost:44329

ENV NUXT_PUBLIC_API_HOST=$NUXT_PUBLIC_API_HOST
ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE

# Static generate (SPA, ssr: false)
RUN npm run generate

# ─────────────────────────────────────────
# Stage 2: Serve
# ─────────────────────────────────────────
FROM nginx:stable-alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy generated output from builder
COPY --from=builder /app/.output/public /usr/share/nginx/html

# Nginx config — handle SPA client-side routing (fallback to index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
