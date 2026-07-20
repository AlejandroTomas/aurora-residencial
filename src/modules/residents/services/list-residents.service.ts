import "server-only";
import type { AuthSession } from "@/modules/auth/server";
import type { Paginated, PaginationParams } from "@/core/types";
import { residentRepository } from "../repositories";
import { toResidentDto } from "../mappers";
import type { ResidentDto } from "../types";

export async function listResidents(
  session: AuthSession,
  pagination: PaginationParams,
  search?: string,
): Promise<Paginated<ResidentDto>> {
  const { rows, total } = await residentRepository.listByTenant(
    session.tenantId,
    pagination,
    search,
  );

  return {
    items: rows.map(toResidentDto),
    page: pagination.page,
    pageSize: pagination.pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pagination.pageSize)),
  };
}
