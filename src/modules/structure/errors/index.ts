import { NotFoundError, ConflictError } from "@/core/errors";

export class StructureNodeNotFoundError extends NotFoundError {
  constructor(message = "No se encontró el registro.") {
    super(message);
  }
}

export class DuplicateLotError extends ConflictError {
  constructor() {
    super("Ya existe un lote con ese número en la manzana.");
  }
}
