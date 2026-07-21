import { z } from "zod";

export const SUPPORTED_LANGUAGES = ["es", "en"] as const;
export const SUPPORTED_CURRENCIES = ["MXN", "USD", "EUR"] as const;

// Texto opcional: acepta el string vacío del formulario (se convierte a NULL al persistir).
const optionalText = (max: number) =>
  z.string().trim().max(max, "Texto demasiado largo.").optional().or(z.literal(""));

export const updateSettingsSchema = z.object({
  contactPhone: optionalText(20),
  contactEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email("Ingresa un correo válido.")
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .trim()
    .url("Ingresa una URL válida (https://…).")
    .optional()
    .or(z.literal("")),
  address: optionalText(160),
  city: optionalText(80),
  state: optionalText(80),
  postalCode: optionalText(12),
  country: optionalText(80),
  currency: z.enum(SUPPORTED_CURRENCIES),
  primaryColor: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Usa un color hexadecimal (#RRGGBB).")
    .optional()
    .or(z.literal("")),
  timezone: z
    .string()
    .trim()
    .min(1, "La zona horaria es obligatoria.")
    .max(60),
  language: z.enum(SUPPORTED_LANGUAGES),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
