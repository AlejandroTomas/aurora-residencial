-- Resident = persona que habita un lote (database.md).
-- No es una cuenta: puede existir sin profile ("puede existir sin acceso al sistema").
-- profile_id es opcional y 1:1 cuando existe ("Profile -> Resident es opcional").

create table public.residents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  lot_id uuid not null references public.lots(id) on delete restrict,
  profile_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  email text,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  deleted_at timestamptz,
  deleted_by uuid references public.profiles(id)
);

create index residents_tenant_id_idx on public.residents (tenant_id);
create index residents_lot_id_idx on public.residents (lot_id);

-- "Cada residente pertenece únicamente a un lote" ya lo garantiza lot_id not null;
-- esto además evita que un mismo profile se vincule a más de un resident activo.
create unique index residents_profile_id_active_key
  on public.residents (profile_id)
  where deleted_at is null and profile_id is not null;

create trigger set_updated_at
  before update on public.residents
  for each row execute function public.set_updated_at();
