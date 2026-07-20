/**
 * Formateo de fechas centralizado (nextjs.md: "Nunca utilizar Date directamente para
 * mostrar fechas. Crear utilidades compartidas."). Locale fijo es-MX por ahora; cuando
 * exista i18n se tomará del tenant/usuario.
 */
const LOCALE = "es-MX";

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(LOCALE, { dateStyle: "medium" }).format(
    new Date(iso),
  );
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}
