# Checklist — Nueva funcionalidad / módulo

Guía para entregar una funcionalidad completa sin romper la arquitectura. El módulo de
referencia es `src/modules/residents` (CRUD completo). No inventar estructuras nuevas:
copiar el patrón existente.

Flujo obligatorio: **UI → Server Action → Service → Repository → Supabase (RLS)**. Nunca
saltar capas.

## 1. Antes de escribir código

- [ ] Entendí el caso de uso (no el "CRUD"): registrar, suspender, reactivar, cambiar rol…
- [ ] Busqué código reutilizable en `components/`, `modules/`, `core/`, `hooks/`.
- [ ] Reviso si la entidad ya tiene tabla y RLS en `supabase/migrations/`.
- [ ] Confirmo que todo lo nuevo pertenece a un `tenant_id` (salvo tablas de sistema).

## 2. Base de datos (si aplica)

- [ ] Migración nueva en `supabase/migrations/` (numerada, incremental, nunca editar una ya aplicada).
- [ ] Toda tabla de negocio: `tenant_id`, `is_active`, auditoría (`created_at/by`, `updated_at/by`, `deleted_at/by`) y trigger `set_updated_at`.
- [ ] RLS habilitado en la misma migración que crea la tabla; policies por tenant + rol. Nunca `using (true)`.
- [ ] Relaciones por FK, nunca texto libre. Enums para catálogos (rol, estado…).
- [ ] Tras aplicar: actualizar el tipado en `src/core/supabase/types.ts` (o regenerar con `supabase gen types`).

## 3. Dominio del módulo (`modules/<nombre>/`)

- [ ] `schemas/` — Zod. Normalizar entradas (trim, lowercase en correos). Sin `preprocess`/`transform` que rompan el tipo de entrada de React Hook Form.
- [ ] `types/` — DTO en camelCase. Nunca exponer filas crudas de PostgreSQL.
- [ ] `errors/` — errores tipados que extienden `AppError` (`NotFoundError`, `ConflictError`, `ValidationError`…). Nunca `throw new Error()`.
- [ ] `permissions/` — funciones puras `can*(session)` (autoridad de autorización en la Action).
- [ ] `repositories/` — único punto que toca Supabase. Solo acceso a datos, sin reglas. `SELECT` de columnas explícitas (nunca `*`). Selects anidados tipados con `.returns<T>()`.
- [ ] `mappers/` — fila → DTO. Toda transformación aquí, nunca en componentes.
- [ ] `services/` — un caso de uso por archivo. Aquí viven las reglas de negocio y la llamada a `recordAudit`.
- [ ] `actions/` — `"use server"`, una acción por archivo. Validan sesión/permiso/datos y devuelven `ActionResult<T>`; `revalidatePath` de lo afectado.
- [ ] `index.ts` (cliente-seguro: actions, componentes, tipos) y `server.ts` (`import "server-only"`: lecturas/services). Nunca importar archivos internos de otro módulo.
- [ ] `README.md` — objetivo, casos de uso, API pública, permisos, decisiones.

## 4. Seguridad (cada mutación)

- [ ] Valida en este orden: **sesión → permiso (`can*`) → datos (Zod) → operación**.
- [ ] El `tenant_id` y el rol provienen SIEMPRE de la sesión (`requireSession`/`requireAdmin`), nunca del cliente.
- [ ] RLS asumido como última barrera (defense in depth), no como única.
- [ ] Toda escritura registra auditoría (`recordAudit`).
- [ ] Errores traducidos con `toActionError` (nunca exponer el error interno a la UI).
- [ ] Pensé los límites de plan (Subscription Ready) si la entidad los tiene (máx. residentes, etc.).

## 5. UI (`app/(dashboard)/<ruta>/`)

- [ ] Server Component por defecto; `"use client"` solo cuando hay interacción real.
- [ ] Página protegida: `getCurrentSession` + redirección si no hay sesión/permiso.
- [ ] Layout del módulo: `PageScaffold` (header + acciones) → filtros → contenido → paginación.
- [ ] Formularios con React Hook Form + Zod (nunca `useState` para el formulario completo).
- [ ] Estados contemplados: **loading, empty, error, success, disabled** (y unauthorized).
- [ ] Búsqueda/paginación por URL (`SearchInput`/`Pagination` de `components/shared`).
- [ ] Catálogos con `Select`, nunca texto libre. Estados con `Badge`, nunca colores sueltos.
- [ ] Botones bloquean doble envío durante la mutación; feedback con `toast`.
- [ ] Accesible (label en cada input, foco en diálogos, navegable con teclado) y responsive.

## 6. Definition of Done

- [ ] `pnpm typecheck` sin errores. Sin `any`, `ts-ignore`, `ts-expect-error`.
- [ ] `pnpm build` verde.
- [ ] `pnpm exec eslint` limpio (sin `console.log`; usar `logger`).
- [ ] Sin código duplicado, sin código muerto, sin TODO/FIXME.
- [ ] Probado manualmente el flujo feliz y al menos un caso de error/permiso.
- [ ] Deuda técnica (si la hay) documentada en `.ai/control/alignment.md`, no oculta.
- [ ] Resumen de entrega: qué cambió, qué archivos, por qué, decisiones y mejoras futuras.
