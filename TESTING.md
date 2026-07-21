# Guía de pruebas — Fraccionamiento Manager

Documento para probar **todos los casos de uso** de punta a punta, con la estructura del
proyecto y los pasos para crear cada tipo de cuenta (`SUPER_ADMIN`, `ADMIN`, `GUARD`,
`RESIDENT`).

> Fuente de verdad del avance: `.ai/control/alignment.md`. Reglas del proyecto: `CLAUDE.md`
> y `.ai/context/*`.

---

## 1. Requisitos previos

- Node 20+, `pnpm`.
- Un proyecto de **Supabase** (nube).
- `pnpm install` ejecutado.

## 2. Variables de entorno (`.env.local`)

```env
# Requeridas (Supabase → Project Settings > API)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...        # solo servidor, nunca exponer

# Opcionales (correo). Sin ellas, el envío se desactiva y solo se registra en log.
RESEND_API_KEY=
EMAIL_FROM="Fraccionamiento Manager <onboarding@resend.dev>"
```

La app **no arranca** si falta una variable requerida (validación con Zod en `core/env`).

## 3. Migraciones y seeds

Aplicar en orden en **Supabase → SQL Editor** (o `supabase db push` si usas el CLI con el
historial reparado). Todas están en `supabase/migrations/`:

| #     | Archivo                          | Qué crea                                              |
| ----- | -------------------------------- | ----------------------------------------------------- |
| 001   | extensions_and_enums             | extensiones, enums, `set_updated_at`                  |
| 002   | tenants                          | `tenants`, `tenant_settings`                          |
| 003   | profiles                         | `profiles` (+ FKs de tenants)                         |
| 004   | property_hierarchy               | `stages`, `streets`, `blocks`, `lots`                 |
| 005   | residents                        | `residents`                                           |
| 006   | announcements                    | `announcements`, `announcement_reads`                 |
| 007   | documents                        | `documents`, `announcement_documents`                 |
| 008   | audit_log                        | `audit_log`                                           |
| 009   | rls                              | helpers RLS + policies en todas las tablas            |
| 010   | storage                          | bucket privado `tenant-files` + policies              |
| 011   | platform                         | enum `subscription_plan`, `tenants.plan`, policy SUPER_ADMIN |
| 012   | tenant_onboarding                | `tenant_settings`: dirección, ciudad, moneda, etc.    |
| 013   | membership_requests              | solicitudes de registro de residentes                 |
| 014   | rate_limits                      | `rate_limit_hits`                                     |

**Configuración de Auth:** Supabase → Authentication → URL Configuration → *Redirect URLs*
debe incluir `http://localhost:3000/auth/callback` (recuperación de contraseña e
invitaciones).

Seeds (`supabase/seeds/`): `seed.sql` (tenant demo con jerarquía) y `platform.sql` (ver §5).

## 4. Roles y jerarquía

Dos niveles que **nunca se mezclan** (CLAUDE.md → Platform Hierarchy):

- **Plataforma** — `SUPER_ADMIN`: dueño del SaaS. Administra **todos** los fraccionamientos
  desde `/platform`. No administra residentes.
- **Tenant** (un fraccionamiento) — `ADMIN` (gestiona todo su fraccionamiento), `GUARD`
  (caseta, solo consulta el padrón), `RESIDENT` (residente: comunicados, su perfil).

Al iniciar sesión, un `SUPER_ADMIN` cae en `/platform`; el resto en `/dashboard`.

---

## 5. Cómo crear cada tipo de cuenta

### 5.1 SUPER_ADMIN (nivel plataforma)

1. Crea una cuenta en Supabase → Authentication → Users (o regístrate y confirma correo).
2. Inserta su fila en `profiles` (si no existe) con cualquier `tenant_id` válido.
3. Ejecuta `supabase/seeds/platform.sql`: crea el tenant reservado **"Plataforma"** y, tras
   descomentar y poner tu correo, promueve tu cuenta:
   ```sql
   update public.profiles
   set role = 'SUPER_ADMIN',
       tenant_id = '00000000-0000-0000-0000-0000000000ff'
   where email = 'TU_CORREO';
   ```
