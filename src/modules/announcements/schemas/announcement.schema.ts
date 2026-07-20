import { z } from "zod";

const announcementFields = {
  title: z
    .string()
    .trim()
    .min(3, "El título debe tener al menos 3 caracteres.")
    .max(160, "El título es demasiado largo."),
  body: z
    .string()
    .trim()
    .min(3, "El contenido es obligatorio.")
    .max(5000, "El contenido es demasiado largo."),
};

export const createAnnouncementSchema = z.object(announcementFields);

export const updateAnnouncementSchema = z.object({
  id: z.string().uuid("Comunicado inválido."),
  ...announcementFields,
});

export const setAnnouncementPublishedSchema = z.object({
  id: z.string().uuid("Comunicado inválido."),
  publish: z.boolean(),
});

export const announcementIdSchema = z.object({
  id: z.string().uuid("Comunicado inválido."),
});

export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;
export type UpdateAnnouncementInput = z.infer<typeof updateAnnouncementSchema>;
export type SetAnnouncementPublishedInput = z.infer<
  typeof setAnnouncementPublishedSchema
>;
