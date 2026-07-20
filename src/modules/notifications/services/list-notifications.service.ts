import "server-only";
import type { AuthSession } from "@/modules/auth/server";
import type { NotificationDto } from "../types";

/**
 * Placeholder del roadmap: aún no existe la tabla `notifications`, así que devuelve una
 * lista vacía. Mantiene la firma estable para que la UI (campana del navbar) pueda
 * conectarse sin cambios cuando el backend exista.
 */
export async function listNotifications(
  _session: AuthSession,
): Promise<NotificationDto[]> {
  void _session;
  return [];
}
