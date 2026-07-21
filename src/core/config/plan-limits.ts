import type { SubscriptionPlan } from "@/core/supabase";

/**
 * Límites por plan de suscripción. `null` = ilimitado. Se validan desde los Services
 * (CLAUDE.md: "Los límites del plan deben validarse desde los Services").
 *
 * Los números son un punto de partida y se ajustan aquí, en un solo lugar. Al añadir un
 * límite nuevo (ej. almacenamiento), agrégalo a la interfaz y a cada plan.
 */
export interface PlanLimits {
  maxResidents: number | null;
  maxUsers: number | null;
  maxAnnouncements: number | null;
}

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  BASICO: { maxResidents: 100, maxUsers: 3, maxAnnouncements: 50 },
  PROFESIONAL: { maxResidents: 500, maxUsers: 10, maxAnnouncements: 500 },
  ENTERPRISE: { maxResidents: null, maxUsers: null, maxAnnouncements: null },
};

/** `true` si aún hay cupo (o el límite es ilimitado). */
export function isWithinLimit(current: number, limit: number | null): boolean {
  return limit === null || current < limit;
}
