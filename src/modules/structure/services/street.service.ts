import "server-only";
import { recordAudit } from "@/core/services";
import type { AuthSession } from "@/modules/auth/server";
import { streetRepository, stageRepository } from "../repositories";
import { toStreetDto } from "../mappers";
import { StructureNodeNotFoundError } from "../errors";
import type { StreetDto } from "../types";
import type {
  CreateNamedNodeInput,
  RenameNodeInput,
  SetNodeActiveInput,
} from "../schemas";

export async function listStreets(
  session: AuthSession,
  stageId: string,
): Promise<StreetDto[]> {
  const rows = await streetRepository.listByStage(session.tenantId, stageId);
  return rows.map(toStreetDto);
}

export async function getStreet(
  session: AuthSession,
  id: string,
): Promise<StreetDto | null> {
  const record = await streetRepository.findById(session.tenantId, id);
  return record ? toStreetDto(record) : null;
}

export async function createStreet(
  session: AuthSession,
  input: CreateNamedNodeInput,
): Promise<void> {
  if (!input.parentId) throw new StructureNodeNotFoundError("Etapa inválida.");
  const stage = await stageRepository.findById(session.tenantId, input.parentId);
  if (!stage) throw new StructureNodeNotFoundError("Etapa inválida.");

  const id = await streetRepository.insert(
    session.tenantId,
    input.parentId,
    input.name,
    session.userId,
  );
  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: "street.created",
    tableName: "streets",
    recordId: id,
    newData: { name: input.name, stageId: input.parentId },
  });
}

export async function renameStreet(
  session: AuthSession,
  input: RenameNodeInput,
): Promise<void> {
  await streetRepository.rename(
    session.tenantId,
    input.id,
    input.name,
    session.userId,
  );
  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: "street.renamed",
    tableName: "streets",
    recordId: input.id,
    newData: { name: input.name },
  });
}

export async function setStreetActive(
  session: AuthSession,
  input: SetNodeActiveInput,
): Promise<void> {
  await streetRepository.setActive(
    session.tenantId,
    input.id,
    input.isActive,
    session.userId,
  );
  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: input.isActive ? "street.activated" : "street.deactivated",
    tableName: "streets",
    recordId: input.id,
  });
}
