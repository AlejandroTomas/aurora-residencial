import type { UserRecord } from "../repositories";
import type { UserDto } from "../types";

export function toUserDto(record: UserRecord): UserDto {
  return {
    id: record.id,
    email: record.email,
    fullName: record.full_name,
    phone: record.phone,
    role: record.role,
    isActive: record.is_active,
  };
}
