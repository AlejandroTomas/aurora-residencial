# Prompt — Crear un módulo

Plantilla para andamiar un módulo de dominio nuevo en `src/modules/`. Rellena los
`{{placeholders}}` y pégalo como instrucción.

## Contexto que debe leerse primero

- `CLAUDE.md` (estructura, convenciones, multi-tenant)
- `.ai/context/architecture.md` (capas y responsabilidades)
- Módulo de referencia: `src/modules/residents`
- `.ai/checklists/feature.md`

## Prompt

> Crea el módulo **`{{nombre_modulo}}`** en `src/modules/{{nombre_modulo}}/` siguiendo
> exactamente el patrón de `src/modules/residents`. La entidad es **{{Entidad}}** y
> pertenece a un tenant. Casos de uso: {{lista_de_casos_de_uso}}.
>
> Genera la estructura de carpetas con `index.ts` por carpeta pública:
> `actions/ components/ constants/ errors/ mappers/ permissions/ repositories/ schemas/ services/ types/`
> más `index.ts` (API pública cliente-segura), `server.ts` (`import "server-only"` para
> lecturas/services) y `README.md`.
>
> Reglas:
> - Flujo UI → Action → Service → Repository → Supabase. No saltar capas.
> - DTO en camelCase en `types/`; nunca exponer filas crudas.
> - Errores tipados que extienden `AppError` en `errors/`.
> - `permissions/` con funciones puras `can*(session)`.
> - No crees carpetas vacías sin uso real, pero respeta las que el módulo sí necesita.
> - Al final: `pnpm typecheck` y `pnpm build` en verde, ESLint limpio.

## Salida esperada

- Estructura del módulo con barrels.
- `index.ts` (actions + componentes + tipos) y `server.ts` (services de lectura).
- `README.md` con objetivo, casos de uso, API pública, permisos y decisiones.
- Registro de la deuda pendiente en `.ai/control/alignment.md` si queda algo.
