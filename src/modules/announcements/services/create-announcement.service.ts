import "server-only";
import { recordAudit } from "@/core/services";
import type { AuthSession } from "@/modules/auth/server";
import { announcementRepository } from "../repositories";
import { toAnnouncementDto } from "../mappers";
import { AnnouncementNotFoundError } from "../errors";
import type { CreateAnnouncementInput } from "../schemas";
import type { AnnouncementDto } from "../types";

/** Caso de uso: crear un comunicado. Se crea como borrador (sin publicar). */
export async function createAnnouncement(
  session: AuthSession,
  input: CreateAnnouncementInput,
): Promise<AnnouncementDto> {
  const id = await announcementRepository.insert(
    session.tenantId,
    input,
    session.userId,
  );

  const record = await announcementRepository.findById(session.tenantId, id);
  if (!record) throw new AnnouncementNotFoundError();

  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: "announcement.created",
    tableName: "announcements",
    recordId: id,
    newData: { title: input.title },
  });

  return toAnnouncementDto(record);
}
