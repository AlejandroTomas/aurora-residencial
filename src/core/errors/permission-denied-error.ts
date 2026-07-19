import { AppError, type ErrorCode } from "./app-error";

export class PermissionDeniedError extends AppError {
  readonly code: ErrorCode = "PERMISSION_DENIED";
  readonly httpStatus = 403;

  constructor(message = "No tienes permisos para realizar esta acción.") {
    super(message);
  }
}
