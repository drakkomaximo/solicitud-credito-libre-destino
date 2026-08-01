# Backend — Solicitud Digital de Crédito de Libre Destino

API NestJS que soporta el flujo de originación digital de crédito de libre destino. Implementa arquitectura hexagonal, TDD, persistencia con Prisma/PostgreSQL, respuestas estandarizadas y paginación por cursor.

## Tecnologías y estándares

- **Framework:** NestJS 11 con TypeScript 5.
- **Gestor de paquetes:** Bun (compatible con `npm` como fallback).
- **Arquitectura:** Hexagonal (dominio, aplicación, infraestructura).
- **Alias de rutas:** `@/` mapeado a `src/` mediante `tsconfig.json`.
- **ORM:** Prisma 5.
- **Base de datos:** PostgreSQL 16 (Docker).
- **Tests:** Jest con `ts-jest`.
- **Documentación API:** Swagger (`/api/docs`).
- **Health checks:** `@nestjs/terminus` (`/health`).
- **Notificaciones en tiempo real:** Server-Sent Events (`/events`) para revalidación de cachés (SSG/ISR).
- **Autenticación administrativa:** JWT (`/auth/login`) para proteger el panel admin y seed.

## Estructura de carpetas

```
backend/
├── scripts/
│   ├── start-dev.ps1   # levanta Postgres, corre migraciones, genera cliente e inicia NestJS
│   └── stop-dev.ps1    # detiene el backend y baja los contenedores
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── common/
│   │   ├── filters/
│   │   │   └── all-exceptions.filter.ts
│   │   └── interceptors/
│   │       └── response-format.interceptor.ts
│   └── modules/
│       ├── admin/
│       │   ├── admin.module.ts
│       │   ├── application/services/admin.service.ts
│       │   └── infrastructure/http/admin.controller.ts
│       ├── references/
│       │   ├── references.module.ts
│       │   └── application/services/references.service.ts
│       ├── credit-applications/
│       │   ├── credit-applications.module.ts
│       │   ├── application/
│       │   │   ├── services/credit-applications.service.ts
│       │   │   └── use-cases/
│       │   ├── domain/
│       │   │   ├── entities/
│       │   │   ├── repositories/
│       │   │   └── credit-application.enums.ts
│       │   └── infrastructure/
│       │       ├── http/
│       │       │   ├── credit-applications.controller.ts
│       │       │   ├── enums.controller.ts
│       │       │   └── dto/
│       │       └── persistence/
│       │           └── prisma-credit-application.repository.ts
│       ├── health/
│       │   ├── health.module.ts
│       │   └── infrastructure/http/health.controller.ts
│       ├── seed/
│       │   ├── seed.module.ts
│       │   ├── application/services/seed.service.ts
│       │   └── infrastructure/http/seed.controller.ts
│       ├── events/
│       │   ├── events.module.ts
│       │   ├── events.service.ts
│       │   └── events.controller.ts
│       └── auth/
│           ├── auth.module.ts
│           ├── auth.service.ts
│           ├── auth.controller.ts
│           └── jwt-auth.guard.ts
```

## Convenciones

1. **Dominio puro:** las entidades y los puertos no dependen de librerías externas.
2. **Inyección de dependencias:** se usa `interface` de repositorio e inyección por token.
3. **DTOs de entrada:** validados con `class-validator`/`class-transformer`.
4. **Casos de uso:** lógica de negocio orquestada por servicios; cada operación relevante genera un evento.
5. **Eventos:** se persisten en la misma transacción que la aplicación.
6. **Alias `@/`:** todos los imports internos se resuelven desde `src/`, evitando `../../../`.
7. **TDD:** casos de uso, servicios y controladores deben tener pruebas unitarias.

## Variables de entorno

Copiar y ajustar:

```bash
cp .env.example .env
```

Ejemplo:

```env
DATABASE_URL=postgresql://credi:credi@localhost:5432/credit
PORT=3000
ADMIN_SECRET=super-secret-local-only
JWT_SECRET=super-secret-jwt-signing-key
JWT_EXPIRES_IN=8h
NODE_ENV=development
```

## Instalación

```bash
bun install
```

## Base de datos

Con Docker (PowerShell):

```powershell
.\scripts\start-dev.ps1    # sube Postgres, migra, genera cliente y arranca
.\scripts\stop-dev.ps1     # detiene el proceso y baja contenedores
```

Manualmente:

```bash
docker compose up -d postgres
bunx prisma migrate deploy
bunx prisma generate
```

Con un PostgreSQL propio, actualiza `DATABASE_URL` y corre:

```bash
bunx prisma migrate deploy
bunx prisma generate
```

