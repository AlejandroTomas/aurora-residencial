"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Paperclip, Download, Trash2, Upload, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/core/utils";
import {
  attachDocumentAction,
  listAttachmentsAction,
  removeAttachmentAction,
} from "../actions";
import type { AttachmentDto } from "../types";

export function AnnouncementAttachmentsDialog({
  announcementId,
  canManage,
}: {
  announcementId: string;
  canManage: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [attachments, setAttachments] = useState<AttachmentDto[] | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  const load = async () => {
    const result = await listAttachmentsAction(announcementId);
    if (result.success) {
      setAttachments(result.data);
    } else {
      toast.error(result.error);
      setAttachments([]);
    }
  };

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setAttachments(null);
      void load();
    }
  };

  const upload = () => {
    if (!file) return;
    startTransition(async () => {
      const formData = new FormData();
      formData.set("announcementId", announcementId);
      formData.set("file", file);
      const result = await attachDocumentAction(formData);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Adjunto subido.");
      setFile(null);
      await load();
      router.refresh();
    });
  };

  const remove = (documentId: string) => {
    startTransition(async () => {
      const result = await removeAttachmentAction(documentId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Adjunto eliminado.");
      await load();
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Paperclip className="h-3.5 w-3.5" />
          Adjuntos
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjuntos</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {attachments === null ? (
            <p className="text-sm text-muted-foreground">Cargando…</p>
          ) : attachments.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin adjuntos.</p>
          ) : (
            <ul className="space-y-2">
              {attachments.map((attachment) => (
                <li
                  key={attachment.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border p-2"
                >
                  <div className="min-w-0">
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-foreground hover:underline"
                    >
                      <Download className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{attachment.filename}</span>
                    </a>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(attachment.sizeBytes)}
                    </p>
                  </div>
                  {canManage && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={isPending}
                      onClick={() => remove(attachment.id)}
                      aria-label="Eliminar adjunto"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}

          {canManage && (
            <div className="space-y-2 border-t border-border pt-3">
              <input
                type="file"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium"
              />
              <Button
                type="button"
                disabled={!file || isPending}
                onClick={upload}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Subir
              </Button>
              <p className="text-xs text-muted-foreground">
                PDF, imágenes, DOCX o XLSX. Máximo 5 MB.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
