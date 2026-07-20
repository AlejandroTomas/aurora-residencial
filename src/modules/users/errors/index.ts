import { NotFoundError, ConflictError, ValidationError } from "@/core/errors";

export class UserNotFoundError extends NotFoundError {
  constructor() {
    super("No se encontró el usuario.");
  }
}

export class UserAlreadyExistsError extends ConflictError {
  constructor() {
    super("Ya existe un usuario con ese correo.");
  }
}

/** Reglas de negocio que protegen al propio administrador y al fraccionamiento. */
export class CannotModifySelfError extends ValidationError {}

export class LastAdminError extends ConflictError {
  constructor() {
    super("No puedes dejar el fraccionamiento sin administradores activos.");
  }
}
