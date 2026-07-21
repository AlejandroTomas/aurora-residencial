import "server-only";
import { createSupabaseServiceRoleClient } from "@/core/supabase";
import type { LotStatus } from "@/core/supabase";

// Registro público: el visitante no tiene sesión, así que estas lecturas/escrituras van por
// service-role, siempre acotadas al tenant identificado por el slug de la URL.
const LOT_SELECT =
  "id, number, status, blocks(name, streets(name, stages(name)))";

export interface RegistrationLotRaw {
  id: string;
  number: string;
  status: LotStatus;
  blocks: {
    name: string;
    streets: { name: string; stages: { name: string } | null } | null;
  } | null;
}

export const publicRegistrationRepository = {
  async findActiveTenantBySlug(
    slug: string,
  ): Promise<{ id: string; name: string } | null> {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
      .from("tenants")
      .select("id, name")
      .eq("slug", slug)
      .eq("is_active", true)
      .is("deleted_at", null)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async listLotOptions(tenantId: string): Promise<RegistrationLotRaw[]> {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
      .from("lots")
      .select(LOT_SELECT)
      .eq("tenant_id", tenantId)
      .eq("is_active", true)
      .is("deleted_at", null)
      .order("number", { ascending: true })
      .returns<RegistrationLotRaw[]>();
    if (error) throw error;
    return data ?? [];
  },

  async lotBelongsToTenant(tenantId: string, lotId: string): Promise<boolean> {
    const supabase = createSupabaseServiceRoleClient();
    const { count, error } = await supabase
      .from("lots")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("id", lotId)
      .is("deleted_at", null);
    if (error) throw error;
    return (count ?? 0) > 0;
  },

  async createAuthUser(
    email: string,
    password: string,
  ): Promise<{ userId: string | null; error: string | null }> {
    const supabase = createSupabaseServiceRoleClient();
    // email_confirm: true deja la cuenta lista para iniciar sesión (sin verificación por
    // correo por ahora; ver README del módulo para activarla más adelante).
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    return { userId: data.user?.id ?? null, error: error?.message ?? null };
  },

  async createProfile(input: {
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
      role: "RESIDENT",
    });
    if (error) throw error;
  },

  async createRequest(input: {
    tenantId: string;
    profileId: string;
    lotId: string;
    fullName: string;
    email: string;
    phone: string | null;
  }): Promise<void> {
    const supabase = createSupabaseServiceRoleClient();
    const { error } = await supabase.from("membership_requests").insert({
      tenant_id: input.tenantId,
      profile_id: input.profileId,
      lot_id: input.lotId,
      full_name: input.fullName,
      email: input.email,
      phone: input.phone,
    });
    if (error) throw error;
  },

  async deleteAuthUser(userId: string): Promise<void> {
    const supabase = createSupabaseServiceRoleClient();
    await supabase.auth.admin.deleteUser(userId);
  },
};
