import "server-only";
import { logger } from "@/core/logger";
import { publicRegistrationRepository } from "../repositories";
import {
  EmailTakenError,
  RegistrationError,
  TenantNotAvailableError,
} from "../errors";
import type { RegisterInput } from "../schemas";

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  );
}

/**
 * Caso de uso: registro autoservicio de un residente. Crea su cuenta (ya confirmada), su
 * perfil RESIDENT y una solicitud de asociación PENDIENTE al lote elegido. NUNCA lo asocia
 * automáticamente: un administrador debe aprobar la solicitud.
 *
 * Es un flujo público (sin sesión), por eso todo va con service-role acotado al tenant del
 * slug. Compensa borrando la cuenta si el alta del perfil/solicitud falla.
 */
export async function register(input: RegisterInput): Promise<void> {
  const tenant = await publicRegistrationRepository.findActiveTenantBySlug(
    input.slug,
  );
  if (!tenant) throw new TenantNotAvailableError();

  const lotOk = await publicRegistrationRepository.lotBelongsToTenant(
    tenant.id,
    input.lotId,
  );
  if (!lotOk) throw new RegistrationError("El lote seleccionado no es válido.");

  const { userId, error } = await publicRegistrationRepository.createAuthUser(
    input.email,
    input.password,
  );
  if (!userId) {
    if (error && /registered|already|exists/i.test(error)) {
      throw new EmailTakenError();
    }
    logger.warn("Fallo al crear la cuenta del residente", { error });
    throw new RegistrationError();
  }

  try {
    await publicRegistrationRepository.createProfile({
      userId,
      tenantId: tenant.id,
      email: input.email,
      fullName: input.fullName,
    });
    await publicRegistrationRepository.createRequest({
      tenantId: tenant.id,
      profileId: userId,
      lotId: input.lotId,
      fullName: input.fullName,
      email: input.email,
      phone: input.phone || null,
    });
  } catch (registrationError) {
    await publicRegistrationRepository.deleteAuthUser(userId);
    if (isUniqueViolation(registrationError)) throw new EmailTakenError();
    throw registrationError;
  }
}
