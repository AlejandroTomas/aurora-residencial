export type ErrorCode =
  | "VALIDATION_ERROR"
  | "PERMISSION_DENIED"
  | "TENANT_MISMATCH"
  | "NOT_FOUND"
  | "CONFLICT"
  | "STORAGE_ERROR";

export abstract class AppError extends Error {
  abstract readonly code: ErrorCode;
  abstract readonly httpStatus: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
