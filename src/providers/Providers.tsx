"use client";

import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";

import { Toaster as ToasterSonner } from "@/components/ui/sonner";
import store from "@/store";
import { GlobalConfirmDialog } from "@/components/compound/GlobalConfirmDialog";
import { NetworkBanner } from "@/components/feedback/NetworkBanner";
import SileoThemeHandler from "@/components/feedback/SileoThemeHandler";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ToasterSonner />
        <SileoThemeHandler />
        <GlobalConfirmDialog />
        <NetworkBanner />
        {children}
      </ThemeProvider>
    </Provider>
  );
}
