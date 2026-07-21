import "server-only";
import { createSupabaseServerClient } from "@/core/supabase";

const ATTACHMENT_SELECT =
  "document_id, documents(id, storage_path, original_filename, mime_type, size_bytes)";

export interface AttachmentRaw {
  document_id: string;
  documents: {
    id: string;
    storage_path: string;
    original_filename: string;
    mime_type: string;
    size_bytes: number;
  } | null;
}

export const documentRepository = {
  async insertDocument(
    tenantId: string,
    payload: {
      storagePath: string;
      originalFilename: string;
      mimeType: string;
      sizeBytes: number;
    },
    actorId: string,
  ): Promise<string> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("documents")
      .insert({
        tenant_id: tenantId,
        storage_path: payload.storagePath,
        original_filename: payload.originalFilename,
        mime_type: payload.mimeType,
        size_bytes: payload.sizeBytes,
        created_by: actorId,
        updated_by: actorId,
      })
      .select("id")
      .single();
    if (error) throw error;
    return data.id;
  },

  async linkToAnnouncement(
    tenantId: string,
    announcementId: string,
    documentId: string,
  ): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("announcement_documents").insert({
      tenant_id: tenantId,
      announcement_id: announcementId,
      document_id: documentId,
    });
    if (error) throw error;
  },

  async listByAnnouncement(
    tenantId: string,
    announcementId: string,
  ): Promise<AttachmentRaw[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("announcement_documents")
      .select(ATTACHMENT_SELECT)
      .eq("tenant_id", tenantId)
      .eq("announcement_id", announcementId)
      .returns<AttachmentRaw[]>();
    if (error) throw error;
    return data ?? [];
  },

  async findStoragePath(
    tenantId: string,
    documentId: string,
  ): Promise<string | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("documents")
      .select("storage_path")
      .eq("tenant_id", tenantId)
      .eq("id", documentId)
      .maybeSingle();
    if (error) throw error;
    return data?.storage_path ?? null;
  },

  async unlink(tenantId: string, documentId: string): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("announcement_documents")
      .delete()
      .eq("tenant_id", tenantId)
      .eq("document_id", documentId);
    if (error) throw error;
  },

  async softDeleteDocument(
    tenantId: string,
    documentId: string,
    actorId: string,
  ): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("documents")
      .update({
        is_active: false,
        deleted_at: new Date().toISOString(),
        deleted_by: actorId,
      })
      .eq("tenant_id", tenantId)
      .eq("id", documentId);
    if (error) throw error;
  },
};
