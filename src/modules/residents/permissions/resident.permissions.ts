import { isAdminRole } from "@/modules/auth/server";
import type { AuthSession } from "@/modules/auth/server";

/**
 * Permisos del módulo residents. Ver el padrón lo pueden hacer administradores y caseta;
 * modificarlo, solo administradores. RLS refuerza (`residents_insert/update` exigen `is_admin()`).
 */
export function canViewResidents(session: AuthSession): boolean {
  return isAdminRole(session.role) || session.role === "GUARD";
}

export function canManageResidents(session: AuthSession): boolean {
  return isAdminRole(session.role);
}
