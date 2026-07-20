import "server-only";
import { recordAudit } from "@/core/services";
import type { AuthSession } from "@/modules/auth/server";
import { residentRepository, lotRepository } from "../repositories";
import { toResidentDto } from "../mappers";
import {
  LotNotFoundError,
  ResidentAlreadyExistsError,
  ResidentNotFoundError,
} from "../errors";
import type { UpdateResidentInput } from "../schemas";
import type { ResidentDto } from "../types";

/**
 * Caso de uso: actualizar los datos de un residente (incluye reubicarlo a otro lote).
 */
export async function updateResident(
  session: AuthSession,
  input: UpdateResidentInput,
): Promise<ResidentDto> {
  const existing = await residentRepository.findById(session.tenantId, input.id);
  if (!existing) throw new ResidentNotFoundError();

  const lotExists = await lotRepository.existsInTenant(
    session.tenantId,
    input.lotId,
  );
  if (!lotExists) throw new LotNotFoundError();

  const duplicated = await residentRepository.existsActiveDuplicate(
    session.tenantId,
    input.lotId,
    input.fullName,
    input.id,
  );
  if (duplicated) throw new ResidentAlreadyExistsError();

  await residentRepository.update(
    session.tenantId,
    input.id,
    input,
    session.userId,
  );

  const raw = await residentRepository.findById(session.tenantId, input.id);
  if (!raw) throw new ResidentNotFoundError();

  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: "resident.updated",
    tableName: "residents",
    recordId: input.id,
    newData: { fullName: input.fullName, lotId: input.lotId },
  });

  return toResidentDto(raw);
}
