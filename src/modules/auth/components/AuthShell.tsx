import type { ReactNode } from "react";

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/**
 * Contenedor visual compartido por las pantallas de autenticación (login, recuperación,
 * restablecimiento). Centra una tarjeta sobre el fondo de la marca. Es un Server Component:
 * no tiene interacción propia, solo estructura.
 */
export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 via-background to-green-50 p-4 dark:from-blue-950/20 dark:via-background dark:to-green-950/20">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 space-y-1">
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
