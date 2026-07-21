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

<!-- Eliminado el bloque duplicado y obsoleto "Fase 2 (pendiente)": la Fase 2 quedó
     completa (ver sección de arriba). El usuario ya levantó el proyecto Supabase,
     aplicó las migraciones y creó su admin. -->

## Fase 3 — Módulo Auth

- [x] `modules/auth/` completo siguiendo el flujo `UI → Action → Service → Repository → Supabase`: schemas (Zod), errores tipados (`InvalidCredentialsError`, `SessionError`), repositories (`auth`, `profile`), mapper de sesión, services (`login`, `logout`, `requestPasswordReset`, `updatePassword`, `getCurrentSession`), actions y componentes cliente (RHF + Zod). Todo sobre Supabase Auth, nunca sesión manual en localStorage.
- [x] Login real (`app/(auth)/login`), recuperación (`app/(auth)/forgot-password`) y restablecimiento (`app/reset-password`) + `app/auth/callback/route.ts` (intercambio de código de recuperación por sesión).
- [x] `LogOutBtn` reescrito: usa `logoutAction` (Server Action) con `useTransition`; Supabase invalida sesión y limpia cookies.
- [x] `src/proxy.ts` protege rutas: refresca sesión y redirige a `/login` toda ruta protegida sin usuario. La redirección inversa (sesión → dashboard) la hace `app/(auth)/layout.tsx` con la sesión completa, para evitar bucles.
- [x] Route Groups introducidos: `(auth)` (redirige a dashboard si hay sesión) y `(dashboard)` (exige sesión, defense in depth sobre el proxy). `/` redirige a `/dashboard`.
- [x] `core/types/action-result.ts` — contrato `ActionResult<T>` de retorno de toda Action.
- [x] `core/supabase/types.ts` — tipado a mano de `profiles` + enums (`UserRole`, `LotStatus`) para no usar `any`; se reemplaza por `supabase gen types` (ver pendiente de Fase 2).
- [x] Verificación: `pnpm build` verde (TypeScript sin errores, rutas `/`, `/login`, `/forgot-password`, `/reset-password`, `/dashboard`, `/auth/callback` y Proxy reconocido); ESLint limpio en todo lo tocado. Se corrigió de paso `src/app/error.tsx` (usaba `console`, ahora usa el logger).

### Decisiones / notas de Fase 3

- **Frontera cliente/servidor:** el módulo expone `index.ts` (cliente-seguro: actions, componentes, constantes, tipos) y `server.ts` (server-only: `getCurrentSession`). Separados porque `getCurrentSession` depende de `server-only` y no debe entrar al bundle del cliente. Ambos son "índices públicos" (no se importan archivos internos).
- **Sesión = auth + perfil activo:** un usuario de Supabase Auth sin fila en `profiles` (o inactivo) NO es sesión válida. `getCurrentSession` devuelve `null` (no lanza) para que los layouts redirijan sin bucles; `loginService` cierra la sesión si la cuenta no tiene perfil activo.
- **Sesión falsa del sidebar (era Fase 5):** ya se eliminó `{ username: "Operador", role: "Admin" }`; `AppLayout`/`SidebarContent` reciben `user` por props y `(dashboard)/layout.tsx` pasa la sesión real. Queda de Fase 5 solo el `NavItem[]` dinámico por rol.

### Pendiente de Fase 3 (requiere validación del usuario en su Supabase)

- [ ] **Probar el flujo end-to-end** en `pnpm dev` con el admin real: login → dashboard, logout, "olvidé mi contraseña" → correo → callback → nueva contraseña.
- [ ] En Supabase (Auth → URL Configuration) agregar la URL de callback a los *Redirect URLs* permitidos (ej. `http://localhost:3000/auth/callback`), o el correo de recuperación fallará silenciosamente.
- [ ] Rate limiting propio para login/recuperación (hoy se apoya en los límites de Supabase Auth) y registro de login/logout en `audit_log` — se integran en Fase 4.

## Fase 4 — Módulos del MVP

Todos siguen el flujo `UI → Action → Service → Repository → Supabase`, con `permissions/` por
módulo, DTO+mapper, errores tipados, auditoría en cada escritura y `index.ts` (cliente) + `server.ts`
(server-only). Verificado: `pnpm typecheck`, `pnpm build` (13 rutas) y ESLint, todo limpio.

- [x] **Foundation compartida**: `Database` tipado a mano de las 14 tablas + enums (reemplazable por `supabase gen types`); `core/types` paginación (`ActionResult`, `Paginated`, `toRange`); `requireSession`/`requireAdmin`/`isAdminRole` en Auth; `core/services/audit.service` (`recordAudit`, lee ip/user-agent de headers, RLS por usuario); `core/utils` (`toActionError`, `formatDate`).
- [x] `modules/tenants` — identidad del fraccionamiento (leer + editar nombre).
- [x] `modules/users` — invitar (Auth admin + perfil vía service-role, con compensación), cambiar rol, activar/desactivar. Reglas: no modificarte a ti mismo, no dejar sin último admin. `/usuarios`.
- [x] `modules/residents` — CRUD completo con jerarquía de lotes (selects anidados tipados con `.returns<T>()`), alta/edición en diálogo, suspender/reactivar, regla anti-duplicado. Vista para admin (gestiona) y caseta (solo lee). `/residentes`.
- [x] `modules/announcements` — crear/editar/publicar/despublicar (admin) + lectura con marca de leído (residente, atribuida al `resident_id`). `/comunicados` ramifica por rol.
- [x] `modules/dashboard` — `getDashboardMetrics` consume las APIs públicas de otros módulos (no sus repos); `src/app/(dashboard)/dashboard` muestra métricas al admin.
- [x] `modules/profile` — el usuario edita su nombre/teléfono; cambio de contraseña reutiliza `/reset-password`. `/perfil`.
- [x] `modules/settings` — `tenant_settings` (contacto, color, zona horaria, idioma). `/configuracion` combina `TenantForm` + `SettingsForm`.
- [x] `modules/notifications` — estructura preparada; `listNotifications` devuelve `[]` (no hay tabla aún, documentado).

