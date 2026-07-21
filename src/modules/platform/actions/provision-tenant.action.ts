"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireSession, AUTH_ROUTES } from "@/modules/auth/server";
import { PermissionDeniedError } from "@/core/errors";
import { toActionError } from "@/core/utils";
import type { ActionResult } from "@/core/types";
import { provisionTenantSchema } from "../schemas";
import { provisionTenant } from "../services";
import { isPlatformAdmin } from "../permissions/platform.permissions";
import type { PlatformTenantDto } from "../types";

export async function provisionTenantAction(
  input: unknown,
): Promise<ActionResult<PlatformTenantDto>> {
  try {
    const session = await requireSession();
    if (!isPlatformAdmin(session)) throw new PermissionDeniedError();

    const parsed = provisionTenantSchema.safeParse(input);
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
    const redirectTo = `${origin}${AUTH_ROUTES.callback}?next=${AUTH_ROUTES.resetPassword}`;

    const dto = await provisionTenant(session, parsed.data, redirectTo);
    revalidatePath(AUTH_ROUTES.platform);
    return { success: true, data: dto };
  } catch (error) {
    return toActionError(error, "provisionTenantAction");
  }
}
