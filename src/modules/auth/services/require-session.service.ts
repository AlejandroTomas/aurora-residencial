import "server-only";
import { PermissionDeniedError } from "@/core/errors";
import type { UserRole } from "@/core/supabase";
import { getCurrentSession } from "./get-session.service";
import { SessionError } from "../errors";
import { AUTH_ROUTES } from "../constants";
import type { AuthSession } from "../types";

const ADMIN_ROLES: readonly UserRole[] = ["ADMIN", "SUPER_ADMIN"];

/**
 * Ruta de inicio según el nivel del usuario: el SUPER_ADMIN vive en el área de
 * plataforma; el resto, en el dashboard de su fraccionamiento. Los niveles no se mezclan.
 */
export function homeRouteForRole(role: UserRole): string {
  return role === "SUPER_ADMIN" ? AUTH_ROUTES.platform : AUTH_ROUTES.afterLogin;
}

/**
 * Exige sesión válida. Pensado para el inicio de toda Server Action de negocio:
 * si no hay sesión, corta con un error tipado (nunca continúa la mutación).
 */
export async function requireSession(): Promise<AuthSession> {
  const session = await getCurrentSession();
  if (!session) {
    throw new SessionError("Debes iniciar sesión para continuar.");
  }
  return session;
}

/**
 * Exige sesión con rol administrador. El rol proviene siempre de la sesión del
 * servidor, nunca del cliente (security.md: Trust Model).
 */
export async function requireAdmin(): Promise<AuthSession> {
  const session = await requireSession();
  if (!ADMIN_ROLES.includes(session.role)) {
    throw new PermissionDeniedError();
  }
  return session;
}

export function isAdminRole(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role);
}
