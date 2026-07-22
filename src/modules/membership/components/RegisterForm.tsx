"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LotOption } from "@/modules/residents";
import { registerSchema, type RegisterInput } from "../schemas";
import { registerAction } from "../actions";

const SELECT_CLASS =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-50 dark:bg-input/30";

export function RegisterForm({
  slug,
  lots,
}: {
  slug: string;
  lots: LotOption[];
}) {
  const [done, setDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      slug,
      fullName: "",
      phone: "",
      password: "",
      lotId: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await registerAction(values);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    setDone(true);
  });

  if (done) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          ¡Listo! Enviamos tu solicitud de registro. Un administrador la revisará
          y aprobará tu asociación al lote. Ya puedes iniciar sesión con tu
          teléfono y contraseña.
        </p>
        <Button asChild className="w-full">
          <Link href="/login">Ir a iniciar sesión</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <input type="hidden" {...register("slug")} />

      <div className="space-y-2">
        <Label htmlFor="reg-name">Nombre completo</Label>
        <Input
          id="reg-name"
          aria-invalid={Boolean(errors.fullName)}
          {...register("fullName")}
        />
        {errors.fullName && (
          <p className="text-xs text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-phone">Teléfono</Label>
        <Input
          id="reg-phone"
          type="tel"
          autoComplete="tel"
          aria-invalid={Boolean(errors.phone)}
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-xs text-destructive">{errors.phone.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Iniciarás sesión con tu teléfono y contraseña.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-password">Contraseña</Label>
        <div className="relative">
          <Input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            className="pr-10"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-lot">Tu lote</Label>
        <select
          id="reg-lot"
          className={SELECT_CLASS}
          disabled={lots.length === 0}
          aria-invalid={Boolean(errors.lotId)}
          {...register("lotId")}
        >
          <option value="" disabled>
            Selecciona tu lote…
          </option>
          {lots.map((lot) => (
            <option key={lot.id} value={lot.id}>
              {lot.label}
            </option>
          ))}
        </select>
        {lots.length === 0 && (
          <p className="text-xs text-muted-foreground">
            El fraccionamiento aún no tiene lotes disponibles. Contacta al
            administrador.
          </p>
        )}
        {errors.lotId && (
          <p className="text-xs text-destructive">{errors.lotId.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Crear cuenta y enviar solicitud
      </Button>

      <Button asChild variant="ghost" className="w-full">
        <Link href="/login">Ya tengo cuenta</Link>
      </Button>
    </form>
  );
}
