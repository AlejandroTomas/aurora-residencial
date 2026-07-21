"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/modules/auth/server";
import { PermissionDeniedError } from "@/core/errors";
import { toActionError } from "@/core/utils";
import type { ActionResult } from "@/core/types";
import { uploadLogo } from "../services";
import { canManageSettings } from "../permissions/settings.permissions";

export async function uploadLogoAction(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await requireSession();
    if (!canManageSettings(session)) throw new PermissionDeniedError();

    const file = formData.get("logo");
    if (!(file instanceof File) || file.size === 0) {
      return { success: false, error: "Selecciona una imagen." };
    }

    await uploadLogo(session, file);
    revalidatePath("/configuracion");
    return { success: true, data: null };
  } catch (error) {
    return toActionError(error, "uploadLogoAction");
  }
}
