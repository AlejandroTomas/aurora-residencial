/**
 * API pública del módulo tenants — cliente y servidor.
 * Los reads server-only viven en `./server`.
 */
export { updateTenantAction } from "./actions";
export { TenantForm } from "./components";
export type { TenantDto } from "./types";
