import "server-only";
import {
  createSupabaseServerClient,
  createSupabaseServiceRoleClient,
} from "@/core/supabase";
import type { Database } from "@/core/supabase";

type SettingsRow = Database["public"]["Tables"]["tenant_settings"]["Row"];

const COLUMNS =
  "contact_phone, contact_email, website, address, city, state, postal_code, country, currency, primary_color, timezone, language";
export type SettingsRecord = Pick<
  SettingsRow,
  | "contact_phone"
  | "contact_email"
  | "website"
  | "address"
  | "city"
  | "state"
  | "postal_code"
  | "country"
  | "currency"
  | "primary_color"
  | "timezone"
  | "language"
>;

interface SettingsPatch {
  contact_phone: string | null;
  contact_email: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  currency: string;
  primary_color: string | null;
  timezone: string;
  language: string;
}

export const settingsRepository = {
  async findByTenant(tenantId: string): Promise<SettingsRecord | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("tenant_settings")
      .select(COLUMNS)
      .eq("tenant_id", tenantId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  /**
   * Upsert con service-role: la fila de configuración puede no existir todavía y RLS no
   * define INSERT para `tenant_settings` (solo SELECT/UPDATE). El scoping por tenant lo
   * garantiza el `tenant_id` de la sesión, y la Action ya verificó rol admin.
   */
  async upsert(
    tenantId: string,
    patch: SettingsPatch,
    actorId: string,
  ): Promise<void> {
    const supabase = createSupabaseServiceRoleClient();
    const { error } = await supabase
      .from("tenant_settings")
      .upsert(
        { tenant_id: tenantId, ...patch, updated_by: actorId },
        { onConflict: "tenant_id" },
      );
    if (error) throw error;
  },
};
