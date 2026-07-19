import { redirect } from "next/navigation";
import { AUTH_ROUTES } from "@/modules/auth/server";

/**
 * La raíz no tiene contenido propio: envía al dashboard. El proxy y el layout del
 * dashboard se encargan de exigir sesión (redirigen a /login si no la hay).
 */
export default function RootPage() {
  redirect(AUTH_ROUTES.afterLogin);
}
