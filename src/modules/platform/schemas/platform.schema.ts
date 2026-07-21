import { z } from "zod";

/**
 * Alta (provisioning) de un fraccionamiento: sus datos mínimos + el administrador inicial
 * que será invitado por correo. El `slug` no se pide: se deriva del nombre en el Service.
 */
export const provisionTenantSchema = z.object({
  tenantName: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(120, "El nombre es demasiado largo."),
  adminFullName: z
    .string()
    .trim()
    .min(2, "El nombre del administrador es obligatorio.")
    .max(120, "El nombre es demasiado largo."),
  adminEmail: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "El correo es obligatorio.")
    .email("Ingresa un correo válido."),
});

export const setTenantActiveSchema = z.object({
  tenantId: z.string().uuid("Fraccionamiento inválido."),
  isActive: z.boolean(),
});

export type ProvisionTenantInput = z.infer<typeof provisionTenantSchema>;
export type SetTenantActiveInput = z.infer<typeof setTenantActiveSchema>;
