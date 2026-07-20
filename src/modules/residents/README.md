# Módulo Residents

## Objetivo

Padrón de residentes del fraccionamiento. Cada residente pertenece a un lote de la
jerarquía Etapa → Calle → Manzana → Lote. Un residente puede existir sin cuenta
(`profile_id` opcional): no todos acceden al sistema.

## Casos de uso

- `listResidents(session, pagination, search?)` — padrón paginado (server-only).
- `getLotOptions(session)` — lotes disponibles para asignar.
- `createResident(session, input)` — alta. Valida que el lote sea del tenant y que no
  exista otro residente activo con el mismo nombre en ese lote.
- `updateResident(session, input)` — edición (incluye reubicar a otro lote).
- `setResidentActive(session, input)` — suspender / reactivar (sin borrar).

Toda escritura registra auditoría.

## API pública

- `index.ts` — actions, `ResidentFormDialog`, `ResidentsTable`, `ResidentDto`, `LotOption`.
- `server.ts` — `listResidents`, `getLotOptions` (server-only).

## Permisos

`permissions/resident.permissions.ts`: `canViewResidents` (admin + caseta),
`canManageResidents` (solo admin). RLS refuerza (`residents_*`).

## Notas

- La etiqueta de ubicación se resuelve en el servidor (`buildLotLabel`), no en la UI.
- Los selects anidados se tipan con `.returns<T>()` porque los tipos de `Database` se
  mantienen a mano y no describen las relaciones para el parser de supabase-js.
