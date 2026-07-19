-- RLS obligatorio en toda tabla (database.md, security.md). Sin policy definida para una
-- operación, esa operación queda bloqueada por defecto: nunca se usa `using (true)`.
--
-- Esto es la última capa de defensa (Defense in Depth). La granularidad fina de permisos
-- por caso de uso vive en modules/*/permissions (Fase 4), no aquí: aquí solo se garantiza
-- aislamiento por tenant y el mínimo de rol necesario para escribir.

-- ── Helpers ──────────────────────────────────────────────────────────────────
-- security definer: evita recursión infinita al leer profiles desde sus propias policies.

create or replace function public.current_tenant_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select tenant_id from public.profiles where id = auth.uid();
$$;

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() in ('ADMIN', 'SUPER_ADMIN');
$$;

grant execute on function public.current_tenant_id() to authenticated;
grant execute on function public.current_user_role() to authenticated;
grant execute on function public.is_admin() to authenticated;

-- ── tenants ──────────────────────────────────────────────────────────────────
alter table public.tenants enable row level security;

create policy tenants_select on public.tenants
  for select using (id = public.current_tenant_id());

create policy tenants_update on public.tenants
  for update using (id = public.current_tenant_id() and public.is_admin())
  with check (id = public.current_tenant_id());

-- Sin INSERT/DELETE para `authenticated`: alta de tenants es una operación de
-- onboarding vía service-role, fuera del flujo normal de usuario.

-- ── tenant_settings ──────────────────────────────────────────────────────────
alter table public.tenant_settings enable row level security;

create policy tenant_settings_select on public.tenant_settings
  for select using (tenant_id = public.current_tenant_id());

create policy tenant_settings_update on public.tenant_settings
  for update using (tenant_id = public.current_tenant_id() and public.is_admin())
  with check (tenant_id = public.current_tenant_id());

-- ── profiles ─────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;

create policy profiles_select on public.profiles
  for select using (
    id = auth.uid()
    or (tenant_id = public.current_tenant_id() and public.is_admin())
  );

create policy profiles_update on public.profiles
  for update using (
    id = auth.uid()
    or (tenant_id = public.current_tenant_id() and public.is_admin())
  )
  with check (tenant_id = public.current_tenant_id());

-- Sin INSERT para `authenticated`: la creación de profiles se resuelve en el
-- flujo de invitación/registro del módulo Auth (Fase 3), vía service-role.

-- ── stages / streets / blocks / lots ──────────────────────────────────────────
alter table public.stages enable row level security;

create policy stages_select on public.stages
  for select using (tenant_id = public.current_tenant_id());
create policy stages_insert on public.stages
  for insert with check (tenant_id = public.current_tenant_id() and public.is_admin());
create policy stages_update on public.stages
  for update using (tenant_id = public.current_tenant_id() and public.is_admin())
  with check (tenant_id = public.current_tenant_id());

alter table public.streets enable row level security;

create policy streets_select on public.streets
  for select using (tenant_id = public.current_tenant_id());
create policy streets_insert on public.streets
  for insert with check (tenant_id = public.current_tenant_id() and public.is_admin());
create policy streets_update on public.streets
  for update using (tenant_id = public.current_tenant_id() and public.is_admin())
  with check (tenant_id = public.current_tenant_id());

alter table public.blocks enable row level security;

create policy blocks_select on public.blocks
  for select using (tenant_id = public.current_tenant_id());
create policy blocks_insert on public.blocks
  for insert with check (tenant_id = public.current_tenant_id() and public.is_admin());
create policy blocks_update on public.blocks
  for update using (tenant_id = public.current_tenant_id() and public.is_admin())
  with check (tenant_id = public.current_tenant_id());

alter table public.lots enable row level security;

create policy lots_select on public.lots
  for select using (tenant_id = public.current_tenant_id());
create policy lots_insert on public.lots
  for insert with check (tenant_id = public.current_tenant_id() and public.is_admin());
create policy lots_update on public.lots
  for update using (tenant_id = public.current_tenant_id() and public.is_admin())
  with check (tenant_id = public.current_tenant_id());

-- ── residents ────────────────────────────────────────────────────────────────
alter table public.residents enable row level security;

create policy residents_select on public.residents
  for select using (tenant_id = public.current_tenant_id());

create policy residents_insert on public.residents
  for insert with check (tenant_id = public.current_tenant_id() and public.is_admin());

create policy residents_update on public.residents
  for update using (tenant_id = public.current_tenant_id() and public.is_admin())
  with check (tenant_id = public.current_tenant_id());

-- ── announcements ────────────────────────────────────────────────────────────
alter table public.announcements enable row level security;

-- Residentes/guardias solo ven comunicados publicados; los admins ven también borradores.
create policy announcements_select on public.announcements
  for select using (
    tenant_id = public.current_tenant_id()
    and (published_at is not null or public.is_admin())
  );

create policy announcements_insert on public.announcements
  for insert with check (tenant_id = public.current_tenant_id() and public.is_admin());

create policy announcements_update on public.announcements
  for update using (tenant_id = public.current_tenant_id() and public.is_admin())
  with check (tenant_id = public.current_tenant_id());

-- ── announcement_reads ───────────────────────────────────────────────────────
alter table public.announcement_reads enable row level security;

create policy announcement_reads_select on public.announcement_reads
  for select using (
    tenant_id = public.current_tenant_id()
    and (
      public.is_admin()
      or resident_id in (select id from public.residents where profile_id = auth.uid())
    )
  );

-- Un residente solo puede marcar como leído su propio registro de resident.
create policy announcement_reads_insert on public.announcement_reads
  for insert with check (
    tenant_id = public.current_tenant_id()
    and resident_id in (select id from public.residents where profile_id = auth.uid())
  );

-- ── documents ────────────────────────────────────────────────────────────────
alter table public.documents enable row level security;

create policy documents_select on public.documents
  for select using (tenant_id = public.current_tenant_id());

create policy documents_insert on public.documents
  for insert with check (tenant_id = public.current_tenant_id() and public.is_admin());

create policy documents_update on public.documents
  for update using (tenant_id = public.current_tenant_id() and public.is_admin())
  with check (tenant_id = public.current_tenant_id());

-- ── announcement_documents ───────────────────────────────────────────────────
-- Tabla de unión pura: sin soft delete, DELETE físico permitido solo a admins.
alter table public.announcement_documents enable row level security;

create policy announcement_documents_select on public.announcement_documents
  for select using (tenant_id = public.current_tenant_id());

create policy announcement_documents_insert on public.announcement_documents
  for insert with check (tenant_id = public.current_tenant_id() and public.is_admin());

create policy announcement_documents_delete on public.announcement_documents
  for delete using (tenant_id = public.current_tenant_id() and public.is_admin());

-- ── audit_log ────────────────────────────────────────────────────────────────
-- "Nunca eliminar auditoría": sin policy de UPDATE ni DELETE para nadie.
alter table public.audit_log enable row level security;

create policy audit_log_select on public.audit_log
  for select using (tenant_id = public.current_tenant_id() and public.is_admin());

create policy audit_log_insert on public.audit_log
  for insert with check (tenant_id = public.current_tenant_id() and user_id = auth.uid());
