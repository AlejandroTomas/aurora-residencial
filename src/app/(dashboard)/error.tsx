"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { logger } from "@/core/logger";

/**
 * Error boundary del área autenticada. Se renderiza dentro del layout (el sidebar
 * permanece) y muestra un mensaje amigable, nunca el error interno (security.md).
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Error en el dashboard", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="max-w-sm space-y-4 text-center">
        <h1 className="text-lg font-semibold text-foreground">
          Ocurrió un problema
        </h1>
        <p className="text-sm text-muted-foreground">
          No pudimos cargar esta sección. Puedes intentarlo de nuevo.
        </p>
        <Button onClick={() => reset()}>Reintentar</Button>
      </div>
    </div>
  );
}
