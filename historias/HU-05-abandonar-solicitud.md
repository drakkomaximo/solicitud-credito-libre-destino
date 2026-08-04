# HU-05 — Abandonar una solicitud

## Historia de usuario

**Como** titular de una solicitud en borrador o en proceso,
**quiero** poder abandonarla de forma explícita indicando un motivo,
**para que** el sistema registre el cierre sin perder la trazabilidad del caso.

## Criterios de aceptación

### CA-01 — Solicitud de abandono
- **Dado** que una solicitud no está en un estado final (`APPROVED` o `REJECTED`),
- **Cuando** el titular oprime abandonar,
- **Entonces** el sistema muestra un modal solicitando el motivo.

### CA-02 — Abandono con motivo
- **Dado** que el titular confirmó el abandono,
- **Cuando** ingresa un motivo y confirma,
- **Entonces** el sistema cambia el estado a `ABANDONED`, persiste el evento `ABANDONED` con el motivo y permanece en el detalle mostrando el nuevo estado.

### CA-03 — Cancelación de abandono
- **Dado** que el titular abrió el modal de abandono,
- **Cuando** cancela la acción,
- **Entonces** el sistema cierra el modal y no realiza cambios en la solicitud.

## Condiciones y reglas de negocio

- Solo se pueden abandonar solicitudes que no estén en estado final.
- El motivo es obligatorio y se guarda en el evento de dominio.
- Una solicitud `ABANDONED` no puede ser editada, simulada ni finalizada.
- El titular puede ser el cliente (JWT de cliente) o portador del token de solicitud.

## Flujo / proceso

1. El titular ingresa al detalle de una solicitud no final.
2. El titular oprime el botón `Abandonar`.
3. El frontend muestra un modal con campo de motivo.
4. El titular escribe el motivo y confirma.
5. El backend valida el estado, cambia a `ABANDONED` y persiste el evento.
6. El frontend permanece en el detalle de la solicitud, mostrando el estado `ABANDONED` y el evento en la trazabilidad.
7. Si el usuario cancela, el modal se cierra sin mutación.

## Notas

- El modal de abandono mejora la UX evitando clics accidentales.
- La trazabilidad permite analizar los motivos de abandono para futuras mejoras del producto.
