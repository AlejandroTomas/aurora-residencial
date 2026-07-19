import type { SessionProfile } from "../repositories";
import type { AuthSession } from "../types";

/**
 * Transforma la fila de `profiles` en el DTO `AuthSession` que consume la app.
 * Toda transformación vive en el mapper, nunca en componentes ni services (architecture.md).
 */
export function toAuthSession(profile: SessionProfile): AuthSession {
  return {
    userId: profile.id,
    email: profile.email,
    tenantId: profile.tenant_id,
    fullName: profile.full_name,
    role: profile.role,
  };
}
