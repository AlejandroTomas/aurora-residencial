import "server-only";
import { recordAudit } from "@/core/services";
import type { AuthSession } from "@/modules/auth/server";
import { platformTenantRepository } from "../repositories";
import { toPlatformTenantDto } from "../mappers";
import { PlatformTenantNotFoundError } from "../errors";
import type { SetTenantActiveInput } from "../schemas";
import type { PlatformTenantDto } from "../types";

/** Caso de uso: activar o suspender un fraccionamiento completo. */
export async function setTenantActive(
  session: AuthSession,
  input: SetTenantActiveInput,
): Promise<PlatformTenantDto> {
  const existing = await platformTenantRepository.findById(input.tenantId);
  if (!existing) throw new PlatformTenantNotFoundError();

  await platformTenantRepository.setActive(
    input.tenantId,
    input.isActive,
    session.userId,
  );

  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: input.isActive
      ? "platform.tenant_activated"
      : "platform.tenant_suspended",
    tableName: "tenants",
    recordId: input.tenantId,
  });

  const record = await platformTenantRepository.findById(input.tenantId);
  if (!record) throw new PlatformTenantNotFoundError();
  return toPlatformTenantDto(record);
}
