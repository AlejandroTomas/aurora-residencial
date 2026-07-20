"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateTenantSchema, type UpdateTenantInput } from "../schemas";
import { updateTenantAction } from "../actions";
import type { TenantDto } from "../types";

export function TenantForm({ tenant }: { tenant: TenantDto }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateTenantInput>({
    resolver: zodResolver(updateTenantSchema),
    defaultValues: { name: tenant.name },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await updateTenantAction(values);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Fraccionamiento actualizado.");
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="tenant-name">Nombre del fraccionamiento</Label>
        <Input
          id="tenant-name"
          aria-invalid={Boolean(errors.name)}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tenant-slug">Identificador</Label>
        <Input id="tenant-slug" value={tenant.slug} readOnly disabled />
        <p className="text-xs text-muted-foreground">
          El identificador es fijo y no puede modificarse.
        </p>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Guardar cambios
      </Button>
    </form>
  );
}
