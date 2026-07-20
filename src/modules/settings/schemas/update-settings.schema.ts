import { z } from "zod";

export const SUPPORTED_LANGUAGES = ["es", "en"] as const;

export const updateSettingsSchema = z.object({
  contactPhone: z
    .string()
    .trim()
    .max(20, "El teléfono es demasiado largo.")
    .optional()
    .or(z.literal("")),
  contactEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email("Ingresa un correo válido.")
    .optional()
    .or(z.literal("")),
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
