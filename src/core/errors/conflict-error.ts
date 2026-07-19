import { AppError, type ErrorCode } from "./app-error";

export class ConflictError extends AppError {
  readonly code: ErrorCode = "CONFLICT";
  readonly httpStatus = 409;
}
