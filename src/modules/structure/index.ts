/**
 * API pública del módulo structure — cliente y servidor.
 * Los reads server-only viven en `./server`.
 */
export {
  createStageAction,
  renameStageAction,
  setStageActiveAction,
  createStreetAction,
  renameStreetAction,
  setStreetActiveAction,
  createBlockAction,
  renameBlockAction,
  setBlockActiveAction,
  createLotAction,
  updateLotAction,
  setLotActiveAction,
} from "./actions";
export {
  StructureLevel,
  NamedNodeDialog,
  LotList,
  LotFormDialog,
  BulkBlocksDialog,
  BulkLotsDialog,
} from "./components";
export type { StageDto, StreetDto, BlockDto, LotDto, NamedNode } from "./types";
