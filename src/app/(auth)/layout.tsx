import { redirect } from "next/navigation";
import { getCurrentSession, homeRouteForRole } from "@/modules/auth/server";

/**
 * Layout de las pantallas de autenticación (login, recuperación). Si ya existe una sesión
 * válida, no tiene sentido mostrarlas: se envía al inicio según el rol (plataforma o
 * dashboard). El restablecimiento de contraseña vive fuera de este grupo, porque ocurre
 * precisamente con una sesión activa.
 */
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();
  if (session) redirect(homeRouteForRole(session.role));

  return children;
}
