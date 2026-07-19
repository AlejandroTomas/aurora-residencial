"use server";

import { headers } from "next/headers";
import type { ActionResult } from "@/core/types";
import { requestPasswordResetSchema } from "../schemas";
import { requestPasswordResetService } from "../services";
import { AUTH_ROUTES } from "../constants";

/**
 * Construye el `redirectTo` absoluto a partir del origen de la petición (no se expone
 * una URL de sitio en env por ahora) y delega en el Service. Siempre responde éxito
 * aunque el correo no exista, para no revelar cuentas.
 */
export async function requestPasswordResetAction(
  input: unknown,
): Promise<ActionResult> {
  const parsed = requestPasswordResetSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Ingresa un correo válido." };
  }

  const origin = (await headers()).get("origin");
  if (!origin) {
    return { success: false, error: "No se pudo procesar la solicitud." };
  }

  const redirectTo = `${origin}${AUTH_ROUTES.callback}?next=${AUTH_ROUTES.resetPassword}`;
  await requestPasswordResetService(parsed.data, redirectTo);

  return { success: true, data: null };
}
