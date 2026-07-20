import { isAdminRole } from "@/modules/auth/server";
import type { AuthSession } from "@/modules/auth/server";

/**
 * Crear, editar y publicar comunicados es exclusivo de administradores. Leerlos, cualquier
 * usuario autenticado del tenant. RLS refuerza (`announcements_insert/update` exigen `is_admin()`;
 * el SELECT limita a publicados salvo para admins).
 */
export function canManageAnnouncements(session: AuthSession): boolean {
  return isAdminRole(session.role);
}
