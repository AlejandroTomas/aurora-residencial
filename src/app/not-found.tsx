import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/modules/auth/server";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-sm space-y-4 text-center">
        <p className="text-5xl font-bold text-muted-foreground">404</p>
        <h1 className="text-lg font-semibold text-foreground">
          Página no encontrada
        </h1>
        <p className="text-sm text-muted-foreground">
          La página que buscas no existe o fue movida.
        </p>
        <Button asChild>
          <Link href={AUTH_ROUTES.afterLogin}>Ir al inicio</Link>
        </Button>
      </div>
    </div>
  );
}
