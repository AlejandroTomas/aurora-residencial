import "server-only";
import { recordAudit } from "@/core/services";
import { isAdminRole } from "@/modules/auth/server";
import type { AuthSession } from "@/modules/auth/server";
import { userRepository } from "../repositories";
import { toUserDto } from "../mappers";
import {
  CannotModifySelfError,
  UserNotFoundError,
  LastAdminError,
} from "../errors";
import type { SetUserActiveInput } from "../schemas";
import type { UserDto } from "../types";

/**
 * Caso de uso: activar o desactivar un usuario. Reglas: no puedes desactivar tu propia
 * cuenta ni al último administrador activo.
 */
export async function setUserActive(
  session: AuthSession,
  input: SetUserActiveInput,
): Promise<UserDto> {
  if (input.userId === session.userId) {
    throw new CannotModifySelfError("No puedes desactivar tu propia cuenta.");
  }

  const target = await userRepository.findById(session.tenantId, input.userId);
  if (!target) throw new UserNotFoundError();

  if (!input.isActive && isAdminRole(target.role)) {
    const admins = await userRepository.countActiveAdmins(session.tenantId);
    if (admins <= 1) throw new LastAdminError();
  }

  const record = await userRepository.setActive(
    session.tenantId,
    input.userId,
    input.isActive,
  );

  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: input.isActive ? "user.activated" : "user.deactivated",
    tableName: "profiles",
    recordId: input.userId,
  });

  return toUserDto(record);
}
