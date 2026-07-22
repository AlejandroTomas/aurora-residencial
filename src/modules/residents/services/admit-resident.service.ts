import "server-only";
import { recordAudit } from "@/core/services";
import { PlanLimitExceededError } from "@/core/errors";
import { PLAN_LIMITS, isWithinLimit } from "@/core/config";
import type { AuthSession } from "@/modules/auth/server";
import { getTenantPlan } from "@/modules/tenants/server";
import { residentRepository } from "../repositories";

interface AdmitResidentInput {
  profileId: string;
  lotId: string;
  fullName: string;
  email: string | null;
  phone: string | null;
}

/**
 * Caso de uso: admitir a un residente a partir de una solicitud aprobada. Crea el registro
 * de residente ligado a su cuenta (`profile_id`). Respeta el límite de plan y audita.
 * Devuelve el id del residente creado.
 */
export async function admitResident(
  session: AuthSession,
  input: AdmitResidentInput,
): Promise<string> {
  const limit = PLAN_LIMITS[await getTenantPlan(session)].maxResidents;
  if (limit !== null) {
    const current = await residentRepository.countActive(session.tenantId);
    if (!isWithinLimit(current, limit)) {
      throw new PlanLimitExceededError(
        `Tu plan permite hasta ${limit} residentes. Actualiza el plan para admitir más.`,
      );
    }
  }

  const residentId = await residentRepository.admit({
    tenantId: session.tenantId,
    lotId: input.lotId,
    profileId: input.profileId,
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    actorId: session.userId,
  });

  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: "resident.admitted",
    tableName: "residents",
    recordId: residentId,
    newData: { profileId: input.profileId, lotId: input.lotId },
  });

  return residentId;
}
