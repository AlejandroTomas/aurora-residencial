import { AppError, type ErrorCode } from "./app-error";

export class NotFoundError extends AppError {
  readonly code: ErrorCode = "NOT_FOUND";
  readonly httpStatus = 404;
}
