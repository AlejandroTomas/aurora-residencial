-- Tenant = un fraccionamiento. Es la raíz multi-tenant; por eso no lleva tenant_id propio.

create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create unique index tenants_slug_active_key
  on public.tenants (slug)
  where deleted_at is null;

create trigger set_updated_at
  before update on public.tenants
  for each row execute function public.set_updated_at();

-- Configuración del tenant (database.md: "No colocar configuración en múltiples tablas").
-- Se separa de `tenants` para no mezclar identidad con preferencias mutables del módulo Settings.
create table public.tenant_settings (
  tenant_id uuid primary key references public.tenants(id) on delete restrict,
  logo_url text,
  contact_phone text,
  contact_email text,
  primary_color text,
  timezone text not null default 'America/Mexico_City',
  language text not null default 'es',
  updated_at timestamptz not null default now(),
  updated_by uuid
);

create trigger set_updated_at
  before update on public.tenant_settings
  for each row execute function public.set_updated_at();
