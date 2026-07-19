import "server-only";
import { createClient } from "@supabase/supabase-js";
import { serverEnv } from "@/core/env/server";
import type { Database } from "./types";

/**
 * Bypasa RLS. Solo para Server Actions/Services que lo requieran
 * explícitamente (ej. operaciones administrativas entre tenants).
 * Nunca importar desde un componente ni exponer al cliente.
 */
export function createSupabaseServiceRoleClient() {
  return createClient<Database>(
    serverEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
