import type { LotStatus } from "@/core/supabase";

export const LOT_STATUSES = [
  "DISPONIBLE",
  "HABITADO",
  "RENTADO",
  "EN_CONSTRUCCION",
  "SUSPENDIDO",
] as const;

export const LOT_STATUS_LABELS: Record<LotStatus, string> = {
  DISPONIBLE: "Disponible",
  HABITADO: "Habitado",
  RENTADO: "Rentado",
  EN_CONSTRUCCION: "En construcción",
  SUSPENDIDO: "Suspendido",
};
