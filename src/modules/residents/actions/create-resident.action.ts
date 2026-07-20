"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/modules/auth/server";
import { PermissionDeniedError } from "@/core/errors";
import { toActionError } from "@/core/utils";
import type { ActionResult } from "@/core/types";
import { createResidentSchema } from "../schemas";
import { createResident } from "../services";
import { canManageResidents } from "../permissions/resident.permissions";
import type { ResidentDto } from "../types";

export async function createResidentAction(
  input: unknown,
): Promise<ActionResult<ResidentDto>> {
  try {
    const session = await requireSession();
    if (!canManageResidents(session)) throw new PermissionDeniedError();

    const parsed = createResidentSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const dto = await createResident(session, parsed.data);
    revalidatePath("/residentes");
    return { success: true, data: dto };
  } catch (error) {
    return toActionError(error, "createResidentAction");
  }
}
