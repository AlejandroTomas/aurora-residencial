"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/modules/auth/server";
import { PermissionDeniedError } from "@/core/errors";
import { toActionError } from "@/core/utils";
import type { ActionResult } from "@/core/types";
import { setUserActiveSchema } from "../schemas";
import { setUserActive } from "../services";
import { canManageUsers } from "../permissions/user.permissions";
import type { UserDto } from "../types";

export async function setUserActiveAction(
  input: unknown,
): Promise<ActionResult<UserDto>> {
  try {
    const session = await requireSession();
    if (!canManageUsers(session)) throw new PermissionDeniedError();

    const parsed = setUserActiveSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const dto = await setUserActive(session, parsed.data);
    revalidatePath("/usuarios");
    return { success: true, data: dto };
  } catch (error) {
    return toActionError(error, "setUserActiveAction");
  }
}
