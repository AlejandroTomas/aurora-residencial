# Control de Alineación — Fraccionamiento Manager

Archivo vivo. Se actualiza en cada sesión de trabajo.

Reglas de uso:
- Marcar `[x]` cuando una tarea se termina y se valida (compila, sin `any`, sin `console.log`).
- Una vez marcada y confirmada en revisión, puede eliminarse la línea para mantener el archivo corto.
- Si una tarea se descarta o cambia de alcance, anotar el motivo antes de eliminarla (no borrar en silencio).
- Este archivo NO reemplaza `.ai/context/*.md` (las reglas) ni `CLAUDE.md` (la fuente de verdad). Solo lleva el estado del trabajo.

Referencia: `CLAUDE.md`, `.ai/context/architecture.md`, `.ai/context/database.md`, `.ai/context/nextjs.md`, `.ai/context/security.md`.

---

## Fase 0 — Limpieza del template (Aurora POS → Fraccionamiento Manager)

Motivo: `src/` venía de un template genérico de POS con Redux, axios y un "cifrado" XOR falso. Nada de esto está en el stack documentado ni se reutiliza en ningún otro archivo (verificado con grep antes de tocar nada).

- [x] Eliminar `src/store/` (Redux) — sin uso fuera de sí mismo
- [x] Eliminar `src/hooks/useReduxHooks.ts` — sin consumidores
- [x] Eliminar `src/utils/axios.ts` — sin consumidores, además viola "toda mutación usa Server Actions"
- [x] Eliminar `src/utils/cookies.ts` — solo lo usaba axios.ts
- [x] Eliminar `src/utils/encrypXOR.ts` — XOR no es cifrado real, riesgo de seguridad
- [x] Eliminar `src/class/` (`PasswordGenerator.ts`) — carpeta fuera de la estructura definida, sin consumidores
- [x] Eliminar `src/lib/authService.ts` y `src/core/services/` (duplicados, sesión en localStorage) — se reemplaza por Supabase Auth en Fase 3
- [x] Quitar `Provider` de Redux en `src/providers/Providers.tsx`
- [x] Quitar dependencias no usadas del `package.json`: `@reduxjs/toolkit`, `react-redux`, `redux-logger`, `axios`, `async-selector-kit`, `@types/redux-logger`
- [x] Renombrar `package.json` (`name: fraccionamiento-manager`, `version: 0.1.0`)
- [x] Quitar branding "Aurora POS" / "Sistema POS" de `src/app/layout.tsx`
- [x] `pnpm install` corrido — `-26 +10` paquetes, sin errores

## Fase 1 — Core (fundamentos)

- [x] `core/env/` — `client.ts` (Zod, público), `server.ts` (Zod + `server-only`, privado — nunca se re-exporta desde `index.ts` para que no pueda colarse al bundle del cliente)
- [x] `.env.example` con las variables requeridas
- [x] `core/supabase/` — `types.ts` (placeholder de `Database`, reemplazar cuando exista `supabase gen types`), `browser.ts`, `server.ts`, `middleware.ts`, `service-role.ts`, `index.ts`
- [x] `core/errors/` — `AppError` base + `ValidationError`, `PermissionDeniedError`, `TenantMismatchError`, `NotFoundError`, `ConflictError`, `StorageError` (según `security.md`)
- [x] `core/logger/` — logger centralizado con niveles (debug/info/warn/error/fatal), formato JSON, respeta `NODE_ENV`
- [x] `src/proxy.ts` — refresca sesión de Supabase; protección de rutas real pendiente del módulo Auth (Fase 3). **Next.js 16 renombró `middleware.ts`→`proxy.ts` y `middleware()`→`proxy()`** (confirmado en `node_modules/next/dist/docs/.../proxy.md`, tal como advierte `AGENTS.md`). `core/supabase/middleware.ts` conserva ese nombre porque así lo pide `database.md` para el cliente de Supabase — son cosas distintas.
- [x] Instalar `@supabase/supabase-js` y `@supabase/ssr` — hecho con `pnpm install`
- [x] `eslint.config.mjs` — se quitó el `"@typescript-eslint/no-explicit-any": "off"` que contradecía CLAUDE.md, se agregó `no-console` (con excepción solo en `core/logger`, su única implementación legítima)
- [x] Corregido `xlsx` y `react-icons`: el código ya los importaba (`ExcelImportModal`, `constants/icons.ts`) pero faltaban en `package.json` y rompían `next build`. Se instalaron — no es scope creep, es la regla "Definition of Done: Compila".
- [x] Verificación: `next build` completo (`/`, `/login`, `/dashboard`, Proxy) sin errores propios; `pnpm dev` con `.env.local` de prueba responde 200 en las 3 rutas y el log confirma que `proxy.ts` se ejecuta en cada request (archivo de prueba borrado al terminar, no se commiteó)
- [ ] `core/config/`, `core/constants/`, `core/permissions/`, `core/types/`, `core/utils/`, `core/validations/` — crear cuando el primer módulo real los necesite (no crear carpetas vacías sin justificación, según CLAUDE.md)

