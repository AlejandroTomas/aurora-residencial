"use client";

import { useState, type DragEvent } from "react";
import * as XLSX from "xlsx";
import { Loader2, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ExcelRow } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  file: File | null;
  excelData: ExcelRow[];
  setFile: (file: File | null) => void;
  setExcelData: (data: ExcelRow[]) => void;
  setExcelColumns: (columns: string[]) => void;
  setError: (error: string) => void;
}

export default function StepUploadFile({
  file,
  excelData,
  setFile,
  setExcelData,
  setExcelColumns,
  setError,
}: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (uploadedFile: File) => {
    setError("");

    if (!uploadedFile.name.match(/\.(xlsx|xls|csv)$/i)) {
      setError("Sube un archivo Excel valido (.xlsx, .xls o .csv)");
      return;
    }

    setFile(uploadedFile);
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        if (!event.target?.result)
          throw new Error("No se pudo leer el archivo");

        const workbook = XLSX.read(event.target.result, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json<ExcelRow>(sheet, {
          defval: null,
        });

        if (data.length === 0) {
          setError("El archivo esta vacio");
          setIsLoading(false);
          return;
        }

        setExcelColumns(Object.keys(data[0]));
        setExcelData(data);
      } catch {
        setError(
          "No se pudo leer el archivo. Verifica que sea un Excel valido.",
        );
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError("Ocurrio un error al leer el archivo");
      setIsLoading(false);
    };

    reader.readAsArrayBuffer(uploadedFile);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileUpload(dropped);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : file
              ? "border-emerald-400/50 bg-emerald-500/5"
              : "border-border bg-card",
        )}
      >
        <UploadCloud
          className={cn(
            "size-10",
            file ? "text-emerald-500" : "text-muted-foreground",
          )}
        />
        <p className="font-medium text-foreground">
          {file ? "Archivo cargado" : "Arrastra tu archivo aqui"}
        </p>
        <p className="text-xs text-muted-foreground">
          o haz clic para seleccionar
        </p>

        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          id="excel-import-input"
          className="hidden"
          disabled={isLoading}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFileUpload(f);
          }}
        />
        <Button
          type="button"
          disabled={isLoading}
          onClick={() => document.getElementById("excel-import-input")?.click()}
          className="rounded-xl"
        >
          {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          Seleccionar archivo
        </Button>
      </div>

      {file && !isLoading ? (
        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
          <div>
            <p className="text-sm font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {excelData.length} registros encontrados
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              setFile(null);
              setExcelData([]);
              setExcelColumns([]);
              setError("");
            }}
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
