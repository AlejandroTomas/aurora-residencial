"use server";

import { revalidatePath } from "next/cache";
import { requireSession, AUTH_ROUTES } from "@/modules/auth/server";
import { PermissionDeniedError } from "@/core/errors";
import { toActionError } from "@/core/utils";
import type { ActionResult } from "@/core/types";
import { setTenantActiveSchema } from "../schemas";
import { setTenantActive } from "../services";
import { isPlatformAdmin } from "../permissions/platform.permissions";
import type { PlatformTenantDto } from "../types";

export async function setTenantActiveAction(
  input: unknown,
): Promise<ActionResult<PlatformTenantDto>> {
  try {
    const session = await requireSession();
    if (!isPlatformAdmin(session)) throw new PermissionDeniedError();

    const parsed = setTenantActiveSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const dto = await setTenantActive(session, parsed.data);
    revalidatePath(AUTH_ROUTES.platform);
    return { success: true, data: dto };
  } catch (error) {
    return toActionError(error, "setTenantActiveAction");
  }
}
