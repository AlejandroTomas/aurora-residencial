import type { UserRole } from "@/core/supabase";

/**
 * Sesión autenticada tal como la consume la aplicación: identidad de Supabase Auth
 * enriquecida con el perfil del negocio (tenant + rol). Nunca se arma en la UI;
 * siempre proviene de `getCurrentSession` (security.md: Trust Model).
 */
export interface AuthSession {
  userId: string;
  email: string;
  tenantId: string;
  fullName: string;
  role: UserRole;
}
