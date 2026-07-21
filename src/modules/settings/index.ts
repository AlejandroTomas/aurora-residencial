/**
 * API pública del módulo settings — cliente y servidor.
 * Los reads server-only viven en `./server`.
 */
export { updateSettingsAction, uploadLogoAction } from "./actions";
export { SettingsForm, LogoUploader } from "./components";
export type { SettingsDto } from "./types";
