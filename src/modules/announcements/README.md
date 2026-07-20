# Módulo Announcements

## Objetivo

Comunicados del fraccionamiento y su lectura. Los administradores crean/editan/publican;
los residentes y caseta leen los publicados y pueden marcarlos como leídos.

## Casos de uso

- `listAnnouncements(session, pagination)` — según rol: admin ve todo (incluye borradores);
  el resto solo publicados, con estado de lectura del residente actual (server-only).
- `createAnnouncement(session, input)` — crea como borrador.
- `updateAnnouncement(session, input)` — edita título/contenido.
- `setAnnouncementPublished(session, input)` — publica (`published_at = now`) o despublica.
- `markAnnouncementRead(session, announcementId)` — registra la lectura (idempotente).
  Requiere que el usuario esté vinculado a un residente.

## API pública

- `index.ts` — actions, `AnnouncementFormDialog`, `AnnouncementsAdminList`,
  `AnnouncementsReaderList`, `AnnouncementDto`.
- `server.ts` — `listAnnouncements` (server-only).

## Permisos

`permissions/announcement.permissions.ts` → `canManageAnnouncements` (solo admin). RLS
refuerza: SELECT limita a publicados salvo admin; INSERT/UPDATE exigen `is_admin()`;
`announcement_reads` solo permite al residente marcar lo propio.

## Notas

- Las lecturas se atribuyen al **residente** (persona), no a la cuenta: por eso `markRead`
  resuelve primero el `resident_id` del perfil.
- La escritura registra auditoría; las lecturas no (son de alto volumen y bajo riesgo).
