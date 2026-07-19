import "server-only";
import { logger } from "@/core/logger";
import { authRepository, profileRepository } from "../repositories";
import { toAuthSession } from "../mappers";
import type { AuthSession } from "../types";

/**
 * Fuente única de verdad de la sesión. Combina la identidad de Supabase Auth con el
 * perfil del negocio. Devuelve `null` (nunca lanza) cuando no hay sesión utilizable,
 * para que los layouts decidan la redirección sin riesgo de bucles.
 *
 * Un usuario autenticado sin perfil activo NO es una sesión válida: se registra y se
 * trata como no autenticado.
 */
export async function getCurrentSession(): Promise<AuthSession | null> {
  const user = await authRepository.getUser();
  if (!user) return null;

  try {
    const profile = await profileRepository.findById(user.id);

    if (!profile || !profile.is_active) {
      logger.warn("Usuario autenticado sin perfil activo", { userId: user.id });
      return null;
    }

    return toAuthSession(profile);
  } catch (error) {
    logger.error("Error al leer el perfil de la sesión", {
      userId: user.id,
      error: error instanceof Error ? error.message : "unknown",
    });
    return null;
  }
}
