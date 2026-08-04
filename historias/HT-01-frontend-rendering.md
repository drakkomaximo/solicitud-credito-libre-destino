# HT-01 — Estrategia de rendering en Next.js App Router

## Historia técnica

**Como** equipo de desarrollo frontend,
**quiero** definir una estrategia consciente de renderizado para las páginas del micrositio,
**para que** se aprovechen Server Components (RSC), `Suspense` y `loading.tsx`, reduciendo JavaScript enviado al cliente y mejorando el tiempo de carga.

## Criterios de aceptación

### CA-01 — Uso de Server Components en pantallas de lectura
- **Dado** que un usuario entra al listado o detalle,
- **Cuando** la página carga,
- **Entonces** el contenedor principal se renderiza en el servidor y los datos estáticos (título, filtros, layout) se envían como HTML, mientras que solo los bloques interactivos (`ApplicationFilters`, acciones) son Client Components.

### CA-02 — Estados de carga con `loading.tsx`
- **Dado** que una ruta depende de datos asíncronos,
- **Cuando** el navegador solicita la página,
- **Entonces** Next.js muestra el `loading.tsx` correspondiente hasta que los `Suspense` boundaries resuelvan el contenido.

### CA-03 — Hidración controlada
- **Dado** que un Client Component requiere interactividad,
- **Cuando** se renderiza,
- **Entonces** se carga el mínimo de JavaScript necesario y se evita hidratar componentes puramente visuales (skeletons, badges).

## Consideraciones de seguridad

- No exponer claves ni tokens en Server Components innecesarios; las variables sensibles deben usarse solo en el backend o en variables de entorno no `NEXT_PUBLIC_`.
- Evitar pasar datos del servidor al cliente que no sean estrictamente necesarios para la UI.
- Asegurar que `loading.tsx` no filtre información parcial de la solicitud.

## Notas

- **Estado: implementado.** Las páginas, layouts, skeletons y los wrappers con `Suspense` (`ApplicationDetail`, `ApplicationNewForm`, `ApplicationEditForm`) son Server Components; cada segmento de ruta tiene su `loading.tsx` con el skeleton real para streaming.
- Los Client Components se limitan a lo interactivo: formularios (`react-hook-form`), filtros con `useSearchParams`, autenticación por cookies (`ApplicationsView`), header con menú móvil y animaciones (`FadeIn`).
- `ApplicationListSkeleton`, `ApplicationDetailSkeleton` y `ApplicationFormSkeleton` son Server Components puros.
- Mejora futura: streaming de datos del listado desde el servidor, que requiere mover la autenticación a cookies `HttpOnly` legibles por el servidor.
