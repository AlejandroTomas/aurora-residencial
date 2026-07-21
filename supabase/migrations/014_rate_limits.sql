-- Rate limiting respaldado en BD (funciona en entornos serverless / multi-instancia, a
-- diferencia de un contador en memoria). Registra "hits" por clave y ventana de tiempo.
-- Se usa solo desde el service-role (endpoints públicos: registro, recuperación), por eso
-- RLS queda habilitado SIN policies: nadie autenticado puede tocarla.

create table public.rate_limit_hits (
  id bigint generated always as identity primary key,
  key text not null,
  created_at timestamptz not null default now()
);

create index rate_limit_hits_key_created_idx
  on public.rate_limit_hits (key, created_at);

alter table public.rate_limit_hits enable row level security;
