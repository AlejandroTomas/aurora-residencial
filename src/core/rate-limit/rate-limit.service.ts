import "server-only";
import { createSupabaseServiceRoleClient } from "@/core/supabase";
import { logger } from "@/core/logger";

interface RateLimitOptions {
  limit: number;
  windowSeconds: number;
}

/**
 * Ventana deslizante respaldada en BD. Devuelve `true` si la operación está permitida (aún
 * hay cupo) y registra el intento. Se apoya en service-role (la tabla no tiene policies).
 *
 * Fail-open: si el limitador falla (BD caída, etc.) se permite la operación y se registra el
 * error — un problema del limitador no debe bloquear a usuarios legítimos.
 */
export async function checkRateLimit(
  key: string,
  options: RateLimitOptions,
): Promise<boolean> {
  try {
    const supabase = createSupabaseServiceRoleClient();
    const cutoff = new Date(
      Date.now() - options.windowSeconds * 1000,
    ).toISOString();

    // Limpia los hits fuera de la ventana para esta clave (mantiene la tabla acotada).
    await supabase
      .from("rate_limit_hits")
      .delete()
      .eq("key", key)
      .lt("created_at", cutoff);

    const { count, error } = await supabase
      .from("rate_limit_hits")
      .select("id", { count: "exact", head: true })
      .eq("key", key);
    if (error) throw error;

    if ((count ?? 0) >= options.limit) return false;

    await supabase.from("rate_limit_hits").insert({ key });
    return true;
  } catch (error) {
    logger.error("Fallo en rate limit (se permite por fail-open)", {
      key,
      error: error instanceof Error ? error.message : "unknown",
    });
    return true;
  }
}
