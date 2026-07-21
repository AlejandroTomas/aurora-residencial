import { buildLotLabel } from "@/modules/residents";
import type { LotOption } from "@/modules/residents";
import type { RegistrationLotRaw, RequestRaw } from "../repositories";
import type { MembershipRequestDto } from "../types";

type NestedLot = {
  number: string;
  blocks: {
    name: string;
    streets: { name: string; stages: { name: string } | null } | null;
  } | null;
} | null;

function labelFromLot(lot: NestedLot): string {
  if (!lot) return "Sin lote";
  return buildLotLabel({
    number: lot.number,
    block: lot.blocks?.name,
    street: lot.blocks?.streets?.name,
    stage: lot.blocks?.streets?.stages?.name,
  });
}

export function toRegistrationLotOption(raw: RegistrationLotRaw): LotOption {
  return { id: raw.id, status: raw.status, label: labelFromLot(raw) };
}

export function toMembershipRequestDto(raw: RequestRaw): MembershipRequestDto {
  return {
    id: raw.id,
    fullName: raw.full_name,
    email: raw.email,
    phone: raw.phone,
    lotId: raw.lot_id,
    lotLabel: labelFromLot(raw.lots),
    status: raw.status,
    adminComment: raw.admin_comment,
    createdAt: raw.created_at,
  };
}
