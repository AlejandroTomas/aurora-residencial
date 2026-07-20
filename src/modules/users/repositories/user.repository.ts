import "server-only";
import {
  createSupabaseServerClient,
  createSupabaseServiceRoleClient,
} from "@/core/supabase";
import type { Database, UserRole } from "@/core/supabase";
import { toRange, type PaginationParams } from "@/core/types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

const USER_COLUMNS = "id, email, full_name, phone, role, is_active";
export type UserRecord = Pick<
  ProfileRow,
  "id" | "email" | "full_name" | "phone" | "role" | "is_active"
>;

const ADMIN_ROLES: UserRole[] = ["ADMIN", "SUPER_ADMIN"];

export const userRepository = {
  async listByTenant(
    tenantId: string,
    pagination: PaginationParams,
    search?: string,
  ): Promise<{ rows: UserRecord[]; total: number }> {
    const supabase = await createSupabaseServerClient();
    const { from, to } = toRange(pagination);

    let query = supabase
      .from("profiles")
      .select(USER_COLUMNS, { count: "exact" })
      .eq("tenant_id", tenantId);

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error, count } = await query
      .order("full_name", { ascending: true })
      .range(from, to);

    if (error) throw error;
    return { rows: data ?? [], total: count ?? 0 };
  },

  async findById(tenantId: string, id: string): Promise<UserRecord | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("profiles")
      .select(USER_COLUMNS)
      .eq("tenant_id", tenantId)
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async countActiveAdmins(tenantId: string): Promise<number> {
    const supabase = await createSupabaseServerClient();
    const { count, error } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("is_active", true)
      .in("role", ADMIN_ROLES);
    if (error) throw error;
    return count ?? 0;
  },

  /**
   * Alta del perfil tras invitar al usuario. Usa service-role porque RLS no permite
   * INSERT en `profiles` a `authenticated` (el alta es un flujo administrado).
   */
  async insertProfile(input: {
    id: string;
    tenantId: string;
    email: string;
    fullName: string;
    role: UserRole;
  }): Promise<UserRecord> {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        id: input.id,
        tenant_id: input.tenantId,
        email: input.email,
        full_name: input.fullName,
        role: input.role,
      })
      .select(USER_COLUMNS)
      .single();
    if (error) throw error;
    return data;
  },

  async updateRole(
    tenantId: string,
    id: string,
    role: UserRole,
  ): Promise<UserRecord> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("tenant_id", tenantId)
      .eq("id", id)
      .select(USER_COLUMNS)
      .single();
    if (error) throw error;
    return data;
  },

  async setActive(
    tenantId: string,
    id: string,
    isActive: boolean,
  ): Promise<UserRecord> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("profiles")
      .update({ is_active: isActive })
      .eq("tenant_id", tenantId)
      .eq("id", id)
      .select(USER_COLUMNS)
      .single();
    if (error) throw error;
    return data;
  },
};
