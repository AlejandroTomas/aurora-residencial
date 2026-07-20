"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/modules/auth/server";
import { toActionError } from "@/core/utils";
import type { ActionResult } from "@/core/types";
import { announcementIdSchema } from "../schemas";
import { markAnnouncementRead } from "../services";

export async function markAnnouncementReadAction(
  input: unknown,
): Promise<ActionResult> {
  try {
    const session = await requireSession();

    const parsed = announcementIdSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: "Comunicado inválido." };
    }

    await markAnnouncementRead(session, parsed.data.id);
    revalidatePath("/comunicados");
    return { success: true, data: null };
  } catch (error) {
    return toActionError(error, "markAnnouncementReadAction");
  }
}
