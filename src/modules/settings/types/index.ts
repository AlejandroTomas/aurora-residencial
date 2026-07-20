/** Configuración mutable del tenant (contacto y preferencias visuales/regionales). */
export interface SettingsDto {
  contactPhone: string | null;
  contactEmail: string | null;
  primaryColor: string | null;
  timezone: string;
  language: string;
}
