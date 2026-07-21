-- Configuración inicial del nivel Plataforma. Ejecutar UNA vez, después de aplicar
-- las migraciones (incluida 011_platform.sql).
--
-- El SUPER_ADMIN es el dueño del SaaS. Como `profiles.tenant_id` es obligatorio, el
-- SUPER_ADMIN pertenece a un tenant reservado "Plataforma" (no es un fraccionamiento
-- real; solo satisface la relación). Las operaciones cross-tenant no dependen de él.

-- 1) Tenant reservado de plataforma.
insert into public.tenants (id, name, slug, is_active)
values ('00000000-0000-0000-0000-0000000000ff', 'Plataforma', 'plataforma', true)
on conflict (id) do nothing;

-- 2) Promueve tu cuenta a SUPER_ADMIN y la asocia a la plataforma.
--    REEMPLAZA el correo por el de tu cuenta antes de ejecutar.
--
--    Nota: un SUPER_ADMIN es nivel plataforma y NO administra un fraccionamiento
--    (los niveles no se mezclan). Si también quieres administrar un fraccionamiento,
--    crea una cuenta ADMIN aparte (o provisiona un tenant desde /platform).
--
-- update public.profiles
-- set role = 'SUPER_ADMIN',
--     tenant_id = '00000000-0000-0000-0000-0000000000ff'
-- where email = 'tu-correo@ejemplo.com';
