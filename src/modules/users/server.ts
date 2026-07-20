import "server-only";

/**
 * API pública server-only del módulo users (lecturas). Separada de `index.ts` para no
 * filtrar código de servidor al bundle del cliente.
 */
export { listUsers } from "./services";
export type { UserDto } from "./types";
