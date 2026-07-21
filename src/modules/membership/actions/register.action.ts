"use server";

import { headers } from "next/headers";
import { toActionError } from "@/core/utils";
import { checkRateLimit } from "@/core/rate-limit";
import type { ActionResult } from "@/core/types";
import { registerSchema } from "../schemas";
import { register } from "../services";

/**
 * Registro público de un residente. No requiere sesión: la valida el schema y el Service
 * acota todo al tenant del slug. Con rate limit por IP para evitar spam de altas.
 */
export async function registerAction(input: unknown): Promise<ActionResult> {
  try {
    const ip =
      (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const allowed = await checkRateLimit(`register:${ip}`, {
      limit: 5,
      windowSeconds: 3600,
    });
    if (!allowed) {
      return {
        success: false,
        error: "Demasiados intentos. Espera un momento e intenta de nuevo.",
      };
    }

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
