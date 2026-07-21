// Servicios agrupados por entidad: el CRUD de los 4 niveles es uniforme, así que agrupar
// sus casos de uso por entidad se lee mejor que 12 archivos casi idénticos.
export {
  listStages,
  getStage,
  createStage,
  renameStage,
  setStageActive,
} from "./stage.service";
export {
  listStreets,
  getStreet,
  createStreet,
  renameStreet,
  setStreetActive,
} from "./street.service";
export {
  listBlocks,
  getBlock,
  createBlock,
  renameBlock,
  setBlockActive,
} from "./block.service";
export { listLots, createLot, updateLot, setLotActive } from "./lot.service";
