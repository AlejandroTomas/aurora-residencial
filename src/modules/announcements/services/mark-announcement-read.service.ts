import "server-only";
import type { AuthSession } from "@/modules/auth/server";
import { announcementRepository, readRepository } from "../repositories";
import { AnnouncementNotFoundError, NotAResidentError } from "../errors";

/**
 * Caso de uso: marcar un comunicado como leído. Requiere que el usuario esté vinculado a
 * un residente (la lectura se atribuye a la persona, no a la cuenta). Idempotente.
 */
export async function markAnnouncementRead(
  session: AuthSession,
  announcementId: string,
): Promise<void> {
  const residentId = await readRepository.findResidentIdByProfile(
    session.tenantId,
    session.userId,
  );
  if (!residentId) throw new NotAResidentError();

  const announcement = await announcementRepository.findById(
    session.tenantId,
    announcementId,
  );
  if (!announcement || announcement.published_at === null) {
    throw new AnnouncementNotFoundError();
  }

  await readRepository.markRead(session.tenantId, announcementId, residentId);
}
