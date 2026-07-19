"use client";

import { ThemeProvider } from "next-themes";

import { Toaster as ToasterSonner } from "@/components/ui/sonner";
import { GlobalConfirmDialog } from "@/components/compound/GlobalConfirmDialog";
import { NetworkBanner } from "@/components/feedback/NetworkBanner";
import SileoThemeHandler from "@/components/feedback/SileoThemeHandler";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ToasterSonner />
      <SileoThemeHandler />
      <GlobalConfirmDialog />
      <NetworkBanner />
      {children}
    </ThemeProvider>
  );
}
