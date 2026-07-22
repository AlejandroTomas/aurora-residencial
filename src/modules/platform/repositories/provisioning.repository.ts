import "server-only";
import { createSupabaseServiceRoleClient } from "@/core/supabase";

/**
 * Alta de un fraccionamiento completo. Todo por service-role: crear un tenant, su
 * configuración, invitar al administrador en Auth y crear su perfil son operaciones que
 * RLS no permite a un usuario normal (son de nivel plataforma). Incluye compensaciones
 * para no dejar recursos huérfanos si un paso falla.
 */
export const provisioningRepository = {
  async createTenant(input: {
    name: string;
    slug: string;
    actorId: string;
  }): Promise<string> {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
      .from("tenants")
      .insert({
        name: input.name,
        slug: input.slug,
        created_by: input.actorId,
        updated_by: input.actorId,
      })
      .select("id")
      .single();
    if (error) throw error;
    return data.id;
  },

  async createSettings(tenantId: string, actorId: string): Promise<void> {
    const supabase = createSupabaseServiceRoleClient();
    const { error } = await supabase
      .from("tenant_settings")
      .insert({ tenant_id: tenantId, updated_by: actorId });
    if (error) throw error;
  },

  /**
   * Crea la cuenta del admin ya confirmada, con una contraseña temporal. No envía correo:
   * las credenciales se entregan a quien provisiona (ver `provisionTenant`).
   */
  async createUserWithPassword(
    email: string,
    password: string,
  ): Promise<{ userId: string | null; error: string | null }> {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    return { userId: data.user?.id ?? null, error: error?.message ?? null };
  },

  async createAdminProfile(input: {
    userId: string;
    tenantId: string;
    email: string;
    fullName: string;
  }): Promise<void> {
    const supabase = createSupabaseServiceRoleClient();
    const { error } = await supabase.from("profiles").insert({
      id: input.userId,
      tenant_id: input.tenantId,
      email: input.email,
      full_name: input.fullName,
      role: "ADMIN",
    });
    if (error) throw error;
  },

  async deleteTenant(tenantId: string): Promise<void> {
    const supabase = createSupabaseServiceRoleClient();
    await supabase.from("tenant_settings").delete().eq("tenant_id", tenantId);
    await supabase.from("tenants").delete().eq("id", tenantId);
  },

  async deleteAuthUser(userId: string): Promise<void> {
    const supabase = createSupabaseServiceRoleClient();
    await supabase.auth.admin.deleteUser(userId);
  },
};
