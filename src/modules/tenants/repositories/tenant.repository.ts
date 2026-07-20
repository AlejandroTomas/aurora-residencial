import "server-only";
import { createSupabaseServerClient } from "@/core/supabase";
import type { Database } from "@/core/supabase";

type TenantRow = Database["public"]["Tables"]["tenants"]["Row"];
type TenantUpdate = Database["public"]["Tables"]["tenants"]["Update"];

// Solo las columnas que el mapper necesita (security.md: "Nunca SELECT *").
const TENANT_COLUMNS = "id, name, slug, is_active";
export type TenantRecord = Pick<
  TenantRow,
  "id" | "name" | "slug" | "is_active"
>;

export const tenantRepository = {
  async findById(id: string): Promise<TenantRecord | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("tenants")
      .select(TENANT_COLUMNS)
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async update(id: string, patch: TenantUpdate): Promise<TenantRecord> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("tenants")
      .update(patch)
      .eq("id", id)
      .is("deleted_at", null)
      .select(TENANT_COLUMNS)
      .single();
    if (error) throw error;
    return data;
  },
};
