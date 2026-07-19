# Supabase

Fuente de verdad de la base de datos. Regla de `database.md`: "Nunca crear SQL fuera de esta carpeta. Todo cambio de base de datos debe vivir en una migración."

## Estructura

- `migrations/` — única fuente ejecutable del esquema. Numeradas y secuenciales; nunca se
  modifica una migración existente, siempre se crea una nueva (`011_...sql`, `012_...sql`, ...).
- `seeds/` — datos mínimos de desarrollo (`seed.sql`). Nunca información de producción.
- `functions/` — Edge Functions, solo cuando exista una razón real para no resolverlo en
  Postgres o en una Server Action (`architecture.md`: "No convertir PostgreSQL en una API
  completa"). Vacía por ahora.
- `policies/` — documentación humana de las políticas RLS vigentes, para lectura rápida sin
  abrir la migración. **No es la fuente de verdad**: eso es siempre `migrations/009_rls.sql`
  y las que la sigan. Si hay una discrepancia, la migración manda.
- `storage/` — convención de rutas del bucket privado `tenant-files` (ver `010_storage.sql`).
- `types/` — salida de `supabase gen types typescript`, que reemplaza el placeholder en
  `src/core/supabase/types.ts`.

## Orden de las migraciones (Fase 2)

1. `001_extensions_and_enums.sql` — `pgcrypto`, enums `user_role`/`lot_status`, trigger genérico `set_updated_at()`.
2. `002_tenants.sql` — `tenants`, `tenant_settings`.
3. `003_profiles.sql` — `profiles` (referencia `auth.users`); cierra el FK circular con `tenants`.
4. `004_property_hierarchy.sql` — `stages` → `streets` → `blocks` → `lots`.
5. `005_residents.sql` — `residents` (lote obligatorio, profile opcional).
6. `006_announcements.sql` — `announcements`, `announcement_reads`.
7. `007_documents.sql` — `documents`, `announcement_documents`.
8. `008_audit_log.sql` — `audit_log` (append-only, columnas exactas de `security.md`).
9. `009_rls.sql` — helpers (`current_tenant_id()`, `current_user_role()`, `is_admin()`) + RLS en todas las tablas anteriores.
10. `010_storage.sql` — bucket privado `tenant-files` + policies de `storage.objects`.

## Cómo aplicarlas

Este proyecto no trae el CLI de Supabase configurado todavía (no hay `supabase/config.toml`
ni proyecto vinculado). Dos formas de aplicar estas migraciones a un proyecto real:

1. **Dashboard**: pegar el contenido de cada archivo, en orden, en el SQL Editor.
2. **CLI**: `supabase link --project-ref <ref>` y luego `supabase db push` (requiere tener el
   CLI instalado y `supabase/config.toml`, que no se generó en esta sesión).

Después de aplicarlas, generar los tipos reales y reemplazar el placeholder:

```
supabase gen types typescript --project-id <id> > supabase/types/database.types.ts
```

y actualizar `src/core/supabase/types.ts` para reexportar ese archivo (o apuntar los clientes
directamente a `supabase/types/database.types.ts`).

## Decisiones no explícitas en `database.md` (para confirmar)

- **`tenant_settings` como tabla separada de `tenants`**: el doc dice "no colocar
  configuración en múltiples tablas", lo cual se cumple (sigue siendo una sola tabla), pero
  separa identidad (`tenants`) de configuración mutable (`tenant_settings`).
- **`audit_log` se llena desde el Service, no con un trigger de Postgres**: `ip` y
  `user_agent` no están disponibles dentro de un trigger; sí en la Server Action.
- **Vehículos y Eventos no se crearon**: están documentados en `database.md` como modelo de
  dominio general, pero no están en el MVP de `CLAUDE.md`. El modelo actual no les cierra el
  paso (se agregan como tablas nuevas con sus FKs cuando entren al roadmap).
- **Roles como `enum`, no como tabla catálogo**: `database.md` los menciona en ambos lugares
  (`Roles: Definir mediante Enum` y luego los lista como ejemplo de `Catálogos`). Se priorizó
  la regla explícita del enum por ser más específica y porque los roles son un conjunto fijo
  y crítico para las políticas RLS.