> Nota de interpretación: `database.md` lista `client.ts` y `browser.ts` como archivos separados del cliente Supabase. Se interpretó `client.ts` (en realidad `types.ts`) como el módulo compartido de tipos (`Database`) usado por los demás, y `browser.ts` como el cliente para Client Components. Confirmar si la intención era otra.

### Deuda técnica detectada (no se toca en esta sesión, fuera de alcance de Fase 0/1)

Al reactivar `no-explicit-any` y `no-console` en ESLint aparecieron **39 errores preexistentes** en componentes compartidos que ya existían antes de esta sesión, ninguno introducido por los cambios de hoy:
- `any` sin tipar: `components/form/Select.tsx`, `components/form/AsyncSelect.tsx` (parcial), `hooks/useAsyncPromise.tsx`, `hooks/useDisclosure.tsx`, `types/interfaces/global.ts`
- `console.*` directo en vez del logger: `hooks/useAsyncPromise.tsx`, `utils/dialogService.ts`, `components/form/AsyncSelect.tsx`
- `tsc --noEmit` reporta módulos no instalados: `xlsx` (usado por `ExcelImportModal/steps/StepUploadFile.tsx`) y `react-icons` (usado por `constants/icons.ts`) — ~~ninguno está en `package.json`~~ **resuelto**: se instalaron ambos (ya se usaban en el código, sin ellos `next build` no compilaba — ver Fase 2).

## Fase 2 — Base de datos

- [x] Carpeta `supabase/` en la raíz: `migrations/`, `seeds/`, `functions/`, `policies/`, `storage/`, `types/`, `README.md`
- [x] Migraciones `001`–`010`: extensiones/enums, `tenants`+`tenant_settings`, `profiles`, jerarquía `stages→streets→blocks→lots`, `residents`, `announcements`+`announcement_reads`, `documents`+`announcement_documents`, `audit_log`, RLS completo (helpers `current_tenant_id()`/`current_user_role()`/`is_admin()` + policies en las 13 tablas), Storage (bucket privado `tenant-files` + policies de `storage.objects`)
- [x] RLS habilitado en las 13 tablas desde la primera migración que las crea; sin policy = bloqueado por defecto, nunca `using (true)`
- [x] Jerarquía `tenants → stages → streets → blocks → lots → residents` implementada con FKs reales (nunca texto libre)
- [x] `seeds/seed.sql` — tenant demo + jerarquía + 1 residente sin profile + 1 comunicado (documenta por qué no crea `auth.users` por SQL)
- [x] Revisión manual línea por línea de las 10 migraciones (sin Docker/psql disponibles en este entorno para ejecutarlas de verdad — ver pendiente abajo)

### Deuda / pendiente de Fase 2

- [ ] **Ejecutar las migraciones contra un Postgres real** (proyecto Supabase o `supabase start` local) — no se pudo validar en este entorno por falta de Docker corriendo y sin `psql` instalado. Es lo primero que debe hacerse antes de escribir cualquier Server Action que toque estas tablas.
- [ ] `supabase gen types typescript` una vez exista el proyecto real, para reemplazar el placeholder en `src/core/supabase/types.ts`

