import "server-only";
import { logger } from "@/core/logger";
import { recordAudit } from "@/core/services";
import { phoneToAuthEmail } from "@/core/utils";
import { authRepository, profileRepository } from "../repositories";
import { toAuthSession } from "../mappers";
import { InvalidCredentialsError, SessionError } from "../errors";
import type { LoginInput } from "../schemas";
import type { AuthSession } from "../types";

/**
 * Caso de uso: iniciar sesión.
 *
 * Regla de negocio: no basta con que Supabase Auth acepte las credenciales; la cuenta
 * debe tener un perfil activo. Si autentica pero no tiene perfil válido, se cierra la
 * sesión inmediatamente para no dejar cookies de una cuenta inutilizable.
 */
export async function loginService(input: LoginInput): Promise<AuthSession> {
  // Un correo (contiene "@") se usa tal cual; un teléfono se convierte al correo sintético.
  const authEmail = input.identifier.includes("@")
    ? input.identifier.toLowerCase()
    : phoneToAuthEmail(input.identifier);

  const { data, error } = await authRepository.signInWithPassword(
    authEmail,
    input.password,
  );

  if (error || !data.user) {
    logger.info("Intento de login fallido", { identifier: input.identifier });
    throw new InvalidCredentialsError();
  }

  const profile = await profileRepository.findById(data.user.id);

  if (!profile || !profile.is_active) {
    await authRepository.signOut();
    logger.warn("Login de cuenta sin perfil activo", { userId: data.user.id });
    throw new SessionError();
  }

  logger.info("Login exitoso", {
    userId: profile.id,
    tenantId: profile.tenant_id,
  });
  await recordAudit({
    tenantId: profile.tenant_id,
    userId: profile.id,
    action: "auth.login",
    tableName: "profiles",
    recordId: profile.id,
    viaServiceRole: true,
  });
  return toAuthSession(profile);
}
