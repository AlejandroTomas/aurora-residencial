import { z } from "zod";
import { LOT_STATUSES } from "../constants";

const nameField = z
  .string()
  .trim()
  .min(1, "El nombre es obligatorio.")
  .max(80, "El nombre es demasiado largo.");

// Niveles con nombre (etapa/calle/manzana). `parentId` es la etapa/calle/manzana padre
// (se ignora en la etapa raíz). Se acepta opcional para unificar el formulario genérico.
export const createNamedNodeSchema = z.object({
  name: nameField,
  parentId: z.string().uuid().optional(),
});

export const renameNodeSchema = z.object({
  id: z.string().uuid("Registro inválido."),
  name: nameField,
});

export const setNodeActiveSchema = z.object({
  id: z.string().uuid("Registro inválido."),
  isActive: z.boolean(),
});

// Lotes.
const lotFields = {
  number: z
    .string()
    .trim()
    .min(1, "El número es obligatorio.")
    .max(20, "El número es demasiado largo."),
  area: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Área inválida (ej. 120 o 120.50).")
    .optional()
    .or(z.literal("")),
  observations: z
    .string()
    .trim()
    .max(300, "Las observaciones son demasiado largas.")
    .optional()
    .or(z.literal("")),
  status: z.enum(LOT_STATUSES),
};

export const createLotSchema = z.object({
  blockId: z.string().uuid("Manzana inválida."),
  ...lotFields,
});

export const updateLotSchema = z.object({
  id: z.string().uuid("Lote inválido."),
  ...lotFields,
});

export type CreateNamedNodeInput = z.infer<typeof createNamedNodeSchema>;
export type RenameNodeInput = z.infer<typeof renameNodeSchema>;
export type SetNodeActiveInput = z.infer<typeof setNodeActiveSchema>;
export type CreateLotInput = z.infer<typeof createLotSchema>;
export type UpdateLotInput = z.infer<typeof updateLotSchema>;
