import { NotFoundError, ConflictError } from "@/core/errors";

export class ResidentNotFoundError extends NotFoundError {
  constructor() {
    super("No se encontró el residente.");
  }
}

export class LotNotFoundError extends NotFoundError {
  constructor() {
    super("El lote seleccionado no existe.");
  }
}

export class ResidentAlreadyExistsError extends ConflictError {
  constructor() {
    super("Ya existe un residente con ese nombre en el mismo lote.");
  }
}
