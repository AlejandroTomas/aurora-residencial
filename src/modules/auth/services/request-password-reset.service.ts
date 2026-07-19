import "server-only";
import { logger } from "@/core/logger";
import { authRepository } from "../repositories";
import type { RequestPasswordResetInput } from "../schemas";

/**
 * Caso de uso: solicitar restablecimiento de contraseña.
 *
 * Nunca revela si el correo existe: siempre resuelve sin error hacia la UI aunque el
 * correo no esté registrado (evita enumeración de cuentas — security.md). El `redirectTo`
 * apunta al handler de callback, que intercambia el código por una sesión de recuperación.
 */
export async function requestPasswordResetService(
  input: RequestPasswordResetInput,
  redirectTo: string,
): Promise<void> {
  const { error } = await authRepository.sendPasswordResetEmail(
    input.email,
    redirectTo,
  );

  if (error) {
    // Se registra para observabilidad pero no se propaga a la UI.
    logger.warn("No se pudo enviar el correo de recuperación", {
      email: input.email,
      error: error.message,
    });
  }
}
