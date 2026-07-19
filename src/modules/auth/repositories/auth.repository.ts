import "server-only";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/core/supabase";

/**
 * Único punto de contacto con Supabase Auth. No contiene reglas de negocio ni
 * validaciones (architecture.md): solo traduce llamadas al SDK. Los Services
 * interpretan el resultado y lanzan los errores tipados del dominio.
 */
export const authRepository = {
  async getUser(): Promise<User | null> {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },

  async signInWithPassword(email: string, password: string) {
    const supabase = await createSupabaseServerClient();
    return supabase.auth.signInWithPassword({ email, password });
  },

  async signOut() {
    const supabase = await createSupabaseServerClient();
    return supabase.auth.signOut();
  },

  async sendPasswordResetEmail(email: string, redirectTo: string) {
    const supabase = await createSupabaseServerClient();
    return supabase.auth.resetPasswordForEmail(email, { redirectTo });
  },

  async updatePassword(password: string) {
    const supabase = await createSupabaseServerClient();
    return supabase.auth.updateUser({ password });
  },
};
