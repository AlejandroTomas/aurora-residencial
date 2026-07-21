import { redirect } from "next/navigation";
import {
  getCurrentSession,
  homeRouteForRole,
  AUTH_ROUTES,
} from "@/modules/auth/server";

/**
 * La raíz no tiene contenido propio: envía a cada quien a su inicio según el rol
 * (plataforma o dashboard), o al login si no hay sesión.
 */
export default async function RootPage() {
  const session = await getCurrentSession();
  redirect(session ? homeRouteForRole(session.role) : AUTH_ROUTES.login);
}
