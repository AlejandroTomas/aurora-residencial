# Módulo Platform

## Objetivo

Nivel **Plataforma** del SaaS: lo administra únicamente el dueño (`SUPER_ADMIN`). Gestiona
**todos** los fraccionamientos (tenants), no residentes ni datos internos de un tenant.
Los dos niveles (Plataforma y Tenant) nunca se mezclan (CLAUDE.md → Platform Hierarchy).

## Casos de uso

- `listTenants(session)` — lista todos los fraccionamientos (server-only). Lectura vía RLS
  (`tenants_select_platform` permite al SUPER_ADMIN ver todos).
- `provisionTenant(session, input, redirectTo)` — alta completa: crea el tenant, su
  `tenant_settings` y su administrador inicial (invitado por correo). Compensa (borra lo
  creado) si un paso falla.
- `setTenantActive(session, input)` — activa o suspende un fraccionamiento.

## Modelo del SUPER_ADMIN

`profiles.tenant_id` es obligatorio, así que el SUPER_ADMIN pertenece a un tenant reservado
**"Plataforma"** (ver `supabase/seeds/platform.sql`). No es un fraccionamiento real; solo
satisface la relación. Las operaciones cross-tenant no dependen de él: las lecturas usan la
policy de RLS del SUPER_ADMIN y las escrituras (crear/suspender tenant, invitar admin) usan
**service-role**, verificando el rol en el servidor.

## API pública

- `index.ts` — actions, `ProvisionTenantForm`, `PlatformTenantsTable`, `PLAN_LABELS`, `PlatformTenantDto`.
- `server.ts` — `listTenants`, `isPlatformAdmin` (server-only).

## Preparado para (roadmap)

- **Suscripciones / planes:** `tenants.plan` (`subscription_plan`) ya existe y se muestra.
  Falta la gestión (cambiar plan) y la validación de límites por plan en los Services de cada
  módulo (máx. residentes, comunicados, almacenamiento…).
- Facturación, feature flags, analytics y soporte (nivel plataforma).

## Pendiente

- [ ] Paginación de la lista de tenants cuando el volumen lo amerite (hoy `listAll`).
