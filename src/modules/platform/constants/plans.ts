import type { SubscriptionPlan } from "@/core/supabase";

export const SUBSCRIPTION_PLANS = [
  "BASICO",
  "PROFESIONAL",
  "ENTERPRISE",
] as const;

export const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  BASICO: "Básico",
  PROFESIONAL: "Profesional",
  ENTERPRISE: "Enterprise",
};
