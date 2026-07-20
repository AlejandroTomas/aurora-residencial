import "server-only";
import { recordAudit } from "@/core/services";
import type { AuthSession } from "@/modules/auth/server";
import { tenantRepository } from "../repositories/tenant.repository";
import { toTenantDto } from "../mappers";
import type { UpdateTenantInput } from "../schemas";
import type { TenantDto } from "../types";

/**
 * Caso de uso: actualizar los datos del fraccionamiento. La escritura queda registrada
 * en auditoría (security.md). El tenant objetivo es siempre el de la sesión.
 */
export async function updateTenant(
  session: AuthSession,
  input: UpdateTenantInput,
): Promise<TenantDto> {
  const record = await tenantRepository.update(session.tenantId, {
    name: input.name,
    updated_by: session.userId,
  });

  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: "tenant.updated",
    tableName: "tenants",
    recordId: record.id,
    newData: { name: record.name },
  });

  return toTenantDto(record);
}
