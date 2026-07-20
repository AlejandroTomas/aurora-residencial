import type { ProfileRecord } from "../repositories/profile.repository";
import type { ProfileDto } from "../types";

export function toProfileDto(record: ProfileRecord): ProfileDto {
  return {
    id: record.id,
    email: record.email,
    fullName: record.full_name,
    phone: record.phone,
    role: record.role,
    avatarUrl: record.avatar_url,
  };
}
