import { NotFoundError, ValidationError } from "@/core/errors";

export class AnnouncementNotFoundError extends NotFoundError {
  constructor() {
    super("No se encontró el comunicado.");
  }
}

/** El usuario no tiene un registro de residente para marcar lecturas. */
export class NotAResidentError extends ValidationError {
  constructor() {
    super("Tu cuenta no está vinculada a un residente.");
  }
}

export class DocumentNotFoundError extends NotFoundError {
  constructor() {
    super("No se encontró el archivo adjunto.");
  }
}
