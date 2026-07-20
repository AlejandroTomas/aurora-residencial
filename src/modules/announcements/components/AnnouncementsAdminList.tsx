"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/core/utils";
import { AnnouncementFormDialog } from "./AnnouncementFormDialog";
import { setAnnouncementPublishedAction } from "../actions";
import type { AnnouncementDto } from "../types";

export function AnnouncementsAdminList({
  announcements,
}: {
  announcements: AnnouncementDto[];
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const togglePublished = (announcement: AnnouncementDto) => {
    setPendingId(announcement.id);
    startTransition(async () => {
      const result = await setAnnouncementPublishedAction({
        id: announcement.id,
        publish: !announcement.isPublished,
      });
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success(
          announcement.isPublished
            ? "Comunicado despublicado."
            : "Comunicado publicado.",
        );
        router.refresh();
      }
      setPendingId(null);
    });
  };

  if (announcements.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Aún no hay comunicados.</p>
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
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">
                    {announcement.title}
                  </h3>
                  <Badge
                    variant={announcement.isPublished ? "secondary" : "outline"}
                  >
                    {announcement.isPublished ? "Publicado" : "Borrador"}
                  </Badge>
                </div>
                {announcement.publishedAt && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDateTime(announcement.publishedAt)}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                <AnnouncementFormDialog
                  announcement={announcement}
                  trigger={
                    <Button variant="outline" size="sm">
                      <Pencil className="h-3.5 w-3.5" />
                      Editar
                    </Button>
                  }
                />
                <Button
                  variant="outline"
                  size="sm"
                  disabled={busy}
                  onClick={() => togglePublished(announcement)}
                >
                  {announcement.isPublished ? "Despublicar" : "Publicar"}
                </Button>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
              {announcement.body}
            </p>
          </article>
        );
      })}
    </div>
  );
}
