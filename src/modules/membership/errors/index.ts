import { NotFoundError, ConflictError, ValidationError } from "@/core/errors";

export class TenantNotAvailableError extends NotFoundError {
  constructor() {
    super("El fraccionamiento no está disponible para registro.");
  }
}

export class EmailTakenError extends ConflictError {
  constructor() {
    super("Ya existe una cuenta con ese correo.");
  }
}

export class PhoneTakenError extends ConflictError {
  constructor() {
    super("Ya existe una cuenta con ese teléfono.");
  }
}

export class RequestNotFoundError extends NotFoundError {
  constructor() {
    super("No se encontró la solicitud.");
  }
}

export class RequestAlreadyReviewedError extends ConflictError {
  constructor() {
    super("La solicitud ya fue revisada.");
  }
}

export class RegistrationError extends ValidationError {
  constructor(message = "No se pudo completar el registro. Intenta de nuevo.") {
    super(message);
  }
}
