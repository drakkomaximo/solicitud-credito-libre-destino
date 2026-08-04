# Frontend — Solicitud Digital de Crédito de Libre Destino

Aplicación Next.js del micrositio de originación digital. Consume la API del backend y ofrece flujos para administradores y clientes.

## 🛠️ Tecnologías

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- React Hook Form + Zod
- Framer Motion
- Lucide React
- SweetAlert2
- TanStack Query
- Bun

## 🚀 Ejecución

```bash
bun install
bun run dev
```

Abrir http://localhost:3001.

## 🌐 Despliegue en Vercel

El proyecto incluye `vercel.json` con los comandos de build para Bun. Para desplegar:

1. Crea un proyecto en Vercel apuntando a la carpeta `frontend` (o al raíz si Vercel detecta la raíz).
2. Configura la variable de entorno `NEXT_PUBLIC_API_URL` con la URL del backend, ej. `https://mi-api.com/api/v1`.
3. En el backend, agrega el dominio de Vercel a `CORS_ORIGIN`, ej. `https://mi-proyecto.vercel.app`.
4. No uses `*` en `CORS_ORIGIN` porque el frontend envía cookies/credenciales.

Si usas múltiples entornos de preview, agrégales todos separados por comas:

```
CORS_ORIGIN=http://localhost:3001,https://mi-proyecto.vercel.app,https://*.vercel.app
```

> Nota: los subdominios wildcard (`*.vercel.app`) no son confiables en todos los navegadores; para producción usa el dominio exacto.

## 📁 Estructura

```
frontend/src/
├── app/                 # páginas del App Router y layouts globales
├── application/         # casos de uso del dominio
├── domain/              # entidades, puertos y reglas de negocio
├── infrastructure/      # clientes HTTP, repositorios, storage (cookies)
└── presentation/        # UI, componentes, hooks, mensajes, validaciones
    ├── components/
    │   ├── applications/  # módulo de solicitudes
    │   │   ├── detail/    # detalle de solicitud
    │   │   ├── form/      # formulario nuevo y edición
    │   │   ├── list/      # listado, filtros y resultados
    │   │   ├── skeletons/ # placeholders de carga
    │   │   └── view/      # vistas contenedoras y dashboard
    │   ├── auth/          # login, sesión, cabecera de rol
    │   ├── common/        # badges, spinners, inputs reutilizables
    │   ├── forms/         # campos y layouts de formulario
    │   └── landing/       # home y páginas de inicio
    ├── hooks/             # hooks de autenticación y aplicaciones
    ├── messages/          # copys centralizados por dominio
    ├── constants/         # canales, estados y referencias
    └── utils/             # helpers de formato y parseo
```

## ⚡ Estrategia de renderizado (RSC)

- **Server Components por defecto:** páginas, layouts, skeletons, `LoadingSpinner` y los wrappers `ApplicationDetail`, `ApplicationNewForm`, `ApplicationEditForm` se renderizan en el servidor; solo se hidrata lo interactivo.
- **Client Components solo donde hay interacción:** formularios (`react-hook-form`), filtros del listado (`useSearchParams`), autenticación por cookies (`ApplicationsView`), header con menú móvil y animaciones (`FadeIn`).
- **Streaming con `loading.tsx`:** cada segmento de ruta (`/applications`, `/applications/[id]`, `/applications/new`, `/applications/[id]/edit`) tiene su `loading.tsx` con el skeleton correspondiente para respuesta instantánea al navegar.
- **`Suspense` boundaries:** el contenido dependiente de datos se envuelve en `Suspense` con fallback del skeleton real de la vista.

## 🔐 Roles

- **admin**: inicia sesión con usuario/contraseña y ve el listado completo.
- **cliente**: inicia con documento y teléfono; ve únicamente sus solicitudes.
- **solicitud** (token de aplicación): permite continuar una solicitud sin sesión.

## 🚀 Estado actual

Se completó el rediseño de la interfaz y la usabilidad del micrositio:

- **Navegación global:** header sticky, navbar responsive, menú hamburguesa con transición suave y footer global.
- **Home y landing:** ajuste de layouts para el header sticky y espaciado consistente.
- **Formulario de solicitud:** multistep con scroll al cambiar de paso, mejor espaciado en mobile y validación con Zod.
- **Detalle de solicitud:** tipografía reducida en mobile, modal de abandono con motivo y estados más compactos; las acciones (abandonar, finalizar, aprobar, rechazar) muestran el spinner dentro del botón en lugar del overlay glass sobre la pantalla, manteniendo el bloqueo de doble envío.
- **Listado de solicitudes:** tarjetas rediseñadas con chip de canal, fecha/hora de creación, grid responsive (1/2/3 columnas), filtros con wrap y ordenamiento descendente por fecha gestionado por el backend.
- **Sesión:** `RoleHeader` integrado dentro del contenedor principal de solicitudes.
- **Skeletons:** spinners de carga del detalle y del listado reemplazados por esqueletos con la estructura real de los componentes.
- **Favicon:** icono del proyecto (`src/app/icon.tsx`) reemplaza el favicon por defecto de Next.js.
- **Tests:** cobertura ampliada con pruebas unitarias para utilidades, validaciones y casos de uso.
- **Accesibilidad básica:** landmark `<main>`, skip link, `aria-label` en footer, `aria-current`/`aria-expanded` en navegación y `loading.tsx` accesible (`aria-busy`, `aria-live`).
- **Organización:** componentes de `applications` agrupados en `detail/`, `form/`, `list/`, `skeletons/` y `view/`.

## ✅ Comandos

```bash
bun run lint        # ESLint
bun run build       # build de producción
bun run test        # pruebas unitarias
```

## 🚧 Limitaciones conocidas y mejoras futuras

- **Formato de teléfono:** se asume que todos los celulares son colombianos. El frontend normaliza el número a 10 dígitos antes de enviarlo. El soporte para otros indicativos requeriría un selector de región.
- **Canal asistido:** el cliente escribe el código del asesor; el backend valida contra el catálogo. El frontend no expone el listado para evitar suplantaciones.
- **Internacionalización (i18n):** los mensajes están centralizados en `src/presentation/messages` pero no hay catálogos por locale. Para múltiples idiomas se recomienda `next-intl`.
- **Feedback durante mutaciones:** la UI usa un overlay/spinner. Para una UX más moderna se podría migrar a toasts y estados optimistas con TanStack Query.
- **Animaciones:** Framer Motion está en el listado de tarjetas; pendiente extender transiciones entre pasos del formulario y cambios de estado.
- **Caché y revalidación:** el listado se consulta en cada carga. Se puede integrar `TanStack Query` con invalidación por eventos SSE del backend.
- **Almacenamiento de token:** el token de sesión se guarda en cookie accesible por JS. En producción se recomienda `HttpOnly`/`SameSite=Strict` o session storage según el flujo.
- **Tests de UI:** hay cobertura básica de utilidades; faltan pruebas de componentes (React Testing Library) y flujos end-to-end.
- **Simulación en UI:** el backend devuelve códigos en inglés (`approved`/`not-viable`); una API más madura soportaría `Accept-Language`.
