import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { ColumnMapping, ExcelRow, ImportActionConfig } from "@/types";
import { validateAndMapRows } from "@/lib/modalExcel/validation";
import { Button } from "@/components/ui/button";

interface Props {
  action: ImportActionConfig;
  excelData: ExcelRow[];
  mapping: ColumnMapping;
  skipInvalidRows: boolean;
  setSkipInvalidRows: (value: boolean) => void;
}

export default function StepPreviewConfirm({
  action,
  excelData,
  mapping,
  skipInvalidRows,
  setSkipInvalidRows,
}: Props) {
  const [showErrors, setShowErrors] = useState(false);

  const result = useMemo(
    () => validateAndMapRows(excelData, mapping, action.fields),
    [excelData, mapping, action.fields],
  );

  const totalRows = excelData.length;
  const errorRows = result.invalidRowIndexes.size;
  const validRows = totalRows - errorRows;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total de filas</p>
          <p className="text-2xl font-bold text-foreground">{totalRows}</p>
        </div>
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/5 p-4">
          <p className="text-xs text-muted-foreground">Filas validas</p>
          <p className="text-2xl font-bold text-emerald-500">{validRows}</p>
        </div>
        <div className="rounded-xl border border-red-400/30 bg-red-500/5 p-4">
          <p className="text-xs text-muted-foreground">Filas con errores</p>
          <p className="text-2xl font-bold text-red-500">{errorRows}</p>
        </div>
      </div>

      {errorRows > 0 ? (
        <div className="rounded-xl border border-red-400/30 bg-red-500/5 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="size-4" />
              <p className="text-sm font-medium">
                Se encontraron {result.errors.length} errores en {errorRows}{" "}
                filas
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowErrors((v) => !v)}
            >
              {showErrors ? "Ocultar" : "Ver detalle"}
            </Button>
          </div>

          {showErrors ? (
            <div className="mt-3 max-h-48 space-y-1 overflow-y-auto text-xs text-red-700">
              {result.errors.map((err, idx) => (
                <p key={idx}>
                  Fila {err.rowIndex + 2}: {err.message}
                </p>
              ))}
            </div>
          ) : null}

          <label className="mt-3 flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={skipInvalidRows}
              onChange={(e) => setSkipInvalidRows(e.target.checked)}
              className="size-4 rounded border-border"
            />
            Omitir las filas con error e importar solo las validas
          </label>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/5 p-4 text-emerald-600">
          <CheckCircle2 className="size-4" />
          <p className="text-sm font-medium">
            Todos los datos son validos, listos para importar.
          </p>
        </div>
      )}
    </div>
  );
}
