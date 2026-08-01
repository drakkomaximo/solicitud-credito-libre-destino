# Multi-stage Dockerfile para despliegue de producción
# Compatible con Azure Container Apps, Azure App Service, Railway, Render, etc.

FROM node:20-alpine AS builder

WORKDIR /app

# 1. Instalar dependencias de build
COPY package*.json bun.lockb* ./
RUN if [ -f bun.lockb ]; then npm install -g bun && bun install; else npm install; fi

# 2. Copiar fuentes y compilar
COPY . .
RUN if [ -f bun.lockb ]; then bunx prisma generate && bun run build; else npx prisma generate && npm run build; fi

# 3. Imagen final de producción
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# Aplicar migraciones de Prisma antes de iniciar el servidor
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && node dist/main"]

