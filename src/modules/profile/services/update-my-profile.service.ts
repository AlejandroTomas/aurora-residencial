import "server-only";
import { recordAudit } from "@/core/services";
import type { AuthSession } from "@/modules/auth/server";
import { profileRepository } from "../repositories/profile.repository";
import { toProfileDto } from "../mappers";
import { ProfileNotFoundError } from "../errors";
import type { UpdateProfileInput } from "../schemas";
import type { ProfileDto } from "../types";

/** Caso de uso: el usuario actualiza sus propios datos (no su rol ni su tenant). */
export async function updateMyProfile(
  session: AuthSession,
  input: UpdateProfileInput,
): Promise<ProfileDto> {
  await profileRepository.update(session.userId, {
    full_name: input.fullName,
    phone: input.phone || null,
  });

  const record = await profileRepository.findById(session.userId);
  if (!record) throw new ProfileNotFoundError();

  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: "profile.updated",
    tableName: "profiles",
    recordId: session.userId,
    newData: { fullName: input.fullName },
  });

  return toProfileDto(record);
}
