"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createAnnouncementSchema,
  type CreateAnnouncementInput,
} from "../schemas";
import { createAnnouncementAction, updateAnnouncementAction } from "../actions";
import type { AnnouncementDto } from "../types";

const TEXTAREA_CLASS =
  "min-h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30";

interface AnnouncementFormDialogProps {
  announcement?: AnnouncementDto;
  // Opcional: si se omite se usa un botón "Nuevo comunicado" creado aquí (cliente). No
  // pasar un trigger creado en un Server Component (rompe el `asChild` de Radix al cruzar RSC).
  trigger?: ReactNode;
}

export function AnnouncementFormDialog({
  announcement,
  trigger,
}: AnnouncementFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(announcement);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAnnouncementInput>({
    resolver: zodResolver(createAnnouncementSchema),
    defaultValues: {
      title: announcement?.title ?? "",
      body: announcement?.body ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result =
      isEdit && announcement
        ? await updateAnnouncementAction({ id: announcement.id, ...values })
        : await createAnnouncementAction(values);

    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success(isEdit ? "Comunicado actualizado." : "Comunicado creado.");
    setOpen(false);
    if (!isEdit) reset();
    router.refresh();
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="h-4 w-4" />
            Nuevo comunicado
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar comunicado" : "Nuevo comunicado"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="announcement-title">Título</Label>
            <Input
              id="announcement-title"
              aria-invalid={Boolean(errors.title)}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="announcement-body">Contenido</Label>
            <textarea
              id="announcement-body"
              className={TEXTAREA_CLASS}
              aria-invalid={Boolean(errors.body)}
              {...register("body")}
            />
            {errors.body && (
              <p className="text-xs text-destructive">{errors.body.message}</p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
