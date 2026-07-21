import "server-only";
import { randomUUID } from "crypto";
import { recordAudit } from "@/core/services";
import { validateUploadFile } from "@/core/storage";
import { storageRepository } from "@/core/storage/storage.repository";
import { logger } from "@/core/logger";
import type { AuthSession } from "@/modules/auth/server";
import { settingsRepository } from "../repositories/settings.repository";

/** URL firmada (vida corta) del logotipo del tenant para mostrarlo, o `null` si no hay. */
export async function getLogoUrl(session: AuthSession): Promise<string | null> {
  const path = await settingsRepository.findLogoPath(session.tenantId);
  if (!path) return null;
  try {
    return await storageRepository.createSignedUrl(path);
  } catch {
    return null;
  }
}

/**
 * Caso de uso: subir/reemplazar el logotipo (solo imágenes). Guarda la ruta en
 * `tenant_settings.logo_url` y elimina el logo anterior del Storage (best-effort).
 */
export async function uploadLogo(
  session: AuthSession,
  file: File,
): Promise<void> {
  const extension = validateUploadFile(
    { size: file.size, type: file.type },
    { imagesOnly: true },
  );

  const previousPath = await settingsRepository.findLogoPath(session.tenantId);
  const path = `${session.tenantId}/branding/${randomUUID()}.${extension}`;

  await storageRepository.upload(path, file);
  await settingsRepository.setLogoPath(session.tenantId, path, session.userId);

  if (previousPath) {
    try {
      await storageRepository.remove([previousPath]);
    } catch (error) {
      logger.warn("No se pudo eliminar el logotipo anterior", {
        error: error instanceof Error ? error.message : "unknown",
      });
    }
  }

  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: "settings.logo_updated",
    tableName: "tenant_settings",
    recordId: session.tenantId,
  });
}
