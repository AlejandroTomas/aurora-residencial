import "server-only";
import { logger } from "@/core/logger";
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
  const { data, error } = await authRepository.signInWithPassword(
    input.email,
    input.password,
  );

  if (error || !data.user) {
    logger.info("Intento de login fallido", { email: input.email });
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
  return toAuthSession(profile);
}
