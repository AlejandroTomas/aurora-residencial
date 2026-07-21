import "server-only";
import { recordAudit } from "@/core/services";
import type { AuthSession } from "@/modules/auth/server";
import { membershipRequestRepository } from "../repositories";
import { RequestAlreadyReviewedError, RequestNotFoundError } from "../errors";
import type { RejectRequestInput } from "../schemas";

/** Caso de uso: rechazar una solicitud, opcionalmente con un comentario para el residente. */
export async function rejectRequest(
  session: AuthSession,
  input: RejectRequestInput,
): Promise<void> {
  const request = await membershipRequestRepository.findById(
    session.tenantId,
    input.requestId,
  );
  if (!request) throw new RequestNotFoundError();
  if (request.status !== "PENDING") throw new RequestAlreadyReviewedError();

  await membershipRequestRepository.markReviewed(
    session.tenantId,
    request.id,
    "REJECTED",
    input.comment || null,
    session.userId,
  );

  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: "membership.request_rejected",
    tableName: "membership_requests",
    recordId: request.id,
  });
}
