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
import { createResidentSchema, type CreateResidentInput } from "../schemas";
import { createResidentAction, updateResidentAction } from "../actions";
import type { ResidentDto, LotOption } from "../types";

const SELECT_CLASS =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-50 dark:bg-input/30";

interface ResidentFormDialogProps {
  lots: LotOption[];
  resident?: ResidentDto;
  trigger: ReactNode;
}

export function ResidentFormDialog({
  lots,
  resident,
  trigger,
}: ResidentFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(resident);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateResidentInput>({
    resolver: zodResolver(createResidentSchema),
    defaultValues: {
      lotId: resident?.lotId ?? "",
      fullName: resident?.fullName ?? "",
      email: resident?.email ?? "",
      phone: resident?.phone ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result =
      isEdit && resident
        ? await updateResidentAction({ id: resident.id, ...values })
        : await createResidentAction(values);

    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success(isEdit ? "Residente actualizado." : "Residente registrado.");
    setOpen(false);
    if (!isEdit) reset();
    router.refresh();
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar residente" : "Nuevo residente"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="resident-lot">Lote</Label>
            <select
              id="resident-lot"
              className={SELECT_CLASS}
              disabled={lots.length === 0}
              aria-invalid={Boolean(errors.lotId)}
              {...register("lotId")}
            >
              <option value="" disabled>
                Selecciona un lote…
              </option>
              {lots.map((lot) => (
                <option key={lot.id} value={lot.id}>
                  {lot.label}
                </option>
              ))}
            </select>
            {lots.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No hay lotes registrados en el fraccionamiento todavía.
              </p>
            )}
            {errors.lotId && (
              <p className="text-xs text-destructive">{errors.lotId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="resident-name">Nombre completo</Label>
            <Input
              id="resident-name"
              aria-invalid={Boolean(errors.fullName)}
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-xs text-destructive">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="resident-email">Correo (opcional)</Label>
              <Input
                id="resident-email"
                type="email"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="resident-phone">Teléfono (opcional)</Label>
              <Input
                id="resident-phone"
                aria-invalid={Boolean(errors.phone)}
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>
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
