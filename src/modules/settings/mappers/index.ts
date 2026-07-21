import type { SettingsRecord } from "../repositories/settings.repository";
import type { SettingsDto } from "../types";

export const DEFAULT_SETTINGS: SettingsDto = {
  contactPhone: null,
  contactEmail: null,
  website: null,
  address: null,
  city: null,
  state: null,
  postalCode: null,
  country: null,
  currency: "MXN",
  primaryColor: null,
  timezone: "America/Mexico_City",
  language: "es",
};

export function toSettingsDto(record: SettingsRecord): SettingsDto {
  return {
    contactPhone: record.contact_phone,
    contactEmail: record.contact_email,
    website: record.website,
    address: record.address,
    city: record.city,
    state: record.state,
    postalCode: record.postal_code,
    country: record.country,
    currency: record.currency,
    primaryColor: record.primary_color,
    timezone: record.timezone,
    language: record.language,
  };
}
