"use client";

import { useSidebar } from "@/lib/context/sidebar-context";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CommandPalette } from "@/components/layout/command-palette";
import { useKeyboardShortcut } from "@/lib/hooks/use-keyboard-shortcut";
import { useCommandPalette } from "@/lib/context/command-palette-context";
import { cn } from "@/lib/utils/cn";

/**
 * App Shell — Client wrapper for the (app) route group.
 * Manages sidebar offset, keyboard shortcut registration, command palette.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  const { open } = useCommandPalette();

  // Register Cmd/Ctrl+K globally to open command palette
  useKeyboardShortcut("k", open, {
    ctrl: true,
    meta: true,
    allowInInputs: false,
  });

  return (
    <div className="flex h-full min-h-screen">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area — offset by sidebar width on desktop */}
      <div
        className={cn(
          "flex flex-col flex-1 min-w-0",
          // On desktop: offset for sidebar
          "lg:transition-[margin-left] lg:duration-200 lg:ease-in-out",
          isCollapsed ? "lg:ml-16" : "lg:ml-60",
          // On mobile: add bottom padding for bottom nav
          "pb-16 lg:pb-0",
        )}
      >
        {children}
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Command Palette */}
      <CommandPalette />
    </div>
  );
}
