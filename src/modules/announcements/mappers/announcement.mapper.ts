import type { AnnouncementRecord } from "../repositories";
import type { AnnouncementDto } from "../types";

export function toAnnouncementDto(
  record: AnnouncementRecord,
  options?: { isRead?: boolean },
): AnnouncementDto {
  return {
    id: record.id,
    title: record.title,
    body: record.body,
    publishedAt: record.published_at,
    isPublished: record.published_at !== null,
    createdAt: record.created_at,
    isRead: options?.isRead,
  };
}
