import "server-only";
import { createSupabaseServerClient } from "@/core/supabase";

/**
 * Lecturas de comunicados. `announcement_reads` es un evento inmutable; el registro se
 * hace de forma idempotente (upsert que ignora duplicados) porque marcar leído dos veces
 * no debe fallar ni duplicar.
 */
export const readRepository = {
  async findResidentIdByProfile(
    tenantId: string,
    profileId: string,
  ): Promise<string | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("residents")
      .select("id")
      .eq("tenant_id", tenantId)
      .eq("profile_id", profileId)
      .eq("is_active", true)
      .is("deleted_at", null)
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data?.id ?? null;
  },

  async getReadAnnouncementIds(
    tenantId: string,
    residentId: string,
  ): Promise<string[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("announcement_reads")
      .select("announcement_id")
      .eq("tenant_id", tenantId)
      .eq("resident_id", residentId);
    if (error) throw error;
    return (data ?? []).map((row) => row.announcement_id);
  },

  async markRead(
    tenantId: string,
    announcementId: string,
    residentId: string,
  ): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("announcement_reads").upsert(
      {
        tenant_id: tenantId,
        announcement_id: announcementId,
        resident_id: residentId,
      },
      { onConflict: "announcement_id,resident_id", ignoreDuplicates: true },
    );
    if (error) throw error;
  },
};
