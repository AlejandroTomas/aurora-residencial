import type { UserRole } from "@/core/supabase";

/**
 * DTO de usuario expuesto a la UI (fila de `profiles` en camelCase, sin columnas internas).
 */
export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
}
