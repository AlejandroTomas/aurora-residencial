# Módulo Structure

## Objetivo

Estructura física del fraccionamiento: la jerarquía **Etapa → Calle → Manzana → Lote**
(CLAUDE.md → Tenant Structure). Es la base a la que se asocian los residentes.

## Casos de uso

Por cada nivel: listar, crear, renombrar (los lotes: editar número/área/estado/observaciones)
y activar/desactivar. Los nombres **no** son únicos (una calle puede repetirse entre etapas);
los lotes sí son únicos por número dentro de su manzana.

- `listStages/Streets/Blocks/Lots`, `getStage/Street/Block` (server-only).
- `createStage/Street/Block`, `renameStage/Street/Block`, `setXActive`.
- `createLot`, `updateLot`, `setLotActive`.

Cada creación valida que el padre pertenezca al tenant; toda escritura audita.

## API pública

- `index.ts` — actions, `StructureLevel`, `NamedNodeDialog`, `LotList`, `LotFormDialog`, tipos.
- `server.ts` — lecturas (`listX`, `getX`).

## Rutas

Navegación por drill-down: `/estructura` (etapas) → `/estructura/[stageId]` (calles) →
`.../[streetId]` (manzanas) → `.../[blockId]` (lotes).

## Permisos

`permissions/structure.permissions.ts` → `canManageStructure` (admin). RLS de
`stages/streets/blocks/lots` refuerza (INSERT/UPDATE exigen `is_admin()`).

## Notas de arquitectura

- Los servicios se **agrupan por entidad** (4 archivos) en vez de un archivo por caso de uso:
  el CRUD de los 4 niveles es uniforme y así se lee mejor.
- Las actions comparten `runStructureAction` (sesión + permiso + validación + revalidate).
- `StructureLevel` es un componente genérico para los niveles con nombre (etapa/calle/manzana);
  recibe las Server Actions por props. Los lotes tienen su propia UI (`LotList`/`LotFormDialog`).
