# Módulo Notifications

## Estado

**Preparado, no implementado por completo en el MVP.** La estructura existe para que la
campana de notificaciones del navbar y futuros disparadores (comunicado publicado, etc.)
tengan dónde conectarse sin reescribir la arquitectura.

## Pendiente (roadmap)

- Tabla `notifications` (con `tenant_id`, destinatario, tipo, payload, `read_at`) + RLS.
- Emisión desde eventos de dominio (`AnnouncementPublished`, etc.).
- Marcado de leído y contador de no leídas.

## API pública

- `server.ts` — `listNotifications` (hoy devuelve `[]`).
- `index.ts` — tipo `NotificationDto`.
