import type { PlatformTenantRecord } from "../repositories";
import type { PlatformTenantDto } from "../types";

export function toPlatformTenantDto(
  record: PlatformTenantRecord,
): PlatformTenantDto {
  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    isActive: record.is_active,
    plan: record.plan,
    createdAt: record.created_at,
  };
}
