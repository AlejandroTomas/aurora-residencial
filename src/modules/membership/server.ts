import "server-only";

/**
 * API pública server-only del módulo membership. La consumen la página pública de registro,
 * la página de solicitudes (admin) y el dashboard del residente.
 */
export {
  getRegistrationContext,
  listPendingRequests,
  getMembershipStatus,
} from "./services";
export type { MembershipRequestDto, MembershipStatus } from "./types";
