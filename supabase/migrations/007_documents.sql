-- Documentos (database.md: "Nunca almacenar archivos dentro de PostgreSQL. Solo referencias al Storage.")
-- storage_path apunta a un objeto en el bucket privado "documents" (ver 010_storage.sql),
-- con nombre generado (UUID.ext) según security.md: "Nunca conservar el nombre original".

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  storage_path text not null,
  original_filename text not null,
  mime_type text not null,
  size_bytes bigint not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  deleted_at timestamptz,
  deleted_by uuid references public.profiles(id)
);

create unique index documents_storage_path_key on public.documents (storage_path);
create index documents_tenant_id_idx on public.documents (tenant_id);

create trigger set_updated_at
  before update on public.documents
  for each row execute function public.set_updated_at();

-- Relación Documento -> Comunicado (database.md documenta también Documento -> Residente
-- y Documento -> Evento; se agregan como tablas de unión cuando esos módulos entren al roadmap,
-- sin romper este modelo).
create table public.announcement_documents (
  announcement_id uuid not null references public.announcements(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete restrict,
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (announcement_id, document_id)
);

create index announcement_documents_tenant_id_idx on public.announcement_documents (tenant_id);
