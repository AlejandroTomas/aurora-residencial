import "server-only";
import { storageRepository } from "@/core/storage/storage.repository";
import type { AuthSession } from "@/modules/auth/server";
import { documentRepository } from "../repositories";
import type { AttachmentDto } from "../types";

/**
 * Adjuntos de un comunicado con Signed URL de descarga (vida corta). Cualquier miembro del
 * tenant puede consultarlos (RLS de `documents`/`announcement_documents` lo limita al tenant).
 */
export async function listAttachments(
  session: AuthSession,
  announcementId: string,
): Promise<AttachmentDto[]> {
  const rows = await documentRepository.listByAnnouncement(
    session.tenantId,
    announcementId,
  );

  const attachments: AttachmentDto[] = [];
  for (const row of rows) {
    if (!row.documents) continue;
    const url = await storageRepository.createSignedUrl(
      row.documents.storage_path,
    );
    attachments.push({
      id: row.documents.id,
      filename: row.documents.original_filename,
      mimeType: row.documents.mime_type,
      sizeBytes: row.documents.size_bytes,
      url,
    });
  }
  return attachments;
}
