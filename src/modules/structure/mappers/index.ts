import type {
  StageRecord,
  StreetRecord,
  BlockRecord,
  LotRecord,
} from "../repositories";
import type { StageDto, StreetDto, BlockDto, LotDto } from "../types";

export function toStageDto(record: StageRecord): StageDto {
  return { id: record.id, name: record.name, isActive: record.is_active };
}

export function toStreetDto(record: StreetRecord): StreetDto {
  return {
    id: record.id,
    name: record.name,
    stageId: record.stage_id,
    isActive: record.is_active,
  };
}

export function toBlockDto(record: BlockRecord): BlockDto {
  return {
    id: record.id,
    name: record.name,
    streetId: record.street_id,
    isActive: record.is_active,
  };
}

export function toLotDto(record: LotRecord): LotDto {
  return {
    id: record.id,
    number: record.number,
    area: record.area,
    observations: record.observations,
    status: record.status,
    blockId: record.block_id,
    isActive: record.is_active,
  };
}
