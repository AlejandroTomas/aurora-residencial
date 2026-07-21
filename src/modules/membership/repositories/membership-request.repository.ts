import "server-only";
import { createSupabaseServerClient } from "@/core/supabase";
import type { MembershipRequestStatus } from "@/core/supabase";

const REQUEST_SELECT =
  "id, profile_id, full_name, email, phone, lot_id, status, admin_comment, created_at, lots(number, blocks(name, streets(name, stages(name))))";

export interface RequestRaw {
  id: string;
  profile_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  lot_id: string;
  status: MembershipRequestStatus;
  admin_comment: string | null;
  created_at: string;
  lots: {
    number: string;
    blocks: {
      name: string;
      streets: { name: string; stages: { name: string } | null } | null;
    } | null;
  } | null;
}

export const membershipRequestRepository = {
  async listPending(tenantId: string): Promise<RequestRaw[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("membership_requests")
      .select(REQUEST_SELECT)
      .eq("tenant_id", tenantId)
      .eq("status", "PENDING")
      .order("created_at", { ascending: true })
      .returns<RequestRaw[]>();
    if (error) throw error;
    return data ?? [];
  },

  async findById(tenantId: string, id: string): Promise<RequestRaw | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("membership_requests")
      .select(REQUEST_SELECT)
      .eq("tenant_id", tenantId)
      .eq("id", id)
      .limit(1)
      .returns<RequestRaw[]>();
    if (error) throw error;
    return data?.[0] ?? null;
  },

  async markReviewed(
    tenantId: string,
    id: string,
    status: MembershipRequestStatus,
    comment: string | null,
    reviewerId: string,
  ): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("membership_requests")
      .update({
        status,
        admin_comment: comment,
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewerId,
      })
      .eq("tenant_id", tenantId)
      .eq("id", id);
    if (error) throw error;
  },

  async findLatestByProfile(
    tenantId: string,
    profileId: string,
  ): Promise<{ status: MembershipRequestStatus; admin_comment: string | null } | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("membership_requests")
      .select("status, admin_comment")
      .eq("tenant_id", tenantId)
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async residentLinked(tenantId: string, profileId: string): Promise<boolean> {
    const supabase = await createSupabaseServerClient();
    const { count, error } = await supabase
      .from("residents")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("profile_id", profileId)
      .is("deleted_at", null);
    if (error) throw error;
    return (count ?? 0) > 0;
  },
};
