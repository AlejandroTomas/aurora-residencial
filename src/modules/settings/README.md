# Módulo Settings

## Objetivo

Configuración mutable del tenant (`tenant_settings`): contacto, color principal, zona
horaria e idioma. La identidad del tenant (nombre) vive en el módulo `tenants`.

## Casos de uso

- `getSettings(session)` — lee la configuración o devuelve valores por defecto si aún no
  existe la fila (server-only).
- `updateSettings(session, input)` — upsert de la configuración. Registra auditoría.

## API pública

- `index.ts` — `updateSettingsAction`, `SettingsForm`, `SettingsDto`.
- `server.ts` — `getSettings` (server-only).

## Permisos

`permissions/settings.permissions.ts` → `canManageSettings` (solo admin).

## Nota

El upsert usa **service-role**: RLS de `tenant_settings` define SELECT/UPDATE pero no
INSERT, y la fila puede no existir todavía. El scoping por tenant lo da el `tenant_id` de la
sesión y la Action ya verificó rol admin. Si se prefiere, se puede añadir una policy de
INSERT y volver al cliente de usuario.
