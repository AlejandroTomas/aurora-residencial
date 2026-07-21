# Checklist — Release

Verificación antes de publicar una versión. Pensado para un SaaS multi-tenant: un solo
despliegue sirve a todos los fraccionamientos, así que un error afecta a todos.

## Código

- [ ] `pnpm typecheck` sin errores.
- [ ] `pnpm build` verde.
- [ ] `pnpm exec eslint` limpio.
- [ ] `pnpm test` en verde (cuando existan pruebas).
- [ ] Sin `any`, sin `console.log`, sin código muerto ni TODO/FIXME.
- [ ] `.ai/control/alignment.md` refleja el estado real (deuda anotada).

## Base de datos

- [ ] Migraciones nuevas revisadas y aplicadas en orden en el entorno destino.
- [ ] Migraciones idempotentes/seguras: no rompen datos existentes; nada destructivo sin plan.
- [ ] RLS habilitado y con policies en toda tabla nueva; verificado que un tenant no ve datos de otro.
- [ ] `supabase gen types` regenerado si cambió el esquema; tipos sincronizados con el código.
- [ ] Storage: buckets privados, policies por tenant, sin URLs públicas.

## Configuración y secretos

- [ ] Variables de entorno presentes y validadas por `core/env` (la app no arranca si falta una obligatoria).
- [ ] `SUPABASE_SERVICE_ROLE_KEY` solo en servidor; nunca expuesta al cliente ni al repositorio.
- [ ] Supabase Auth → Redirect URLs del entorno (callback de recuperación/invitación) configuradas.
- [ ] Sin `.env`, tokens ni claves commiteados.

## Seguridad y operación

- [ ] Rutas protegidas: `proxy.ts` + layouts revalidan sesión/rol.
- [ ] Auditoría activa en las operaciones críticas.
- [ ] Rate limiting en login/recuperación/carga de archivos (o límites de Supabase asumidos y documentados).
- [ ] Backups/restauración verificados en el proyecto Supabase.
- [ ] Plan de rollback definido (revertir despliegue y, si aplica, migración).

## Producto

- [ ] Flujos MVP probados end-to-end: login, recuperación, residentes, comunicados (incl. lectura), perfil, configuración.
- [ ] Provisioning/onboarding de un tenant nuevo funciona de principio a fin.
- [ ] Responsive verificado en móvil.
- [ ] Notas de versión: qué cambió, migraciones incluidas, pasos manuales requeridos.
