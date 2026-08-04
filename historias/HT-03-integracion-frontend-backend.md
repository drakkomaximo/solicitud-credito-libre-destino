# HT-03 — Integración frontend-backend con trazabilidad y manejo de errores

## Historia técnica

**Como** equipo de desarrollo,
**quiero** una integración robusta entre el frontend y el backend,
**para que** las solicitudes sean rastreables, los errores sean comprensibles y la experiencia del usuario sea coherente ante cualquier respuesta de la API.

## Criterios de aceptación

### CA-01 — Correlación de peticiones con `x-request-id`
- **Dado** que el frontend realiza una petición al backend,
- **Cuando** se envía la solicitud,
- **Entonces** se incluye un header `x-request-id` único que el backend registra en sus logs y devuelve en respuestas de error para soporte.

### CA-02 — Manejo unificado de errores
- **Dado** que la API responde con error,
- **Cuando** el frontend recibe `4xx` o `5xx`,
- **Entonces** se diferencia entre rechazo de viabilidad, error funcional y error técnico temporal, mostrando el mensaje adecuado y, si aplica, el `requestId`.

### CA-03 — Contratos API documentados
- **Dado** que un desarrollador consulta el repositorio,
- **Cuando** revisa la documentación,
- **Entonces** encuentra los endpoints, payloads, códigos de error y ejemplos de respuesta en el README del backend.

## Consideraciones de seguridad

- Las credenciales y tokens se envían con `credentials: 'include'` y se almacenan en cookies `SameSite=Lax`; evaluar `HttpOnly` en futuras versiones.
- El `x-request-id` no debe exponer información interna; usar UUID v4 o similar.
- Limitar CORS en producción a dominios explícitos y no usar `*` con credenciales.
- No incluir detalles técnicos sensibles en mensajes de error mostrados al usuario; el `requestId` sí puede mostrarse para soporte.

## Notas

- **Estado: implementado.** `HttpClient` centraliza el consumo, genera el `x-request-id` en cada petición y `ApiError` incluye el `requestId`.
- El backend lee o genera `x-request-id` mediante middleware, lo registra en los logs HTTP/errores y lo expone al cliente vía `exposedHeaders` en CORS.
