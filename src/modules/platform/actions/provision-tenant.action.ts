"use server";

import { revalidatePath } from "next/cache";
import { requireSession, AUTH_ROUTES } from "@/modules/auth/server";
import { PermissionDeniedError } from "@/core/errors";
import { toActionError } from "@/core/utils";
import type { ActionResult } from "@/core/types";
import { provisionTenantSchema } from "../schemas";
import { provisionTenant } from "../services";
import { isPlatformAdmin } from "../permissions/platform.permissions";
import type { ProvisionResult } from "../types";

export async function provisionTenantAction(
  input: unknown,
): Promise<ActionResult<ProvisionResult>> {
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

    const result = await provisionTenant(session, parsed.data);
    revalidatePath(AUTH_ROUTES.platform);
    return { success: true, data: result };
  } catch (error) {
    return toActionError(error, "provisionTenantAction");
  }
}
