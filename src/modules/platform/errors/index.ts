import { NotFoundError, ConflictError, ValidationError } from "@/core/errors";

export class PlatformTenantNotFoundError extends NotFoundError {
  constructor() {
    super("No se encontró el fraccionamiento.");
  }
}

export class TenantSlugTakenError extends ConflictError {
  constructor() {
    super("Ya existe un fraccionamiento con un nombre muy similar.");
  }
}

export class TenantAdminExistsError extends ConflictError {
  constructor() {
    super("Ya existe un usuario con ese correo.");
  }
}

export class ProvisioningError extends ValidationError {
  constructor(message = "No se pudo crear el fraccionamiento. Intenta de nuevo.") {
    super(message);
  }
}
