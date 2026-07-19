import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/core/supabase";
import { logger } from "@/core/logger";
import { AUTH_ROUTES } from "@/modules/auth/server";

/**
 * Intercambia el código del enlace de correo (recuperación de contraseña) por una
 * sesión y redirige a `next` (por defecto, el restablecimiento). Es un route handler
 * porque necesita fijar cookies de sesión sobre la respuesta de redirección.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? AUTH_ROUTES.resetPassword;

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    logger.warn("Fallo al intercambiar el código de recuperación", {
      error: error.message,
    });
  }

  return NextResponse.redirect(`${origin}${AUTH_ROUTES.login}?error=auth`);
}
