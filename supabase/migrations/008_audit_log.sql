-- Auditoría (security.md: columnas exactas). "Nunca eliminar auditoría": sin soft delete,
-- sin updated_at, sin RLS de escritura para `authenticated` (ver 009_rls.sql).
--
-- Se llena desde la capa de Service (architecture.md: "Crear residente -> ... -> Crear
-- auditoría. Todo dentro del Service."), no con un trigger de base de datos: ip y
-- user_agent solo están disponibles en el contexto de la request (Server Action), no
-- dentro de un trigger de PostgreSQL.

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  user_id uuid references public.profiles(id),
  action text not null,
  table_name text not null,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index audit_log_tenant_id_idx on public.audit_log (tenant_id);
create index audit_log_table_record_idx on public.audit_log (table_name, record_id);
create index audit_log_created_at_idx on public.audit_log (created_at);
