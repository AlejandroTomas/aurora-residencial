// Bucket privado único (creado en `supabase/migrations/010_storage.sql`). Nunca público:
// los archivos se sirven con Signed URLs de vida corta.
export const STORAGE_BUCKET = "tenant-files";

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// Tipos permitidos (MVP, security.md). El valor es la extensión que se usa en el nombre
// generado; nunca se conserva el nombre original del usuario en el Storage.
export const ALLOWED_FILE_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
};

export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};
