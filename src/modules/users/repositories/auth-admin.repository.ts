import "server-only";
import { createSupabaseServiceRoleClient } from "@/core/supabase";

/**
 * Operaciones administrativas de Supabase Auth (crear/invitar/eliminar usuarios).
 * Requieren service-role, por eso viven aisladas aquí y nunca se exponen al cliente.
 */
export const authAdminRepository = {
  async inviteByEmail(email: string, redirectTo: string) {
    const supabase = createSupabaseServiceRoleClient();
    return supabase.auth.admin.inviteUserByEmail(email, { redirectTo });
  },

  /** Compensación: si el alta del perfil falla tras crear el usuario de Auth. */
  async deleteUser(userId: string) {
    const supabase = createSupabaseServiceRoleClient();
    return supabase.auth.admin.deleteUser(userId);
  },
};
