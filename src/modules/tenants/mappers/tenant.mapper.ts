import type { TenantRecord } from "../repositories/tenant.repository";
import type { TenantDto } from "../types";

export function toTenantDto(record: TenantRecord): TenantDto {
  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    isActive: record.is_active,
  };
}
