import "server-only";
import { createSupabaseServerClient } from "@/core/supabase";
import type { Database, LotStatus } from "@/core/supabase";

type LotRow = Database["public"]["Tables"]["lots"]["Row"];
const COLUMNS = "id, number, area, observations, status, block_id, is_active";
export type LotRecord = Pick<
  LotRow,
  "id" | "number" | "area" | "observations" | "status" | "block_id" | "is_active"
>;

interface LotWritePayload {
  number: string;
  area: number | null;
  observations: string | null;
  status: LotStatus;
}

export const lotRepository = {
  async listByBlock(tenantId: string, blockId: string): Promise<LotRecord[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("lots")
      .select(COLUMNS)
      .eq("tenant_id", tenantId)
      .eq("block_id", blockId)
      .is("deleted_at", null)
      .order("number", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },

  async insert(
    tenantId: string,
    blockId: string,
    payload: LotWritePayload,
    actorId: string,
  ): Promise<string> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("lots")
      .insert({
        tenant_id: tenantId,
        block_id: blockId,
        number: payload.number,
        area: payload.area,
        observations: payload.observations,
        status: payload.status,
        created_by: actorId,
        updated_by: actorId,
      })
      .select("id")
      .single();
    if (error) throw error;
    return data.id;
  },

  async update(
    tenantId: string,
    id: string,
    payload: LotWritePayload,
    actorId: string,
  ): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("lots")
      .update({
        number: payload.number,
        area: payload.area,
        observations: payload.observations,
        status: payload.status,
        updated_by: actorId,
      })
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
      .from("lots")
      .update({ is_active: isActive, updated_by: actorId })
      .eq("tenant_id", tenantId)
      .eq("id", id);
    if (error) throw error;
  },
};
