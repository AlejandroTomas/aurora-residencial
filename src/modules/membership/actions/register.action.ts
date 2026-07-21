"use server";

import { toActionError } from "@/core/utils";
import type { ActionResult } from "@/core/types";
import { registerSchema } from "../schemas";
import { register } from "../services";

/**
 * Registro público de un residente. No requiere sesión: la valida el schema y el Service
 * acota todo al tenant del slug. Devuelve un resultado tipado para el formulario.
 */
export async function registerAction(input: unknown): Promise<ActionResult> {
  try {
    const parsed = registerSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    await register(parsed.data);
    return { success: true, data: null };
  } catch (error) {
    return toActionError(error, "registerAction");
  }
}
