# Storage

Un bucket privado, `tenant-files` (creado en `migrations/010_storage.sql`). Nunca público
(`database.md`: "Buckets privados. Nunca públicos. Las imágenes se consultan mediante Signed
URLs.").

## Convención de rutas

```
{tenant_id}/announcements/{uuid}.{ext}
{tenant_id}/documents/{uuid}.{ext}
{tenant_id}/profiles/{auth.uid()}.{ext}
{tenant_id}/events/{uuid}.{ext}       # reservado, sin RLS todavía (no es MVP)
```

El primer segmento es siempre el `tenant_id` — es lo que usan las políticas de
`storage.objects` para aislar por tenant. Nunca subir un archivo fuera de esa convención.

## Reglas

- Nombre de archivo generado (UUID + extensión), nunca el nombre original del usuario
  (`security.md`). El nombre original se guarda como metadata en `public.documents.original_filename`.
- Validar tipo MIME, extensión y tamaño **antes** de subir, en el Server Action — el bucket
  privado y las policies no validan contenido, solo aíslan por tenant y rol.
- Tipos permitidos (MVP): PDF, PNG, JPG, WEBP, DOCX, XLSX.
- Servir siempre con Signed URLs de vida corta, nunca URLs permanentes.
