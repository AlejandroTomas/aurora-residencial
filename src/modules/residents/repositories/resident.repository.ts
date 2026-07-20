import "server-only";
import { createSupabaseServerClient } from "@/core/supabase";
import { toRange, type PaginationParams } from "@/core/types";

// Trae la ubicación anidada en una sola consulta. El tipado de selects anidados se fija
// con `.returns<T>()` (los tipos generados a mano no describen las relaciones para el parser).
const RESIDENT_SELECT =
  "id, full_name, email, phone, is_active, lot_id, lots(number, blocks(name, streets(name, stages(name))))";

export interface ResidentRaw {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  lot_id: string;
  lots: {
    number: string;
    blocks: {
      name: string;
      streets: { name: string; stages: { name: string } | null } | null;
    } | null;
  } | null;
}

interface ResidentWritePayload {
  lotId: string;
  fullName: string;
  email?: string;
  phone?: string;
}

export const residentRepository = {
  async listByTenant(
    tenantId: string,
    pagination: PaginationParams,
    search?: string,
  ): Promise<{ rows: ResidentRaw[]; total: number }> {
    const supabase = await createSupabaseServerClient();
    const { from, to } = toRange(pagination);

    let query = supabase
      .from("residents")
      .select(RESIDENT_SELECT, { count: "exact" })
      .eq("tenant_id", tenantId)
      .is("deleted_at", null);

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error, count } = await query
      .order("full_name", { ascending: true })
      .range(from, to)
      .returns<ResidentRaw[]>();

    if (error) throw error;
    return { rows: data ?? [], total: count ?? 0 };
  },

  async findById(tenantId: string, id: string): Promise<ResidentRaw | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("residents")
      .select(RESIDENT_SELECT)
      .eq("tenant_id", tenantId)
      .eq("id", id)
      .is("deleted_at", null)
      .limit(1)
      .returns<ResidentRaw[]>();
    if (error) throw error;
    return data?.[0] ?? null;
  },

  async existsActiveDuplicate(
    tenantId: string,
    lotId: string,
    fullName: string,
    excludeId?: string,
  ): Promise<boolean> {
    const supabase = await createSupabaseServerClient();
    let query = supabase
      .from("residents")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("lot_id", lotId)
      .ilike("full_name", fullName)
      .eq("is_active", true)
      .is("deleted_at", null);

    if (excludeId) query = query.neq("id", excludeId);

    const { count, error } = await query;
    if (error) throw error;
    return (count ?? 0) > 0;
  },

  async insert(
    tenantId: string,
    payload: ResidentWritePayload,
    actorId: string,
  ): Promise<string> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("residents")
      .insert({
        tenant_id: tenantId,
        lot_id: payload.lotId,
        full_name: payload.fullName,
        email: payload.email || null,
        phone: payload.phone || null,
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
    payload: ResidentWritePayload,
    actorId: string,
  ): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("residents")
      .update({
        lot_id: payload.lotId,
        full_name: payload.fullName,
        email: payload.email || null,
        phone: payload.phone || null,
        updated_by: actorId,
      })
      .eq("tenant_id", tenantId)
      .eq("id", id)
      .is("deleted_at", null);
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
      .from("residents")
      .update({ is_active: isActive, updated_by: actorId })
      .eq("tenant_id", tenantId)
      .eq("id", id)
      .is("deleted_at", null);
    if (error) throw error;
  },
};
