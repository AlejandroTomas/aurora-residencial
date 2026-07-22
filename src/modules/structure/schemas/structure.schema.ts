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

// Alta por grupos.
export const bulkBlocksSchema = z.object({
  parentId: z.string().uuid("Calle inválida."),
  names: z
    .array(nameField)
    .min(1, "Ingresa al menos un nombre.")
    .max(200, "Máximo 200 manzanas por operación."),
});

export const bulkLotsSchema = z
  .object({
    blockId: z.string().uuid("Manzana inválida."),
    prefix: z.string().trim().max(10).optional().or(z.literal("")),
    from: z.coerce.number().int().min(1, "«Desde» debe ser 1 o mayor."),
    to: z.coerce.number().int().min(1, "«Hasta» debe ser 1 o mayor."),
    status: z.enum(LOT_STATUSES),
  })
  .refine((data) => data.to >= data.from, {
    message: "El rango es inválido («Hasta» menor que «Desde»).",
    path: ["to"],
  })
  .refine((data) => data.to - data.from <= 999, {
    message: "Máximo 1000 lotes por operación.",
    path: ["to"],
  });

export type CreateNamedNodeInput = z.infer<typeof createNamedNodeSchema>;
export type RenameNodeInput = z.infer<typeof renameNodeSchema>;
export type SetNodeActiveInput = z.infer<typeof setNodeActiveSchema>;
export type CreateLotInput = z.infer<typeof createLotSchema>;
export type UpdateLotInput = z.infer<typeof updateLotSchema>;
export type BulkBlocksInput = z.infer<typeof bulkBlocksSchema>;
export type BulkLotsInput = z.infer<typeof bulkLotsSchema>;
