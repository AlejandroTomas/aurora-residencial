"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireSession, AUTH_ROUTES } from "@/modules/auth/server";
import { PermissionDeniedError } from "@/core/errors";
import { toActionError } from "@/core/utils";
import type { ActionResult } from "@/core/types";
import { inviteUserSchema } from "../schemas";
import { inviteUser } from "../services";
import { canManageUsers } from "../permissions/user.permissions";
import type { UserDto } from "../types";

export async function inviteUserAction(
  input: unknown,
): Promise<ActionResult<UserDto>> {
  try {
    const session = await requireSession();
    if (!canManageUsers(session)) throw new PermissionDeniedError();

    const parsed = inviteUserSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const origin = (await headers()).get("origin");
    if (!origin) {
      return { success: false, error: "No se pudo procesar la solicitud." };
    }
    // Invitación (enlace generado en servidor): el correo apunta a /auth/confirm con
    // token_hash (verifyOtp), y tras confirmar lleva a este destino a definir contraseña.
    const redirectTo = `${origin}${AUTH_ROUTES.resetPassword}`;

    const dto = await inviteUser(session, parsed.data, redirectTo);
    revalidatePath("/usuarios");
    return { success: true, data: dto };
  } catch (error) {
    return toActionError(error, "inviteUserAction");
  }
}
