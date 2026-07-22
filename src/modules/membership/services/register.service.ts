import "server-only";
import { logger } from "@/core/logger";
import { phoneToAuthEmail } from "@/core/utils";
import { publicRegistrationRepository } from "../repositories";
import {
  PhoneTakenError,
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
 * Caso de uso: registro autoservicio de un residente con **teléfono + contraseña** (sin
 * correo). Se deriva un correo sintético interno del teléfono para Supabase Auth y se crea
 * la cuenta ya confirmada (sin validación). Crea el perfil RESIDENT y una solicitud
 * PENDIENTE; NUNCA asocia el lote automáticamente. Compensa si algún paso falla.
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

  const authEmail = phoneToAuthEmail(input.phone);

  const { userId, error } = await publicRegistrationRepository.createAuthUser(
    authEmail,
    input.password,
  );
  if (!userId) {
    logger.warn("Fallo al crear la cuenta del residente", {
      error,
    });
    if (error && /registered|already|exists/i.test(error)) {
      throw new PhoneTakenError();
    }
    throw new RegistrationError();
  }

  try {
    await publicRegistrationRepository.createProfile({
      userId,
      tenantId: tenant.id,
      email: authEmail,
      fullName: input.fullName,
    });
    await publicRegistrationRepository.createRequest({
      tenantId: tenant.id,
      profileId: userId,
      lotId: input.lotId,
      fullName: input.fullName,
      email: authEmail,
      phone: input.phone,
    });
  } catch (registrationError) {
    await publicRegistrationRepository.deleteAuthUser(userId);
    if (isUniqueViolation(registrationError)) throw new PhoneTakenError();
    throw registrationError;
  }
}
