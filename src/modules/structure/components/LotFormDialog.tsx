"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
import { createLotSchema, type CreateLotInput } from "../schemas";
import { createLotAction, updateLotAction } from "../actions";
import { LOT_STATUSES, LOT_STATUS_LABELS } from "../constants";
import type { LotDto } from "../types";

const SELECT_CLASS =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30";
const TEXTAREA_CLASS =
  "min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30";

export function LotFormDialog({
  blockId,
  lot,
  trigger,
}: {
  blockId: string;
  lot?: LotDto;
  trigger: ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(lot);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateLotInput>({
    resolver: zodResolver(createLotSchema),
    defaultValues: {
      blockId,
      number: lot?.number ?? "",
      area: lot?.area != null ? String(lot.area) : "",
      observations: lot?.observations ?? "",
      status: lot?.status ?? "DISPONIBLE",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result =
      isEdit && lot
        ? await updateLotAction({
            id: lot.id,
            number: values.number,
            area: values.area,
            observations: values.observations,
            status: values.status,
          })
        : await createLotAction(values);

    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success(isEdit ? "Lote actualizado." : "Lote creado.");
    setOpen(false);
    if (!isEdit) reset();
    router.refresh();
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar lote" : "Nuevo lote"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <input type="hidden" {...register("blockId")} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lot-number">Número</Label>
              <Input
                id="lot-number"
                aria-invalid={Boolean(errors.number)}
                {...register("number")}
              />
              {errors.number && (
                <p className="text-xs text-destructive">
                  {errors.number.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lot-area">Área m² (opcional)</Label>
              <Input
                id="lot-area"
                placeholder="120.50"
                aria-invalid={Boolean(errors.area)}
                {...register("area")}
              />
              {errors.area && (
                <p className="text-xs text-destructive">{errors.area.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lot-status">Estado</Label>
            <select
              id="lot-status"
              className={SELECT_CLASS}
              {...register("status")}
            >
              {LOT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {LOT_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lot-observations">Observaciones (opcional)</Label>
            <textarea
              id="lot-observations"
              className={TEXTAREA_CLASS}
              {...register("observations")}
            />
            {errors.observations && (
              <p className="text-xs text-destructive">
                {errors.observations.message}
              </p>
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
