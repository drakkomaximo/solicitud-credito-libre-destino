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
├── app/                 # páginas del App Router
├── application/         # casos de uso
├── domain/              # entidades y puertos
├── infrastructure/      # repositorios API, client HTTP, storage
└── presentation/        # componentes, hooks, mensajes, validaciones
```

## 🔐 Roles

- **admin**: inicia sesión con usuario/contraseña y ve el listado completo.
- **cliente**: inicia con documento y teléfono; ve únicamente sus solicitudes.
- **solicitud** (token de aplicación): permite continuar una solicitud sin sesión.

## 🚧 Limitaciones conocidas

- **Formato de teléfono:** se asume que todos los celulares son colombianos. El frontend normaliza el número a 10 dígitos antes de enviarlo, eliminando caracteres no numéricos y el prefijo `57` si existe. El soporte para otros indicativos de país requeriría un selector de región.
- **Canal asistido:** para el canal `advisor` el cliente escribe el código del asesor. El backend valida que exista en el catálogo; el frontend no expone el listado para evitar suplantaciones.

## ✅ Comandos

```bash
bun run lint        # ESLint
bun run build       # build de producción
bun test            # pruebas unitarias
```

## 🚧 Limitaciones conocidas y mejoras futuras

- **Formato de teléfono:** se asume que todos los celulares son colombianos. El frontend normaliza el número a 10 dígitos antes de enviarlo, eliminando caracteres no numéricos y el prefijo `57` si existe. El soporte para otros indicativos de país requeriría un selector de región.
- **Canal asistido:** para el canal `advisor` el cliente escribe el código del asesor. El backend valida que exista en el catálogo; el frontend no expone el listado para evitar suplantaciones.
- **Internacionalización (i18n):** los mensajes están centralizados en `src/presentation/messages` pero no hay detección de idioma ni catálogos por locale. Para múltiples idiomas se recomienda `next-intl` o equivalente.
- **Feedback durante mutaciones:** se implementó un overlay con spinner mientras se realizan operaciones críticas (`finalize`, `abandon`, `decide`). Para una UX más moderna se podría usar toasts y estados optimistas con TanStack Query.
- **Diseño y animaciones:** el rediseño actual usa Tailwind con sombras, gradientes y micro-interacciones. Queda pendiente evaluar Framer Motion para transiciones entre pasos del formulario, listados y cambios de estado.
- **Almacenamiento de token:** el token de solicitud/admin se guarda en una cookie accesible por JS. En producción se recomienda `HttpOnly`/`SameSite=Strict` o session storage según el flujo.
- **Simulación en UI:** los resultados se traducen a español en el frontend. El backend devuelve códigos en inglés (`approved`/`not-viable`); una API más madura soportaría `Accept-Language`.
