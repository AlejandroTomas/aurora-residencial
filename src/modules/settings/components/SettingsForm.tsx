"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  updateSettingsSchema,
  SUPPORTED_LANGUAGES,
  type UpdateSettingsInput,
} from "../schemas";
import { updateSettingsAction } from "../actions";
import type { SettingsDto } from "../types";

const SELECT_CLASS =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30";

const LANGUAGE_LABELS: Record<(typeof SUPPORTED_LANGUAGES)[number], string> = {
  es: "Español",
  en: "Inglés",
};

export function SettingsForm({ settings }: { settings: SettingsDto }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateSettingsInput>({
    resolver: zodResolver(updateSettingsSchema),
    defaultValues: {
      contactPhone: settings.contactPhone ?? "",
      contactEmail: settings.contactEmail ?? "",
      primaryColor: settings.primaryColor ?? "",
      timezone: settings.timezone,
      language:
        settings.language === "en" || settings.language === "es"
          ? settings.language
          : "es",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await updateSettingsAction(values);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Configuración actualizada.");
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="settings-phone">Teléfono de contacto</Label>
          <Input
            id="settings-phone"
            aria-invalid={Boolean(errors.contactPhone)}
            {...register("contactPhone")}
          />
          {errors.contactPhone && (
            <p className="text-xs text-destructive">
              {errors.contactPhone.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="settings-email">Correo de contacto</Label>
          <Input
            id="settings-email"
            type="email"
            aria-invalid={Boolean(errors.contactEmail)}
            {...register("contactEmail")}
          />
          {errors.contactEmail && (
            <p className="text-xs text-destructive">
              {errors.contactEmail.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="settings-color">Color principal</Label>
          <Input
            id="settings-color"
            placeholder="#4f46e5"
            aria-invalid={Boolean(errors.primaryColor)}
            {...register("primaryColor")}
          />
          {errors.primaryColor && (
            <p className="text-xs text-destructive">
              {errors.primaryColor.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="settings-timezone">Zona horaria</Label>
          <Input
            id="settings-timezone"
            aria-invalid={Boolean(errors.timezone)}
            {...register("timezone")}
          />
          {errors.timezone && (
            <p className="text-xs text-destructive">
              {errors.timezone.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="settings-language">Idioma</Label>
          <select
            id="settings-language"
            className={SELECT_CLASS}
            {...register("language")}
          >
            {SUPPORTED_LANGUAGES.map((language) => (
              <option key={language} value={language}>
                {LANGUAGE_LABELS[language]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Guardar configuración
      </Button>
    </form>
  );
}
