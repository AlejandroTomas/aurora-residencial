import "server-only";
import type { AuthSession } from "@/modules/auth/server";
import { tenantRepository } from "../repositories/tenant.repository";
import { toTenantDto } from "../mappers";
import { TenantNotFoundError } from "../errors";
import type { TenantDto } from "../types";

/**
 * Devuelve el tenant de la sesión actual. El `tenant_id` proviene siempre de la
 * sesión del servidor, nunca del cliente (security.md: Trust Model).
 */
export async function getCurrentTenant(session: AuthSession): Promise<TenantDto> {
  const record = await tenantRepository.findById(session.tenantId);
  if (!record) throw new TenantNotFoundError();
  return toTenantDto(record);
}
