import "server-only";
import { recordAudit } from "@/core/services";
import { slugify } from "@/core/utils";
import { logger } from "@/core/logger";
import type { AuthSession } from "@/modules/auth/server";
import { platformTenantRepository, provisioningRepository } from "../repositories";
import { toPlatformTenantDto } from "../mappers";
import {
  PlatformTenantNotFoundError,
  TenantAdminExistsError,
  TenantSlugTakenError,
  ProvisioningError,
} from "../errors";
import type { ProvisionTenantInput } from "../schemas";
import type { PlatformTenantDto } from "../types";

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
 * inicial invitado). Si algún paso posterior a crear el tenant falla, se compensa
 * eliminando lo creado para no dejar recursos huérfanos.
 */
export async function provisionTenant(
  session: AuthSession,
  input: ProvisionTenantInput,
  inviteRedirectTo: string,
): Promise<PlatformTenantDto> {
  const slug = await resolveUniqueSlug(input.tenantName);

  const tenantId = await provisioningRepository.createTenant({
    name: input.tenantName,
    slug,
    actorId: session.userId,
  });

  let invitedUserId: string | null = null;
  try {
    await provisioningRepository.createSettings(tenantId, session.userId);

    const invite = await provisioningRepository.inviteAdmin(
      input.adminEmail,
      inviteRedirectTo,
    );
    if (!invite.userId) {
      logger.warn("Fallo al invitar admin del tenant", {
        tenantId,
        error: invite.error,
      });
      if (invite.error && /registered|already|exists/i.test(invite.error)) {
        throw new TenantAdminExistsError();
      }
      throw new ProvisioningError();
    }
    invitedUserId = invite.userId;

    await provisioningRepository.createAdminProfile({
      userId: invitedUserId,
      tenantId,
      email: input.adminEmail,
      fullName: input.adminFullName,
    });
  } catch (error) {
    if (invitedUserId) {
      await provisioningRepository.deleteAuthUser(invitedUserId);
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

  const record = await platformTenantRepository.findById(tenantId);
  if (!record) throw new PlatformTenantNotFoundError();
  return toPlatformTenantDto(record);
}
