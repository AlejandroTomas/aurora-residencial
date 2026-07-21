import type { LotStatus } from "@/core/supabase";

export interface StageDto {
  id: string;
  name: string;
  isActive: boolean;
}

export interface StreetDto {
  id: string;
  name: string;
  stageId: string;
  isActive: boolean;
}

export interface BlockDto {
  id: string;
  name: string;
  streetId: string;
  isActive: boolean;
}

export interface LotDto {
  id: string;
  number: string;
  area: number | null;
  observations: string | null;
  status: LotStatus;
  blockId: string;
  isActive: boolean;
}

/** Forma mínima que consume el componente genérico de niveles con nombre. */
export interface NamedNode {
  id: string;
  name: string;
  isActive: boolean;
}
