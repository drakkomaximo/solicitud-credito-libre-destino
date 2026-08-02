# Multi-stage Dockerfile para despliegue de producción
# Compatible con Azure Container Apps, Azure App Service, Railway, Render, etc.

FROM node:20-slim AS builder

WORKDIR /app

# Prisma requiere OpenSSL y ca-certificates para descargar engines
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# 1. Instalar dependencias de build
COPY package*.json bun.lockb* ./
RUN if [ -f bun.lockb ]; then npm install -g bun && bun install; else npm install; fi

# 2. Copiar fuentes y compilar
COPY . .
RUN if [ -f bun.lockb ]; then bunx prisma generate && bun run build; else npx prisma generate && npm run build; fi

# 3. Imagen final de producción
FROM node:20-slim AS runner

WORKDIR /app

# Prisma requiere OpenSSL y ca-certificates en runtime
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh

EXPOSE 3000

# Aplicar migraciones de Prisma antes de iniciar el servidor
CMD ["/bin/sh", "./entrypoint.sh"]

