import type { AuthSession } from "@/modules/auth/server";

/**
 * El nivel Plataforma es exclusivo del SUPER_ADMIN (dueño del SaaS). Nunca se mezcla con
 * los roles de tenant. Además de esta verificación, las lecturas se apoyan en la policy
 * de RLS `tenants_select_platform` y las escrituras corren con service-role.
 */
export function isPlatformAdmin(session: AuthSession): boolean {
  return session.role === "SUPER_ADMIN";
}
