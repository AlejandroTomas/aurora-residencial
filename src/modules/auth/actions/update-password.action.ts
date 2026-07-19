"use server";

import { AppError } from "@/core/errors";
import { logger } from "@/core/logger";
import type { ActionResult } from "@/core/types";
import { updatePasswordSchema } from "../schemas";
import { updatePasswordService } from "../services";

export async function updatePasswordAction(
  input: unknown,
): Promise<ActionResult> {
  const parsed = updatePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  try {
    await updatePasswordService(parsed.data);
    return { success: true, data: null };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }
    logger.error("Error inesperado en updatePasswordAction", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return { success: false, error: "Ocurrió un error. Intenta de nuevo." };
  }
}
