/**
 * Construye una etiqueta legible de ubicación a partir de la jerarquía
 * Etapa · Calle · Manzana · Lote. Omite los segmentos ausentes.
 */
export function buildLotLabel(parts: {
  number: string;
  block?: string | null;
  street?: string | null;
  stage?: string | null;
}): string {
  const segments = [
    parts.stage,
    parts.street,
    parts.block ? `Mz ${parts.block}` : null,
    `Lote ${parts.number}`,
  ].filter((segment): segment is string => Boolean(segment));

  return segments.join(" · ");
}
