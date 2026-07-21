"use client";

import { useState } from "react";
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
import { provisionTenantSchema, type ProvisionTenantInput } from "../schemas";
import { provisionTenantAction } from "../actions";

export function ProvisionTenantForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProvisionTenantInput>({
    resolver: zodResolver(provisionTenantSchema),
    defaultValues: { tenantName: "", adminFullName: "", adminEmail: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await provisionTenantAction(values);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success(
      "Fraccionamiento creado. Se envió la invitación al administrador.",
    );
    setOpen(false);
    reset();
    router.refresh();
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Nuevo fraccionamiento
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo fraccionamiento</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="tenant-name">Nombre del fraccionamiento</Label>
            <Input
              id="tenant-name"
              aria-invalid={Boolean(errors.tenantName)}
              {...register("tenantName")}
            />
            {errors.tenantName && (
              <p className="text-xs text-destructive">
                {errors.tenantName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-name">Administrador inicial</Label>
            <Input
              id="admin-name"
              placeholder="Nombre completo"
              aria-invalid={Boolean(errors.adminFullName)}
              {...register("adminFullName")}
            />
            {errors.adminFullName && (
              <p className="text-xs text-destructive">
                {errors.adminFullName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-email">Correo del administrador</Label>
            <Input
              id="admin-email"
              type="email"
              placeholder="admin@fraccionamiento.com"
              aria-invalid={Boolean(errors.adminEmail)}
              {...register("adminEmail")}
            />
            {errors.adminEmail && (
              <p className="text-xs text-destructive">
                {errors.adminEmail.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Recibirá una invitación por correo para definir su contraseña.
            </p>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Crear
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
