import "server-only";
import { recordAudit } from "@/core/services";
import { PlanLimitExceededError } from "@/core/errors";
import { PLAN_LIMITS, isWithinLimit } from "@/core/config";
import type { AuthSession } from "@/modules/auth/server";
import { getTenantPlan } from "@/modules/tenants/server";
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
  const limit = PLAN_LIMITS[await getTenantPlan(session)].maxAnnouncements;
  if (limit !== null) {
    const current = await announcementRepository.countActive(session.tenantId);
    if (!isWithinLimit(current, limit)) {
      throw new PlanLimitExceededError(
        `Tu plan permite hasta ${limit} comunicados. Actualiza el plan para crear más.`,
      );
    }
  }

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
