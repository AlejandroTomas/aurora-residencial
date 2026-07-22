import "server-only";
import { recordAudit } from "@/core/services";
import { slugify } from "@/core/utils";
import { logger } from "@/core/logger";
import type { AuthSession } from "@/modules/auth/server";
import { platformTenantRepository, provisioningRepository } from "../repositories";
import { generateTempPassword } from "../utils/generate-temp-password";
import {
  TenantAdminExistsError,
  TenantSlugTakenError,
  ProvisioningError,
} from "../errors";
import type { ProvisionTenantInput } from "../schemas";
import type { ProvisionResult } from "../types";

const MAX_SLUG_ATTEMPTS = 50;

async function resolveUniqueSlug(name: string): Promise<string> {
  const base = slugify(name) || "fraccionamiento";
  let candidate = base;
  let attempt = 1;
  while (await platformTenantRepository.slugExists(candidate)) {
    attempt += 1;
    if (attempt > MAX_SLUG_ATTEMPTS) throw new TenantSlugTakenError();
    candidate = `${base}-${attempt}`;
  }
  return candidate;
}

/**
 * Caso de uso: dar de alta un fraccionamiento completo (tenant + configuración + admin
 * inicial). El admin se crea con la cuenta **ya confirmada** y una contraseña temporal
 * generada, sin correo de verificación: las credenciales se devuelven para entregarlas.
 * Si algún paso falla se compensa eliminando lo creado.
 */
export async function provisionTenant(
  session: AuthSession,
  input: ProvisionTenantInput,
): Promise<ProvisionResult> {
  const slug = await resolveUniqueSlug(input.tenantName);

  const tenantId = await provisioningRepository.createTenant({
    name: input.tenantName,
    slug,
    actorId: session.userId,
  });

  const password = generateTempPassword();
  let createdUserId: string | null = null;
  try {
    await provisioningRepository.createSettings(tenantId, session.userId);

    const created = await provisioningRepository.createUserWithPassword(
      input.adminEmail,
      password,
    );
    if (!created.userId) {
      logger.warn("Fallo al crear la cuenta del admin", {
        tenantId,
        error: created.error,
      });
      if (created.error && /registered|already|exists/i.test(created.error)) {
        throw new TenantAdminExistsError();
      }
      throw new ProvisioningError();
    }
    createdUserId = created.userId;

    await provisioningRepository.createAdminProfile({
      userId: createdUserId,
      tenantId,
      email: input.adminEmail,
      fullName: input.adminFullName,
    });
  } catch (error) {
    if (createdUserId) {
      await provisioningRepository.deleteAuthUser(createdUserId);
    }
    await provisioningRepository.deleteTenant(tenantId);
    throw error;
  }

  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: "platform.tenant_provisioned",
    tableName: "tenants",
    recordId: tenantId,
    newData: { name: input.tenantName, slug, adminEmail: input.adminEmail },
  });

  return {
    tenantName: input.tenantName,
    adminEmail: input.adminEmail,
    adminPassword: password,
  };
}
