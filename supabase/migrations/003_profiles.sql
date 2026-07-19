-- Profile = usuario autenticado (database.md: "id siempre referencia auth.users.id").
-- Columnas exactas según database.md; no es una "tabla de negocio" genérica
-- (no lleva created_by/deleted_at: se administra vía auth.users, no se elimina localmente).

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  email text not null,
  full_name text not null,
  phone text,
  role public.user_role not null default 'RESIDENT',
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_tenant_id_idx on public.profiles (tenant_id);
create unique index profiles_tenant_email_key on public.profiles (tenant_id, lower(email));

create trigger set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Cierra la referencia circular tenants.created_by/updated_by/deleted_by -> profiles.id
-- (profiles no podía existir antes de tenants porque profiles.tenant_id -> tenants.id).
alter table public.tenants
  add constraint tenants_created_by_fkey foreign key (created_by) references public.profiles(id),
  add constraint tenants_updated_by_fkey foreign key (updated_by) references public.profiles(id),
  add constraint tenants_deleted_by_fkey foreign key (deleted_by) references public.profiles(id);

alter table public.tenant_settings
  add constraint tenant_settings_updated_by_fkey foreign key (updated_by) references public.profiles(id);
