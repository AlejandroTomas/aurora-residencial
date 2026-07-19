import { NextResponse, type NextRequest } from "next/server";
import { updateSupabaseSession } from "@/core/supabase/middleware";

/**
 * Rutas accesibles sin sesión. `/auth` cubre el callback de recuperación; `/reset-password`
 * se atiende con la sesión temporal creada al abrir el enlace del correo.
 */
const PUBLIC_PREFIXES = [
  "/login",
  "/forgot-password",
  "/reset-password",
  "/auth",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Primera barrera de protección: refresca la sesión de Supabase en cada request y
 * redirige a `/login` cualquier ruta protegida sin usuario autenticado. La redirección
 * inversa (usuario con sesión que abre /login) la resuelve `app/(auth)/layout.tsx`,
 * que sí conoce la sesión completa (perfil), evitando bucles.
 */
export async function proxy(request: NextRequest) {
  const { response, user } = await updateSupabaseSession(request);
  const { pathname } = request.nextUrl;

  if (!user && !isPublicPath(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    const redirect = NextResponse.redirect(loginUrl);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
