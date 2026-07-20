import "server-only";
import type { AuthSession } from "@/modules/auth/server";
import type { Paginated, PaginationParams } from "@/core/types";
import { userRepository } from "../repositories";
import { toUserDto } from "../mappers";
import type { UserDto } from "../types";

export async function listUsers(
  session: AuthSession,
  pagination: PaginationParams,
  search?: string,
): Promise<Paginated<UserDto>> {
  const { rows, total } = await userRepository.listByTenant(
    session.tenantId,
    pagination,
    search,
  );

  return {
    items: rows.map(toUserDto),
    page: pagination.page,
    pageSize: pagination.pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pagination.pageSize)),
  };
}
