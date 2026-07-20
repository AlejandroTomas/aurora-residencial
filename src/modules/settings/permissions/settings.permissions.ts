import { isAdminRole } from "@/modules/auth/server";
import type { AuthSession } from "@/modules/auth/server";

export function canManageSettings(session: AuthSession): boolean {
  return isAdminRole(session.role);
}
