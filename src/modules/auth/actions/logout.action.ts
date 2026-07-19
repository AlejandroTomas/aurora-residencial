"use server";

import { redirect } from "next/navigation";
import { logoutService } from "../services";
import { AUTH_ROUTES } from "../constants";

/**
 * Cierra la sesión y redirige al login. `redirect` interrumpe la ejecución, por eso
 * el tipo de retorno es `never` y no debe envolverse en try/catch.
 */
export async function logoutAction(): Promise<never> {
  await logoutService();
  redirect(AUTH_ROUTES.login);
}
