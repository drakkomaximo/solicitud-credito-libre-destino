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

- `common/` — filtros, interceptores, DTOs y decoradores compartidos.
- `credit-applications/` — flujo principal de solicitudes de crédito (creación, actualización parcial, simulación, finalización, abandono, búsqueda y trazabilidad).
- `references/` — gestión de referencias de dominio versionadas (enums activables/desactivables).
- `admin/` — limpieza de base de datos y CRUD de referencias (JWT requerido).
- `seed/` — población de datos de prueba (JWT requerido).
- `auth/` — autenticación administrativa y guardia de tokens de solicitud.
- `events/` — emisión de eventos de dominio por Server-Sent Events (SSE).
- `health/` — health checks con Terminus/Prisma.
- `prisma/` — módulo y cliente de Prisma.

## Contratos API

### Solicitudes de crédito

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/applications` | Crear solicitud (devuelve `accessToken`) |
| GET | `/applications/lookup` | Buscar borrador por documento y teléfono |
| GET | `/applications` | Listar con filtros `status`, `channel`, `q` y paginación por cursor (admin) |
| GET | `/applications/:id` | Detalle de la solicitud (token de solicitud o admin) |
| PATCH | `/applications/:id` | Actualizar datos complementarios (parcial; token o admin) |
| POST | `/applications/:id/simulate-offer` | Simular oferta preliminar (token o admin) |
| POST | `/applications/:id/finalize` | Enviar a validación (token o admin) |
| POST | `/applications/:id/abandon` | Abandonar solicitud con motivo (token o admin) |
| GET | `/applications/:id/events` | Trazabilidad de eventos (token o admin) |
| POST | `/auth/login` | Login de administrador (JWT) |
| GET | `/events` | Stream SSE de eventos de dominio |

### Complementarios

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/applications/enums` | Enumeraciones activas de dominio |
| GET | `/admin/references` | Listar referencias de dominio |
| POST | `/admin/references` | Crear referencia de dominio |
| PATCH | `/admin/references/:id` | Actualizar referencia |
| POST | `/admin/references/:id/toggle` | Activar/desactivar referencia |
| POST | `/admin/database/clean` | Limpiar base de datos (JWT) |
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
- **Autenticación dual:** JWT de administrador (`/auth/login`) para `admin`, `seed` y listado; token de solicitud generado al crear para las demás operaciones del cliente.
- **PATCH parcial:** `PATCH /applications/:id` acepta solo los campos editados, permitiendo guardar borrador paso a paso.
- **Recuperación de borradores:** `GET /applications/lookup` permite retomar una solicitud por documento y teléfono.
- **Eventos SSE:** `GET /events` notifica al frontend cambios en referencias y limpieza de base de datos.
- **Respuestas estandarizadas:** `ResponseFormatInterceptor` y `AllExceptionsFilter` envuelven todas las respuestas con `success`, `statusCode`, `message`, `data` y `meta`.
- **Paginación por cursor (keyset):** reemplaza `OFFSET/LIMIT` para mejor rendimiento y consistencia.
- **Prisma 5:** genera el cliente y maneja migraciones.
- **Docker:** se usa principalmente para PostgreSQL; el contenedor `backend` está en `docker-compose.yml` para despliegue.
- **Frontend App Router:** usa server/client components; formularios con `react-hook-form` y validación con Zod.
- **Bun:** gestor de paquetes para backend y frontend.

## Despliegue a producción

El backend se empaqueta como imagen Docker y puede desplegarse en cualquier servicio de contenedores. La configuración de producción mantiene las variables de entorno fuera de la imagen y deja listo el punto de entrada para Azure, Railway, Render, etc.

### Archivos de despliegue

- `backend/Dockerfile` — imagen multi-etapa (`node:20-slim` Debian) que instala OpenSSL, genera el cliente Prisma y ejecuta `prisma migrate deploy` antes de iniciar.
- `backend/.dockerignore` — evita copiar `node_modules`, `dist`, `.env` y otros archivos innecesarios.
- `docker-compose.prod.yml` — levanta el backend localmente en modo producción usando un archivo `.env` externo.
- `backend/.env.prod.example` — ejemplo de variables de producción.

### Local con Docker Compose (modo producción)

```bash
cd backend
cp .env.prod.example .env
# editar .env con los valores reales de PostgreSQL
cd ..
docker compose -f docker-compose.prod.yml up --build
```

El contenedor aplica migraciones automáticamente y expone el backend en el puerto configurado (por defecto `3000`).

### Railway (recomendado para la prueba)

1. Conectar el repositorio de GitHub a Railway.
2. Crear un servicio **PostgreSQL** desde el dashboard.
3. Crear un servicio desde el `Dockerfile` del `backend/`.
4. Configurar las variables de entorno copiando el contenido de `backend/.env.prod.example`.
5. Railway generará una URL pública para el backend.

### Azure (referencia sin despliegue real)

- **Azure Container Apps:** apuntar el contexto de build al `backend/Dockerfile`; inyectar las variables en *Application Settings*.
- **Azure Database for PostgreSQL - Flexible Server:** usar como base de datos gestionada.
- **Azure App Service (Web App for Containers):** desplegar la misma imagen con variables de entorno.

El proyecto queda **configurado** para Azure, pero no requiere un despliegue real en la nube para la prueba.

## Uso de inteligencia artificial

Este proyecto fue desarrollado con asistencia de un agente de código (Cascade, modelo SWE-1.6 de Cognition), integrado en el IDE del desarrollador, bajo un flujo de pair programming iterativo.

### Versionamiento

- **Control de versiones:** Git, con el repositorio alojado en GitHub bajo la rama `main`.
- **Versiones del código:** cada cambio se registró mediante commits atómicos con mensajes en inglés siguiendo Conventional Commits (`feat`, `fix`, `docs`, `refactor`, etc.).
- **Historial de cambios:** el repo mantiene un historial lineal con los puntos de control del desarrollo; ver `git log` para el detalle.

### Tipo de IA y herramientas

- **Asistente:** Cascade (agente de programación de Cognition, modelo SWE-1.6).
- **IDE:** editor con integración nativa del asistente (entorno de pair programming en el IDE).
- **Comunicación:** prompts en español, respuestas y código en español/inglés según el contexto.

### Proceso seguido

1. **Definición del alcance:** el desarrollador describió el requerimiento del micrositio de crédito de libre destino.
2. **Planificación:** se construyó una lista de tareas priorizada; el desarrollador aprobó o ajustó el plan en cada paso.
3. **Implementación por pares (pair programming):** el agente escribió el código, explicó decisiones y aplicó cambios bajo la dirección del desarrollador.
4. **Revisión y feedback:** el desarrollador solicitó ajustes (autenticación, documentación, estructura de carpetas, etc.), que fueron implementados y versionados.
5. **Verificación:** `bun run build`, revisión de Swagger y commits frecuentes para mantener el repo sincronizado.
6. **Documentación:** el `README` global y el del `backend` se actualizaron en cada iteración para reflejar el estado actual.

## Supuestos y limitaciones

- La simulación de oferta es una lógica interna de ejemplo; en producción se conectaría al motor de scoring/riesgo correspondiente.
- Docker Desktop debe estar corriendo para levantar PostgreSQL; si no está disponible, el backend no iniciará por la conexión a Prisma.
- No se incluyen logos ni imágenes alusivas a entidades financieras reales.
- El seed deja la base en un estado inicial determinístico y está pensado solo para desarrollo.
- El token de solicitud es básico (no revocable ni rotativo); el flujo de recuperación por documento/teléfono es funcional pero no verifica identidad con OTP.
