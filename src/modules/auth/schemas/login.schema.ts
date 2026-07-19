import { z } from "zod";

/**
 * Se normaliza el correo (trim + minúsculas) antes de validar (security.md:
 * "Normalizar correos"). La contraseña solo se exige presente: nunca se revelan
 * las reglas de complejidad en el login para no facilitar ataques.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "El correo es obligatorio.")
    .email("Ingresa un correo válido."),
  password: z.string().min(1, "La contraseña es obligatoria."),
});

export type LoginInput = z.infer<typeof loginSchema>;
