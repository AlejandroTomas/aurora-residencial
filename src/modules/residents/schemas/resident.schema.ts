import { z } from "zod";

// Campos opcionales: se acepta el string vacío del formulario (el input siempre existe)
// además del valor válido. La conversión "" -> NULL para persistir ocurre en el repository.
// Se evitan `preprocess`/`transform` para no romper el tipado de React Hook Form
// (el tipo de entrada del formulario debe seguir siendo `string`).
const optionalEmail = z
  .string()
  .trim()
  .toLowerCase()
  .email("Ingresa un correo válido.")
  .optional()
  .or(z.literal(""));

const optionalPhone = z
  .string()
  .trim()
  .min(7, "El teléfono es demasiado corto.")
  .max(20, "El teléfono es demasiado largo.")
  .optional()
  .or(z.literal(""));

const residentFields = {
  lotId: z.string().uuid("Selecciona un lote."),
  fullName: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(120, "El nombre es demasiado largo."),
  email: optionalEmail,
  phone: optionalPhone,
};

export const createResidentSchema = z.object(residentFields);

export const updateResidentSchema = z.object({
  id: z.string().uuid("Residente inválido."),
  ...residentFields,
});

export const setResidentActiveSchema = z.object({
  id: z.string().uuid("Residente inválido."),
  isActive: z.boolean(),
});

export type CreateResidentInput = z.infer<typeof createResidentSchema>;
export type UpdateResidentInput = z.infer<typeof updateResidentSchema>;
export type SetResidentActiveInput = z.infer<typeof setResidentActiveSchema>;