### Decisiones / deuda de Fase 4

- **Bug de tipado resuelto (importante):** el `Database` a mano rompía los `insert` (todo resolvía a `never`). Causas encadenadas: `Views: Record<string,never>` (su firma de índice colapsaba `Tables & Views`) y `AuditColumns` como `interface` (un `interface` no es asignable a `Record<string,unknown>`, así el schema no cumplía `GenericSchema`). Fix: `Views: { [_ in never]: never }` + `AuditColumns` como `type`. Documentado en `src/core/supabase/types.ts`.
- **service-role puntual:** alta de perfiles (users) y upsert de `tenant_settings` usan service-role porque RLS no define INSERT para esas tablas (flujos administrados). El scoping por tenant lo da la sesión y la Action ya verificó admin. Alternativa futura: añadir policies de INSERT.
- [x] **Paginación en UI:** hecho en Fase 5 (`components/shared/Pagination` por URL `?page=`, en usuarios/residentes/comunicados).
- [x] **Búsqueda en UI:** hecho en Fase 5 (`components/shared/SearchInput` por URL `?q=`, en usuarios/residentes).
- [ ] Auditoría de login/logout (heredado de Fase 3) y rate limiting siguen pendientes.

## Fase 5 — Layout / UI

Patrón confirmado por el usuario: `AppLayout` (en `src/components/layouts/Sidebar.tsx`) es el shell reutilizable real; `AdminLayout` es solo un ejemplo de uso con `NavItem[]` fijos. Se sigue este patrón para las páginas de módulos; se abstrae más solo si un módulo lo requiere.

Verificado: `pnpm build` (13 rutas) y ESLint, limpios.

- [x] Sustituir la sesión falsa (`{ username: "Operador", role: "Admin" }`) en `SidebarContent` por la sesión real de Supabase — hecho en Fase 3 (`AppLayout` recibe `user` por props).
- [x] `NavItem[]` dinámico según rol — hecho en Fase 4 (`buildNavItems` en `(dashboard)/layout.tsx`: secciones admin solo para admins). Pendiente granularidad por permiso fino si se requiere.
- [x] Route Groups `(auth)` y `(dashboard)` creados en Fase 3. Pendiente `(public)` si aparece contenido público.
- [x] `components/shared/` — `SearchInput` (búsqueda por URL `?q=`) y `Pagination` (por URL `?page=`), URL-driven y sin `useEffect`. Cableados en usuarios/residentes (búsqueda + paginación) y comunicados (paginación).
- [x] `(dashboard)/loading.tsx` — skeleton durante la navegación (se mantiene el sidebar).
- [x] `(dashboard)/error.tsx` — error boundary del área autenticada con mensaje amigable (nunca el error interno) + reintentar.
- [x] `app/not-found.tsx` — 404 global con enlace al inicio.

### Pendiente de Fase 5 (bajo riesgo, opcional)

- [ ] `loading.tsx`/`error.tsx` por página cuando alguna consulta sea notablemente lenta (hoy basta el del grupo).
- [ ] Route Group `(public)` cuando exista la URL pública del tenant (documentada en CLAUDE.md).

## Fase 6 — `.ai/`

- [x] Checklists con contenido: `feature.md` (entrega de módulo/feature), `review.md` (code review), `release.md` (release). `review.ms` vacío renombrado → `review.md`.
- [x] Prompts con contenido: `create-module`, `create-crud`, `create-service`, `create-repository`, `create-form`, `create-policy` — plantillas con placeholders y referencias a los patrones reales (módulo `residents` como canónico).

Todos alineados con `CLAUDE.md` y los `.ai/context/*` (incluye el bloque SaaS: multi-tenant, RLS, límites de plan, auditoría).

## Deuda de alineación con CLAUDE.md (bloque SaaS)

- [x] ~~Rol `STAFF`~~: descartado. El usuario aclaró que los usuarios finales son los residentes y quitó `STAFF` de `CLAUDE.md`; el enum `user_role` (`SUPER_ADMIN, ADMIN, GUARD, RESIDENT`) ahora coincide con el doc.
- [ ] **Nivel Plataforma (SUPER_ADMIN) sin implementar (prioritario):** hoy todo perfil pertenece a un tenant (`profiles.tenant_id` NOT NULL) y solo existe administración a nivel fraccionamiento. Falta el área de plataforma para el dueño del SaaS: gestionar todos los tenants, alta/provisioning de fraccionamientos (tenant + admin inicial + settings + roles), activar/suspender. Decisión pendiente: cómo modelar al SUPER_ADMIN frente a `tenant_id` y RLS (ver `modules/platform` cuando se cree).
- [ ] **Campos de Tenant Onboarding faltantes:** `tenant_settings` no cubre dirección, estado, ciudad, país, código postal, sitio web ni **moneda** (CLAUDE.md → Tenant Onboarding). Ampliar tabla + schema + `SettingsForm` cuando se aborde el onboarding completo.
- [ ] **URL pública del tenant** (Public Information) — nivel plataforma, fuera del MVP actual.
