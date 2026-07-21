-- Datos de onboarding del tenant (CLAUDE.md → Tenant Onboarding).
-- Amplían `tenant_settings` con dirección, web y moneda. La identidad (nombre/slug) sigue
-- en `tenants`; aquí van los datos de contacto/ubicación/preferencias, que son mutables.

alter table public.tenant_settings
  add column address text,
  add column city text,
  add column state text,
  add column postal_code text,
  add column country text,
  add column website text,
  add column currency text not null default 'MXN';
