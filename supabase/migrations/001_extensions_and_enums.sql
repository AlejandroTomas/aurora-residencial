-- Extensiones y tipos base compartidos por todo el esquema.

create extension if not exists "pgcrypto";

-- Roles del sistema (database.md: "Definir mediante Enum. No utilizar strings libres.")
create type public.user_role as enum ('SUPER_ADMIN', 'ADMIN', 'GUARD', 'RESIDENT');

-- Estado de ocupación de un lote (database.md: "No utilizar texto libre.")
create type public.lot_status as enum (
  'DISPONIBLE',
  'HABITADO',
  'RENTADO',
  'EN_CONSTRUCCION',
  'SUSPENDIDO'
);

-- Trigger genérico reutilizable en toda tabla con updated_at.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