## Ejecución

En Windows, la forma más rápida de levantar el entorno completo es usar los scripts de PowerShell:

```powershell
.\scripts\start-dev.ps1   # Postgres + migraciones + Prisma client + NestJS en watch
.\scripts\stop-dev.ps1    # detiene todo
```

Comandos manuales:

```bash
bun run start:dev    # modo watch
bun run build        # build de producción
bun run start:prod   # ejecutar build
```

## Tests

```bash
bun run test         # unitarios
bun run test:cov     # con cobertura
bun run test:e2e     # end-to-end (requiere DB)
```

## Endpoints principales

Swagger agrupa los endpoints en **Solicitudes de crédito** y en subgrupos dentro de **Complementarios**: `Admin`, `Dominios`, `Seed`, `Health` y `Auth`.

### Solicitudes de crédito

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/applications` | Crear solicitud |
| GET | `/applications` | Listar con filtros `status`, `channel`, `q` y paginación por cursor |
| GET | `/applications/:id` | Detalle |
| PATCH | `/applications/:id` | Actualizar datos complementarios |
| POST | `/applications/:id/simulate-offer` | Simular oferta |
| POST | `/applications/:id/finalize` | Enviar a validación |
| POST | `/applications/:id/abandon` | Abandonar |
| GET | `/applications/:id/events` | Trazabilidad |

### Complementarios

#### Admin

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/admin/database/clean` | Limpiar la base de datos (JWT requerido, solo local) |
| GET | `/admin/references` | Listar referencias de dominio (opcionalmente filtrar por `?domain=`) |
| POST | `/admin/references` | Crear una referencia de dominio |
| PATCH | `/admin/references/:id` | Actualizar label/descripción/estado de una referencia |
| POST | `/admin/references/:id/toggle` | Activar o desactivar una referencia |

#### Dominios

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/applications/enums` | Enumeraciones activas agrupadas dinámicamente por dominio |

#### Seed

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/seed` | Poblar datos de prueba (JWT requerido) |

#### Auth

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/login` | Obtener token JWT con `username` y `password` |

#### Health

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Health check de Prisma |

#### Events

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/events` | Stream Server-Sent Events (SSE) para notificaciones en tiempo real |

### Revalidación on-demand (SSG/ISR)

El backend notifica al frontend a través de SSE cuando cambian referencias o se limpia la base de datos. Para revalidar contenido estático bajo demanda sin webhooks ni GitHub Actions, el frontend debe:

1. Conectarse a `GET /events` con `EventSource`.
2. Escuchar los eventos `reference.created`, `reference.updated`, `reference.toggled` o `database.cleaned`.
3. Llamar a una API route de Next.js (`/api/revalidate`) con el `tag` a invalidar.
4. La API route ejecuta `revalidateTag('references')` (o `revalidatePath`) para regenerar el contenido afectado.

Ejemplo de conexión SSE en el frontend:

```js
const source = new EventSource('http://localhost:3000/events');
source.onmessage = async (event) => {
  const { type } = JSON.parse(event.data);
  if (type.startsWith('reference.') || type === 'database.cleaned') {
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag: 'references' }),
    });
  }
};
```

Ejemplo de API route en Next.js (`app/api/revalidate/route.ts`):

```ts
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { tag } = await request.json();
  revalidateTag(tag);
  return NextResponse.json({ revalidated: true });
}
```

Para que esto funcione, las consultas del frontend deben etiquetarse con `next: { tags: ['references'] }` o `unstable_cache` con el mismo tag.

## Autenticación administrativa

Los endpoints bajo `/admin` y `/seed` requieren un token JWT. Flujo típico:

```bash
POST /auth/login
{
  "username": "admin",
  "password": "<ADMIN_SECRET>"
}
```

Respuesta:

```json
{
  "success": true,
  "data": { "accessToken": "..." }
}
```

Usar el token en cada petición protegida:

```bash
curl -H "Authorization: Bearer <accessToken>" http://localhost:3000/admin/references
```

### Eventos SSE

Cada mensaje del stream tiene la siguiente estructura:

```json
{
  "type": "reference.created",
  "payload": { "id": "...", "domain": "...", "code": "..." },
  "timestamp": "2026-08-01T18:00:00.000Z"
}
```

En el transporte SSE se ve como:

```
data: {"type":"reference.created","payload":{...},"timestamp":"..."}

```

**Tipos actuales:**

- `reference.created`
- `reference.updated`
- `reference.toggled`
- `database.cleaned`

**Errores:** si ocurre un error al abrir el stream, la respuesta sigue el formato estándar de error (`success: false`, `message: [...]`) con el código correspondiente. Una vez abierto el stream, no hay mensajes de error en línea; la conexión simplemente se cierra.

