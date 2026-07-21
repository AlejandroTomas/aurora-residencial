# Prompt — Crear un CRUD completo

Plantilla para un caso de uso completo (listar + crear + editar + suspender/activar) de una
entidad de tenant. Referencia canónica: `src/modules/residents`.

## Contexto que debe leerse primero

- `.ai/context/architecture.md`, `.ai/context/security.md`, `.ai/context/ui-guidelines.md`
- `src/modules/residents` completo (dominio + UI)
- `src/core/types` (`ActionResult`, `Paginated`, `toRange`), `src/core/services/audit.service`, `src/core/utils`

## Prompt

> Implementa el CRUD de **{{Entidad}}** en `src/modules/{{nombre_modulo}}/`, calcado del
> patrón de `residents`. Campos: {{campos}}. Reglas de negocio: {{reglas}} (ej. no duplicar,
> no dejar sin último X).
>
> **Dominio**
> - `schemas/`: Zod para create/update/set-active. Normaliza (trim, correos en minúscula).
>   Campos opcionales con `.optional().or(z.literal(""))` (no uses `preprocess`/`transform`:
>   rompen el tipo de entrada de React Hook Form). Convierte `""`→`null` en el repository.
> - `types/`: DTO camelCase.
> - `errors/`: `{{Entidad}}NotFoundError`, `{{Entidad}}AlreadyExistsError`, etc. (extienden `AppError`).
> - `permissions/`: `canView{{Entidad}}s`, `canManage{{Entidad}}s`.
> - `repositories/`: `listByTenant` (con `{ count: "exact" }` + `.range(toRange(...))`),
>   `findById`, `existsActiveDuplicate`, `insert`, `update`, `setActive`. Columnas explícitas;
>   selects anidados con `.returns<T>()`. Filtra `is("deleted_at", null)`.
> - `mappers/`: fila (o fila anidada) → DTO.
> - `services/`: un archivo por caso de uso. Validan reglas y llaman `recordAudit`. Devuelven DTO.
> - `actions/`: `"use server"`, una por archivo. `requireSession` + `can*` → `PermissionDeniedError`;
>   validan con Zod; devuelven `ActionResult<T>`; `revalidatePath` de la ruta; `try/catch` con `toActionError`.
>
> **UI** (`app/(dashboard)/{{ruta}}/page.tsx`, Server Component)
> - Protege con `getCurrentSession` + `isAdminRole`; redirige si no procede.
> - `PageScaffold` con acción "Nuevo {{Entidad}}" (diálogo reutilizable create/edit como
>   `ResidentFormDialog`), `SearchInput` + tabla (`ui/table`) + `Pagination` (`components/shared`).
>   Estados con `Badge`, catálogos con `Select`, feedback con `toast`, `useTransition` para acciones de fila.
> - Lee `searchParams` (`page`, `q`) y pásalos al service.
>
> Cierra con `index.ts`/`server.ts`, `README.md`, y `typecheck`/`build`/`eslint` en verde.

## Recordatorios

- Toda escritura: auditoría. Todo listado: paginado. Toda mutación: sesión → permiso → tenant → datos.
- RLS es la última barrera, no la única.
