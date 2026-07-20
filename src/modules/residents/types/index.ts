import type { LotStatus } from "@/core/supabase";

/**
 * DTO de residente para la UI. Incluye una etiqueta de ubicación ya resuelta
 * (`lotLabel`) para no exponer la jerarquía cruda ni transformarla en el componente.
 */
export interface ResidentDto {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  lotId: string;
  lotLabel: string;
}

/** Opción de lote para el selector del formulario. */
export interface LotOption {
  id: string;
  label: string;
  status: LotStatus;
}
