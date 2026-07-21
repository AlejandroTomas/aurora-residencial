import "server-only";
import { recordAudit } from "@/core/services";
import { PlanLimitExceededError } from "@/core/errors";
import { PLAN_LIMITS, isWithinLimit } from "@/core/config";
import type { AuthSession } from "@/modules/auth/server";
import { getTenantPlan } from "@/modules/tenants/server";
import { residentRepository, lotRepository } from "../repositories";
import { toResidentDto } from "../mappers";
import {
  LotNotFoundError,
  ResidentAlreadyExistsError,
  ResidentNotFoundError,
} from "../errors";
import type { CreateResidentInput } from "../schemas";
import type { ResidentDto } from "../types";

/**
 * Caso de uso: registrar un nuevo residente. Reglas: el lote debe pertenecer al tenant
 * y no puede existir otro residente activo con el mismo nombre en ese lote.
 */
export async function createResident(
  session: AuthSession,
  input: CreateResidentInput,
): Promise<ResidentDto> {
  const lotExists = await lotRepository.existsInTenant(
    session.tenantId,
    input.lotId,
  );
  if (!lotExists) throw new LotNotFoundError();

  const limit = PLAN_LIMITS[await getTenantPlan(session)].maxResidents;
  if (limit !== null) {
    const current = await residentRepository.countActive(session.tenantId);
    if (!isWithinLimit(current, limit)) {
      throw new PlanLimitExceededError(
        `Tu plan permite hasta ${limit} residentes. Actualiza el plan para registrar más.`,
      );
    }
  }

  const duplicated = await residentRepository.existsActiveDuplicate(
    session.tenantId,
    input.lotId,
    input.fullName,
  );
  if (duplicated) throw new ResidentAlreadyExistsError();

  const id = await residentRepository.insert(
    session.tenantId,
    input,
    session.userId,
  );

  const raw = await residentRepository.findById(session.tenantId, id);
  if (!raw) throw new ResidentNotFoundError();

  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: "resident.created",
    tableName: "residents",
    recordId: id,
    newData: { fullName: input.fullName, lotId: input.lotId },
  });

  return toResidentDto(raw);
}
