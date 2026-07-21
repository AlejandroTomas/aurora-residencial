/**
 * Tipos de la base de datos.
 *
 * IDEALMENTE este archivo se genera con el CLI de Supabase y no se escribe a mano:
 *   supabase gen types typescript --project-id <id> > supabase/types/database.types.ts
 * y aquí se reexporta. Mientras tanto se mantiene tipado a mano, fiel a las migraciones
 * (`supabase/migrations/*`), para no usar `any` (CLAUDE.md) ni bloquear el avance.
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
export type SubscriptionPlan = "BASICO" | "PROFESIONAL" | "ENTERPRISE";

// Columnas de auditoría presentes en toda "tabla de negocio" (soft delete incluido).
// DEBE ser `type` (no `interface`): un `interface` no recibe firma de índice implícita,
// así que `{...} & AuditColumns` no sería asignable a `Record<string, unknown>` y rompería
// el constraint `GenericSchema` de supabase-js (Schema colapsaría a `never` en los inserts).
type AuditColumns = {
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  deleted_at: string | null;
  deleted_by: string | null;
};

type AuditInsert = Partial<AuditColumns>;

interface TenantsTable {
  Row: {
    id: string;
    name: string;
    slug: string;
    is_active: boolean;
    plan: SubscriptionPlan;
  } & AuditColumns;
  Insert: {
    id?: string;
    name: string;
    slug: string;
    is_active?: boolean;
    plan?: SubscriptionPlan;
  } & AuditInsert;
  Update: Partial<TenantsTable["Insert"]>;
  Relationships: [];
}

interface TenantSettingsTable {
  Row: {
    tenant_id: string;
    logo_url: string | null;
    contact_phone: string | null;
    contact_email: string | null;
    primary_color: string | null;
    timezone: string;
    language: string;
    updated_at: string;
    updated_by: string | null;
  };
  Insert: {
    tenant_id: string;
    logo_url?: string | null;
    contact_phone?: string | null;
    contact_email?: string | null;
    primary_color?: string | null;
    timezone?: string;
    language?: string;
    updated_at?: string;
    updated_by?: string | null;
  };
  Update: Partial<TenantSettingsTable["Insert"]>;
  Relationships: [];
}

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

interface StagesTable {
  Row: {
    id: string;
    tenant_id: string;
    name: string;
    is_active: boolean;
  } & AuditColumns;
  Insert: {
    id?: string;
    tenant_id: string;
    name: string;
    is_active?: boolean;
  } & AuditInsert;
  Update: Partial<StagesTable["Insert"]>;
  Relationships: [];
}

interface StreetsTable {
  Row: {
    id: string;
    tenant_id: string;
    stage_id: string;
    name: string;
    is_active: boolean;
  } & AuditColumns;
  Insert: {
    id?: string;
    tenant_id: string;
    stage_id: string;
    name: string;
    is_active?: boolean;
  } & AuditInsert;
  Update: Partial<StreetsTable["Insert"]>;
  Relationships: [];
}

interface BlocksTable {
  Row: {
    id: string;
    tenant_id: string;
    street_id: string;
    name: string;
    is_active: boolean;
  } & AuditColumns;
  Insert: {
    id?: string;
    tenant_id: string;
    street_id: string;
    name: string;
    is_active?: boolean;
  } & AuditInsert;
  Update: Partial<BlocksTable["Insert"]>;
  Relationships: [];
}

interface LotsTable {
  Row: {
    id: string;
    tenant_id: string;
    block_id: string;
    number: string;
    area: number | null;
    observations: string | null;
    status: LotStatus;
    is_active: boolean;
  } & AuditColumns;
  Insert: {
    id?: string;
    tenant_id: string;
    block_id: string;
    number: string;
    area?: number | null;
    observations?: string | null;
    status?: LotStatus;
    is_active?: boolean;
  } & AuditInsert;
  Update: Partial<LotsTable["Insert"]>;
  Relationships: [];
}

interface ResidentsTable {
  Row: {
    id: string;
    tenant_id: string;
    lot_id: string;
    profile_id: string | null;
    full_name: string;
    email: string | null;
    phone: string | null;
    is_active: boolean;
  } & AuditColumns;
  Insert: {
    id?: string;
    tenant_id: string;
    lot_id: string;
    profile_id?: string | null;
    full_name: string;
    email?: string | null;
    phone?: string | null;
    is_active?: boolean;
  } & AuditInsert;
  Update: Partial<ResidentsTable["Insert"]>;
  Relationships: [];
}

interface AnnouncementsTable {
  Row: {
    id: string;
    tenant_id: string;
    title: string;
    body: string;
    published_at: string | null;
    is_active: boolean;
  } & AuditColumns;
  Insert: {
    id?: string;
    tenant_id: string;
    title: string;
    body: string;
    published_at?: string | null;
    is_active?: boolean;
  } & AuditInsert;
  Update: Partial<AnnouncementsTable["Insert"]>;
  Relationships: [];
}

interface AnnouncementReadsTable {
  Row: {
    id: string;
    tenant_id: string;
    announcement_id: string;
    resident_id: string;
    read_at: string;
  };
  Insert: {
    id?: string;
    tenant_id: string;
    announcement_id: string;
    resident_id: string;
    read_at?: string;
  };
  Update: Partial<AnnouncementReadsTable["Insert"]>;
  Relationships: [];
}

interface DocumentsTable {
  Row: {
    id: string;
    tenant_id: string;
    storage_path: string;
    original_filename: string;
    mime_type: string;
    size_bytes: number;
    is_active: boolean;
  } & AuditColumns;
  Insert: {
    id?: string;
    tenant_id: string;
    storage_path: string;
    original_filename: string;
    mime_type: string;
    size_bytes: number;
    is_active?: boolean;
  } & AuditInsert;
  Update: Partial<DocumentsTable["Insert"]>;
  Relationships: [];
}

interface AnnouncementDocumentsTable {
  Row: {
    announcement_id: string;
    document_id: string;
    tenant_id: string;
    created_at: string;
  };
  Insert: {
    announcement_id: string;
    document_id: string;
    tenant_id: string;
    created_at?: string;
  };
  Update: Partial<AnnouncementDocumentsTable["Insert"]>;
  Relationships: [];
}

interface AuditLogTable {
  Row: {
    id: string;
    tenant_id: string;
    user_id: string | null;
    action: string;
    table_name: string;
    record_id: string | null;
    old_data: Record<string, unknown> | null;
    new_data: Record<string, unknown> | null;
    ip: string | null;
    user_agent: string | null;
    created_at: string;
  };
  Insert: {
    id?: string;
    tenant_id: string;
    user_id?: string | null;
    action: string;
    table_name: string;
    record_id?: string | null;
    old_data?: Record<string, unknown> | null;
    new_data?: Record<string, unknown> | null;
    ip?: string | null;
    user_agent?: string | null;
    created_at?: string;
  };
  Update: Partial<AuditLogTable["Insert"]>;
  Relationships: [];
}

export type Database = {
  public: {
    Tables: {
      tenants: TenantsTable;
      tenant_settings: TenantSettingsTable;
      profiles: ProfilesTable;
      stages: StagesTable;
      streets: StreetsTable;
      blocks: BlocksTable;
      lots: LotsTable;
      residents: ResidentsTable;
      announcements: AnnouncementsTable;
      announcement_reads: AnnouncementReadsTable;
      documents: DocumentsTable;
      announcement_documents: AnnouncementDocumentsTable;
      audit_log: AuditLogTable;
    };
    // Forma vacía sin firma de índice (igual que `supabase gen types`). NO usar
    // `Record<string, never>`: su índice `[k: string]: never` hace que supabase-js,
    // al intersectar `Tables & Views`, colapse toda tabla a `never` en los inserts.
    Views: { [_ in never]: never };
    Functions: {
      current_tenant_id: {
        Args: Record<string, never>;
        Returns: string;
      };
      current_user_role: {
        Args: Record<string, never>;
        Returns: UserRole;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      lot_status: LotStatus;
      subscription_plan: SubscriptionPlan;
    };
    CompositeTypes: { [_ in never]: never };
  };
};
