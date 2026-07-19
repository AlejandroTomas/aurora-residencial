import "server-only";
import { logger } from "@/core/logger";
import { authRepository } from "../repositories";
import { SessionError } from "../errors";
import type { UpdatePasswordInput } from "../schemas";

/**
 * Caso de uso: fijar una contraseña nueva.
 *
 * Requiere una sesión activa (la de recuperación creada al abrir el enlace del correo).
 * Si no hay usuario, la operación se rechaza: nunca se cambia una contraseña sin sesión.
 */
export async function updatePasswordService(
  input: UpdatePasswordInput,
): Promise<void> {
  const user = await authRepository.getUser();
  if (!user) {
    throw new SessionError("El enlace de recuperación expiró o no es válido.");
  }

  const { error } = await authRepository.updatePassword(input.password);
  if (error) {
    logger.error("Error al actualizar la contraseña", {
      userId: user.id,
      error: error.message,
    });
    throw new SessionError("No se pudo actualizar la contraseña. Intenta de nuevo.");
  }

  logger.info("Contraseña actualizada", { userId: user.id });
}
