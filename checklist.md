# Checklist de cumplimiento — Prueba BCS Micrositio de Crédito

Este documento resume el estado de cada requerimiento del enunciado, el criterio usado para marcarlo y las mejoras futuras sugeridas. Se actualizará a medida que avancen los PRs.

**Leyenda**
- `✅` Cumplido o implementado.
- `⚠️` Parcial o funcional pero mejorable.
- `🔲` Pendiente o no iniciado.

---

## 3. Caso funcional detallado

| # | Requerimiento | Estado | Notas | Mejoras futuras |
|---|---------------|--------|-------|-----------------|
| 1 | Ingreso al micrositio y landing con propuesta de valor, beneficios, requisitos mínimos y CTA | `✅` | Home explica el producto y lleva al flujo de solicitud | Refinar copy y añadir animaciones de entrada |
| 2 | Selección de canal: autogestionado o asistido (con `advisorId`) | `✅` | El formulario soporta ambos canales y valida asesor en `superRefine` | Persistir asesor vinculado a sesión |
| 3 | Creación de solicitud con datos básicos | `✅` | Paso 1 del multi-step con Zod | Agregar validación de existencia previa |
| 4 | Captura y edición de datos complementarios | `✅` | Paso 2 (captura) y edición desde detalle si estado lo permite | Reutilizar esquema entre nuevo y edición |
| 5 | Simulación preliminar con endpoint mock (éxito, no viable, error técnico) | `✅` | Botón de simular consume `POST /applications/:id/simulate-offer` | Manejo visual más detallado por tipo de rechazo |
| 6 | Resumen consolidado y transición a Pendiente Validación / Finalizada | `✅` | Paso 3 de resumen y botón `Finalizar` | Mostrar desglose de aprobación/rechazo |
| 7 | Guardar en borrador y retomar posteriormente | `✅` | `PATCH /applications/:id` permite guardar parcial | Login por documento/celular para retomar |
| 8 | Abandonar el proceso registrando motivo | `✅` | `POST /applications/:id/abandon` con modal de motivo | Confirmación previa con SweetAlert |
| 9 | Listado con filtros por estado, canal y búsqueda | `✅` | Filtros responsivos y paginación por cursor | Búsqueda por palabras clave con índice FTS |
| 10 | Detalle, línea de tiempo de eventos y edición condicionada al estado | `✅` | Pestañas de resumen y eventos; edición solo en `DRAFT` | Agregar permisos por rol |

---

## 4. Alcance técnico obligatorio

| Requerimiento | Estado | Notas | Mejoras futuras |
|---------------|--------|-------|-----------------|
| Frontend con Next.js y React | `✅` | Next.js 16 App Router, React 19, TypeScript | Evaluar Server Components en listado |
| Landing page clara con navegación transaccional | `✅` | Home con CTA a `/applications/new` | Mejorar accesibilidad y semántica |
| Formulario multi-paso con validaciones, persistencia temporal y manejo de estados | `✅` | `react-hook-form` + `zod` + TanStack Query | Separar esquemas por paso para mensajes más precisos |
| Pantalla de listado con filtros básicos | `✅` | `/applications` con filtros y ordenamiento | Skeletons en "cargar más" (dejado para futuro) |
| Pantalla de detalle de solicitud | `✅` | `/applications/[id]` con resumen y eventos | Optimizar carga con SSR parcial |
| Pantalla de confirmación, finalización o abandono | `✅` | Multi-step final y acciones desde detalle | Añadir modales de doble confirmación |
| Consumo de servicios mock REST (crear, listar, consultar, actualizar, simular, finalizar, abandonar) | `✅` | Backend real en NestJS/Prisma usado como mock | Documentar contratos en OpenAPI |
| Manejo explícito de loading, empty, success y error | `✅` | Skeletons, alertas y estados vacíos | Unificar componente `EmptyState` |
| Mensajes funcionales claros ante rechazo, error técnico o inconsistencias | `✅` | `ApiError` y alertas con mensajes del backend | Mejorar traducciones y códigos de error |
| Vista o mecanismo de trazabilidad de eventos | `✅` | Pestaña de eventos con `occurredAt` y `payload` | Mostrar correlación de solicitud |

---

## 5. Requerimientos de arquitectura y desarrollo

| Aspecto | Estado | Notas | Mejoras futuras |
|---------|--------|-------|-----------------|
| Next.js App Router, React y TypeScript | `✅` | `app/` router, páginas principales | Revisar uso de `loading.tsx` |
| Arquitectura limpia, separación de UI, hooks, servicios y utilidades | `✅` | Capas `domain`, `application`, `infrastructure`, `presentation` | Definir design system y tokens de color |
| Renderizado consciente (SSR/Server Components) | `⚠️` | Uso mayoritario de Client Components por interactividad | Migrar listado a RSC con streaming |
| Consumo de servicios REST | `✅` | `HttpClient` genérico + repositorios | Añadir `react-query` devtools condicional |
| Validaciones de formulario | `✅` | Zod en pasos y edición | Validación asíncrona de documentos duplicados |
| Accesibilidad | `⚠️` | Etiquetas básicas, foco en formularios | Auditar con axe-core, roles y ARIA |
| Trazabilidad | `✅` | Eventos de dominio persistidos y visibles | Correlacionar eventos con request ID |
| Cloud de referencia (Azure, no obligatorio) | `⚠️` | Preparado para Vercel con `vercel.json` | Evaluar contenedores Docker para Azure |

