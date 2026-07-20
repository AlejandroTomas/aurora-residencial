import "server-only";
import { createSupabaseServerClient } from "@/core/supabase";
import type { LotStatus } from "@/core/supabase";

const LOT_SELECT =
  "id, number, status, blocks(name, streets(name, stages(name)))";

export interface LotRaw {
  id: string;
  number: string;
  status: LotStatus;
  blocks: {
    name: string;
    streets: { name: string; stages: { name: string } | null } | null;
  } | null;
}

export const lotRepository = {
  async listOptions(tenantId: string): Promise<LotRaw[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("lots")
      .select(LOT_SELECT)
      .eq("tenant_id", tenantId)
      .eq("is_active", true)
      .is("deleted_at", null)
      .order("number", { ascending: true })
      .returns<LotRaw[]>();
    if (error) throw error;
    return data ?? [];
  },

  async existsInTenant(tenantId: string, lotId: string): Promise<boolean> {
    const supabase = await createSupabaseServerClient();
    const { count, error } = await supabase
      .from("lots")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("id", lotId)
      .is("deleted_at", null);
    if (error) throw error;
    return (count ?? 0) > 0;
  },
};
