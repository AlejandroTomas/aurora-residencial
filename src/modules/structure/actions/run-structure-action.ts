import "server-only";
import { revalidatePath } from "next/cache";
import type { ZodType } from "zod";
import { requireSession } from "@/modules/auth/server";
import type { AuthSession } from "@/modules/auth/server";
import { PermissionDeniedError } from "@/core/errors";
import { toActionError } from "@/core/utils";
import type { ActionResult } from "@/core/types";
import { canManageStructure } from "../permissions/structure.permissions";

/**
 * Envoltura común de las Server Actions de estructura: valida sesión + permiso admin +
 * datos (Zod), ejecuta el caso de uso y revalida. Evita repetir el mismo try/catch en las
 * ~10 acciones casi idénticas de este módulo. No es una action (no se exporta como tal):
 * la invocan las actions "use server".
 */
export async function runStructureAction<T>(
  input: unknown,
  schema: ZodType<T>,
  run: (session: AuthSession, data: T) => Promise<void>,
  context: string,
): Promise<ActionResult> {
  try {
    const session = await requireSession();
    if (!canManageStructure(session)) throw new PermissionDeniedError();

    const parsed = schema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    await run(session, parsed.data);
    revalidatePath("/estructura");
    return { success: true, data: null };
  } catch (error) {
    return toActionError(error, context);
  }
}
