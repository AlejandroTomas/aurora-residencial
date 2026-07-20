import "server-only";
import { recordAudit } from "@/core/services";
import type { AuthSession } from "@/modules/auth/server";
import { announcementRepository } from "../repositories";
import { toAnnouncementDto } from "../mappers";
import { AnnouncementNotFoundError } from "../errors";
import type { SetAnnouncementPublishedInput } from "../schemas";
import type { AnnouncementDto } from "../types";

/** Caso de uso: publicar (fija `published_at = now`) o despublicar (lo deja en borrador). */
export async function setAnnouncementPublished(
  session: AuthSession,
  input: SetAnnouncementPublishedInput,
): Promise<AnnouncementDto> {
  const existing = await announcementRepository.findById(
    session.tenantId,
    input.id,
  );
  if (!existing) throw new AnnouncementNotFoundError();

  const publishedAt = input.publish ? new Date().toISOString() : null;
  await announcementRepository.setPublished(
    session.tenantId,
    input.id,
    publishedAt,
    session.userId,
  );

  const record = await announcementRepository.findById(
    session.tenantId,
    input.id,
  );
  if (!record) throw new AnnouncementNotFoundError();

  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: input.publish
      ? "announcement.published"
      : "announcement.unpublished",
    tableName: "announcements",
    recordId: input.id,
  });

  return toAnnouncementDto(record);
}
