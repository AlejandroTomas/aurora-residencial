-- Registro autoservicio de residentes con aprobación (CLAUDE.md → Resident Registration).
-- Una cuenta nunca queda asociada automáticamente a un lote: primero se crea una solicitud
-- y un administrador la aprueba (creando el residente) o la rechaza con un comentario.

create type public.membership_request_status as enum (
  'PENDING',
  'APPROVED',
  'REJECTED'
);

create table public.membership_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  lot_id uuid not null references public.lots(id) on delete restrict,
  full_name text not null,
  email text not null,
  phone text,
  status public.membership_request_status not null default 'PENDING',
  admin_comment text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id)
);

create index membership_requests_tenant_id_idx
  on public.membership_requests (tenant_id);
create index membership_requests_profile_id_idx
  on public.membership_requests (profile_id);

-- Una sola solicitud pendiente por cuenta.
create unique index membership_requests_one_pending
  on public.membership_requests (profile_id)
  where status = 'PENDING';

alter table public.membership_requests enable row level security;

-- El residente ve sus propias solicitudes; el admin, todas las de su tenant.
create policy membership_requests_select on public.membership_requests
  for select using (
    tenant_id = public.current_tenant_id()
    and (public.is_admin() or profile_id = auth.uid())
  );

-- Un residente autenticado puede crear su propia solicitud (ej. re-solicitar tras rechazo).
-- El alta durante el registro público la hace el service-role (aún no hay sesión).
create policy membership_requests_insert on public.membership_requests
  for insert with check (
    tenant_id = public.current_tenant_id() and profile_id = auth.uid()
  );

-- Solo el admin revisa (aprueba/rechaza).
create policy membership_requests_update on public.membership_requests
  for update using (tenant_id = public.current_tenant_id() and public.is_admin())
  with check (tenant_id = public.current_tenant_id());
