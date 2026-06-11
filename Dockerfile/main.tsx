# ── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Firebase config must be baked into the Vite bundle at build time.
# Pass these as --build-arg when running docker build.
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID

ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID

# Install pnpm
RUN npm install -g pnpm

# Copy lockfiles first to leverage Docker layer cache
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

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
