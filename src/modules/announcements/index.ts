/**
 * API pública del módulo announcements — cliente y servidor.
 * Los reads server-only viven en `./server`.
 */
export {
  createAnnouncementAction,
  updateAnnouncementAction,
  setAnnouncementPublishedAction,
  markAnnouncementReadAction,
} from "./actions";
export {
  AnnouncementFormDialog,
  AnnouncementsAdminList,
  AnnouncementsReaderList,
} from "./components";
export type { AnnouncementDto } from "./types";
