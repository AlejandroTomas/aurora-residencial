"use server";

import { AppError } from "@/core/errors";
import { logger } from "@/core/logger";
import type { ActionResult } from "@/core/types";
import { loginSchema } from "../schemas";
import { loginService } from "../services";

/**
 * Valida los datos y delega en el Service. No implementa reglas de negocio
 * (architecture.md). Devuelve un resultado tipado; la redirección la decide el
 * cliente tras el éxito, para poder mostrar errores de formulario si falla.
 */
export async function loginAction(input: unknown): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Datos inválidos. Revisa el formulario." };
  }

  try {
    await loginService(parsed.data);
    return { success: true, data: null };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }
    logger.error("Error inesperado en loginAction", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return { success: false, error: "Ocurrió un error. Intenta de nuevo." };
  }
}
