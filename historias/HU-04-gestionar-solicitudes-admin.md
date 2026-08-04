# HU-04 — Gestionar solicitudes como administrador

## Historia de usuario

**Como** administrador del sistema,
**quiero** listar, filtrar, ordenar y decidir sobre las solicitudes recibidas,
**para que** pueda hacer seguimiento del proceso y aprobar o rechazar solicitudes en validación.

## Criterios de aceptación

### CA-01 — Listado de solicitudes
- **Dado** que un administrador ha iniciado sesión,
- **Cuando** accede al listado de solicitudes,
- **Entonces** el sistema muestra las solicitudes ordenadas de más reciente a más antigua, con paginación por cursor.

### CA-02 — Filtros y búsqueda
- **Dado** que el administrador está en el listado,
- **Cuando** aplica filtro por estado, canal o término de búsqueda,
- **Entonces** el sistema actualiza el listado manteniendo el orden por fecha descendente.

### CA-03 — Decisión de aprobación
- **Dado** que una solicitud está en `PENDING_VALIDATION`,
- **Cuando** el administrador aprueba la solicitud,
- **Entonces** el sistema cambia el estado a `APPROVED`, registra un evento `DECIDED` y notifica (vía SSE).

### CA-04 — Decisión de rechazo
- **Dado** que una solicitud está en `PENDING_VALIDATION`,
- **Cuando** el administrador rechaza la solicitud con un motivo,
- **Entonces** el sistema cambia el estado a `REJECTED`, registra el motivo en el evento `DECIDED` y notifica.

## Condiciones y reglas de negocio

- El listado se ordena por `createdAt` descendente y usa `id` como desempate.
- El administrador requiere token JWT obtenido en `POST /api/v1/auth/login`.
- El rechazo es obligatorio con un motivo descriptivo.
- Una vez decidida, la solicitud no puede volver a `PENDING_VALIDATION` ni ser editada.
- Solo las solicitudes en `PENDING_VALIDATION` son elegibles para decisión.

## Flujo / proceso

1. El administrador inicia sesión con usuario y contraseña.
2. El backend valida credenciales y devuelve un JWT.
3. El administrador accede al listado de solicitudes.
4. El frontend consulta `GET /api/v1/applications` con filtros y paginación.
5. El administrador revisa el detalle de una solicitud.
6. Si la solicitud está en `PENDING_VALIDATION`, el administrador oprime `Aprobar` o `Rechazar`.
7. El backend valida el rol, cambia el estado y persiste el evento `DECIDED`.
8. El frontend actualiza la UI con el nuevo estado.

## Notas

- El proceso de decisión es manual; en un escenario real podría incluir un analista de crédito o motor de decisión automático.
- Los eventos quedan en la trazabilidad (`GET /api/v1/applications/:id/events`) para auditoría.
