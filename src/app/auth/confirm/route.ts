import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/core/supabase";
import { logger } from "@/core/logger";
import { AUTH_ROUTES } from "@/modules/auth/server";

/**
 * Verifica los enlaces de correo generados en el servidor (invitaciones, y opcionalmente
 * recuperación/registro) mediante `token_hash` + `verifyOtp`. A diferencia del flujo PKCE
 * (`/auth/callback`), NO requiere un `code_verifier` en el navegador, así que funciona con
 * enlaces creados vía admin API. Al verificar deja la sesión activa y lleva a `next`.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  // Solo se acepta un `next` de tipo ruta (empieza con "/"), para no habilitar open-redirect.
  const nextParam = searchParams.get("next");
  const next =
    nextParam && nextParam.startsWith("/")
      ? nextParam
      : AUTH_ROUTES.resetPassword;

  if (tokenHash && type) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    logger.warn("Fallo al verificar el enlace de correo", {
      type,
      error: error.message,
    });
  }

  return NextResponse.redirect(`${origin}${AUTH_ROUTES.login}?error=auth`);
}
