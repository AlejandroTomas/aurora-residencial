/**
 * Comparador de orden natural (numérico) para strings alfanuméricos: "2" antes que "10",
 * "A-2" antes que "A-10". Evita el orden lexicográfico (1, 10, 11, 2, …).
 */
export function naturalCompare(a: string, b: string): number {
  return a.localeCompare(b, "es", { numeric: true, sensitivity: "base" });
}
