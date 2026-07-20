# Módulo Tenants

## Objetivo

Gestión de la identidad del fraccionamiento (tenant) del usuario autenticado. La
configuración mutable (contacto, colores, zona horaria) vive en el módulo `settings`
sobre `tenant_settings`; aquí solo la identidad (`tenants`).

El alta de tenants es onboarding vía service-role (RLS no permite INSERT a `authenticated`),
fuera del flujo normal de usuario.

## Casos de uso

- `getCurrentTenant(session)` — lee el tenant de la sesión (server-only).
- `updateTenant(session, input)` — cambia el nombre; registra auditoría.

## API pública

- `index.ts` — `updateTenantAction`, `TenantForm`, `TenantDto`.
- `server.ts` — `getCurrentTenant` (server-only).

## Permisos

`permissions/tenant.permissions.ts` → `canManageTenant` (solo admin). RLS lo refuerza
(`tenants_update` exige `is_admin()` y mismo tenant).
