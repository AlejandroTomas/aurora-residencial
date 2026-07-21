import "server-only";
import { createSupabaseServerClient } from "@/core/supabase";
import type { Database } from "@/core/supabase";
import { toRange, type PaginationParams } from "@/core/types";

type AnnouncementRow = Database["public"]["Tables"]["announcements"]["Row"];

const COLUMNS = "id, title, body, published_at, created_at";
export type AnnouncementRecord = Pick<
  AnnouncementRow,
  "id" | "title" | "body" | "published_at" | "created_at"
>;

export const announcementRepository = {
  /** Admin: todos los comunicados no eliminados (incluye borradores). */
  async listAll(
    tenantId: string,
    pagination: PaginationParams,
  ): Promise<{ rows: AnnouncementRecord[]; total: number }> {
    const supabase = await createSupabaseServerClient();
    const { from, to } = toRange(pagination);
    const { data, error, count } = await supabase
      .from("announcements")
      .select(COLUMNS, { count: "exact" })
      .eq("tenant_id", tenantId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .range(from, to);
    if (error) throw error;
    return { rows: data ?? [], total: count ?? 0 };
  },

  /** Lector: solo publicados. RLS igual lo restringe, esto es la consulta explícita. */
  async listPublished(
    tenantId: string,
    pagination: PaginationParams,
  ): Promise<{ rows: AnnouncementRecord[]; total: number }> {
    const supabase = await createSupabaseServerClient();
    const { from, to } = toRange(pagination);
    const { data, error, count } = await supabase
      .from("announcements")
      .select(COLUMNS, { count: "exact" })
      .eq("tenant_id", tenantId)
      .is("deleted_at", null)
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .range(from, to);
    if (error) throw error;
    return { rows: data ?? [], total: count ?? 0 };
  },

  async countActive(tenantId: string): Promise<number> {
    const supabase = await createSupabaseServerClient();
    const { count, error } = await supabase
      .from("announcements")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .is("deleted_at", null);
    if (error) throw error;
    return count ?? 0;
  },

  async findById(
    tenantId: string,
    id: string,
  ): Promise<AnnouncementRecord | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("announcements")
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
    payload: { title: string; body: string },
    actorId: string,
  ): Promise<string> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("announcements")
      .insert({
        tenant_id: tenantId,
        title: payload.title,
        body: payload.body,
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
    payload: { title: string; body: string },
    actorId: string,
  ): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("announcements")
      .update({ title: payload.title, body: payload.body, updated_by: actorId })
      .eq("tenant_id", tenantId)
      .eq("id", id)
      .is("deleted_at", null);
    if (error) throw error;
  },

  async setPublished(
    tenantId: string,
    id: string,
    publishedAt: string | null,
    actorId: string,
  ): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("announcements")
      .update({ published_at: publishedAt, updated_by: actorId })
      .eq("tenant_id", tenantId)
      .eq("id", id)
      .is("deleted_at", null);
    if (error) throw error;
  },
};
