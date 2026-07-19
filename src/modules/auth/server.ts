import "server-only";

/**
 * API pública del módulo Auth exclusiva de servidor. La consumen layouts, route
 * handlers y otros Services (nunca componentes cliente). Separada de `index.ts`
 * porque `getCurrentSession` depende de `server-only` y no debe llegar al cliente.
 */
export { getCurrentSession } from "./services";
export { AUTH_ROUTES } from "./constants";
export type { AuthSession } from "./types";
