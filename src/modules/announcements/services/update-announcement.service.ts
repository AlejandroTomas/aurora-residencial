import "server-only";
import { recordAudit } from "@/core/services";
import type { AuthSession } from "@/modules/auth/server";
import { announcementRepository } from "../repositories";
import { toAnnouncementDto } from "../mappers";
import { AnnouncementNotFoundError } from "../errors";
import type { UpdateAnnouncementInput } from "../schemas";
import type { AnnouncementDto } from "../types";

export async function updateAnnouncement(
  session: AuthSession,
  input: UpdateAnnouncementInput,
): Promise<AnnouncementDto> {
  const existing = await announcementRepository.findById(
    session.tenantId,
    input.id,
  );
  if (!existing) throw new AnnouncementNotFoundError();

  await announcementRepository.update(
    session.tenantId,
    input.id,
    { title: input.title, body: input.body },
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
    action: "announcement.updated",
    tableName: "announcements",
    recordId: input.id,
    newData: { title: input.title },
  });

  return toAnnouncementDto(record);
}
