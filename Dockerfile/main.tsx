# ── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy lockfiles first to leverage Docker layer cache
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy .env files so Vite picks up VITE_* variables at build time
COPY .env* ./

RUN pnpm install --frozen-lockfile

# Copy the rest of the source
COPY . .

RUN pnpm run build

# ── Stage 2: Serve ────────────────────────────────────────────────────────────
FROM nginx:alpine

# Remove default nginx config and replace with SPA config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Cloud Run expects the container to listen on port 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
