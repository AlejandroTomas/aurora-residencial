"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/modules/auth/server";
import { PermissionDeniedError } from "@/core/errors";
import { toActionError } from "@/core/utils";
import type { ActionResult } from "@/core/types";
import { bulkBlocksSchema, bulkLotsSchema } from "../schemas";
import { createBlocksBulk, createLotsBulk } from "../services";
import { canManageStructure } from "../permissions/structure.permissions";

export async function createBlocksBulkAction(
  input: unknown,
): Promise<ActionResult<{ created: number }>> {
  try {
    const session = await requireSession();
    if (!canManageStructure(session)) throw new PermissionDeniedError();

    const parsed = bulkBlocksSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const created = await createBlocksBulk(session, parsed.data);
    revalidatePath("/estructura");
    return { success: true, data: { created } };
  } catch (error) {
    return toActionError(error, "createBlocksBulkAction");
  }
}

export async function createLotsBulkAction(
  input: unknown,
): Promise<ActionResult<{ created: number; skipped: number }>> {
  try {
    const session = await requireSession();
    if (!canManageStructure(session)) throw new PermissionDeniedError();

    const parsed = bulkLotsSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const result = await createLotsBulk(session, parsed.data);
    revalidatePath("/estructura");
    return { success: true, data: result };
  } catch (error) {
    return toActionError(error, "createLotsBulkAction");
  }
}
