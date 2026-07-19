import { AppError, type ErrorCode } from "@/core/errors";

/**
 * Credenciales inválidas en el login.
 *
 * El mensaje es deliberadamente genérico (no revela si el correo existe o no) para
 * no facilitar la enumeración de cuentas (security.md: Trust Model).
 */
export class InvalidCredentialsError extends AppError {
  readonly code: ErrorCode = "PERMISSION_DENIED";
  readonly httpStatus = 401;

  constructor() {
    super("Correo o contraseña incorrectos.");
  }
}
