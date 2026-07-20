# Módulo Users

## Objetivo

Gestión de usuarios (perfiles) del fraccionamiento con sus roles. Es la base de
administración: quién tiene acceso y con qué permisos.

## Casos de uso

- `listUsers(session, pagination, search?)` — lista paginada del tenant (server-only).
- `inviteUser(session, input, redirectTo)` — crea la cuenta en Supabase Auth (envía correo
  de invitación) y su perfil. Compensa (elimina la cuenta) si el alta del perfil falla.
- `updateUserRole(session, input)` — cambia el rol. No permite cambiar el propio ni degradar
  al último administrador activo.
- `setUserActive(session, input)` — activa/desactiva. No permite desactivar la propia cuenta
  ni al último administrador activo.

## Notas de arquitectura

- El alta de perfiles usa **service-role** (RLS no permite INSERT en `profiles` a
  `authenticated`): es un flujo administrado, no self-service.
- `SUPER_ADMIN` no es asignable desde la UI (rol reservado de plataforma).
- Toda escritura registra auditoría.

## API pública

- `index.ts` — actions, `InviteUserForm`, `UsersTable`, `ROLE_LABELS`, `UserDto`.
- `server.ts` — `listUsers` (server-only).

## Permisos

`permissions/user.permissions.ts` → `canManageUsers` (solo admin). RLS refuerza en
`profiles`.
