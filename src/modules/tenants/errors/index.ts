import { NotFoundError } from "@/core/errors";

export class TenantNotFoundError extends NotFoundError {
  constructor() {
    super("No se encontró el fraccionamiento.");
  }
}
