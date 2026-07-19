import { AppError, type ErrorCode } from "@/core/errors";

/**
 * La sesión existe en Supabase Auth pero no tiene un perfil activo asociado
 * (cuenta sin `profiles` o marcada como inactiva). No es un login fallido:
 * es una cuenta que no está lista para operar.
 */
export class SessionError extends AppError {
  readonly code: ErrorCode = "PERMISSION_DENIED";
  readonly httpStatus = 403;

  constructor(
    message = "Tu cuenta no está configurada. Contacta al administrador.",
  ) {
    super(message);
  }
}
