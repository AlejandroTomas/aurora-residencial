import type { MembershipRequestStatus } from "@/core/supabase";
import type { LotOption } from "@/modules/residents";

export type { MembershipRequestStatus };

/** Solicitud de asociación vista por el administrador. */
export interface MembershipRequestDto {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  lotId: string;
  lotLabel: string;
  status: MembershipRequestStatus;
  adminComment: string | null;
  createdAt: string;
}

/** Contexto público de la pantalla de registro (por slug de fraccionamiento). */
export interface RegistrationContext {
  tenantName: string;
  lots: LotOption[];
}

/** Estado de membresía del residente autenticado (para su dashboard). */
export type MembershipStatus =
  | { kind: "member" }
  | { kind: "pending" }
  | { kind: "rejected"; comment: string | null }
  | { kind: "none" };
