# HU-02 — Continuar una solicitud en borrador

## Historia de usuario

**Como** cliente que ya inició una solicitud y no la finalizó,
**quiero** buscar mi borrador con el documento y teléfono para retomarla,
**para que** pueda seguir editando, simular y finalizar sin crear una solicitud nueva.

## Criterios de aceptación

### CA-01 — Búsqueda de borrador
- **Dado** que un usuario tiene una solicitud en estado `DRAFT`,
- **Cuando** ingresa su tipo y número de documento y teléfono en la pantalla de consulta,
- **Entonces** el sistema busca la solicitud más reciente `DRAFT` asociada a esos datos.

### CA-02 — Acceso al borrador
- **Dado** que el sistema encontró el borrador,
- **Cuando** la respuesta es exitosa,
- **Entonces** se genera un nuevo token de acceso a la solicitud y se redirige al detalle.

### CA-03 — Sin borrador vigente
- **Dado** que no existe una solicitud `DRAFT` para los datos ingresados,
- **Cuando** el usuario intenta consultar,
- **Entonces** el sistema devuelve un mensaje claro indicando que no se encontró un borrador.

## Condiciones y reglas de negocio

- Solo se pueden retomar solicitudes en estado `DRAFT`.
- El documento y teléfono deben coincidir exactamente con los de la solicitud.
- El teléfono se normaliza igual que en la creación para comparar correctamente.
- El token entregado permite operar solo sobre esa solicitud específica.
- No se verifica identidad con OTP ni segundo factor en esta versión.

## Flujo / proceso

1. El usuario ingresa a la landing y selecciona la opción de continuar solicitud.
2. El sistema muestra el formulario de consulta con documento y teléfono.
3. El usuario envía los datos.
4. El backend normaliza el teléfono y busca el borrador más reciente.
5. Si existe, el backend genera un token y responde con el `id`.
6. El frontend redirige al detalle de la solicitud con el token almacenado.
7. Si no existe, el frontend muestra un mensaje de error y ofrece crear una nueva solicitud.

## Notas

- La consulta es pública y no requiere JWT de cliente.
- En producción este flujo debería incluir un paso de verificación de identidad (OTP, correo o SMS).
