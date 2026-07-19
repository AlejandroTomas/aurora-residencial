"use client";

import { useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowLeft,
  ArrowRight,
  FileSpreadsheet,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { importActions } from "@/lib/modalExcel/config";
import {
  validateAndMapRows,
  allFieldsMapped,
} from "@/lib/modalExcel/validation";
import type { ColumnMapping, ExcelRow } from "@/types";
import { cn } from "@/lib/utils";
import StepSelectAction from "./steps/StepSelectAction";
import StepUploadFile from "./steps/StepUploadFile";
import StepMapColumns from "./steps/StepMapColumns";
import StepPreviewConfirm from "./steps/StepPreviewConfirm";

const stepLabels = [
  "Tipo de datos",
  "Subir archivo",
  "Mapear columnas",
  "Confirmar",
];

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  // El caller decide como persistir cada fila (crearProducto, registrarCliente, etc.)
  onImport: (
    actionValue: string,
    rows: Array<Record<string, unknown>>,
  ) => Promise<void>;
}

export default function ExcelImportModal({
  isOpen,
  onClose,
  onImport,
}: ExcelImportModalProps) {
  const [step, setStep] = useState(0);
  const [selectedAction, setSelectedAction] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<ExcelRow[]>([]);
  const [excelColumns, setExcelColumns] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [skipInvalidRows, setSkipInvalidRows] = useState(true);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const currentAction = useMemo(
    () => importActions.find((a) => a.value === selectedAction),
    [selectedAction],
  );

  const reset = () => {
    setStep(0);
    setSelectedAction("");
    setFile(null);
    setExcelData([]);
    setExcelColumns([]);
    setMapping({});
    setSkipInvalidRows(true);
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSelectAction = (value: string) => {
    setSelectedAction(value);
    setFile(null);
    setExcelData([]);
    setExcelColumns([]);
    setMapping({});
    setError("");
  };

  const handleNext = () => {
    setError("");

    if (step === 0 && !selectedAction) {
      setError("Selecciona un tipo de datos para continuar");
      return;
    }
    if (step === 1 && !file) {
      setError("Sube un archivo para continuar");
      return;
    }
    if (step === 2 && currentAction) {
      if (!allFieldsMapped(mapping, currentAction.fields)) {
        setError("Mapea todos los campos obligatorios antes de continuar");
        return;
      }
    }

    setStep((s) => s + 1);
  };

  const handleProcess = async () => {
    if (!currentAction) return;
    setError("");
    setIsProcessing(true);

    try {
      const result = validateAndMapRows(
        excelData,
        mapping,
        currentAction.fields,
      );

      if (result.invalidRowIndexes.size > 0 && !skipInvalidRows) {
        setError(
          "Hay filas con errores. Corrigelas o activa la opcion de omitirlas.",
        );
        setIsProcessing(false);
        return;
      }

      await onImport(currentAction.value, result.validRows);
      handleClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al importar los datos",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[95vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          aria-describedby="excel-import-description"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-cyan-500 to-indigo-500 px-6 py-4">
            <div className="flex items-center gap-3 text-white">
              <FileSpreadsheet className="size-6" />
              <Dialog.Title className="text-lg font-bold">
                Importar desde Excel
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <X className="size-4" />
              </Button>
            </Dialog.Close>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-2 border-b border-border px-6 py-4">
            {stepLabels.map((label, idx) => (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full border-2 text-sm font-medium",
                      idx < step
                        ? "border-primary bg-primary text-primary-foreground"
                        : idx === step
                          ? "border-primary text-primary"
                          : "border-border text-muted-foreground",
                    )}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={cn(
                      "hidden text-xs sm:block",
                      idx === step
                        ? "font-medium text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </span>
                </div>
                {idx < stepLabels.length - 1 ? (
                  <div
                    className={cn(
                      "mx-2 h-px w-8 sm:w-16",
                      idx < step ? "bg-primary" : "bg-border",
                    )}
                  />
                ) : null}
              </div>
            ))}
          </div>

          {/* Body */}
          <div
            id="excel-import-description"
            className="flex-1 overflow-y-auto p-6"
          >
            {error ? (
              <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            {step === 0 ? (
              <StepSelectAction
                actions={importActions}
                selectedAction={selectedAction}
                onSelect={handleSelectAction}
              />
            ) : null}

            {step === 1 ? (
              <StepUploadFile
                file={file}
                excelData={excelData}
                setFile={setFile}
                setExcelData={setExcelData}
                setExcelColumns={setExcelColumns}
                setError={setError}
              />
            ) : null}

            {step === 2 && currentAction ? (
              <StepMapColumns
                action={currentAction}
                excelColumns={excelColumns}
                excelData={excelData}
                mapping={mapping}
                setMapping={setMapping}
              />
            ) : null}

            {step === 3 && currentAction ? (
              <StepPreviewConfirm
                action={currentAction}
                excelData={excelData}
                mapping={mapping}
                skipInvalidRows={skipInvalidRows}
                setSkipInvalidRows={setSkipInvalidRows}
              />
            ) : null}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border px-6 py-4">
            <Button variant="ghost" onClick={handleClose}>
              Cancelar
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={step === 0}
                onClick={() => setStep((s) => s - 1)}
                className="rounded-xl"
              >
                <ArrowLeft className="mr-2 size-4" />
                Atras
              </Button>

              {step === stepLabels.length - 1 ? (
                <Button
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="rounded-xl bg-linear-to-r from-cyan-500 to-indigo-500 text-white hover:from-cyan-400 hover:to-indigo-400"
                >
                  {isProcessing ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : null}
                  {isProcessing ? "Importando..." : "Importar datos"}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="rounded-xl bg-linear-to-r from-cyan-500 to-indigo-500 text-white hover:from-cyan-400 hover:to-indigo-400"
                >
                  Siguiente
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
