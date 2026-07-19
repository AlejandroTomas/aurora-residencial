"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error(error);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4">
        <h1>Algo salió mal.</h1>

        <Button onClick={() => reset()}>Reintentar</Button>
      </div>
    </div>
  );
}
