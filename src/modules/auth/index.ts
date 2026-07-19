/**
 * API pública del módulo Auth — segura para cliente y servidor.
 *
 * Las Server Actions ("use server") son la frontera RPC: pueden importarse desde
 * componentes cliente sin arrastrar su código de servidor al bundle. Lo que SÍ es
 * estrictamente server-only (`getCurrentSession`) se expone aparte en `./server`,
 * para que un componente cliente nunca lo incluya por accidente (Next.js: `server-only`).
 */
export {
  loginAction,
  logoutAction,
  requestPasswordResetAction,
  updatePasswordAction,
} from "./actions";

export {
  AuthShell,
  LoginForm,
  RequestPasswordResetForm,
  UpdatePasswordForm,
} from "./components";

export { AUTH_ROUTES } from "./constants";
export type { AuthSession } from "./types";
