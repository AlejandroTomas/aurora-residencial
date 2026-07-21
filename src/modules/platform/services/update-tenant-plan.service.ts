import "server-only";
import { recordAudit } from "@/core/services";
import type { AuthSession } from "@/modules/auth/server";
import { platformTenantRepository } from "../repositories";
import { toPlatformTenantDto } from "../mappers";
import { PlatformTenantNotFoundError } from "../errors";
import type { UpdateTenantPlanInput } from "../schemas";
import type { PlatformTenantDto } from "../types";

/** Caso de uso: cambiar el plan de suscripción de un fraccionamiento. */
export async function updateTenantPlan(
  session: AuthSession,
  input: UpdateTenantPlanInput,
): Promise<PlatformTenantDto> {
  const existing = await platformTenantRepository.findById(input.tenantId);
  if (!existing) throw new PlatformTenantNotFoundError();

  await platformTenantRepository.updatePlan(
    input.tenantId,
    input.plan,
    session.userId,
  );

  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: "platform.tenant_plan_changed",
    tableName: "tenants",
    recordId: input.tenantId,
    oldData: { plan: existing.plan },
    newData: { plan: input.plan },
  });

  const record = await platformTenantRepository.findById(input.tenantId);
  if (!record) throw new PlatformTenantNotFoundError();
  return toPlatformTenantDto(record);
}
