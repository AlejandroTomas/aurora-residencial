import "server-only";
import {
  createSupabaseServerClient,
  createSupabaseServiceRoleClient,
} from "@/core/supabase";
import type { Database } from "@/core/supabase";

type TenantRow = Database["public"]["Tables"]["tenants"]["Row"];

const COLUMNS = "id, name, slug, is_active, plan, created_at";
export type PlatformTenantRecord = Pick<
  TenantRow,
  "id" | "name" | "slug" | "is_active" | "plan" | "created_at"
>;

export const platformTenantRepository = {
  // Lecturas con el cliente del usuario: la policy `tenants_select_platform` permite al
  // SUPER_ADMIN ver todos los tenants (RLS como fuente de verdad).
  async listAll(): Promise<PlatformTenantRecord[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("tenants")
      .select(COLUMNS)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async findById(tenantId: string): Promise<PlatformTenantRecord | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("tenants")
      .select(COLUMNS)
      .eq("id", tenantId)
      .is("deleted_at", null)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async slugExists(slug: string): Promise<boolean> {
    const supabase = await createSupabaseServerClient();
    const { count, error } = await supabase
      .from("tenants")
      .select("id", { count: "exact", head: true })
      .eq("slug", slug)
      .is("deleted_at", null);
    if (error) throw error;
    return (count ?? 0) > 0;
  },

  // Escritura con service-role: activar/suspender un tenant es una operación de plataforma.
  async setActive(
    tenantId: string,
    isActive: boolean,
    actorId: string,
  ): Promise<void> {
    const supabase = createSupabaseServiceRoleClient();
    const { error } = await supabase
      .from("tenants")
      .update({ is_active: isActive, updated_by: actorId })
      .eq("id", tenantId);
    if (error) throw error;
  },
};
