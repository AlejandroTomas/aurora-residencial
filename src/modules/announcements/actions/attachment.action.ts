"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/modules/auth/server";
import { PermissionDeniedError } from "@/core/errors";
import { toActionError } from "@/core/utils";
import type { ActionResult } from "@/core/types";
import { attachDocument, listAttachments, removeAttachment } from "../services";
import { canManageAnnouncements } from "../permissions/announcement.permissions";
import type { AttachmentDto } from "../types";

const idSchema = z.string().uuid();

export async function attachDocumentAction(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await requireSession();
    if (!canManageAnnouncements(session)) throw new PermissionDeniedError();

    const announcementId = idSchema.safeParse(formData.get("announcementId"));
    if (!announcementId.success) {
      return { success: false, error: "Comunicado inválido." };
    }
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { success: false, error: "Selecciona un archivo." };
    }

    await attachDocument(session, announcementId.data, file);
    revalidatePath("/comunicados");
    return { success: true, data: null };
  } catch (error) {
    return toActionError(error, "attachDocumentAction");
  }
}

export async function listAttachmentsAction(
  announcementId: unknown,
): Promise<ActionResult<AttachmentDto[]>> {
  try {
    const session = await requireSession();
    const parsed = idSchema.safeParse(announcementId);
    if (!parsed.success) {
      return { success: false, error: "Comunicado inválido." };
    }
    const data = await listAttachments(session, parsed.data);
    return { success: true, data };
  } catch (error) {
    return toActionError(error, "listAttachmentsAction");
  }
}

export async function removeAttachmentAction(
  documentId: unknown,
): Promise<ActionResult> {
  try {
    const session = await requireSession();
    if (!canManageAnnouncements(session)) throw new PermissionDeniedError();

    const parsed = idSchema.safeParse(documentId);
    if (!parsed.success) {
      return { success: false, error: "Adjunto inválido." };
    }

    await removeAttachment(session, parsed.data);
    revalidatePath("/comunicados");
    return { success: true, data: null };
  } catch (error) {
    return toActionError(error, "removeAttachmentAction");
  }
}
