import { isAdminRole } from "@/modules/auth/server";
import type { AuthSession } from "@/modules/auth/server";

/** Revisar (aprobar/rechazar) solicitudes de asociación es exclusivo de administradores. */
export function canReviewRequests(session: AuthSession): boolean {
  return isAdminRole(session.role);
}
