/**
 * API pública del módulo settings — cliente y servidor.
 * Los reads server-only viven en `./server`.
 */
export { updateSettingsAction } from "./actions";
export { SettingsForm } from "./components";
export type { SettingsDto } from "./types";
