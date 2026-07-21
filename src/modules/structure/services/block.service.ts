import "server-only";
import { recordAudit } from "@/core/services";
import type { AuthSession } from "@/modules/auth/server";
import { blockRepository, streetRepository } from "../repositories";
import { toBlockDto } from "../mappers";
import { StructureNodeNotFoundError } from "../errors";
import type { BlockDto } from "../types";
import type {
  CreateNamedNodeInput,
  RenameNodeInput,
  SetNodeActiveInput,
} from "../schemas";

export async function listBlocks(
  session: AuthSession,
  streetId: string,
): Promise<BlockDto[]> {
  const rows = await blockRepository.listByStreet(session.tenantId, streetId);
  return rows.map(toBlockDto);
}

export async function getBlock(
  session: AuthSession,
  id: string,
): Promise<BlockDto | null> {
  const record = await blockRepository.findById(session.tenantId, id);
  return record ? toBlockDto(record) : null;
}

export async function createBlock(
  session: AuthSession,
  input: CreateNamedNodeInput,
): Promise<void> {
  if (!input.parentId) throw new StructureNodeNotFoundError("Calle inválida.");
  const street = await streetRepository.findById(
    session.tenantId,
    input.parentId,
  );
  if (!street) throw new StructureNodeNotFoundError("Calle inválida.");

  const id = await blockRepository.insert(
    session.tenantId,
    input.parentId,
    input.name,
    session.userId,
  );
  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: "block.created",
    tableName: "blocks",
    recordId: id,
    newData: { name: input.name, streetId: input.parentId },
  });
}

export async function renameBlock(
  session: AuthSession,
  input: RenameNodeInput,
): Promise<void> {
  await blockRepository.rename(
    session.tenantId,
    input.id,
    input.name,
    session.userId,
  );
  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: "block.renamed",
    tableName: "blocks",
    recordId: input.id,
    newData: { name: input.name },
  });
}

export async function setBlockActive(
  session: AuthSession,
  input: SetNodeActiveInput,
): Promise<void> {
  await blockRepository.setActive(
    session.tenantId,
    input.id,
    input.isActive,
    session.userId,
  );
  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: input.isActive ? "block.activated" : "block.deactivated",
    tableName: "blocks",
    recordId: input.id,
  });
}
