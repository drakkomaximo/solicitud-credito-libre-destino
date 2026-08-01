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

- **Backend:** NestJS 10, TypeScript, Prisma 5, PostgreSQL, Bun, Jest, `@nestjs/swagger`, `@nestjs/terminus`.
- **Frontend:** Next.js 16, React, TypeScript, Tailwind CSS, React Hook Form, Zod, Lucide icons, Bun.
- **Infraestructura:** Docker, Docker Compose, PostgreSQL 16.

## Requisitos

- Bun 1.3+
- Docker Desktop (para PostgreSQL)
- Node.js 20+ (como fallback)

## Configuración

### Backend

```bash
cd backend
cp .env.example .env
```

El `.env` ya incluye `DATABASE_URL=postgresql://credi:credi@localhost:5432/credit` y `PORT=3000`.

### Base de datos

```bash
docker compose up -d postgres
cd backend
bunx prisma migrate dev
bunx prisma generate
```

### Ejecutar backend

```bash
cd backend
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

- Frontend: http://localhost:3000

> Si el backend corre en otro puerto, ajusta `src/lib/api.ts`.

## Arquitectura del backend

El backend sigue una arquitectura hexagonal y modular:

- `src/modules/credit-applications/domain/` — entidades, objetos de valor y puertos (repositorio).
- `src/modules/credit-applications/application/` — casos de uso (`CreateApplicationUseCase`) y `CreditApplicationsService`.
- `src/modules/credit-applications/infrastructure/` — controladores REST, DTOs y adaptador Prisma.
- `src/prisma/` — Prisma client y módulo.
- `src/health/` — health checks con Terminus/Prisma.

## Contratos API

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/applications` | Crear solicitud (canal, datos básicos) |
| GET | `/applications` | Listar con filtros `status`, `channel`, `q` |
| GET | `/applications/:id` | Detalle de la solicitud |
| PATCH | `/applications/:id` | Actualizar datos complementarios |
| POST | `/applications/:id/simulate-offer` | Simular oferta preliminar |
| POST | `/applications/:id/finalize` | Enviar a validación |
| POST | `/applications/:id/abandon` | Abandonar solicitud con motivo |
| GET | `/applications/:id/events` | Trazabilidad de eventos |
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
- **Modular monolith:** un único módulo `CreditApplicationsModule` en un solo backend para el alcance de la prueba.
- **Prisma 5:** permite generar el cliente y manejar migraciones sin depender de Docker para el desarrollo.
- **Docker:** se usa solo para PostgreSQL; el contenedor `backend` existe en `docker-compose.yml` para despliegue.
- **Frontend App Router:** usa server/client components según la página; formularios con `use client` y `react-hook-form`.
- **Bun:** se usó como gestor de paquetes para aprovechar su velocidad en instalación y ejecución.

## Supuestos y limitaciones

- No se conecta a un Core Bancario real; la simulación de oferta es una lógica interna del backend.
- El motor de simulación es determinístico y de ejemplo; en producción se conectaría al motor de crédito real.
- Docker Desktop debe estar corriendo para levantar PostgreSQL; si no está disponible, el backend no iniciará por la conexión a Prisma.
- No se incluyen logos ni imágenes alusivas a la entidad financiera.
