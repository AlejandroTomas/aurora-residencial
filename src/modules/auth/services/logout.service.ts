import "server-only";
import { logger } from "@/core/logger";
import { authRepository } from "../repositories";

/**
 * Caso de uso: cerrar sesión. Delega en Supabase Auth, que invalida la sesión y
 * limpia las cookies. Nunca se manipulan tokens a mano (security.md: Sesiones).
 */
export async function logoutService(): Promise<void> {
  const { error } = await authRepository.signOut();
  if (error) {
    logger.error("Error al cerrar sesión", { error: error.message });
  }
}
