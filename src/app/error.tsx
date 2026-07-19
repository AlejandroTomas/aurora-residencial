"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { logger } from "@/core/logger";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Error no controlado en la UI", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-sm space-y-4 text-center">
        <h1 className="text-lg font-semibold text-foreground">
          Algo salió mal.
        </h1>
        <p className="text-sm text-muted-foreground">
          Ocurrió un error inesperado. Puedes intentarlo de nuevo.
        </p>
        <Button onClick={() => reset()}>Reintentar</Button>
      </div>
    </div>
  );
}
