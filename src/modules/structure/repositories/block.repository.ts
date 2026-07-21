import "server-only";
import { createSupabaseServerClient } from "@/core/supabase";
import type { Database } from "@/core/supabase";

type BlockRow = Database["public"]["Tables"]["blocks"]["Row"];
const COLUMNS = "id, name, street_id, is_active";
export type BlockRecord = Pick<
  BlockRow,
  "id" | "name" | "street_id" | "is_active"
>;

export const blockRepository = {
  async listByStreet(
    tenantId: string,
    streetId: string,
  ): Promise<BlockRecord[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("blocks")
      .select(COLUMNS)
      .eq("tenant_id", tenantId)
      .eq("street_id", streetId)
      .is("deleted_at", null)
      .order("name", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },

  async findById(tenantId: string, id: string): Promise<BlockRecord | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("blocks")
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
    streetId: string,
    name: string,
    actorId: string,
  ): Promise<string> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("blocks")
      .insert({
        tenant_id: tenantId,
        street_id: streetId,
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
      .from("blocks")
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
      .from("blocks")
      .update({ is_active: isActive, updated_by: actorId })
      .eq("tenant_id", tenantId)
      .eq("id", id);
    if (error) throw error;
  },
};
