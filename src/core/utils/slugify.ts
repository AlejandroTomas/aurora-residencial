/**
 * Genera un slug URL-safe a partir de un texto (quita acentos, pasa a minúsculas y
 * reemplaza lo no alfanumérico por guiones). Usado para el identificador de un tenant.
 */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
