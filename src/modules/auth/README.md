# Módulo Auth

## Objetivo

Autenticación de la plataforma sobre **Supabase Auth**. Cubre el MVP: inicio de
sesión, cierre de sesión, recuperación y restablecimiento de contraseña, y la
lectura de la sesión activa (identidad + tenant + rol).

Nunca se manejan tokens ni sesiones a mano ni en `localStorage` (security.md).

## Flujo

```
UI (componentes cliente)
  ↓  Server Action        actions/*.action.ts      valida (Zod) y delega
  ↓  Service              services/*.service.ts    reglas de negocio
  ↓  Repository           repositories/*.ts        único punto con Supabase
  ↓  Supabase Auth / RLS
```

## Casos de uso

- `loginService` — inicia sesión. Regla: además de credenciales válidas, la cuenta
  debe tener un perfil **activo**; si no, cierra la sesión y falla.
- `logoutService` — cierra la sesión en Supabase Auth.
- `requestPasswordResetService` — envía el correo de recuperación. Nunca revela si
  el correo existe (anti-enumeración).
- `updatePasswordService` — fija una contraseña nueva usando la sesión de recuperación.
- `getCurrentSession` — fuente única de verdad de la sesión; devuelve `null` (no lanza)
  cuando no hay sesión utilizable, para que los layouts redirijan sin bucles.

## API pública

- `index.ts` — **cliente y servidor**: Server Actions, componentes, `AUTH_ROUTES`,
  tipo `AuthSession`.
- `server.ts` — **solo servidor**: `getCurrentSession`. Está separado porque depende
  de `server-only` y no debe entrar al bundle del cliente. Los layouts y route handlers
  importan desde `@/modules/auth/server`.

## Protección de rutas

- `src/proxy.ts` refresca la sesión en cada request y redirige a `/login` cualquier
  ruta protegida sin sesión (primera barrera).
- `app/(auth)/layout.tsx` redirige a `/dashboard` si ya hay sesión válida.
- `app/(dashboard)/layout.tsx` exige sesión válida; si no, redirige a `/login`.
- `app/auth/callback/route.ts` intercambia el código del enlace de recuperación por
  una sesión y lleva a `/reset-password`.

Defense in depth: aunque el proxy falle, cada layout revalida, y por debajo RLS aísla
por tenant.

## Permisos

Este módulo no define permisos por caso de uso (cualquiera puede intentar iniciar
sesión). La autorización por rol/tenant vive en los módulos de negocio y en RLS.

## Pendiente

- Rate limiting explícito para login y recuperación (security.md). Hoy se apoya en los
  límites integrados de Supabase Auth; un limitador propio entra cuando exista infra.
- Registro en `audit_log` de los eventos de login/logout (se integrará con el Service de
  auditoría en Fase 4).
