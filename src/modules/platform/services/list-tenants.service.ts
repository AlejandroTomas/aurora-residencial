import "server-only";
import type { AuthSession } from "@/modules/auth/server";
import { platformTenantRepository } from "../repositories";
import { toPlatformTenantDto } from "../mappers";
import type { PlatformTenantDto } from "../types";

/**
 * Lista todos los fraccionamientos. La sesión se recibe para dejar explícita la dependencia
 * del nivel plataforma (la autorización se verifica en la Action); RLS ya restringe la
 * lectura al SUPER_ADMIN.
 */
export async function listTenants(
  _session: AuthSession,
): Promise<PlatformTenantDto[]> {
  void _session;
  const records = await platformTenantRepository.listAll();
  return records.map(toPlatformTenantDto);
}
