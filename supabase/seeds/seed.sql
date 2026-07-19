-- Datos mínimos de desarrollo (database.md: "Nunca insertar información de producción").
--
-- IMPORTANTE: no crea usuarios de auth.users aquí. Insertar directamente en auth.users
-- por SQL es fragil y depende de la versión interna de Supabase Auth. El usuario admin
-- demo se crea con el Auth Admin API o el dashboard de Supabase, y luego se linkea a
-- public.profiles con el mismo id. Ver supabase/README.md.

insert into public.tenants (id, name, slug)
values ('00000000-0000-0000-0000-000000000001', 'Fraccionamiento Demo', 'demo')
on conflict (id) do nothing;

insert into public.tenant_settings (tenant_id, timezone, language)
values ('00000000-0000-0000-0000-000000000001', 'America/Mexico_City', 'es')
on conflict (tenant_id) do nothing;

insert into public.stages (id, tenant_id, name)
values ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Primera Etapa')
on conflict (id) do nothing;

insert into public.streets (id, tenant_id, stage_id, name)
values ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Calle Olivos')
on conflict (id) do nothing;

insert into public.blocks (id, tenant_id, street_id, name)
values ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'Manzana A')
on conflict (id) do nothing;

insert into public.lots (id, tenant_id, block_id, number, status)
values ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', '1', 'HABITADO')
on conflict (id) do nothing;

-- Residente demo sin profile (persona registrada manualmente, sin acceso al sistema todavía).
insert into public.residents (id, tenant_id, lot_id, full_name, email)
values ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', 'Residente Demo', 'residente.demo@example.com')
on conflict (id) do nothing;

insert into public.announcements (id, tenant_id, title, body, published_at)
values ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 'Bienvenida', 'Este es un comunicado de prueba.', now())
on conflict (id) do nothing;
