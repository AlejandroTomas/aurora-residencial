"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/modules/auth/server";
import { PermissionDeniedError } from "@/core/errors";
import { toActionError } from "@/core/utils";
import type { ActionResult } from "@/core/types";
import { setAnnouncementPublishedSchema } from "../schemas";
import { setAnnouncementPublished } from "../services";
import { canManageAnnouncements } from "../permissions/announcement.permissions";
import type { AnnouncementDto } from "../types";

export async function setAnnouncementPublishedAction(
  input: unknown,
): Promise<ActionResult<AnnouncementDto>> {
  try {
    const session = await requireSession();
    if (!canManageAnnouncements(session)) throw new PermissionDeniedError();

    const parsed = setAnnouncementPublishedSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const dto = await setAnnouncementPublished(session, parsed.data);
    revalidatePath("/comunicados");
    return { success: true, data: dto };
  } catch (error) {
    return toActionError(error, "setAnnouncementPublishedAction");
  }
}
