import "server-only";
import { recordAudit } from "@/core/services";
import type { AuthSession } from "@/modules/auth/server";
import { settingsRepository } from "../repositories/settings.repository";
import { toSettingsDto, DEFAULT_SETTINGS } from "../mappers";
import type { UpdateSettingsInput } from "../schemas";
import type { SettingsDto } from "../types";

export async function updateSettings(
  session: AuthSession,
  input: UpdateSettingsInput,
): Promise<SettingsDto> {
  await settingsRepository.upsert(
    session.tenantId,
    {
      contact_phone: input.contactPhone || null,
      contact_email: input.contactEmail || null,
      primary_color: input.primaryColor || null,
      timezone: input.timezone,
      language: input.language,
    },
    session.userId,
  );

  await recordAudit({
    tenantId: session.tenantId,
    userId: session.userId,
    action: "settings.updated",
    tableName: "tenant_settings",
    recordId: session.tenantId,
    newData: { timezone: input.timezone, language: input.language },
  });

  const record = await settingsRepository.findByTenant(session.tenantId);
  return record ? toSettingsDto(record) : DEFAULT_SETTINGS;
}
