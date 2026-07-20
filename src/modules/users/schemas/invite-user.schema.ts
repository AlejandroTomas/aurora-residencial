import { z } from "zod";
import { ASSIGNABLE_ROLES } from "../constants";

export const inviteUserSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "El correo es obligatorio.")
    .email("Ingresa un correo válido."),
  fullName: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(120, "El nombre es demasiado largo."),
  role: z.enum(ASSIGNABLE_ROLES),
});

export type InviteUserInput = z.infer<typeof inviteUserSchema>;
