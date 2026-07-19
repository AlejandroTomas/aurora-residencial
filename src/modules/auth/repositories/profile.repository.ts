import "server-only";
import { createSupabaseServerClient } from "@/core/supabase";
import type { Database } from "@/core/supabase";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

/**
 * Lectura del perfil del usuario autenticado. Selecciona solo las columnas que la
 * sesión necesita (security.md: "Nunca SELECT *"). La consulta corre con el cliente
 * del usuario, así RLS (`profiles_select`) es la última línea de aislamiento.
 */
export type SessionProfile = Pick<
  ProfileRow,
  "id" | "tenant_id" | "email" | "full_name" | "role" | "is_active"
>;

export const profileRepository = {
  async findById(userId: string): Promise<SessionProfile | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, tenant_id, email, full_name, role, is_active")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },
};
