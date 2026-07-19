-- Comunicados (database.md: "Entidad independiente. No incrustar comentarios.").

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  title text not null,
  body text not null,
  published_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  deleted_at timestamptz,
  deleted_by uuid references public.profiles(id)
);

create index announcements_tenant_id_idx on public.announcements (tenant_id);
create index announcements_published_at_idx on public.announcements (published_at);

create trigger set_updated_at
  before update on public.announcements
  for each row execute function public.set_updated_at();

-- Lecturas: entidad intermedia Announcement -> Resident -> Read (database.md: "Nunca guardar arrays").
-- Es un evento inmutable: sin updated_at ni soft delete, igual que audit_log.
create table public.announcement_reads (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  announcement_id uuid not null references public.announcements(id) on delete cascade,
  resident_id uuid not null references public.residents(id) on delete cascade,
  read_at timestamptz not null default now()
);

create unique index announcement_reads_unique_key
  on public.announcement_reads (announcement_id, resident_id);

create index announcement_reads_tenant_id_idx on public.announcement_reads (tenant_id);
