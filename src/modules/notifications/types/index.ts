/**
 * Notificación in-app. Estructura preparada para el roadmap; el MVP todavía no la usa
 * de forma completa (no existe tabla `notifications`; ver README).
 */
export interface NotificationDto {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  readAt: string | null;
}
