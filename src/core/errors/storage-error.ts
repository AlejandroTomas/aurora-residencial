import { AppError, type ErrorCode } from "./app-error";

export class StorageError extends AppError {
  readonly code: ErrorCode = "STORAGE_ERROR";
  readonly httpStatus = 500;
}
