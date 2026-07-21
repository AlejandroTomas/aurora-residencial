import "server-only";
import { recordAudit } from "@/core/services";
import type { AuthSession } from "@/modules/auth/server";
import { stageRepository } from "../repositories";
import { toStageDto } from "../mappers";
import type { StageDto } from "../types";
import type {
  CreateNamedNodeInput,
  RenameNodeInput,
  SetNodeActiveInput,
} from "../schemas";

export async function listStages(session: AuthSession): Promise<StageDto[]> {
  const rows = await stageRepository.listByTenant(session.tenantId);
  return rows.map(toStageDto);
}

export async function getStage(
  session: AuthSession,
  id: string,
): Promise<StageDto | null> {
  const record = await stageRepository.findById(session.tenantId, id);
  return record ? toStageDto(record) : null;
}

export async function createStage(
  session: AuthSession,
  input: CreateNamedNodeInput,
): Promise<void> {
  const id = await stageRepository.insert(
    session.tenantId,
    input.name,
    session.userId,
  );
  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: "stage.created",
    tableName: "stages",
    recordId: id,
    newData: { name: input.name },
  });
}

export async function renameStage(
  session: AuthSession,
  input: RenameNodeInput,
): Promise<void> {
  await stageRepository.rename(
    session.tenantId,
    input.id,
    input.name,
    session.userId,
  );
  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: "stage.renamed",
    tableName: "stages",
    recordId: input.id,
    newData: { name: input.name },
  });
}

export async function setStageActive(
  session: AuthSession,
  input: SetNodeActiveInput,
): Promise<void> {
  await stageRepository.setActive(
    session.tenantId,
    input.id,
    input.isActive,
    session.userId,
  );
  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: input.isActive ? "stage.activated" : "stage.deactivated",
    tableName: "stages",
    recordId: input.id,
  });
}
