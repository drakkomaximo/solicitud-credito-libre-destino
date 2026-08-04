# Frontend — Solicitud Digital de Crédito de Libre Destino

Aplicación Next.js del micrositio de originación digital. Consume la API del backend y ofrece flujos para administradores y clientes.

## 🛠️ Tecnologías

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- React Hook Form + Zod
- Bun

## 🚀 Ejecución

```bash
bun install
bun run dev
```

Abrir http://localhost:3001.

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

## 🔐 Roles

- **admin**: inicia sesión con usuario/contraseña y ve el listado completo.
- **cliente**: inicia con documento y teléfono; ve únicamente sus solicitudes.
- **solicitud** (token de aplicación): permite continuar una solicitud sin sesión.

## � Estado actual

Se completó el rediseño de la interfaz y la usabilidad del micrositio:

- **Navegación global:** header sticky, navbar responsive, menú hamburguesa con transición suave y footer global.
- **Home y landing:** ajuste de layouts para el header sticky y espaciado consistente.
- **Formulario de solicitud:** multistep con scroll al cambiar de paso, mejor espaciado en mobile y validación con Zod.
- **Detalle de solicitud:** tipografía reducida en mobile, modal de abandono con motivo y estados más compactos.
- **Listado de solicitudes:** tarjetas rediseñadas con chip de canal, fecha/hora de creación, grid responsive (1/2/3 columnas), filtros con wrap y ordenamiento descendente por fecha gestionado por el backend.
- **Sesión:** `RoleHeader` integrado dentro del contenedor principal de solicitudes.
- **Skeletons:** spinners de carga del detalle y del listado reemplazados por esqueletos con la estructura real de los componentes.
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
