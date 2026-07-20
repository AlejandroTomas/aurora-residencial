import { z } from "zod";
import { ASSIGNABLE_ROLES } from "../constants";

export const updateUserRoleSchema = z.object({
  userId: z.string().uuid("Usuario inválido."),
  role: z.enum(ASSIGNABLE_ROLES),
});

export const setUserActiveSchema = z.object({
  userId: z.string().uuid("Usuario inválido."),
  isActive: z.boolean(),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type SetUserActiveInput = z.infer<typeof setUserActiveSchema>;
