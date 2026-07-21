-- Nivel Plataforma (SUPER_ADMIN, dueño del SaaS).
--
-- 1) Plan de suscripción por tenant: se agrega ya la columna aunque el MVP no valide
--    límites todavía, para dejar preparado el módulo de suscripciones (CLAUDE.md:
--    Subscription Ready) sin otra migración de esquema.
-- 2) Lectura cross-tenant para el SUPER_ADMIN: puede ver todos los fraccionamientos.
--    Las escrituras (alta/suspensión de tenants) van por service-role desde el módulo
--    platform, verificando el rol en el servidor.

create type public.subscription_plan as enum (
  'BASICO',
  'PROFESIONAL',
  'ENTERPRISE'
);

alter table public.tenants
  add column plan public.subscription_plan not null default 'BASICO';

-- El SUPER_ADMIN ve todos los tenants. Se suma a `tenants_select` (mismo tenant):
-- las policies de una misma operación se combinan con OR.
create policy tenants_select_platform on public.tenants
  for select using (public.current_user_role() = 'SUPER_ADMIN');
