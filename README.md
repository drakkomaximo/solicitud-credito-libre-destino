# 🚀 Solicitud Digital de Crédito de Libre Destino

Micrositio de originación digital de crédito de libre destino con backend en NestJS (arquitectura hexagonal, TDD) y frontend en Next.js.

> 🏗️ **Estructura del proyecto:** `backend/` contiene la API NestJS y `frontend/` la aplicación Next.js.

## 🌐 Demo en producción

| Servicio | URL |
|----------|-----|
| **Frontend (Vercel)** | https://solicitud-credito-libre-destino.vercel.app/ |
| **Backend (Railway)** | https://solicitud-credito-libre-destino-production.up.railway.app/api/v1 |
| **Swagger** | https://solicitud-credito-libre-destino-production.up.railway.app/api/v1/docs |

## 📁 Estructura

```
.
├── backend/       # API NestJS + Prisma + PostgreSQL
├── frontend/      # Next.js App Router + Tailwind + React Hook Form + Zod
├── historias/     # historias de usuario del dominio de crédito
├── docker-compose.yml
└── README.md
```

## 🚀 Estado actual

Este ciclo cerró el rediseño completo de la interfaz del micrositio, dejando operativo el flujo desde la landing hasta el detalle de una solicitud:

- **Frontend:** Server Components por defecto con `Suspense` y `loading.tsx` por segmento de ruta (streaming); solo los componentes con interacción real son Client Components; header sticky, navegación responsive con `aria-current`/`aria-expanded`, footer global, skip link, home actualizada, formulario multistep, detalle mobile, listado de solicitudes con tarjetas rediseñadas (chip de canal, fecha/hora, grid 1/2/3 columnas) y filtros responsivos; skeletons de carga en detalle, listado y formularios; landmark `<main>` y `aria-label` de footer; favicon del proyecto; pruebas unitarias ampliadas para utilidades, validaciones y casos de uso; reorganización de componentes en `detail/`, `form/`, `list/`, `skeletons/` y `view/`.
- **Backend:** el listado de solicitudes ahora se ordena por `createdAt` descendente (más recientes primero) usando paginación por cursor nativa de Prisma; correlación de peticiones con `x-request-id` y logging HTTP/errores; contratos de API y autenticación se mantienen estables.

Ver `frontend/README.md` y `backend/README.md` para el detalle de cada capa.

## 🚧 Mejoras futuras

- **Backend:** rate limiting, logs de auditoría, tests E2E de flujos de autenticación, firmas de commits.
- **Frontend:** toasts y estados optimistas con TanStack Query, animaciones Framer Motion en formularios, i18n con `next-intl`, pruebas de componentes y almacenamiento de token en `HttpOnly`/`SameSite=Strict`.

## 🛠️ Tecnologías

- **Backend:** NestJS 11, TypeScript 5.7, Prisma 5, PostgreSQL, Bun, Jest, `@nestjs/swagger`, `@nestjs/terminus`.
- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, React Hook Form, Zod, Lucide icons, Bun.
- **Infraestructura:** Docker, Docker Compose, PostgreSQL 16.

## ⚙️ Requisitos

- Bun 1.3+
- Docker Desktop (para PostgreSQL)
- Node.js 20+ (como fallback)

## 🔧 Configuración

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
- Swagger: http://localhost:3000/api/v1/docs
- Health: http://localhost:3000/api/v1/health

### Ejecutar frontend

```bash
cd frontend
bun run dev
```

- Frontend: http://localhost:3001

> Ajusta `src/lib/api.ts` si el backend corre en otro puerto.

## 🏛️ Arquitectura del backend

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

## 📡 Contratos API

### Solicitudes de crédito

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/v1/applications` | Crear solicitud (devuelve `accessToken` de solicitud) |
| GET | `/api/v1/applications/lookup` | Buscar borrador por documento y teléfono |
| GET | `/api/v1/applications` | Listar con filtros `status`, `channel`, `q` y paginación por cursor. Admin ve todo; cliente ve solo las suyas. |
| GET | `/api/v1/applications/:id` | Detalle de la solicitud (token de solicitud, admin o cliente propietario) |
| PATCH | `/api/v1/applications/:id` | Actualizar datos complementarios (parcial; token, admin o cliente propietario) |
| POST | `/api/v1/applications/:id/simulate-offer` | Simular oferta preliminar (token, admin o cliente propietario) |
| POST | `/api/v1/applications/:id/finalize` | Enviar a validación (token, admin o cliente propietario) |
| POST | `/api/v1/applications/:id/abandon` | Abandonar solicitud con motivo (token, admin o cliente propietario) |
| GET | `/api/v1/applications/:id/events` | Trazabilidad de eventos (token, admin o cliente propietario) |
| POST | `/api/v1/auth/login` | Login de administrador (JWT) |
| POST | `/api/v1/auth/client` | Login de cliente con documento y teléfono (JWT) |
| GET | `/api/v1/events` | Stream SSE de eventos de dominio |

### Complementarios

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/applications/enums` | Enumeraciones activas de dominio |
| GET | `/api/v1/admin/references` | Listar referencias de dominio |
| POST | `/api/v1/admin/references` | Crear referencia de dominio |
| PATCH | `/api/v1/admin/references/:id` | Actualizar referencia |
| POST | `/api/v1/admin/references/:id/toggle` | Activar/desactivar referencia |
| POST | `/api/v1/admin/database/clean` | Limpiar base de datos (JWT) |
| POST | `/api/v1/seed` | Poblar datos de prueba |
| GET | `/api/v1/health` | Health check (app + Prisma) |

