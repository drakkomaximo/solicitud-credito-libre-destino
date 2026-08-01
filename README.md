# Solicitud Digital de Crédito de Libre Destino

Micrositio de originación digital de crédito de libre destino con backend en NestJS (arquitectura hexagonal, TDD) y frontend en Next.js.

## Estructura

```
.
├── backend/       # API NestJS + Prisma + PostgreSQL
├── frontend/      # Next.js App Router + Tailwind + React Hook Form + Zod
├── docker-compose.yml
└── README.md
```

## Tecnologías

- **Backend:** NestJS 11, TypeScript 5.7, Prisma 5, PostgreSQL, Bun, Jest, `@nestjs/swagger`, `@nestjs/terminus`.
- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, React Hook Form, Zod, Lucide icons, Bun.
- **Infraestructura:** Docker, Docker Compose, PostgreSQL 16.

## Requisitos

- Bun 1.3+
- Docker Desktop (para PostgreSQL)
- Node.js 20+ (como fallback)

## Configuración

### Entorno

```bash
cd backend
cp .env.example .env
```

El `.env` incluye `DATABASE_URL=postgresql://credi:credi@localhost:5432/credit`, `PORT=3000` y `ADMIN_SECRET`.

### Levantar todo (PowerShell)

```powershell
cd backend
.\scripts\start-dev.ps1
```

Esto sube PostgreSQL, aplica migraciones, genera el cliente Prisma e inicia NestJS en modo watch.

Para detener:

```powershell
.\scripts\stop-dev.ps1
```

### Manualmente

```bash
docker compose up -d postgres
cd backend
bunx prisma migrate deploy
bunx prisma generate
bun run start:dev
```

- API: http://localhost:3000
- Swagger: http://localhost:3000/api/docs
- Health: http://localhost:3000/health

### Ejecutar frontend

```bash
cd frontend
bun run dev
```

- Frontend: http://localhost:3001

> Ajusta `src/lib/api.ts` si el backend corre en otro puerto.

## Arquitectura del backend

El backend sigue una arquitectura hexagonal y modular bajo `src/modules/`:

- `credit-applications/` — flujo principal de solicitudes de crédito.
- `references/` — gestión de referencias de dominio versionadas (enums activables/desactivables).
- `admin/` — limpieza de base de datos y CRUD de referencias.
- `seed/` — población de datos de prueba.
- `health/` — health checks con Terminus/Prisma.
- `prisma/` — módulo y cliente de Prisma.

## Contratos API

### Solicitudes de crédito

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/applications` | Crear solicitud |
| GET | `/applications` | Listar con filtros `status`, `channel`, `q` y paginación por cursor |
| GET | `/applications/:id` | Detalle de la solicitud |
| PATCH | `/applications/:id` | Actualizar datos complementarios |
| POST | `/applications/:id/simulate-offer` | Simular oferta preliminar |
| POST | `/applications/:id/finalize` | Enviar a validación |
| POST | `/applications/:id/abandon` | Abandonar solicitud con motivo |
| GET | `/applications/:id/events` | Trazabilidad de eventos |

### Complementarios

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/applications/enums` | Enumeraciones activas de dominio |
| GET | `/admin/references` | Listar referencias de dominio |
| POST | `/admin/references` | Crear referencia de dominio |
| PATCH | `/admin/references/:id` | Actualizar referencia |
| POST | `/admin/references/:id/toggle` | Activar/desactivar referencia |
| POST | `/admin/database/clean` | Limpiar base de datos (`x-admin-secret`) |
| POST | `/seed` | Poblar datos de prueba |
| GET | `/health` | Health check (app + Prisma) |

### Ejemplo de creación

```bash
curl -X POST http://localhost:3000/applications \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "self-service",
    "documentType": "CC",
    "documentNumber": "1234567890",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "3001234567",
    "email": "juan@example.com",
    "city": "Bogotá"
  }'
```

## Decisiones de arquitectura

- **Backend-first:** se construyó primero el API NestJS con arquitectura hexagonal y pruebas TDD antes del frontend.
- **Módulos por bounded context:** `credit-applications`, `references`, `admin`, `seed` y `health` viven bajo `src/modules/`.
- **Hexagonal por módulo:** cada módulo separa `application`, `domain` e `infrastructure`.
- **Referencias versionadas:** `DomainReference` permite activar/desactivar valores de enumeración sin perder trazabilidad.
- **Respuestas estandarizadas:** `ResponseFormatInterceptor` y `AllExceptionsFilter` envuelven todas las respuestas con `success`, `statusCode`, `message`, `data` y `meta`.
- **Paginación por cursor (keyset):** reemplaza `OFFSET/LIMIT` para mejor rendimiento y consistencia.
- **Prisma 5:** genera el cliente y maneja migraciones.
- **Docker:** se usa principalmente para PostgreSQL; el contenedor `backend` está en `docker-compose.yml` para despliegue.
- **Frontend App Router:** usa server/client components; formularios con `react-hook-form` y validación con Zod.
- **Bun:** gestor de paquetes para backend y frontend.

## Supuestos y limitaciones

- La simulación de oferta es una lógica interna de ejemplo; en producción se conectaría al motor de scoring/riesgo correspondiente.
- Docker Desktop debe estar corriendo para levantar PostgreSQL; si no está disponible, el backend no iniciará por la conexión a Prisma.
- No se incluyen logos ni imágenes alusivas a entidades financieras reales.
- El seed deja la base en un estado inicial determinístico y está pensado solo para desarrollo.
