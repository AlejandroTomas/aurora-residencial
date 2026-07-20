import type { SettingsRecord } from "../repositories/settings.repository";
import type { SettingsDto } from "../types";

export const DEFAULT_SETTINGS: SettingsDto = {
  contactPhone: null,
  contactEmail: null,
  primaryColor: null,
  timezone: "America/Mexico_City",
  language: "es",
};

export function toSettingsDto(record: SettingsRecord): SettingsDto {
  return {
    contactPhone: record.contact_phone,
    contactEmail: record.contact_email,
    primaryColor: record.primary_color,
    timezone: record.timezone,
    language: record.language,
  };
}
