import { isAdminRole } from "@/modules/auth/server";
import type { AuthSession } from "@/modules/auth/server";

/**
 * Gestionar usuarios (invitar, cambiar rol, activar/desactivar) es exclusivo de
 * administradores. RLS lo refuerza (`profiles_update` exige `is_admin()`).
 */
export function canManageUsers(session: AuthSession): boolean {
  return isAdminRole(session.role);
}
