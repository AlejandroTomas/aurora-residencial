import "server-only";
import { isAdminRole } from "@/modules/auth/server";
import type { AuthSession } from "@/modules/auth/server";
import type { Paginated, PaginationParams } from "@/core/types";
import { announcementRepository, readRepository } from "../repositories";
import { toAnnouncementDto } from "../mappers";
import type { AnnouncementDto } from "../types";

/**
 * Lista comunicados según el rol: los administradores ven todo (incluye borradores);
 * el resto solo publicados, marcados como leídos/no leídos para el residente actual.
 */
export async function listAnnouncements(
  session: AuthSession,
  pagination: PaginationParams,
): Promise<Paginated<AnnouncementDto>> {
  const totalPagesOf = (total: number) =>
    Math.max(1, Math.ceil(total / pagination.pageSize));

  if (isAdminRole(session.role)) {
    const { rows, total } = await announcementRepository.listAll(
      session.tenantId,
      pagination,
    );
    return {
      items: rows.map((row) => toAnnouncementDto(row)),
      page: pagination.page,
      pageSize: pagination.pageSize,
      total,
      totalPages: totalPagesOf(total),
    };
  }

  const { rows, total } = await announcementRepository.listPublished(
    session.tenantId,
    pagination,
  );

  const residentId = await readRepository.findResidentIdByProfile(
    session.tenantId,
    session.userId,
  );
  const readIds = residentId
    ? new Set(
        await readRepository.getReadAnnouncementIds(
          session.tenantId,
          residentId,
        ),
      )
    : new Set<string>();

  return {
    items: rows.map((row) =>
      toAnnouncementDto(row, { isRead: readIds.has(row.id) }),
    ),
    page: pagination.page,
    pageSize: pagination.pageSize,
    total,
    totalPages: totalPagesOf(total),
  };
}
