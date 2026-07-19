-- Jerarquía física del fraccionamiento (database.md):
-- Tenant -> Stages -> Streets -> Blocks -> Lots -> Residents.
-- "Nunca guardar direcciones como texto. Siempre utilizar relaciones."

create table public.stages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  deleted_at timestamptz,
  deleted_by uuid references public.profiles(id)
);

create index stages_tenant_id_idx on public.stages (tenant_id);

create trigger set_updated_at
  before update on public.stages
  for each row execute function public.set_updated_at();

-- "Una calle puede existir en distintas etapas. Nunca asumir nombres únicos."
create table public.streets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  stage_id uuid not null references public.stages(id) on delete restrict,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  deleted_at timestamptz,
  deleted_by uuid references public.profiles(id)
);

create index streets_tenant_id_idx on public.streets (tenant_id);
create index streets_stage_id_idx on public.streets (stage_id);

create trigger set_updated_at
  before update on public.streets
  for each row execute function public.set_updated_at();

create table public.blocks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  street_id uuid not null references public.streets(id) on delete restrict,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  deleted_at timestamptz,
  deleted_by uuid references public.profiles(id)
);

create index blocks_tenant_id_idx on public.blocks (tenant_id);
create index blocks_street_id_idx on public.blocks (street_id);

create trigger set_updated_at
  before update on public.blocks
  for each row execute function public.set_updated_at();

-- "Debe ser único dentro de esa manzana. No necesariamente dentro del fraccionamiento."
-- "El lote contiene información física... No almacenar información personal."
create table public.lots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  block_id uuid not null references public.blocks(id) on delete restrict,
  number text not null,
  area numeric(10, 2),
  observations text,
  status public.lot_status not null default 'DISPONIBLE',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  deleted_at timestamptz,
  deleted_by uuid references public.profiles(id)
);

create index lots_tenant_id_idx on public.lots (tenant_id);
create index lots_block_id_idx on public.lots (block_id);

create unique index lots_block_number_active_key
  on public.lots (block_id, number)
  where deleted_at is null;

create trigger set_updated_at
  before update on public.lots
  for each row execute function public.set_updated_at();
