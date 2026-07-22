import { z } from "zod";

/**
 * El identificador puede ser un **correo** (admins/plataforma) o un **teléfono** (residentes).
 * Se normaliza en el Service según el caso. La contraseña solo se exige presente: nunca se
 * revelan las reglas de complejidad en el login para no facilitar ataques.
 */
export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Ingresa tu correo o teléfono."),
  password: z.string().min(1, "La contraseña es obligatoria."),
});

export type LoginInput = z.infer<typeof loginSchema>;