**Consumo de recursos:** cada cliente mantiene una conexión HTTP abierta. En producción, limitar el número de conexiones concurrentes y asegurar que el balanceador (Nginx, ALB, Cloudflare, etc.) no corte conexiones largas por timeout. En local esto no es un problema para el volumen esperado de pruebas.

## Formato de respuestas

Todas las respuestas comparten un envelope estandarizado. La forma exacta depende del tipo de operación:

### 1. Éxito con un solo recurso

Operaciones como `POST /applications`, `GET /applications/:id`, `POST /auth/login`, `PATCH /admin/references/:id` o `POST /seed` devuelven `data` como objeto.

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operación realizada con éxito",
  "data": { "id": "..." },
  "meta": {}
}
```

### 2. Éxito con arreglo paginado

Listados como `GET /applications` o `GET /admin/references` devuelven `data` como arreglo y `meta` con la paginación por cursor.

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Elementos obtenidos",
  "data": [ ... ],
  "meta": {
    "limit": 10,
    "nextCursor": "...",
    "hasNextPage": true
  }
}
```

### 3. Error

```json
{
  "success": false,
  "statusCode": 400,
  "message": ["El campo term no está permitido"],
  "data": {},
  "meta": {}
}
```

`statusCode` refleja el código HTTP. `message` puede ser un string o un arreglo de strings en errores de validación.

## Documentación y salud

- Swagger: `http://localhost:3000/api/docs`
- Health: `http://localhost:3000/health`

## Decisiones de arquitectura

- **Módulos por bounded context:** `credit-applications`, `admin`, `seed` y `health` viven bajo `src/modules/`.
- **Hexagonal por módulo:** cada módulo separa `application`, `domain` e `infrastructure`.
- **Servicio agregado:** `CreditApplicationsService` orquesta todos los casos de uso y mantiene el dominio como fuente de verdad.
- **Persistencia transaccional:** el repositorio Prisma actualiza `CreditApplication` junto con sus eventos en una transacción.
- **Paginación por cursor (keyset):** reemplaza `OFFSET/LIMIT` para mejor rendimiento y consistencia.
- **Enumeraciones dinámicas:** `GET /applications/enums` devuelve todos los códigos activos agrupados bajo sus respectivos dominios, permitiendo agregar nuevos dominios sin tocar el endpoint (incluye `credit-term` con plazos 12, 24, 36, 48, 60, 72 meses).
- **Plazo controlado:** el campo `term` se valida contra el dominio `credit-term`, evitando plazos arbitrarios.
- **Canal asistido:** `advisorId` identifica al asesor cuando `channel === 'advisor'`.
- **Autenticación JWT:** el panel administrativo (`/admin`, `/seed`) requiere token Bearer obtenido en `/auth/login`.
- **Notificaciones SSE:** `GET /events` expone un stream de eventos que el frontend consume para revalidar cachés (SSG/ISR) cuando cambian referencias o se limpia la base de datos.
- **Referencias versionadas:** `DomainReference` guarda los valores de enumeración con `isActive`, `validFrom` y `validTo`, permitiendo activar/desactivar códigos sin perder la trazabilidad de registros anteriores.
- **Prisma 5:** versión fija para evitar problemas de compatibilidad con el CLI y el schema.

## Limitaciones conocidas y futuras mejoras

Esta implementación se mantuvo deliberadamente mínima para cumplir el alcance del ejercicio. Por tiempo y complejidad se dejaron fuera los siguientes puntos, listados como trabajo futuro:

- **Autenticación en `/applications`:** el flujo del cliente es público para permitir que un usuario solicite crédito sin registrarse. En producción debería existir un mecanismo de sesión/token por cliente (ej. JWT de corta duración ligado al `id` de la solicitud) para evitar que terceros consulten o modifiquen solicitudes ajenas.
- **Autorización por roles:** actualmente solo existe un rol `admin`. Se podría agregar `advisor` y permisos específicos.
- **Rate limiting:** ningún endpoint tiene límites de peticiones. `POST /applications` y `/auth/login` deberían tener throttling.
- **Logs de auditoría:** aunque `events` traza cambios internos, no hay logs de auditoría de qué usuario/admin realizó cada cambio.
- **Pruebas E2E y unitarias:** hay cobertura básica pero faltan casos de guardia JWT, auth y flujos edge.
- **Soft delete y archivado:** `DELETE` o limpieza de base de datos es física. En producción debería ser lógica.
- **Notificaciones SSE persistentes:** los eventos se mantienen en memoria; en producción conviene usar Redis o cola para múltiples instancias.
