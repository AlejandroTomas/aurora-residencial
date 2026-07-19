import { z } from "zod";

const MIN_PASSWORD_LENGTH = 8;

/**
 * Reglas de complejidad mínimas para una contraseña nueva. Se validan aquí (cliente)
 * y de nuevo en el servidor (nextjs.md: "Siempre validar nuevamente en el servidor").
 */
export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(
        MIN_PASSWORD_LENGTH,
        `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`,
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
