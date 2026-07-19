"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const ROOT_BACKGROUND = {
  light: "#eff6ff",
  dark: "#0f172a",
} as const;

export function ThemeToggle() {
  const { resolvedTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!resolvedTheme || typeof window === "undefined") return;

    document.documentElement.style.setProperty(
      "--bg-root",
      ROOT_BACKGROUND[resolvedTheme === "dark" ? "dark" : "light"],
    );
  }, [resolvedTheme]);

  if (!mounted) return null;

  const activeTheme = resolvedTheme ?? theme ?? "light";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setTheme(activeTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
