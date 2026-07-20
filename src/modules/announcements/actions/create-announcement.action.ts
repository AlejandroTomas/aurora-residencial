"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/modules/auth/server";
import { PermissionDeniedError } from "@/core/errors";
import { toActionError } from "@/core/utils";
import type { ActionResult } from "@/core/types";
import { createAnnouncementSchema } from "../schemas";
import { createAnnouncement } from "../services";
import { canManageAnnouncements } from "../permissions/announcement.permissions";
import type { AnnouncementDto } from "../types";

export async function createAnnouncementAction(
  input: unknown,
): Promise<ActionResult<AnnouncementDto>> {
  try {
    const session = await requireSession();
    if (!canManageAnnouncements(session)) throw new PermissionDeniedError();

    const parsed = createAnnouncementSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const dto = await createAnnouncement(session, parsed.data);
    revalidatePath("/comunicados");
    return { success: true, data: dto };
  } catch (error) {
    return toActionError(error, "createAnnouncementAction");
  }
}
