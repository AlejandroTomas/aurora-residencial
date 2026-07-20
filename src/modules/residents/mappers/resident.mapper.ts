import type { ResidentRaw, LotRaw } from "../repositories";
import type { ResidentDto, LotOption } from "../types";
import { buildLotLabel } from "./lot-label";

export function toResidentDto(raw: ResidentRaw): ResidentDto {
  return {
    id: raw.id,
    fullName: raw.full_name,
    email: raw.email,
    phone: raw.phone,
    isActive: raw.is_active,
    lotId: raw.lot_id,
    lotLabel: raw.lots
      ? buildLotLabel({
          number: raw.lots.number,
          block: raw.lots.blocks?.name,
          street: raw.lots.blocks?.streets?.name,
          stage: raw.lots.blocks?.streets?.stages?.name,
        })
      : "Sin lote",
  };
}

export function toLotOption(raw: LotRaw): LotOption {
  return {
    id: raw.id,
    status: raw.status,
    label: buildLotLabel({
      number: raw.number,
      block: raw.blocks?.name,
      street: raw.blocks?.streets?.name,
      stage: raw.blocks?.streets?.stages?.name,
    }),
  };
}
