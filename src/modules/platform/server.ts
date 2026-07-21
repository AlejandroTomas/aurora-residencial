import "server-only";

/**
 * API pública server-only del módulo platform. La consumen el layout y las páginas del
 * área `/platform`, accesibles solo para SUPER_ADMIN.
 */
export { listTenants } from "./services";
export { isPlatformAdmin } from "./permissions/platform.permissions";
export type { PlatformTenantDto } from "./types";
