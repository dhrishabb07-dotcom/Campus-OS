"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";
import { SidebarProvider } from "@/lib/context/sidebar-context";
import { CommandPaletteProvider } from "@/lib/context/command-palette-context";

/**
 * Combines all client-side providers for the application.
 * Mounted in the root layout to wrap the entire app.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <SidebarProvider>
        <CommandPaletteProvider>{children}</CommandPaletteProvider>
      </SidebarProvider>
    </NextThemesProvider>
  );
}
