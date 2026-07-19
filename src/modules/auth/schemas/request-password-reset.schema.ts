import { z } from "zod";

export const requestPasswordResetSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "El correo es obligatorio.")
    .email("Ingresa un correo válido."),
});

export type RequestPasswordResetInput = z.infer<
  typeof requestPasswordResetSchema
>;
