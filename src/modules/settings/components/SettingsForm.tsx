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
  SUPPORTED_CURRENCIES,
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

const CURRENCY_LABELS: Record<(typeof SUPPORTED_CURRENCIES)[number], string> = {
  MXN: "Peso mexicano (MXN)",
  USD: "Dólar (USD)",
  EUR: "Euro (EUR)",
};

function normalizeLanguage(value: string): (typeof SUPPORTED_LANGUAGES)[number] {
  return value === "en" ? "en" : "es";
}

function normalizeCurrency(value: string): (typeof SUPPORTED_CURRENCIES)[number] {
  return value === "USD" || value === "EUR" ? value : "MXN";
}

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
      website: settings.website ?? "",
      address: settings.address ?? "",
      city: settings.city ?? "",
      state: settings.state ?? "",
      postalCode: settings.postalCode ?? "",
      country: settings.country ?? "",
      currency: normalizeCurrency(settings.currency),
      primaryColor: settings.primaryColor ?? "",
      timezone: settings.timezone,
      language: normalizeLanguage(settings.language),
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
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Contacto
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="settings-phone">Teléfono</Label>
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
            <Label htmlFor="settings-email">Correo</Label>
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
          <div className="space-y-2">
            <Label htmlFor="settings-website">Sitio web</Label>
            <Input
              id="settings-website"
              placeholder="https://…"
              aria-invalid={Boolean(errors.website)}
              {...register("website")}
            />
            {errors.website && (
              <p className="text-xs text-destructive">
                {errors.website.message}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Dirección
        </h3>
        <div className="space-y-2">
          <Label htmlFor="settings-address">Calle y número</Label>
          <Input id="settings-address" {...register("address")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="settings-city">Ciudad</Label>
            <Input id="settings-city" {...register("city")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-state">Estado</Label>
            <Input id="settings-state" {...register("state")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-postal">Código postal</Label>
            <Input id="settings-postal" {...register("postalCode")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-country">País</Label>
            <Input id="settings-country" {...register("country")} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Preferencias
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="settings-currency">Moneda</Label>
            <select
              id="settings-currency"
              className={SELECT_CLASS}
              {...register("currency")}
            >
              {SUPPORTED_CURRENCIES.map((currency) => (
                <option key={currency} value={currency}>
                  {CURRENCY_LABELS[currency]}
                </option>
              ))}
            </select>
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
        </div>
      </section>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Guardar configuración
      </Button>
    </form>
  );
}
