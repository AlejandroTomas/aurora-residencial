import { z } from "zod";

/**
 * El `slug` es identidad del tenant y se fija en el onboarding: no se edita aquí.
 * El administrador solo cambia el nombre visible.
 */
export const updateTenantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(120, "El nombre es demasiado largo."),
});

export type UpdateTenantInput = z.infer<typeof updateTenantSchema>;
