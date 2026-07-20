import type { UserRole } from "@/core/supabase";

/**
 * Roles que un administrador puede asignar desde la UI. `SUPER_ADMIN` queda reservado
 * (se otorga solo a nivel plataforma, nunca desde la gestión de un tenant).
 */
export const ASSIGNABLE_ROLES = ["ADMIN", "GUARD", "RESIDENT"] as const;
export type AssignableRole = (typeof ASSIGNABLE_ROLES)[number];

export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "Super administrador",
  ADMIN: "Administrador",
  GUARD: "Caseta",
  RESIDENT: "Residente",
};
