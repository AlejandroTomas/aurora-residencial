import "server-only";
import { recordAudit } from "@/core/services";
import { storageRepository } from "@/core/storage/storage.repository";
import type { AuthSession } from "@/modules/auth/server";
import { documentRepository } from "../repositories";
import { DocumentNotFoundError } from "../errors";

/** Caso de uso: quitar un adjunto (desvincula, marca el documento como eliminado y borra el archivo). */
export async function removeAttachment(
  session: AuthSession,
  documentId: string,
): Promise<void> {
  const path = await documentRepository.findStoragePath(
    session.tenantId,
    documentId,
  );
  if (!path) throw new DocumentNotFoundError();

  await documentRepository.unlink(session.tenantId, documentId);
  await documentRepository.softDeleteDocument(
    session.tenantId,
    documentId,
    session.userId,
  );
  await storageRepository.remove([path]);

  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: "announcement.attachment_removed",
    tableName: "documents",
    recordId: documentId,
  });
}
