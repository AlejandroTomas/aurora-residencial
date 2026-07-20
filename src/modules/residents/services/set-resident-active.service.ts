import "server-only";
import { recordAudit } from "@/core/services";
import type { AuthSession } from "@/modules/auth/server";
import { residentRepository } from "../repositories";
import { toResidentDto } from "../mappers";
import { ResidentNotFoundError } from "../errors";
import type { SetResidentActiveInput } from "../schemas";
import type { ResidentDto } from "../types";

/** Caso de uso: suspender o reactivar un residente (sin borrarlo). */
export async function setResidentActive(
  session: AuthSession,
  input: SetResidentActiveInput,
): Promise<ResidentDto> {
  const existing = await residentRepository.findById(session.tenantId, input.id);
  if (!existing) throw new ResidentNotFoundError();

  await residentRepository.setActive(
    session.tenantId,
    input.id,
    input.isActive,
    session.userId,
  );

  const raw = await residentRepository.findById(session.tenantId, input.id);
  if (!raw) throw new ResidentNotFoundError();

  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: input.isActive ? "resident.reactivated" : "resident.suspended",
    tableName: "residents",
    recordId: input.id,
  });

  return toResidentDto(raw);
}
