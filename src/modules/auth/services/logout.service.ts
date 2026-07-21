import "server-only";
import { logger } from "@/core/logger";
import { recordAudit } from "@/core/services";
import { authRepository } from "../repositories";
import { getCurrentSession } from "./get-session.service";

/**
 * Caso de uso: cerrar sesión. Audita el evento (mientras la sesión aún es válida) y luego
 * delega en Supabase Auth, que invalida la sesión y limpia las cookies. Nunca se manipulan
 * tokens a mano (security.md: Sesiones).
 */
export async function logoutService(): Promise<void> {
  const session = await getCurrentSession();
  if (session) {
    await recordAudit({
      tenantId: session.tenantId,
      userId: session.userId,
      action: "auth.logout",
      tableName: "profiles",
      recordId: session.userId,
      viaServiceRole: true,
    });
  }

  const { error } = await authRepository.signOut();
  if (error) {
    logger.error("Error al cerrar sesión", { error: error.message });
  }
}
