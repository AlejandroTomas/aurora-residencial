import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import useAsyncPromise from "@/hooks/useAsyncPromise";

const LogOutBtn = ({ iconOnly = false }: { iconOnly?: boolean }) => {
  const { isLoading, wrapperFunction } = useAsyncPromise("LogOutBtn");

  const logOut = () => {
    wrapperFunction(async () => {});
  };

  return iconOnly ? (
    <button
      onClick={logOut}
      disabled={isLoading}
      aria-label="Cerrar sesión"
      className="flex h-8 w-8 items-center justify-center rounded-lg text-sidebar-foreground/50 hover:bg-white/10 hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
    >
      <LogOut className="h-4 w-4" />
    </button>
  ) : (
    <div className="flex items-center gap-3 w-full">
      <Button
        variant="outline"
        className="text-red-600 dark:text-red-400"
        onClick={logOut}
        disabled={isLoading}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Salir
      </Button>
    </div>
  );
};

export default LogOutBtn;
