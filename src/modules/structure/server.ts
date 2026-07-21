import "server-only";

/**
 * API pública server-only del módulo structure (lecturas). La consumen las páginas
 * anidadas de `/estructura`.
 */
export {
  listStages,
  getStage,
  listStreets,
  getStreet,
  listBlocks,
  getBlock,
  listLots,
} from "./services";
export type { StageDto, StreetDto, BlockDto, LotDto } from "./types";
