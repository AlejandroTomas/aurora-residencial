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
import type { UpdateUserRoleInput } from "../schemas";
import type { UserDto } from "../types";

/**
 * Caso de uso: cambiar el rol de un usuario. Reglas: no puedes cambiar tu propio rol,
 * y no puedes degradar al último administrador activo del fraccionamiento.
 */
export async function updateUserRole(
  session: AuthSession,
  input: UpdateUserRoleInput,
): Promise<UserDto> {
  if (input.userId === session.userId) {
    throw new CannotModifySelfError("No puedes cambiar tu propio rol.");
  }

  const target = await userRepository.findById(session.tenantId, input.userId);
  if (!target) throw new UserNotFoundError();

  const demotingAdmin = isAdminRole(target.role) && !isAdminRole(input.role);
  if (demotingAdmin) {
    const admins = await userRepository.countActiveAdmins(session.tenantId);
    if (admins <= 1) throw new LastAdminError();
  }

  const record = await userRepository.updateRole(
    session.tenantId,
    input.userId,
    input.role,
  );

  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: "user.role_changed",
    tableName: "profiles",
    recordId: input.userId,
    oldData: { role: target.role },
    newData: { role: input.role },
  });

  return toUserDto(record);
}
