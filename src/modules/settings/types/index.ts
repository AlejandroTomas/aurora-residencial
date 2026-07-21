/** Configuración mutable del tenant: contacto, ubicación y preferencias. */
export interface SettingsDto {
  contactPhone: string | null;
  contactEmail: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  currency: string;
  primaryColor: string | null;
  timezone: string;
  language: string;
}
