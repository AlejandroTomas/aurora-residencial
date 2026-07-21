/**
 * API pública del módulo platform — cliente y servidor.
 * Los reads server-only viven en `./server`.
 */
export {
  provisionTenantAction,
  setTenantActiveAction,
} from "./actions";
export { ProvisionTenantForm, PlatformTenantsTable } from "./components";
export { PLAN_LABELS } from "./constants";
export type { PlatformTenantDto } from "./types";
