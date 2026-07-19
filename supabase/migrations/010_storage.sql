-- Storage privado, aislado por tenant (database.md: "Storage Structure: tenant-id/...").
-- Un solo bucket privado; el primer segmento de la ruta es siempre el tenant_id, ej.:
--   {tenant_id}/documents/{uuid}.pdf
--   {tenant_id}/announcements/{uuid}.jpg
--   {tenant_id}/profiles/{auth.uid()}.webp

insert into storage.buckets (id, name, public)
values ('tenant-files', 'tenant-files', false)
on conflict (id) do nothing;

create policy tenant_files_select on storage.objects
  for select using (
    bucket_id = 'tenant-files'
    and (storage.foldername(name))[1] = public.current_tenant_id()::text
  );

-- Escritura de documentos/comunicados: solo admins, dentro de su propio tenant.
create policy tenant_files_admin_write on storage.objects
  for insert with check (
    bucket_id = 'tenant-files'
    and (storage.foldername(name))[1] = public.current_tenant_id()::text
    and public.is_admin()
  );

create policy tenant_files_admin_update on storage.objects
  for update using (
    bucket_id = 'tenant-files'
    and (storage.foldername(name))[1] = public.current_tenant_id()::text
    and public.is_admin()
  );

create policy tenant_files_admin_delete on storage.objects
  for delete using (
    bucket_id = 'tenant-files'
    and (storage.foldername(name))[1] = public.current_tenant_id()::text
    and public.is_admin()
  );

-- Avatar propio: cualquier usuario puede escribir su propio archivo en
-- {tenant_id}/profiles/{auth.uid()}.*, sin necesitar rol admin.
create policy tenant_files_own_avatar_write on storage.objects
  for insert with check (
    bucket_id = 'tenant-files'
    and (storage.foldername(name))[1] = public.current_tenant_id()::text
    and (storage.foldername(name))[2] = 'profiles'
    and split_part(name, '/', 3) like auth.uid()::text || '.%'
  );

create policy tenant_files_own_avatar_update on storage.objects
  for update using (
    bucket_id = 'tenant-files'
    and (storage.foldername(name))[1] = public.current_tenant_id()::text
    and (storage.foldername(name))[2] = 'profiles'
    and split_part(name, '/', 3) like auth.uid()::text || '.%'
  );
