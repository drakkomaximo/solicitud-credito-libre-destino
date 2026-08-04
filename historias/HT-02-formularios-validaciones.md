# HT-02 — Validaciones de formularios y seguridad de entradas

## Historia técnica

**Como** equipo de desarrollo frontend,
**quiero** centralizar y fortalecer las validaciones de formularios,
**para que** los datos cumplan reglas de negocio antes de enviarse, se eviten envíos inválidos y se reduzcan riesgos de inyección o datos inconsistentes.

## Criterios de aceptación

### CA-01 — Validación cliente y servidor con esquemas compartidos
- **Dado** que un usuario completa el formulario multi-paso,
- **Cuando** avanza o envía,
- **Entonces** `zod` valida formato, obligatoriedad y reglas de negocio en el cliente y la API repite la validación con `class-validator` en el backend.

### CA-02 — Normalización y sanitización de entradas
- **Dado** que un usuario ingresa teléfono, correo o texto libre,
- **Cuando** el formulario procesa el dato,
- **Entonces** se normaliza (ej. `normalizePhone`) y se eliminan espacios/ caracteres de riesgo antes de enviar al backend.

### CA-03 — Validación asíncrona de viabilidad
- **Dado** que un titular completa datos financieros,
- **Cuando** solicita simular,
- **Entonces** el backend verifica la regla de viabilidad (`amount <= income * 3`) y responde con mensaje funcional claro en vez de error genérico.

## Consideraciones de seguridad

- No confiar únicamente en la validación del cliente; el backend debe validar todo payload.
- Sanitizar campos libres (`purpose`, `reason`) para evitar inyección en logs y base de datos.
- Limitar la frecuencia de simulaciones para evitar ingeniería inversa de la regla de viabilidad.
- Los tokens de acceso a borrador no deben contener datos sensibles ni ser predecibles.

## Notas

- `react-hook-form` + `zod` ya están implementados. La mejora consiste en extraer esquemas comunes entre creación y edición y en reutilizar mensajes de error.
- Se recomienda un esquema `draftSchema` para guardados parciales y un `finalizeSchema` con la condición de simulación vigente.
