# Prompt — Crear un Repository

El Repository es el **único** punto que conoce Supabase. Solo acceso a datos: sin reglas,
validaciones ni permisos. Referencia: `src/modules/residents/repositories/resident.repository.ts`.

## Contexto que debe leerse primero

- `.ai/context/architecture.md` (sección Repository), `.ai/context/database.md`
- `src/core/supabase` (`createSupabaseServerClient`, `createSupabaseServiceRoleClient`, `Database`)
- `src/core/types` (`toRange`, `PaginationParams`)

## Prompt

> Crea `{{entidad}}Repository` en
> `src/modules/{{nombre_modulo}}/repositories/{{entidad}}.repository.ts`.
>
> - `import "server-only";` al inicio. Usa `createSupabaseServerClient()` (respeta RLS del
>   usuario). Usa `createSupabaseServiceRoleClient()` **solo** si RLS no permite la operación
>   (ej. INSERT no habilitado) y documenta por qué; nunca lo expongas al cliente.
> - Define las columnas explícitas en una constante y un `type {{Entidad}}Record = Pick<Row, …>`
>   (nunca `SELECT *`). El tipo `Row` sale de `Database["public"]["Tables"]["{{tabla}}"]["Row"]`.
> - Métodos típicos: `listByTenant(tenantId, pagination, search?)` (con `{ count: "exact" }`,
>   `.eq("tenant_id", …)`, `.is("deleted_at", null)`, `.order(...)`, `.range(from, to)`),
>   `findById`, `existsActiveDuplicate`, `insert`, `update`, `setActive`.
> - Selects anidados (joins): tipa el resultado con `.returns<{{Raw}}[]>()` porque el
>   `Database` a mano no describe relaciones para el parser de supabase-js.
> - En error de Supabase: `if (error) throw error;` (que el Service lo interprete). No metas
>   lógica de negocio ni logging de dominio aquí.
> - Filtra por `tenant_id` en toda consulta, aunque RLS ya aísle (defense in depth).
> - Exporta desde `repositories/index.ts` (repo + tipos `Record`/`Raw`).

## Recordatorios

- Un Repository consulta una sola entidad (joins simples permitidos).
- Nunca conoce React, Actions ni componentes.
