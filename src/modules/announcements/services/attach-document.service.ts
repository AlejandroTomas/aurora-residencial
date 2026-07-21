import "server-only";
import { randomUUID } from "crypto";
import { recordAudit } from "@/core/services";
import { validateUploadFile } from "@/core/storage";
import { storageRepository } from "@/core/storage/storage.repository";
import type { AuthSession } from "@/modules/auth/server";
import { announcementRepository, documentRepository } from "../repositories";
import { AnnouncementNotFoundError } from "../errors";

/**
 * Caso de uso: adjuntar un archivo a un comunicado. Valida tipo/tamaño, sube con nombre
 * generado (UUID + extensión, nunca el original) a `{tenantId}/announcements/...`, registra
 * el documento y lo vincula al comunicado. El nombre original se guarda como metadata.
 */
export async function attachDocument(
  session: AuthSession,
  announcementId: string,
  file: File,
): Promise<void> {
  const announcement = await announcementRepository.findById(
    session.tenantId,
    announcementId,
  );
  if (!announcement) throw new AnnouncementNotFoundError();

  const extension = validateUploadFile({ size: file.size, type: file.type });
  const path = `${session.tenantId}/announcements/${randomUUID()}.${extension}`;

  await storageRepository.upload(path, file);

  const documentId = await documentRepository.insertDocument(
    session.tenantId,
    {
      storagePath: path,
      originalFilename: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
    },
    session.userId,
  );
  await documentRepository.linkToAnnouncement(
    session.tenantId,
    announcementId,
    documentId,
  );

  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: "announcement.attachment_added",
    tableName: "documents",
    recordId: documentId,
    newData: { announcementId, filename: file.name },
  });
}
