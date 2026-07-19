"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { logoutAction } from "@/modules/auth";

/**
 * Cierra la sesión vía Server Action (Supabase Auth invalida la sesión y limpia cookies).
 * `useTransition` evita bloquear la UI mientras corre la acción, que además redirige a /login.
 */
const LogOutBtn = ({ iconOnly = false }: { iconOnly?: boolean }) => {
  const [isPending, startTransition] = useTransition();

  const logOut = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return iconOnly ? (
    <button
      onClick={logOut}
      disabled={isPending}
      aria-label="Cerrar sesión"
      className="flex h-8 w-8 items-center justify-center rounded-lg text-sidebar-foreground/50 hover:bg-white/10 hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring disabled:opacity-50"
    >
      <LogOut className="h-4 w-4" />
    </button>
  ) : (
    <div className="flex items-center gap-3 w-full">
      <Button
        variant="outline"
        className="text-red-600 dark:text-red-400"
        onClick={logOut}
        disabled={isPending}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Salir
      </Button>
    </div>
  );
};

export default LogOutBtn;
