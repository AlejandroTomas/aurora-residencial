import "server-only";
import { recordAudit } from "@/core/services";
import { sendEmail } from "@/core/email";
import { isPhoneAuthEmail } from "@/core/utils";
import type { AuthSession } from "@/modules/auth/server";
import { admitResident } from "@/modules/residents/server";
import { membershipRequestRepository } from "../repositories";
import { RequestAlreadyReviewedError, RequestNotFoundError } from "../errors";
import { renderApprovalEmail } from "../utils";
import type { ApproveRequestInput } from "../schemas";

/**
 * Caso de uso: aprobar una solicitud de asociación. Crea el residente ligado a la cuenta
 * (a través del Service público de `residents`) y marca la solicitud como aprobada.
 * Idempotente: si el residente ya existe, solo cierra la solicitud.
 */
export async function approveRequest(
  session: AuthSession,
  input: ApproveRequestInput,
  loginUrl?: string,
): Promise<void> {
  const request = await membershipRequestRepository.findById(
    session.tenantId,
    input.requestId,
  );
  if (!request) throw new RequestNotFoundError();
  if (request.status !== "PENDING") throw new RequestAlreadyReviewedError();

  const alreadyResident = await membershipRequestRepository.residentLinked(
    session.tenantId,
    request.profile_id,
  );
  // Los residentes por teléfono tienen un correo sintético interno: no se propaga al
  // registro del residente (se guarda su teléfono como contacto).
  const isPhoneAccount = isPhoneAuthEmail(request.email);
  if (!alreadyResident) {
    await admitResident(session, {
      profileId: request.profile_id,
      lotId: request.lot_id,
      fullName: request.full_name,
      email: isPhoneAccount ? null : request.email,
      phone: request.phone,
    });
  }

  await membershipRequestRepository.markReviewed(
    session.tenantId,
    request.id,
    "APPROVED",
    null,
    session.userId,
  );

  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: "membership.request_approved",
    tableName: "membership_requests",
    recordId: request.id,
  });

  // Solo se notifica por correo a cuentas con correo real (no a las de teléfono).
  if (!isPhoneAccount) {
    const email = renderApprovalEmail(request.full_name, loginUrl);
    await sendEmail({
      to: request.email,
      subject: email.subject,
      html: email.html,
    });
  }
}
