import { NotFoundError } from "@/core/errors";

export class ProfileNotFoundError extends NotFoundError {
  constructor() {
    super("No se encontró tu perfil.");
  }
}
