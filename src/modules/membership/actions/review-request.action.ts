"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/modules/auth/server";
import { PermissionDeniedError } from "@/core/errors";
import { toActionError } from "@/core/utils";
import type { ActionResult } from "@/core/types";
import { approveRequestSchema, rejectRequestSchema } from "../schemas";
import { approveRequest, rejectRequest } from "../services";
import { canReviewRequests } from "../permissions/membership.permissions";

const REQUESTS_PATH = "/solicitudes";

export async function approveRequestAction(
  input: unknown,
): Promise<ActionResult> {
  try {
    const session = await requireSession();
    if (!canReviewRequests(session)) throw new PermissionDeniedError();

    const parsed = approveRequestSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: "Solicitud inválida." };
    }

    const origin = (await headers()).get("origin");
    await approveRequest(
      session,
      parsed.data,
      origin ? `${origin}/login` : undefined,
    );
    revalidatePath(REQUESTS_PATH);
    return { success: true, data: null };
  } catch (error) {
    return toActionError(error, "approveRequestAction");
  }
}

export async function rejectRequestAction(
  input: unknown,
): Promise<ActionResult> {
  try {
    const session = await requireSession();
    if (!canReviewRequests(session)) throw new PermissionDeniedError();

    const parsed = rejectRequestSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    await rejectRequest(session, parsed.data);
    revalidatePath(REQUESTS_PATH);
    return { success: true, data: null };
  } catch (error) {
    return toActionError(error, "rejectRequestAction");
  }
}
