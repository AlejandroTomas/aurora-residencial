import "server-only";

/**
 * API pública server-only del módulo tenants. La consumen Server Components y otros
 * módulos (ej. dashboard, settings). Separada de `index.ts` para no filtrar código de
 * servidor al bundle del cliente.
 */
export { getCurrentTenant } from "./services";
export type { TenantDto } from "./types";
