import { ValidationError } from "@/core/errors";
import {
  ALLOWED_FILE_TYPES,
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE_BYTES,
} from "./constants";

interface UploadFileInfo {
  size: number;
  type: string;
}

/**
 * Valida tipo MIME y tamaño antes de subir (security.md: "Validar tipo, extensión, peso
 * ANTES de subir. Nunca confiar en el nombre del archivo."). Devuelve la extensión segura
 * para construir el nombre generado. Lanza `ValidationError` si no cumple.
 */
export function validateUploadFile(
  file: UploadFileInfo,
  options?: { imagesOnly?: boolean },
): string {
  const allowed = options?.imagesOnly
    ? ALLOWED_IMAGE_TYPES
    : ALLOWED_FILE_TYPES;

  const extension = allowed[file.type];
  if (!extension) {
    throw new ValidationError("Tipo de archivo no permitido.");
  }
  if (file.size <= 0) {
    throw new ValidationError("El archivo está vacío.");
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const maxMb = Math.floor(MAX_FILE_SIZE_BYTES / 1024 / 1024);
    throw new ValidationError(`El archivo supera el máximo de ${maxMb} MB.`);
  }

  return extension;
}
