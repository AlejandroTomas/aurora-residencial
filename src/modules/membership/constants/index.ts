import type { MembershipRequestStatus } from "@/core/supabase";

export const REQUEST_STATUS_LABELS: Record<MembershipRequestStatus, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
};
