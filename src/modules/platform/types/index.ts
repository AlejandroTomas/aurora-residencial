import type { SubscriptionPlan } from "@/core/supabase";

/**
 * DTO de tenant (fraccionamiento) visto desde el nivel Plataforma. Incluye el `plan`
 * para dejar preparada la gestión de suscripciones (aún no se validan límites).
 */
export interface PlatformTenantDto {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  plan: SubscriptionPlan;
  createdAt: string;
}

/** Resultado del alta de un fraccionamiento: credenciales del admin inicial (una sola vez). */
export interface ProvisionResult {
  tenantName: string;
  adminEmail: string;
  adminPassword: string;
}
