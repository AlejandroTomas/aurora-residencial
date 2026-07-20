import "server-only";
import { createSupabaseServerClient } from "@/core/supabase";
import type { Database } from "@/core/supabase";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

const COLUMNS = "id, email, full_name, phone, role, avatar_url";
export type ProfileRecord = Pick<
  ProfileRow,
  "id" | "email" | "full_name" | "phone" | "role" | "avatar_url"
>;

export const profileRepository = {
  async findById(id: string): Promise<ProfileRecord | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("profiles")
      .select(COLUMNS)
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async update(
    id: string,
    patch: { full_name: string; phone: string | null },
  ): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", id);
    if (error) throw error;
  },
};