### Decisiones tomadas sin especificación exacta en `database.md` (documentadas también en `supabase/README.md`)

- `tenant_settings` separado de `tenants` (identidad vs. configuración mutable), sigue siendo "una sola tabla" de config.
- `audit_log` se llena desde el Service (Fase 4), no con trigger de Postgres — `ip`/`user_agent` no existen dentro de un trigger.
- Vehículos y Eventos (documentados en `database.md` como modelo general) no se crearon: no están en el MVP de `CLAUDE.md`. El modelo no les cierra el paso a futuro.
- Roles como `enum` (`user_role`), no como tabla catálogo — `database.md` los menciona en ambos lugares; se priorizó la regla explícita "`Roles: Definir mediante Enum`" por ser más específica y crítica para las policies de RLS.
- `documents` usa `announcement_documents` como única tabla de unión por ahora (Documento↔Comunicado); Documento↔Residente y Documento↔Evento se agregan cuando esos módulos entren al roadmap.

No se corrigió para no mezclar un refactor grande de UI compartida con la tarea de hoy (regla de CLAUDE.md: modificar la menor cantidad posible de archivos). Se limpia módulo por módulo conforme se toque cada componente, o en una tarea dedicada si se prefiere antes.

## Fase 2 — Base de datos (pendiente)

- [ ] Carpeta `supabase/` en la raíz: `migrations/`, `seeds/`, `functions/`, `policies/`, `storage/`, `types/`, `README.md`
- [ ] Migración `001_initial.sql`: `tenants`, `profiles`, enum de roles (`ADMIN`, `RESIDENT`, `GUARD`, `SUPER_ADMIN`)
- [ ] RLS habilitado + policies base (SELECT/INSERT/UPDATE/DELETE) desde la primera migración
- [ ] Jerarquía `tenants → stages → streets → blocks → lots → residents` (según `database.md`)

## Fase 3 — Módulo Auth (pendiente)

- [ ] `modules/auth/` completo: login, recuperación de contraseña, usando Supabase Auth (nunca sesión manual en localStorage)
- [ ] Reemplazar `LogOutBtn` para usar Server Action de logout real
- [ ] Conectar `src/middleware.ts` con protección real de rutas por sesión/rol/tenant
- [ ] Implementar `src/app/login/page.tsx` (hoy vacío)

## Fase 4 — Módulos del MVP (pendiente, uno a la vez)

- [ ] `modules/tenants`
- [ ] `modules/users`
- [ ] `modules/residents`
- [ ] `modules/announcements`
- [ ] `modules/dashboard` — implementar `src/app/dashboard/page.tsx` (hoy vacío)
- [ ] `modules/profile`
- [ ] `modules/settings`
- [ ] `modules/notifications` (estructura preparada, aunque el MVP no la use completa)

## Fase 5 — Layout / UI (pendiente)

Patrón confirmado por el usuario: `AppLayout` (en `src/components/layouts/Sidebar.tsx`) es el shell reutilizable real; `AdminLayout` es solo un ejemplo de uso con `NavItem[]` fijos. Se sigue este patrón para las páginas de módulos; se abstrae más solo si un módulo lo requiere.

- [ ] Sustituir la sesión falsa (`{ username: "Operador", role: "Admin" }`) en `SidebarContent` por la sesión real de Supabase
- [ ] `NavItem[]` dinámico según permisos del usuario/rol, no hardcodeado en `AdminLayout`
- [ ] Revisar Route Groups: `(auth)`, `(dashboard)`, `(public)`

## Fase 6 — `.ai/` pendiente

- [ ] `.ai/checklists/feature.md`, `release.md`, `review.md` (renombrar `review.ms` → `review.md`) — contenido
- [ ] `.ai/prompts/*.md` — se crean bajo demanda conforme se necesiten (no en bloque)
