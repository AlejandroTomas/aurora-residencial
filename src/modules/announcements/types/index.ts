/**
 * DTO de comunicado para la UI. `isRead` solo se calcula para lectores residentes;
 * para administradores es `undefined` (ellos ven el estado de publicación, no de lectura).
 */
export interface AnnouncementDto {
  id: string;
  title: string;
  body: string;
  publishedAt: string | null;
  isPublished: boolean;
  createdAt: string;
  isRead?: boolean;
}

/** Adjunto de un comunicado, con Signed URL de descarga (vida corta). */
export interface AttachmentDto {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
}
