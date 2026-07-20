import "server-only";
import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/core/supabase";
import { logger } from "@/core/logger";

interface AuditInput {
  tenantId: string;
  userId: string;
  action: string; // dominio.evento, ej. "resident.created"
  tableName: string;
  recordId?: string | null;
  oldData?: Record<string, unknown> | null;
  newData?: Record<string, unknown> | null;
}

/**
 * Registra un evento en `audit_log` (security.md: Auditoría). Se llama desde los Services
 * de escritura, no desde un trigger, porque `ip`/`user_agent` solo existen en el contexto
 * de la request. Corre con el cliente del usuario: la policy de RLS exige `user_id = auth.uid()`.
 *
 * Un fallo de auditoría se registra pero NO interrumpe la operación de negocio ya realizada:
 * se prioriza no dejar al usuario a medias, y el error queda observable en logs.
 */
export async function recordAudit(input: AuditInput): Promise<void> {
  try {
    const headerList = await headers();
    const ip =
      headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const userAgent = headerList.get("user-agent");

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("audit_log").insert({
      tenant_id: input.tenantId,
      user_id: input.userId,
      action: input.action,
      table_name: input.tableName,
      record_id: input.recordId ?? null,
      old_data: input.oldData ?? null,
      new_data: input.newData ?? null,
      ip,
      user_agent: userAgent,
    });

    if (error) {
      logger.error("No se pudo registrar auditoría", {
        action: input.action,
        error: error.message,
      });
    }
  } catch (error) {
    logger.error("Excepción al registrar auditoría", {
      action: input.action,
      error: error instanceof Error ? error.message : "unknown",
    });
  }
}