### Versionado de la API

A partir de esta versión, todos los endpoints se exponen bajo el prefijo `/api/v1`. Esta decisión técnica busca:

- **Versionado semántico:** permitir evolucionar la API en el futuro (`/api/v2`) sin romper a consumidores actuales.
- **Separación clara:** distinguir la API REST del resto de rutas del dominio, como la documentación Swagger (`/api/v1/docs`) o futuros activos estáticos.
- **Coherencia profesional:** adoptar una convención estándar en APIs públicas y microservicios.
- **Compatibilidad documentada:** Swagger y los ejemplos de contrato reflejan la ruta base completa.

### Ejemplo de creación

```bash
curl -X POST http://localhost:3000/api/v1/applications \
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

## 🧠 Decisiones de arquitectura

- **Backend-first:** se construyó primero el API NestJS con arquitectura hexagonal y pruebas TDD antes del frontend.
- **Módulos por bounded context:** `credit-applications`, `references`, `admin`, `seed` y `health` viven bajo `src/modules/`.
- **Hexagonal por módulo:** cada módulo separa `application`, `domain` e `infrastructure`.
- **Referencias versionadas:** `DomainReference` permite activar/desactivar valores de enumeración sin perder trazabilidad.
- **Autenticación por roles:** JWT de administrador (`/auth/login`) para `admin`, `seed` y listado general; JWT de cliente (`/auth/client`) generado a partir de `documentNumber`/`phone`; token de solicitud generado al crear para continuar un caso sin sesión.
- **PATCH parcial:** `PATCH /api/v1/applications/:id` acepta solo los campos editados, permitiendo guardar borrador paso a paso.
- **Recuperación de borradores:** `GET /api/v1/applications/lookup` permite retomar una solicitud por documento y teléfono.
- **Eventos SSE:** `GET /api/v1/events` notifica al frontend cambios en referencias y limpieza de base de datos.
- **Respuestas estandarizadas:** `ResponseFormatInterceptor` y `AllExceptionsFilter` envuelven todas las respuestas con `success`, `statusCode`, `message`, `data` y `meta`.
- **Paginación por cursor (keyset):** reemplaza `OFFSET/LIMIT` para mejor rendimiento y consistencia.
- **Prisma 5:** genera el cliente y maneja migraciones.
- **Docker:** se usa principalmente para PostgreSQL; el contenedor `backend` está en `docker-compose.yml` para despliegue.
- **Frontend App Router:** usa server/client components; formularios con `react-hook-form` y validación con Zod.
- **Bun:** gestor de paquetes para backend y frontend.

## 🚀 Despliegue a producción

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

### Frontend en Vercel

El frontend está desplegado en **Vercel** conectado al repositorio de GitHub (deploy automático en cada push a `main`):

1. Importar el repositorio en Vercel y fijar el **Root Directory** en `frontend/`.
2. Framework detectado automáticamente (Next.js); build con `next build`.
3. Configurar la variable de entorno `NEXT_PUBLIC_API_URL` apuntando al backend de Railway (`https://solicitud-credito-libre-destino-production.up.railway.app/api/v1`).
4. Agregar el dominio generado por Vercel a la variable `CORS_ORIGIN` del backend en Railway para habilitar las peticiones con credenciales.

Consideraciones del despliegue del frontend:

- **Server Components + streaming:** las rutas usan `loading.tsx` por segmento y `Suspense`, lo que Vercel sirve con streaming nativo; las páginas estáticas (`/`, `/applications`, `/applications/new`) se prerenderizan y las dinámicas (`/applications/[id]`) se renderizan bajo demanda.
- **Variables públicas:** solo se expone `NEXT_PUBLIC_API_URL`; no hay secretos en el bundle del cliente.
- **Previews:** cada PR genera un preview deploy propio; si se usan, sus dominios también deben agregarse a `CORS_ORIGIN`.

## 🤖 Uso de inteligencia artificial

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

## 🔒 Políticas del repositorio

