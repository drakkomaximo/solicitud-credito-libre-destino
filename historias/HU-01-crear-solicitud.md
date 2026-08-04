# HU-01 — Crear una solicitud de crédito de libre destino

## Historia de usuario

**Como** usuario interesado en un crédito de libre destino,
**quiero** completar un formulario de solicitud con mis datos personales, financieros y la información del crédito deseado,
**para que** el sistema genere una solicitud en estado `DRAFT` y me entregue un token para continuar o retomar el trámite.

## Criterios de aceptación

### CA-01 — Canal y datos personales
- **Dado** que un usuario accede al formulario,
- **Cuando** selecciona el canal (`self-service` o `advisor`), ingresa tipo y número de documento, nombres, teléfono, correo, ciudad y, si aplica, un `advisorId` válido,
- **Entonces** el sistema permite avanzar al paso de información financiera.

### CA-02 — Datos financieros y crédito
- **Dado** que el usuario está en el segundo paso,
- **Cuando** ingresa ingresos, gastos, monto, plazo, propósito y autoriza el tratamiento de datos,
- **Entonces** el sistema valida que el monto y el plazo sean valores permitidos y que los ingresos sean mayores a los gastos.

### CA-03 — Creación y token de acceso
- **Dado** que el usuario confirmó la información en el paso de revisión,
- **Cuando** envía la solicitud,
- **Entonces** el sistema crea el registro, guarda el evento `CREATED` y devuelve un `accessToken` para continuar el flujo sin sesión.

## Condiciones y reglas de negocio

- El teléfono se normaliza a 10 dígitos asumiendo celular colombiano; se eliminan caracteres no numéricos y el prefijo `57` si está presente.
- El plazo debe corresponder a un valor activo del dominio `credit-term`.
- El `advisorId` es obligatorio y se valida contra el catálogo de asesores cuando `channel` es `advisor`.
- Una solicitud `DRAFT` permite edición parcial y simulación antes de finalizarla.
- El token generado es no revocable y no tiene expiración en esta versión.

## Flujo / proceso

1. El usuario selecciona el canal y completa los datos personales (paso 1).
2. El sistema valida los campos con Zod y avanza al paso 2.
3. El usuario ingresa información financiera y autoriza el tratamiento de datos (paso 2).
4. El sistema valida montos, plazo y autorización.
5. El usuario revisa el resumen (paso 3).
6. El sistema crea la solicitud en base de datos, persiste el evento `CREATED` y responde con `id`, `accessToken` y estado `DRAFT`.
7. El frontend redirige al detalle de la solicitud.

## Notas

- El formulario es multistep con scroll al cambiar de paso para mejor UX en móvil.
- Se usa `react-hook-form` + `zod` para validación cliente y la API repite validación con `class-validator`.
- En producción el token de solicitud debería tener expiración corta y mecanismo de revocación.
