import "server-only";
import { createSupabaseServerClient } from "@/core/supabase";
import type { Database } from "@/core/supabase";

type StreetRow = Database["public"]["Tables"]["streets"]["Row"];
const COLUMNS = "id, name, stage_id, is_active";
export type StreetRecord = Pick<
  StreetRow,
  "id" | "name" | "stage_id" | "is_active"
>;

export const streetRepository = {
  async listByStage(
    tenantId: string,
    stageId: string,
  ): Promise<StreetRecord[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("streets")
      .select(COLUMNS)
      .eq("tenant_id", tenantId)
      .eq("stage_id", stageId)
      .is("deleted_at", null)
      .order("name", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },

  async findById(tenantId: string, id: string): Promise<StreetRecord | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("streets")
      .select(COLUMNS)
      .eq("tenant_id", tenantId)
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async insert(
    tenantId: string,
    stageId: string,
    name: string,
    actorId: string,
  ): Promise<string> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("streets")
      .insert({
        tenant_id: tenantId,
        stage_id: stageId,
        name,
        created_by: actorId,
        updated_by: actorId,
      })
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
      .from("streets")
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
      .from("streets")
      .update({ is_active: isActive, updated_by: actorId })
      .eq("tenant_id", tenantId)
      .eq("id", id);
    if (error) throw error;
  },
};
