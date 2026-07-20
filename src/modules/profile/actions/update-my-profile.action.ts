"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/modules/auth/server";
import { toActionError } from "@/core/utils";
import type { ActionResult } from "@/core/types";
import { updateProfileSchema } from "../schemas";
import { updateMyProfile } from "../services";
import type { ProfileDto } from "../types";

export async function updateMyProfileAction(
  input: unknown,
): Promise<ActionResult<ProfileDto>> {
  try {
    const session = await requireSession();

    const parsed = updateProfileSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const dto = await updateMyProfile(session, parsed.data);
    revalidatePath("/perfil");
    return { success: true, data: dto };
  } catch (error) {
    return toActionError(error, "updateMyProfileAction");
  }
}
