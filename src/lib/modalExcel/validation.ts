import type { ColumnMapping, ExcelRow, ImportField, RowError, ValidationResult } from "@/types";

const truthyValues = new Set(["true", "1", "si", "sí", "yes", "x"]);
const falsyValues = new Set(["false", "0", "no", ""]);

function coerceValue(
  raw: unknown,
  field: ImportField,
): { value: unknown; error: string | null } {
  const isEmpty = raw === null || raw === undefined || String(raw).trim() === "";

  if (isEmpty) {
    if (field.defaultValue !== undefined) return { value: field.defaultValue, error: null };
    if (field.required) return { value: null, error: `"${field.label}" es obligatorio` };
    return { value: undefined, error: null };
  }

  switch (field.type) {
    case "string":
      return { value: String(raw).trim(), error: null };

    case "number": {
      const num = typeof raw === "number" ? raw : Number(String(raw).replace(",", "."));
      if (Number.isNaN(num)) {
        return { value: null, error: `"${field.label}" debe ser un numero (valor recibido: "${raw}")` };
      }
      return { value: num, error: null };
    }

    case "boolean": {
      const normalized = String(raw).trim().toLowerCase();
      if (truthyValues.has(normalized)) return { value: true, error: null };
      if (falsyValues.has(normalized)) return { value: false, error: null };
      return { value: null, error: `"${field.label}" debe ser si/no o true/false (valor recibido: "${raw}")` };
    }

    case "enum": {
      const normalized = String(raw).trim().toLowerCase();
      const match = field.enumOptions?.find(
        (opt) => opt.value.toLowerCase() === normalized || opt.label.toLowerCase() === normalized,
      );
      if (!match) {
        const opciones = field.enumOptions?.map((o) => o.value).join(", ");
        return {
          value: null,
          error: `"${field.label}" debe ser uno de: ${opciones} (valor recibido: "${raw}")`,
        };
      }
      return { value: match.value, error: null };
    }

    default:
      return { value: raw, error: null };
  }
}

export function validateAndMapRows(
  excelData: ExcelRow[],
  mapping: ColumnMapping,
  fields: ImportField[],
): ValidationResult {
  const validRows: Array<Record<string, unknown>> = [];
  const invalidRowIndexes = new Set<number>();
  const errors: RowError[] = [];

  excelData.forEach((row, rowIndex) => {
    const mappedRow: Record<string, unknown> = {};
    let rowHasError = false;

    for (const field of fields) {
      const columnName = mapping[field.key];
      const rawValue = columnName ? row[columnName] : undefined;
      const { value, error } = coerceValue(rawValue, field);

      if (error) {
        rowHasError = true;
        invalidRowIndexes.add(rowIndex);
        errors.push({ rowIndex, field: field.key, message: error });
      } else if (value !== undefined) {
        mappedRow[field.key] = value;
      }
    }

    if (!rowHasError) {
      validRows.push(mappedRow);
    }
  });

  return { validRows, invalidRowIndexes, errors };
}

export function allFieldsMapped(mapping: ColumnMapping, fields: ImportField[]): boolean {
  return fields.filter((f) => f.required).every((f) => Boolean(mapping[f.key]));
}