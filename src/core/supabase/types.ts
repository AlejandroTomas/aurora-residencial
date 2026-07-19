/**
 * Tipos de la base de datos.
 *
 * IDEALMENTE este archivo se genera con el CLI de Supabase y no se escribe a mano:
 *   supabase gen types typescript --project-id <id> > supabase/types/database.types.ts
 * y aquí se reexporta. Mientras tanto se mantiene tipado a mano SOLO para las tablas
 * y enums que el código ya consume, para no usar `any` (CLAUDE.md) ni bloquear el avance.
 *
 * Al generar el archivo real, reemplazar este contenido por el reexport de la salida del CLI.
 */

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "GUARD" | "RESIDENT";
export type LotStatus =
  | "DISPONIBLE"
  | "HABITADO"
  | "RENTADO"
  | "EN_CONSTRUCCION"
  | "SUSPENDIDO";

interface ProfilesTable {
  Row: {
    id: string;
    tenant_id: string;
    email: string;
    full_name: string;
    phone: string | null;
    role: UserRole;
    avatar_url: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id: string;
    tenant_id: string;
    email: string;
    full_name: string;
    phone?: string | null;
    role?: UserRole;
    avatar_url?: string | null;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
  };
  Update: Partial<ProfilesTable["Insert"]>;
  Relationships: [];
}

export type Database = {
  public: {
    Tables: {
      profiles: ProfilesTable;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      lot_status: LotStatus;
    };
  };
};
