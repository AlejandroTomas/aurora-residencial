"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/core/utils";
import { AnnouncementAttachmentsDialog } from "./AnnouncementAttachmentsDialog";
import { markAnnouncementReadAction } from "../actions";
import type { AnnouncementDto } from "../types";

export function AnnouncementsReaderList({
  announcements,
}: {
  announcements: AnnouncementDto[];
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const markRead = (announcement: AnnouncementDto) => {
    setPendingId(announcement.id);
    startTransition(async () => {
      const result = await markAnnouncementReadAction({ id: announcement.id });
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success("Marcado como leído.");
        router.refresh();
      }
      setPendingId(null);
    });
  };

  if (announcements.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay comunicados por ahora.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => {
        const busy = pendingId === announcement.id;
        return (
          <article
            key={announcement.id}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground">
                  {announcement.title}
                </h3>
                {announcement.publishedAt && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDateTime(announcement.publishedAt)}
                  </p>
                )}
              </div>
              {announcement.isRead ? (
                <Badge variant="secondary" className="shrink-0">
                  <Check className="h-3 w-3" />
                  Leído
                </Badge>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  disabled={busy}
                  onClick={() => markRead(announcement)}
                >
                  Marcar como leído
                </Button>
              )}
            </div>
            <p className="mt-3 whitespace-pre-line text-sm text-foreground/80">
              {announcement.body}
            </p>
            <div className="mt-3">
              <AnnouncementAttachmentsDialog
                announcementId={announcement.id}
                canManage={false}
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}
