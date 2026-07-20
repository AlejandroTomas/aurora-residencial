"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/modules/auth/server";
import { PermissionDeniedError } from "@/core/errors";
import { toActionError } from "@/core/utils";
import type { ActionResult } from "@/core/types";
import { updateTenantSchema } from "../schemas";
import { updateTenant } from "../services";
import { canManageTenant } from "../permissions/tenant.permissions";
import type { TenantDto } from "../types";

export async function updateTenantAction(
  input: unknown,
): Promise<ActionResult<TenantDto>> {
  try {
    const session = await requireSession();
    if (!canManageTenant(session)) throw new PermissionDeniedError();

    const parsed = updateTenantSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const dto = await updateTenant(session, parsed.data);
    revalidatePath("/configuracion");
    return { success: true, data: dto };
  } catch (error) {
    return toActionError(error, "updateTenantAction");
  }
}
