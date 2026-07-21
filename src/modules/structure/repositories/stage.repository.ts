import "server-only";
import { createSupabaseServerClient } from "@/core/supabase";
import type { Database } from "@/core/supabase";

type StageRow = Database["public"]["Tables"]["stages"]["Row"];
const COLUMNS = "id, name, is_active";
export type StageRecord = Pick<StageRow, "id" | "name" | "is_active">;

export const stageRepository = {
  async listByTenant(tenantId: string): Promise<StageRecord[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("stages")
      .select(COLUMNS)
      .eq("tenant_id", tenantId)
      .is("deleted_at", null)
      .order("name", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },

  async findById(tenantId: string, id: string): Promise<StageRecord | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("stages")
      .select(COLUMNS)
      .eq("tenant_id", tenantId)
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async insert(tenantId: string, name: string, actorId: string): Promise<string> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("stages")
      .insert({ tenant_id: tenantId, name, created_by: actorId, updated_by: actorId })
      .select("id")
      .single();
    if (error) throw error;
    return data.id;
  },

  async rename(
    tenantId: string,
    id: string,
    name: string,
    actorId: string,
  ): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("stages")
      .update({ name, updated_by: actorId })
      .eq("tenant_id", tenantId)
      .eq("id", id);
    if (error) throw error;
  },

  async setActive(
    tenantId: string,
    id: string,
    isActive: boolean,
    actorId: string,
  ): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("stages")
      .update({ is_active: isActive, updated_by: actorId })
      .eq("tenant_id", tenantId)
      .eq("id", id);
    if (error) throw error;
  },
};
