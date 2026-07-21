import "server-only";
import { createSupabaseServerClient } from "@/core/supabase";
import { StorageError } from "@/core/errors";
import { STORAGE_BUCKET } from "./constants";

/**
 * Acceso al Storage privado. Corre con el cliente del usuario, así las policies de
 * `storage.objects` (aislamiento por `tenant_id` en el primer segmento de la ruta) son la
 * última barrera. Nunca entrega URLs públicas: solo Signed URLs de vida corta.
 */
export const storageRepository = {
  async upload(path: string, file: File): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: true });
    if (error) throw new StorageError("No se pudo subir el archivo.");
  },

  async createSignedUrl(
    path: string,
    expiresInSeconds = 3600,
  ): Promise<string> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(path, expiresInSeconds);
    if (error || !data) {
      throw new StorageError("No se pudo generar el enlace de descarga.");
    }
    return data.signedUrl;
  },

  async remove(paths: string[]): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove(paths);
    if (error) throw new StorageError("No se pudo eliminar el archivo.");
  },
};
