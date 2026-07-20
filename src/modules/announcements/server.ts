import "server-only";

/**
 * API pública server-only del módulo announcements (lecturas). Separada de `index.ts`
 * para no filtrar código de servidor al bundle del cliente.
 */
export { listAnnouncements } from "./services";
export type { AnnouncementDto } from "./types";
