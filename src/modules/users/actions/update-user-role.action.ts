"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/modules/auth/server";
import { PermissionDeniedError } from "@/core/errors";
import { toActionError } from "@/core/utils";
import type { ActionResult } from "@/core/types";
import { updateUserRoleSchema } from "../schemas";
import { updateUserRole } from "../services";
import { canManageUsers } from "../permissions/user.permissions";
import type { UserDto } from "../types";

export async function updateUserRoleAction(
  input: unknown,
): Promise<ActionResult<UserDto>> {
  try {
    const session = await requireSession();
    if (!canManageUsers(session)) throw new PermissionDeniedError();

    const parsed = updateUserRoleSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const dto = await updateUserRole(session, parsed.data);
    revalidatePath("/usuarios");
    return { success: true, data: dto };
  } catch (error) {
    return toActionError(error, "updateUserRoleAction");
  }
}
