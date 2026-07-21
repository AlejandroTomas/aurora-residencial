import { isAdminRole } from "@/modules/auth/server";
import type { AuthSession } from "@/modules/auth/server";

/** Gestionar la estructura física (etapas/calles/manzanas/lotes) es exclusivo de admins. */
export function canManageStructure(session: AuthSession): boolean {
  return isAdminRole(session.role);
}
