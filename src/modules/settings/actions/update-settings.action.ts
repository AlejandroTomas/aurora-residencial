"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/modules/auth/server";
import { PermissionDeniedError } from "@/core/errors";
import { toActionError } from "@/core/utils";
import type { ActionResult } from "@/core/types";
import { updateSettingsSchema } from "../schemas";
import { updateSettings } from "../services";
import { canManageSettings } from "../permissions/settings.permissions";
import type { SettingsDto } from "../types";

export async function updateSettingsAction(
  input: unknown,
): Promise<ActionResult<SettingsDto>> {
  try {
    const session = await requireSession();
    if (!canManageSettings(session)) throw new PermissionDeniedError();

    const parsed = updateSettingsSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const dto = await updateSettings(session, parsed.data);
    revalidatePath("/configuracion");
    return { success: true, data: dto };
  } catch (error) {
    return toActionError(error, "updateSettingsAction");
  }
}