---

## 6. Contratos y mocks mínimos

| Endpoint | Estado | Notas |
|----------|--------|-------|
| `POST /applications` | `✅` | Crear solicitud |
| `GET /applications` | `✅` | Listar con filtros y cursor |
| `GET /applications/{id}` | `✅` | Detalle |
| `PATCH /applications/{id}` | `✅` | Actualizar borrador |
| `POST /applications/{id}/simulate-offer` | `✅` | Simular oferta |
| `POST /applications/{id}/finalize` | `✅` | Finalizar |
| `POST /applications/{id}/abandon` | `✅` | Abandonar |
| `GET /applications/{id}/events` | `✅` | Trazabilidad |

**Comportamientos simulados**
- `✅` Respuesta exitosa.
- `✅` Respuesta no viable con mensaje funcional.
- `✅` Respuesta de error técnico temporal.

---

## 7. Requerimientos no funcionales

| Aspecto | Estado | Notas | Mejoras futuras |
|---------|--------|-------|-----------------|
| Seguridad básica (no exponer secretos, sanitizar entradas) | `✅` | Token en cookie `HttpOnly` no, pero `SameSite=Lax`; env vars para API | Revisar manejo de token y XSS |
| Observabilidad (logs/telemetría) | `⚠️` | Logs básicos en consola del cliente | Integrar Sentry o Vercel Analytics |
| Trazabilidad (correlación) | `⚠️` | Eventos por solicitud; falta request ID global | Añadir `x-request-id` en frontend y backend |
| Mantenibilidad | `✅` | Estructura clara, nombres consistentes | Completar design system |
| Calidad (pruebas automatizadas) | `✅` | 20 archivos de tests, 42+ casos | Subir cobertura de hooks y componentes |
| Performance | `⚠️` | Carga razonable, skeletons | Implementar `Suspense` y `loading.tsx` |
| Usabilidad | `✅` | Navegación clara, textos en español, responsive | Test de usabilidad con usuarios |

---

## 8. Entregables obligatorios

| Entregable | Estado | Notas |
|------------|--------|-------|
| Repositorio Git público | `✅` | https://github.com/drakkomaximo/solicitud-credito-libre-destino |
| README técnico con instrucciones, supuestos, decisiones y limitaciones | `✅` | README raíz, backend y frontend |
| Código fuente funcional del frontend | `✅` | `/frontend` |
| Mocks o backend simulado | `✅` | Backend NestJS en `/backend` |
| Pruebas automatizadas | `✅` | Tests unitarios con `bun:test` |
| Contratos API usados o propuestos | `✅` | Documentados en README del backend |
| Tres historias técnicas | `🔲` | Pendiente redactar documento de historias |

---

## 10. Rúbrica de evaluación — Autoevaluación estimada

| Criterio | % | Estado estimado | Comentario |
|----------|---:|-----------------|------------|
| Arquitectura y dominio frontend | 40% | `✅` ~35/40 | Capas limpias, Next.js App Router, TypeScript |
| UX técnica, accesibilidad y performance | 15% | `⚠️` ~10/15 | Responsive y validaciones; falta accesibilidad profunda y performance |
| Integración con backend y contratos | 15% | `✅` ~13/15 | Consumo correcto, contratos claros, CORS flexible |
| Calidad y pruebas | 15% | `✅` ~13/15 | 20 archivos de tests; faltan tests de hooks/componentes |
| Seguridad, observabilidad y trazabilidad | 10% | `⚠️` ~6/10 | Básico; falta observabilidad real y request ID |
| Documentación y criterio técnico | 5% | `✅` ~4/5 | READMEs actualizados; faltan las 3 historias técnicas |
| **Total estimado** | **100%** | **~91/100** | Sin contar el PLUS de backend que aportaría puntos adicionales |

---

## 11. Criterios de aprobación

- Puntaje sugerido de aprobación > 75 puntos: `✅` se supera con lo implementado.
- Proyecto incompleto con criterio senior: `✅` la arquitectura es limpia y el flujo crítico está cubierto.
- Interfaz atractiva sin robustez: `❌` no aplica; el flujo tiene manejo de errores, trazabilidad y pruebas.
- PLUS Backend en NestJS/TypeScript: `✅` implementado en `/backend`.

---

## Mejoras futuras priorizadas

1. **Historias técnicas**: redactar las 3 historias solicitadas (frontend/rendering, formularios/validaciones, integración frontend-backend).
2. **Accesibilidad**: auditar con `axe-core`, roles, ARIA y foco visible.
3. **Observabilidad**: `x-request-id`, logs estructurados o Sentry.
4. **Performance**: `Suspense`/`loading.tsx`, streaming y Server Components en listado.
5. **Skeletons en "cargar más"**: evaluar si agregar placeholders al final del listado.
6. **Búsqueda avanzada**: índice GIN o FTS en PostgreSQL para búsqueda exacta.
7. **Más tests**: hooks de TanStack Query y componentes con DOM (happy-dom/jsdom).