4. Inicia sesión → deberías entrar a `/platform`.

### 5.2 ADMIN (administrador de un fraccionamiento)

**Opción recomendada (provisioning):** como `SUPER_ADMIN`, en `/platform` → **Nuevo
fraccionamiento**. Se crea el tenant + su configuración + se **invita por correo** al admin
inicial. El admin abre el correo, define contraseña e inicia sesión → cae en `/dashboard`.

> Sin `RESEND_API_KEY`, la invitación no se envía por correo (se registra en log). Para
> pruebas locales puedes: (a) configurar Resend, o (b) crear el admin a mano (cuenta en Auth
> + fila en `profiles` con `role='ADMIN'` y el `tenant_id` del fraccionamiento).

### 5.3 GUARD (caseta)

Un `ADMIN` en `/usuarios` → **Invitar usuario** con rol **Caseta**. Recibe correo para
definir contraseña. Verá el padrón de residentes en modo solo lectura.

### 5.4 RESIDENT (residente) — autoservicio con aprobación

1. El `ADMIN` primero crea la **estructura** (§7.3) para que existan lotes.
2. En `/platform`, copia el **slug** del fraccionamiento (columna Identificador).
3. Abre `/registro/{slug}` (ventana anónima): nombre, correo, contraseña, **elige lote** →
   enviar. La cuenta queda lista para iniciar sesión; la solicitud queda **pendiente**.
4. El `RESIDENT` inicia sesión → verá "solicitud en revisión" en su dashboard.
5. El `ADMIN` va a `/solicitudes` → **Aprobar** (o Rechazar con motivo). Al aprobar, el
   residente queda registrado y ligado a su lote.

---

## 6. Estructura del proyecto

```
src/
  app/                      # solo rutas (App Router)
    (auth)/                 # login, forgot-password  → redirige si hay sesión
    (dashboard)/            # área del tenant (admin/guard/resident)
    (platform)/             # área del SUPER_ADMIN
    registro/[slug]/        # registro público de residentes
    auth/callback/          # intercambio de código (recuperación/invitación)
    proxy.ts                # (en src/) protección de rutas
  core/                     # compartido: env, errors, logger, supabase, types,
                            #   services (audit), utils, config (plan-limits),
                            #   email, rate-limit, storage
  modules/                  # dominios de negocio, cada uno autocontenido:
    auth, platform, tenants, users, residents, membership, structure,
    announcements, documents(en announcements), dashboard, profile,
    settings, notifications
  components/               # UI compartida (ui/, layouts/, shared/, ...)
supabase/                   # migrations/, seeds/, policies/, storage/
.ai/                        # context/ (reglas), checklists/, prompts/, control/
```

**Anatomía de un módulo** (`modules/<x>/`) y su flujo obligatorio:

```
UI (components) → Action (actions/) → Service (services/) → Repository (repositories/) → Supabase (RLS)
```

- `schemas/` (Zod) · `types/` (DTO) · `errors/` (tipados) · `permissions/` (`can*`) ·
  `mappers/` · `index.ts` (API cliente-segura) · `server.ts` (lecturas server-only) · `README.md`.

---

## 7. Casos de uso (checklist)

Marca cada uno al probarlo. Entre paréntesis, el rol necesario.

### 7.1 Autenticación (todos)

- [ ] Iniciar sesión con credenciales válidas → entra según rol.
- [ ] Credenciales inválidas → "Correo o contraseña incorrectos".
- [ ] Cerrar sesión (botón del sidebar) → vuelve a `/login`.
- [ ] "¿Olvidaste tu contraseña?" → correo → enlace → `/reset-password` → nueva contraseña.
- [ ] Ruta protegida sin sesión (`/dashboard`) → redirige a `/login`.
- [ ] Cambiar contraseña estando dentro (`/perfil` → "Cambiar contraseña").

### 7.2 Plataforma (`SUPER_ADMIN`, en `/platform`)

- [ ] Listar todos los fraccionamientos (paginado).
- [ ] **Nuevo fraccionamiento** (provisioning) → invita admin.
- [ ] Cambiar el **plan** de un fraccionamiento (select).
- [ ] **Suspender / Activar** un fraccionamiento.
- [ ] Un `ADMIN`/`RESIDENT` que intente entrar a `/platform` → redirigido a su inicio.

