# Prompt — Crear un permiso / policy

Cada módulo define sus permisos como funciones puras sobre la sesión, en `permissions/`. Son la
autoridad de autorización que la Action consulta antes de mutar. La barrera final es RLS en la
base. Referencia: `src/modules/residents/permissions/resident.permissions.ts`.

## Contexto que debe leerse primero

- `.ai/context/architecture.md` (sección Permissions), `.ai/context/security.md` (Trust Model)
- `src/modules/auth/server` (`isAdminRole`, `AuthSession`)

## Prompt

> Crea `src/modules/{{nombre_modulo}}/permissions/{{entidad}}.permissions.ts` con funciones puras
> `export function can{{Accion}}(session: AuthSession): boolean`.
>
> - Basadas solo en la sesión (rol/tenant), sin efectos secundarios ni acceso a datos.
> - Reutiliza `isAdminRole(session.role)` para lo de administrador; añade `session.role === "GUARD"`
>   u otros según el caso (ej. `canView{{Entidad}}s` = admin o caseta; `canManage{{Entidad}}s` = admin).
> - Documenta qué policy de RLS refuerza cada permiso (ej. "RLS `{{tabla}}_update` exige `is_admin()`").
>
> Úsalas en la Action así:
> `const session = await requireSession(); if (!can{{Accion}}(session)) throw new PermissionDeniedError();`
>
> No dupliques la lógica de rol en el componente: la UI puede ocultar botones por UX, pero la
> autorización real vive en la Action + RLS.

## Recordatorios

- El rol y el tenant SIEMPRE vienen de la sesión del servidor, nunca del cliente.
- Permisos por caso de uso viven en el módulo; el aislamiento por tenant/rol vive en RLS.
- Si un permiso necesita consultar datos (ej. "solo su propia etapa"), esa consulta va en el
  Service usando un Repository, no dentro de la función de permiso.
