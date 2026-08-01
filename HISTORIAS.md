# Historias técnicas

## 1. Frontend / Rendering

**Título:** Implementar la landing y el listado de solicitudes con Next.js App Router y estrategia de renderizado mixta.

**Como** desarrollador frontend
**quiero** que la landing sea estática y el listado de solicitudes use datos dinámicos del backend
**para** cumplir el requisito de rendering consciente y buen rendimiento inicial.

### Criterios de aceptación
- La página `/` se prerenderiza como contenido estático.
- La página `/applications` es un Client Component que consulta `/applications` vía `fetch`.
- Se manejan explícitamente estados `loading`, `empty`, `success` y `error`.
- Los filtros por `status`, `channel` y `q` se envían como query params al backend.

### Consideraciones de seguridad
- No se expone la API key en el cliente; la URL del backend se puede parametrizar vía variable de entorno.
- Sanitizar el input de búsqueda antes de enviarlo.

---

## 2. Formularios / Validaciones

**Título:** Construir el flujo multi-paso de creación de solicitud con React Hook Form y Zod.

**Como** usuario del micrositio
**quiero** completar la solicitud en pasos con validaciones inmediatas
**para** evitar errores y entender qué información falta antes de enviar.

### Criterios de aceptación
- El formulario se divide en tres pasos: canal y datos básicos, datos financieros, resumen.
- Cada paso valida con Zod antes de avanzar (`trigger` de React Hook Form).
- El paso final muestra un resumen y envía `POST /applications`.
- Se muestran mensajes de error claros bajo cada campo y un mensaje global si el backend falla.

### Consideraciones de seguridad
- Validar en cliente y servidor; el backend rechaza payloads inválidos con `ValidationPipe`.
- No persistir datos sensibles en `localStorage`; mantenerlos solo en memoria del componente.

---

## 3. Integración frontend-backend

**Título:** Consumir la API de solicitudes y trazabilidad con fetch y manejo de errores funcional.

**Como** desarrollador
**quiero** que el frontend consuma los endpoints del backend y refleje los estados de negocio
**para** ofrecer una experiencia consistente en creación, edición, simulación y finalización.

### Criterios de aceptación
- `GET /applications/:id` muestra detalle, eventos y acciones disponibles.
- `PATCH /applications/:id` permite editar datos complementarios.
- `POST /applications/:id/simulate-offer` muestra el resultado (aprobado, no viable, error técnico).
- `POST /applications/:id/finalize` y `POST /applications/:id/abandon` actualizan el estado y redirigen al detalle.
- Se diferencian los mensajes al usuario según el tipo de respuesta del backend.

### Consideraciones de seguridad
- Usar CORS configurado en el backend (`enableCors()`).
- No enviar secretos ni información sensible en la URL.
- Manejar errores HTTP 4xx/5xx mostrando mensajes funcionales y guardando el `correlationId` o `id` para soporte.
