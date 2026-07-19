"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  requestPasswordResetSchema,
  type RequestPasswordResetInput,
} from "../schemas";
import { requestPasswordResetAction } from "../actions";
import { AUTH_ROUTES } from "../constants";

export function RequestPasswordResetForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestPasswordResetInput>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await requestPasswordResetAction(values);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    setSent(true);
  });

  if (sent) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Si el correo está registrado, enviamos las instrucciones para
          restablecer tu contraseña. Revisa tu bandeja de entrada.
        </p>
        <Button asChild variant="outline" className="w-full">
          <Link href={AUTH_ROUTES.login}>Volver al inicio de sesión</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">Correo</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Enviar instrucciones
      </Button>

      <Button asChild variant="ghost" className="w-full">
        <Link href={AUTH_ROUTES.login}>Volver al inicio de sesión</Link>
      </Button>
    </form>
  );
}
