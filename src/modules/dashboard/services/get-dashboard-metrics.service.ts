import "server-only";
import type { AuthSession } from "@/modules/auth/server";
import { listResidents } from "@/modules/residents/server";
import { listUsers } from "@/modules/users/server";
import { listAnnouncements } from "@/modules/announcements/server";
import type { DashboardMetrics } from "../types";

/**
 * Reúne los totales de otros módulos consumiendo su API pública (nunca sus repositorios).
 * Se pide `pageSize: 1` porque solo interesa el `total`, no los registros.
 */
export async function getDashboardMetrics(
  session: AuthSession,
): Promise<DashboardMetrics> {
  const pagination = { page: 1, pageSize: 1 };
  const [residents, users, announcements] = await Promise.all([
    listResidents(session, pagination),
    listUsers(session, pagination),
    listAnnouncements(session, pagination),
  ]);

  return {
    residents: residents.total,
    users: users.total,
    announcements: announcements.total,
  };
}
