import { AppError, type ErrorCode } from "./app-error";

export class ValidationError extends AppError {
  readonly code: ErrorCode = "VALIDATION_ERROR";
  readonly httpStatus = 400;
}
