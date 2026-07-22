/**
 * Contratos de paginación compartidos. Toda lista se pagina (security.md:
 * "Nunca cargar miles de registros").
 */

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export interface PaginationParams {
  page: number; // 1-based
  pageSize: number;
}

export interface Paginated<TItem> {
  items: TItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Traduce página/pageSize al rango `[from, to]` inclusivo que espera Supabase (`.range()`).
 */
export function toRange({ page, pageSize }: PaginationParams): {
  from: number;
  to: number;
} {
  const from = (page - 1) * pageSize;
  return { from, to: from + pageSize - 1 };
}

/**
 * Pagina en memoria un arreglo ya ordenado. Útil cuando el orden no se puede expresar en
 * SQL (ej. orden natural) y el conjunto está acotado.
 */
export function paginateArray<TItem>(
  items: TItem[],
  { page, pageSize }: PaginationParams,
): Paginated<TItem> {
  const total = items.length;
  const from = (page - 1) * pageSize;
  return {
    items: items.slice(from, from + pageSize),
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}
