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

## ✅ Comandos

```bash
bun run lint        # ESLint
bun run build       # build de producción
bun test            # pruebas unitarias
```
