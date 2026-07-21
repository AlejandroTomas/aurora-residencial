import "server-only";
import { recordAudit } from "@/core/services";
import { ValidationError, PlanLimitExceededError } from "@/core/errors";
import { PLAN_LIMITS, isWithinLimit } from "@/core/config";
import { logger } from "@/core/logger";
import type { AuthSession } from "@/modules/auth/server";
import { getTenantPlan } from "@/modules/tenants/server";
import { authAdminRepository, userRepository } from "../repositories";
import { toUserDto } from "../mappers";
import { UserAlreadyExistsError } from "../errors";
import type { InviteUserInput } from "../schemas";
import type { UserDto } from "../types";

function looksLikeExistingUser(message: string): boolean {
  return /registered|already|exists|duplicate/i.test(message);
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  );
}

/**
 * Caso de uso: invitar a un usuario. Crea la cuenta en Supabase Auth (envía correo de
 * invitación) y su perfil en el tenant. Si el alta del perfil falla, se compensa
 * eliminando la cuenta de Auth para no dejar usuarios huérfanos.
 */
export async function inviteUser(
  session: AuthSession,
  input: InviteUserInput,
  redirectTo: string,
): Promise<UserDto> {
  const limit = PLAN_LIMITS[await getTenantPlan(session)].maxUsers;
  if (limit !== null) {
    const current = await userRepository.countActive(session.tenantId);
    if (!isWithinLimit(current, limit)) {
      throw new PlanLimitExceededError(
        `Tu plan permite hasta ${limit} usuarios. Actualiza el plan para invitar más.`,
      );
    }
  }

  const { data, error } = await authAdminRepository.inviteByEmail(
    input.email,
    redirectTo,
  );

  if (error || !data.user) {
    logger.warn("Fallo al invitar usuario", {
      email: input.email,
      error: error?.message,
    });
    if (error && looksLikeExistingUser(error.message)) {
      throw new UserAlreadyExistsError();
    }
    throw new ValidationError(
      "No se pudo enviar la invitación. Revisa el correo e intenta de nuevo.",
    );
  }

  const userId = data.user.id;

  try {
    const record = await userRepository.insertProfile({
      id: userId,
      tenantId: session.tenantId,
      email: input.email,
      fullName: input.fullName,
      role: input.role,
    });

    await recordAudit({
      tenantId: session.tenantId,
      userId: session.userId,
      action: "user.invited",
      tableName: "profiles",
      recordId: userId,
      newData: { email: input.email, role: input.role },
    });

    return toUserDto(record);
  } catch (insertError) {
    await authAdminRepository.deleteUser(userId);
    if (isUniqueViolation(insertError)) {
      throw new UserAlreadyExistsError();
    }
    throw insertError;
  }
}
