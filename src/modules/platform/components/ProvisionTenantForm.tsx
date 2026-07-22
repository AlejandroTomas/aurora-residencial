"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus, Copy } from "lucide-react";
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
import type { ProvisionResult } from "../types";

export function ProvisionTenantForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<ProvisionResult | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProvisionTenantInput>({
    resolver: zodResolver(provisionTenantSchema),
    defaultValues: { tenantName: "", adminFullName: "", adminEmail: "" },
  });

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setResult(null);
      reset();
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    const response = await provisionTenantAction(values);
    if (!response.success) {
      toast.error(response.error);
      return;
    }
    setResult(response.data);
    reset();
    router.refresh();
  });

  const copyCredentials = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(
        `Correo: ${result.adminEmail}\nContraseña: ${result.adminPassword}`,
      );
      toast.success("Credenciales copiadas.");
    } catch {
      toast.error("No se pudo copiar.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Nuevo fraccionamiento
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {result ? "Fraccionamiento creado" : "Nuevo fraccionamiento"}
          </DialogTitle>
        </DialogHeader>

        {result ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Comparte estas credenciales con el administrador de{" "}
              <span className="font-medium text-foreground">
                {result.tenantName}
              </span>
              . Podrá cambiar su contraseña desde su perfil. No volverás a ver la
              contraseña.
            </p>
            <div className="space-y-2 rounded-lg border border-border bg-muted/40 p-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Correo</span>
                <span className="font-medium">{result.adminEmail}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Contraseña</span>
                <span className="font-mono font-medium">
                  {result.adminPassword}
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={copyCredentials}>
                <Copy className="h-4 w-4" />
                Copiar
              </Button>
              <Button type="button" onClick={() => setResult(null)}>
                Crear otro
              </Button>
            </DialogFooter>
          </div>
        ) : (
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
                Se creará su cuenta con una contraseña temporal (sin correo de
                verificación).
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
        )}
      </DialogContent>
    </Dialog>
  );
}
