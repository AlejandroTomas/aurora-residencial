import "server-only";
import type { AuthSession } from "@/modules/auth/server";
import { settingsRepository } from "../repositories/settings.repository";
import { toSettingsDto, DEFAULT_SETTINGS } from "../mappers";
import type { SettingsDto } from "../types";

/** Devuelve la configuración del tenant o los valores por defecto si aún no existe. */
export async function getSettings(session: AuthSession): Promise<SettingsDto> {
  const record = await settingsRepository.findByTenant(session.tenantId);
  return record ? toSettingsDto(record) : DEFAULT_SETTINGS;
}
