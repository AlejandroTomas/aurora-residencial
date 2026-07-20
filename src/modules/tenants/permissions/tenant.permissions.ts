import { isAdminRole } from "@/modules/auth/server";
import type { AuthSession } from "@/modules/auth/server";

/**
 * Permisos del módulo tenants. Funciones puras sobre la sesión (architecture.md:
 * carpeta `permissions` por módulo). La verificación fuerte adicional vive en RLS.
 */
export function canManageTenant(session: AuthSession): boolean {
  return isAdminRole(session.role);
}
