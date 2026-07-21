import "server-only";
import type { AuthSession } from "@/modules/auth/server";
import { membershipRequestRepository } from "../repositories";
import { toMembershipRequestDto } from "../mappers";
import type { MembershipRequestDto } from "../types";

export async function listPendingRequests(
  session: AuthSession,
): Promise<MembershipRequestDto[]> {
  const rows = await membershipRequestRepository.listPending(session.tenantId);
  return rows.map(toMembershipRequestDto);
}
