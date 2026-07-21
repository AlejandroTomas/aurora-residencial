import { z } from "zod";

export const registerSchema = z.object({
  slug: z.string().min(1, "Fraccionamiento inválido."),
  fullName: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(120, "El nombre es demasiado largo."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "El correo es obligatorio.")
    .email("Ingresa un correo válido."),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres."),
  phone: z
    .string()
    .trim()
    .min(7, "El teléfono es demasiado corto.")
    .max(20, "El teléfono es demasiado largo.")
    .optional()
    .or(z.literal("")),
  lotId: z.string().uuid("Selecciona tu lote."),
});

export const approveRequestSchema = z.object({
  requestId: z.string().uuid("Solicitud inválida."),
});

export const rejectRequestSchema = z.object({
  requestId: z.string().uuid("Solicitud inválida."),
  comment: z
    .string()
    .trim()
    .max(500, "El comentario es demasiado largo.")
    .optional()
    .or(z.literal("")),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type ApproveRequestInput = z.infer<typeof approveRequestSchema>;
export type RejectRequestInput = z.infer<typeof rejectRequestSchema>;