### 7.3 Estructura física (`ADMIN`, en `/estructura`)

- [ ] Crear **Etapa** → entrar → crear **Calle** → entrar → crear **Manzana** → entrar →
      crear **Lote** (número, área, estado, observaciones).
- [ ] Renombrar y desactivar/activar en cada nivel.
- [ ] Crear dos lotes con el mismo número en la misma manzana → error (número único).

### 7.4 Residentes (`ADMIN` gestiona / `GUARD` consulta, en `/residentes`)

- [ ] Alta de residente asignado a un lote (diálogo).
- [ ] Editar / suspender / reactivar.
- [ ] Buscar por nombre o correo; paginar.
- [ ] Como `GUARD`: ve el padrón sin botones de gestión.

### 7.5 Solicitudes de registro (`ADMIN`, en `/solicitudes`)

- [ ] Ver solicitudes pendientes.
- [ ] **Aprobar** → el residente queda registrado (aparece en `/residentes`).
- [ ] **Rechazar** con comentario → el residente ve el motivo en su dashboard.

### 7.6 Usuarios (`ADMIN`, en `/usuarios`)

- [ ] Invitar usuario (ADMIN/Caseta/Residente).
- [ ] Cambiar rol de otro usuario.
- [ ] Activar/desactivar otro usuario.
- [ ] Intentar cambiar tu **propio** rol o desactivarte → bloqueado.
- [ ] Desactivar/degradar al **último admin** → bloqueado.

### 7.7 Comunicados (`ADMIN` publica / `RESIDENT` lee, en `/comunicados`)

- [ ] Crear comunicado (queda como borrador).
- [ ] Publicar / despublicar.
- [ ] **Adjuntos**: subir PDF/imagen/DOCX/XLSX (máx. 5 MB), descargar, eliminar.
- [ ] Tipo no permitido o >5 MB → error de validación.
- [ ] Como `RESIDENT`: ve solo publicados, **descarga adjuntos**, **marca como leído**.

### 7.8 Perfil (todos, en `/perfil`)

- [ ] Editar nombre y teléfono.
- [ ] Correo y rol se muestran solo lectura.

### 7.9 Configuración (`ADMIN`, en `/configuracion`)

- [ ] Editar nombre del fraccionamiento.
- [ ] Datos de onboarding (dirección, ciudad, país, moneda, etc.).
- [ ] **Subir logotipo** (imagen) → se muestra la vista previa.

### 7.10 Límites de plan (Subscription Ready)

Con un fraccionamiento en plan **Básico** (100 residentes / 3 usuarios / 50 comunicados):

- [ ] Invitar un 4º usuario → "Tu plan permite hasta 3 usuarios…".
- [ ] Subir el plan en `/platform` → ya permite más.
- [ ] (Análogo para residentes y comunicados según el tope.)

### 7.11 Seguridad

- [ ] Rate limit: 6 registros/recuperaciones seguidos desde la misma IP → "Demasiados
      intentos" (límite 5/hora).
- [ ] Auditoría: tras login/logout y operaciones de escritura, hay filas en `audit_log`
      (revisar en Supabase).

### 7.12 Correo (opcional)

- Sin `RESEND_API_KEY`: los envíos (invitación, aprobación/rechazo) se **registran en log**,
  no se mandan. **Ya está implementado**; solo requiere configurar la API key (y un dominio
  verificado en Resend para producción) para enviar de verdad.

---

## 8. Verificación técnica

```bash
pnpm typecheck   # TypeScript sin errores
pnpm build       # compila (Turbopack)
pnpm lint        # ESLint limpio
```

## 9. Limitaciones conocidas (documentadas en el control)

- Verificación por correo real en el registro: la cuenta se crea ya confirmada (activable
  cambiando a `signUp`).
- Validación de archivos por MIME reportado (no magic bytes).
- El logo se muestra en Configuración, aún no en el sidebar.
- Notificaciones push, votaciones, pagos, etc.: fuera del MVP (roadmap).
