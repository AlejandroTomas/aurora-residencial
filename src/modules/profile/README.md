# Módulo Profile

## Objetivo

Datos de la cuenta del propio usuario. Cada quien edita su nombre y teléfono; el rol y el
tenant no se tocan aquí (eso es del módulo `users`, y solo un admin puede cambiarlos).

## Casos de uso

- `getMyProfile(session)` — lee el perfil propio (server-only).
- `updateMyProfile(session, input)` — actualiza nombre y teléfono. Registra auditoría.

El cambio de contraseña reutiliza el flujo de Auth (`/reset-password`, que funciona con la
sesión activa).

## API pública

- `index.ts` — `updateMyProfileAction`, `ProfileForm`, `ProfileDto`.
- `server.ts` — `getMyProfile` (server-only).

## Permisos

Cualquier usuario autenticado edita su propio perfil. RLS (`profiles_update` con
`id = auth.uid()`) garantiza que solo el dueño lo modifique.
