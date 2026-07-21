import "server-only";
import { recordAudit } from "@/core/services";
import type { AuthSession } from "@/modules/auth/server";
import { lotRepository, blockRepository } from "../repositories";
import { toLotDto } from "../mappers";
import { DuplicateLotError, StructureNodeNotFoundError } from "../errors";
import type { LotDto } from "../types";
import type {
  CreateLotInput,
  UpdateLotInput,
  SetNodeActiveInput,
} from "../schemas";

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  );
}

function parseArea(value: string | undefined): number | null {
  return value ? Number(value) : null;
}

export async function listLots(
  session: AuthSession,
  blockId: string,
): Promise<LotDto[]> {
  const rows = await lotRepository.listByBlock(session.tenantId, blockId);
  return rows.map(toLotDto);
}

export async function createLot(
  session: AuthSession,
  input: CreateLotInput,
): Promise<void> {
  const block = await blockRepository.findById(session.tenantId, input.blockId);
  if (!block) throw new StructureNodeNotFoundError("Manzana inválida.");

  try {
    const id = await lotRepository.insert(
      session.tenantId,
      input.blockId,
      {
        number: input.number,
        area: parseArea(input.area),
        observations: input.observations || null,
        status: input.status,
      },
      session.userId,
    );
    await recordAudit({
      tenantId: session.tenantId,
      userId: session.userId,
      action: "lot.created",
      tableName: "lots",
      recordId: id,
      newData: { number: input.number, blockId: input.blockId },
    });
  } catch (error) {
    if (isUniqueViolation(error)) throw new DuplicateLotError();
    throw error;
  }
}

export async function updateLot(
  session: AuthSession,
  input: UpdateLotInput,
): Promise<void> {
  try {
    await lotRepository.update(
      session.tenantId,
      input.id,
      {
        number: input.number,
        area: parseArea(input.area),
        observations: input.observations || null,
        status: input.status,
      },
      session.userId,
    );
    await recordAudit({
      tenantId: session.tenantId,
      userId: session.userId,
      action: "lot.updated",
      tableName: "lots",
      recordId: input.id,
      newData: { number: input.number },
    });
  } catch (error) {
    if (isUniqueViolation(error)) throw new DuplicateLotError();
    throw error;
  }
}

export async function setLotActive(
  session: AuthSession,
  input: SetNodeActiveInput,
): Promise<void> {
  await lotRepository.setActive(
    session.tenantId,
    input.id,
    input.isActive,
    session.userId,
  );
  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: input.isActive ? "lot.activated" : "lot.deactivated",
    tableName: "lots",
    recordId: input.id,
  });
}
