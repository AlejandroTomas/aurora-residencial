import { AppError } from "@/core/errors";
import { logger } from "@/core/logger";

/**
 * Traduce cualquier error capturado en una Server Action a un fallo tipado y seguro
 * para la UI. Los errores del dominio (`AppError`) exponen su mensaje amigable; los
 * inesperados se registran y se responden con un mensaje genérico (security.md: "No
 * mostrar mensajes internos").
 *
 * No usar en actions que redirigen: `redirect()` lanza un error de control de Next que
 * no debe capturarse aquí.
 */
export function toActionError(
  error: unknown,
  context: string,
): { success: false; error: string } {
  if (error instanceof AppError) {
    return { success: false, error: error.message };
  }
  logger.error(`Error inesperado en ${context}`, {
    error: error instanceof Error ? error.message : "unknown",
  });
  return { success: false, error: "Ocurrió un error. Intenta de nuevo." };
}
