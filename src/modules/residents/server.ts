import "server-only";

/**
 * API pública server-only del módulo residents (lecturas). Separada de `index.ts` para
 * no filtrar código de servidor al bundle del cliente.
 */
export { listResidents, getLotOptions, admitResident } from "./services";
export type { ResidentDto, LotOption } from "./types";