> 🛡️ **Calidad y trazabilidad:** la rama `main` está protegida y todos los commits deben estar firmados para garantizar la integridad del historial.

### Protección de la rama `main`

Configuración recomendada en GitHub (`Settings → Branches → Add rule`):

| Opción | Recomendación |
|--------|---------------|
| **Branch name pattern** | `main` |
| **Protect matching branches** | ✅ Activar |
| **Require a pull request before merging** | ✅ Obligatorio |
| **Do not allow bypassing the above settings** | ✅ Aplicar a administradores |
| **Require signed commits** | ✅ Obligatorio |
| **Allow force pushes** | ❌ Desactivar |
| **Allow deletions** | ❌ Desactivar |

Opcionales según el flujo:

- **Require status checks to pass before merging:** activar si hay GitHub Actions de `build`/`test`.
- **Require linear history:** recomendado para mantener un historial limpio sin merge commits.

### Commits firmados

Se usa firma SSH con la llave `ed25519` del equipo. La configuración global de Git es:

```bash
git config --global gpg.format ssh
git config --global user.signingkey "C:/Users/<tu-usuario>/.ssh/<tu-nombre-de-archivo>_id_ed25519.pub"
git config --global commit.gpgsign true
```

> 📌 **Nota:** si la llave aún no está registrada como *Signing key* en GitHub, agrégala en `Settings → SSH and GPG keys`. A partir de esa configuración, todos los commits nuevos se mostrarán como `Verified`.

## 🛡️ Supuestos y limitaciones

- La simulación de oferta es una lógica interna de ejemplo; en producción se conectaría al motor de scoring/riesgo correspondiente.
- Docker Desktop debe estar corriendo para levantar PostgreSQL; si no está disponible, el backend no iniciará por la conexión a Prisma.
- No se incluyen logos ni imágenes alusivas a entidades financieras reales.
- El seed deja la base en un estado inicial determinístico y está pensado solo para desarrollo.
- El token de solicitud es básico (no revocable ni rotativo); el flujo de recuperación por documento/teléfono es funcional pero no verifica identidad con OTP.
- El canal asistido valida el `advisorId` contra un catálogo de asesores. No se exponen los códigos al público; el asesor debe conocer su código.
- **Limpieza de base de datos:** `POST /api/v1/admin/database/clean` está habilitado en todos los ambientes por facilidad de modificar la información del ejercicio. En condiciones normales no debería estar disponible en producción; se recomienda activarlo solo mediante feature flag, IP/VPN, 2FA o palabra de paso en secret manager.
- **Indicativo de país en teléfono:** se asume que todos los números celulares son colombianos (10 dígitos). El sistema normaliza eliminando caracteres no numéricos y el prefijo `57` si está presente. Para soportar otros países se requiere un selector de indicativo o detección del prefijo internacional.
- **Decisión final:** una solicitud en `PENDING_VALIDATION` la aprueba o rechaza manualmente un administrador (`PATCH /api/v1/admin/applications/:id/decision`). En un escenario real este paso lo daría un analista de crédito o un motor de decisión automático.
- **Reintentos de simulación:** se permite editar y re-simular una solicitud incluso tras un resultado aprobado o no viable; el objetivo del micrositio es lograr solicitudes viables. Para finalizar, la última simulación aprobada debe ser posterior a la última edición de datos. En producción se limitaría el número de simulaciones y se usarían variables de decisión no visibles al usuario.
- **Internacionalización parcial de la UI:** aunque los mensajes principales están en español, la estructura de componentes no está preparada para múltiples idiomas. En producción conviene usar `next-intl` o similar con detección de locale y catálogos separados.
- **Feedback visual durante acciones asíncronas:** las acciones del detalle (abandonar, finalizar, aprobar, rechazar) muestran el spinner dentro del botón que ejecuta la acción y deshabilitan las demás, sin overlays que cubran la pantalla. Para una experiencia premium se podrían reemplazar los modales de SweetAlert2 por toasts sin bloqueo y estados optimistas con TanStack Query.
- **Paleta y animaciones:** el rediseño aplicado usa Tailwind con sombras, gradientes y micro-interacciones. La quinta mejora propuesta es agregar transiciones con Framer Motion en formularios de pasos, listas y cambios de estado; esto queda como trabajo futuro para no introducir dependencia adicional en este ciclo.
- **Dependencia del token en cookie:** el frontend almacena el token de solicitud/admin en una cookie accesible por JS; en producción se recomienda `HttpOnly` + `SameSite=Strict` y refresh tokens, o session storage en flujos de corta duración.
- **Cálculo de simulación visible:** la fórmula de cuota y tasa es expuesta en el frontend. Un motor real no revelaría la tasa de interés ni los cálculos hasta la oferta definitiva, y la aprobación no dependería de una regla tan simple.
