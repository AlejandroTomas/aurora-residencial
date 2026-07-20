"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROLE_LABELS } from "@/modules/users";
import { updateProfileSchema, type UpdateProfileInput } from "../schemas";
import { updateMyProfileAction } from "../actions";
import type { ProfileDto } from "../types";

export function ProfileForm({ profile }: { profile: ProfileDto }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: profile.fullName,
      phone: profile.phone ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await updateMyProfileAction(values);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Perfil actualizado.");
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="profile-email">Correo</Label>
          <Input id="profile-email" value={profile.email} readOnly disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-role">Rol</Label>
          <Input
            id="profile-role"
            value={ROLE_LABELS[profile.role]}
            readOnly
            disabled
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile-name">Nombre completo</Label>
        <Input
          id="profile-name"
          aria-invalid={Boolean(errors.fullName)}
          {...register("fullName")}
        />
        {errors.fullName && (
          <p className="text-xs text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile-phone">Teléfono (opcional)</Label>
        <Input
          id="profile-phone"
          aria-invalid={Boolean(errors.phone)}
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-xs text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Guardar cambios
        </Button>
        <Button asChild variant="link">
          <Link href="/reset-password">Cambiar contraseña</Link>
        </Button>
      </div>
    </form>
  );
}
