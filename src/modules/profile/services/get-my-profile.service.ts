import "server-only";
import type { AuthSession } from "@/modules/auth/server";
import { profileRepository } from "../repositories/profile.repository";
import { toProfileDto } from "../mappers";
import { ProfileNotFoundError } from "../errors";
import type { ProfileDto } from "../types";

export async function getMyProfile(session: AuthSession): Promise<ProfileDto> {
  const record = await profileRepository.findById(session.userId);
  if (!record) throw new ProfileNotFoundError();
  return toProfileDto(record);
}
