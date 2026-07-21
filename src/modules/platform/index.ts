/**
 * API pública del módulo platform — cliente y servidor.
 * Los reads server-only viven en `./server`.
 */
export {
  provisionTenantAction,
  setTenantActiveAction,
  updateTenantPlanAction,
} from "./actions";
export { ProvisionTenantForm, PlatformTenantsTable } from "./components";
export { PLAN_LABELS, SUBSCRIPTION_PLANS } from "./constants";
export type { PlatformTenantDto } from "./types";
