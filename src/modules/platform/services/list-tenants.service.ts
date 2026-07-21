import "server-only";
import type { AuthSession } from "@/modules/auth/server";
import type { Paginated, PaginationParams } from "@/core/types";
import { platformTenantRepository } from "../repositories";
import { toPlatformTenantDto } from "../mappers";
import type { PlatformTenantDto } from "../types";

/**
 * Lista paginada de todos los fraccionamientos. La sesión se recibe para dejar explícita la
 * dependencia del nivel plataforma (la autorización se verifica en la Action); RLS ya
 * restringe la lectura al SUPER_ADMIN.
 */
export async function listTenants(
  _session: AuthSession,
  pagination: PaginationParams,
): Promise<Paginated<PlatformTenantDto>> {
  void _session;
  const { rows, total } = await platformTenantRepository.list(pagination);

  return {
    items: rows.map(toPlatformTenantDto),
    page: pagination.page,
    pageSize: pagination.pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pagination.pageSize)),
  };
}
