import { AppError, type ErrorCode } from "./app-error";

export class TenantMismatchError extends AppError {
  readonly code: ErrorCode = "TENANT_MISMATCH";
  readonly httpStatus = 403;

  constructor(message = "El recurso no pertenece a tu organización.") {
    super(message);
  }
}
