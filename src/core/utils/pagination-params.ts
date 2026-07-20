/** Convierte el `?page=` de la URL en un número de página válido (>= 1). */
export function parsePageParam(value: string | undefined): number {
  const page = Number(value);
  return Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1;
}
