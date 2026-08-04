# HU-03 — Simular oferta de crédito

## Historia de usuario

**Como** titular de una solicitud en borrador,
**quiero** ejecutar una simulación de oferta para saber si mi solicitud es viable,
**para que** pueda decidir si finalizar el trámite o ajustar los datos.

## Criterios de aceptación

### CA-01 — Ejecución de la simulación
- **Dado** que una solicitud está en estado `DRAFT` y tiene datos financieros completos,
- **Cuando** el titular solicita la simulación,
- **Entonces** el backend evalúa la regla de viabilidad y responde con `approved` o `not-viable`.

### CA-02 — Resultado aprobado
- **Dado** que la simulación resulta viable,
- **Cuando** se devuelve `approved`,
- **Entonces** el sistema muestra el monto, plazo, tasa de interés, cuota mensual, pago total y mensaje de viabilidad.

### CA-03 — Resultado no viable
- **Dado** que la simulación resulta no viable,
- **Cuando** se devuelve `not-viable`,
- **Entonces** el sistema muestra un mensaje indicando el motivo y la recomendación.

### CA-04 — Condición para finalizar
- **Dado** que el usuario desea finalizar la solicitud,
- **Cuando** pulsa `Finalizar`,
- **Entonces** el sistema permite enviar solo si la última simulación fue aprobada y es posterior a la última edición de datos.

## Condiciones y reglas de negocio

- La regla de viabilidad actual es `amount <= income * 3`.
- Cada simulación genera un evento `SIMULATED` con el resultado.
- Se permite volver a editar y simular incluso tras un resultado aprobado o no viable.
- Para `finalize` la última simulación `approved` debe ser más reciente que el último evento `UPDATED`.
- El cálculo de cuota, tasa y pago total se expone en la UI; en producción un motor real no revelaría estos valores.

## Flujo / proceso

1. El titular ingresa al detalle de una solicitud `DRAFT`.
2. El titular oprime el botón de simular.
3. El backend ejecuta la regla y persiste el evento `SIMULATED`.
4. El frontend muestra el resultado aprobado con cuota, tasa y pago total, o no viable con mensaje.
5. Si el resultado es aprobado y los datos no han sido editados posteriormente, se habilita el botón `Finalizar`.
6. El titular puede editar datos y volver a simular.

## Notas

- La simulación es una lógica de ejemplo; en producción se conectaría a un motor de scoring/riesgo.
- La frecuencia de simulaciones debería limitarse para evitar ingeniería inversa de la regla.
