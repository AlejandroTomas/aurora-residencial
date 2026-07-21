/**
 * API pública del módulo residents — cliente y servidor.
 * Los reads server-only viven en `./server`.
 */
export {
  createResidentAction,
  updateResidentAction,
  setResidentActiveAction,
} from "./actions";
export { ResidentFormDialog, ResidentsTable } from "./components";
export { buildLotLabel } from "./mappers";
export type { ResidentDto, LotOption } from "./types";
