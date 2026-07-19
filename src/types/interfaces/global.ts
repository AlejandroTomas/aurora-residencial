export interface Response<T> {
  ok: boolean;
  data: T;
  message?: string;
}

export interface SelectOption {
  label: string;
  text?: string;
  value: any;
}

export type DialogType = "info" | "warning" | "error" | "success" | "question";

export interface DialogOptions {
  title?: string;
  message?: string;
  type?: "info" | "warning" | "error" | "success" | "question";
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export type ImportFieldType = "string" | "number" | "boolean" | "enum";

export interface ImportFieldEnumOption {
  value: string;
  label: string;
}

export interface ImportField {
  key: string; // propiedad destino, ej. "precioVenta"
  label: string; // texto mostrado al usuario
  type: ImportFieldType;
  required: boolean;
  enumOptions?: ImportFieldEnumOption[]; // solo si type === "enum"
  defaultValue?: string | number | boolean;
  helpText?: string;
}

export interface ImportActionConfig {
  value: string; // "productos" | "clientes" | ...
  label: string;
  description: string;
  icon: string; // emoji simple, facil de mantener
  color: string; // clase tailwind base, ej "cyan"
  fields: ImportField[];
}

export type ExcelRow = Record<string, unknown>;
export type ColumnMapping = Record<string, string>; // fieldKey -> nombre columna excel ("" = sin mapear)

export interface RowError {
  rowIndex: number; // indice 0-based dentro de excelData
  field: string;
  message: string;
}

export interface ValidationResult {
  validRows: Array<Record<string, unknown>>;
  invalidRowIndexes: Set<number>;
  errors: RowError[];
}