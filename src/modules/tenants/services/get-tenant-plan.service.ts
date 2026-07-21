import "server-only";
import type { AuthSession } from "@/modules/auth/server";
import type { SubscriptionPlan } from "@/core/supabase";
import { tenantRepository } from "../repositories/tenant.repository";
import { TenantNotFoundError } from "../errors";

/** Plan de suscripción del tenant de la sesión. Usado para validar límites de plan. */
export async function getTenantPlan(
  session: AuthSession,
): Promise<SubscriptionPlan> {
  const plan = await tenantRepository.findPlan(session.tenantId);
  if (!plan) throw new TenantNotFoundError();
  return plan;
}
