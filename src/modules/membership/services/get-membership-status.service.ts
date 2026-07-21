import "server-only";
import type { AuthSession } from "@/modules/auth/server";
import { membershipRequestRepository } from "../repositories";
import type { MembershipStatus } from "../types";

/**
 * Estado de membresía del residente autenticado: si ya es residente (tiene registro
 * ligado), o el estado de su última solicitud (pendiente/rechazada), o ninguno.
 */
export async function getMembershipStatus(
  session: AuthSession,
): Promise<MembershipStatus> {
  const linked = await membershipRequestRepository.residentLinked(
    session.tenantId,
    session.userId,
  );
  if (linked) return { kind: "member" };

  const latest = await membershipRequestRepository.findLatestByProfile(
    session.tenantId,
    session.userId,
  );
  if (!latest) return { kind: "none" };
  if (latest.status === "PENDING") return { kind: "pending" };
  if (latest.status === "REJECTED") {
    return { kind: "rejected", comment: latest.admin_comment };
  }
  return { kind: "member" };
}
