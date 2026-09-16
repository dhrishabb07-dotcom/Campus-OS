"use client";

import { Search, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useCommandPalette } from "@/lib/context/command-palette-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils/cn";

interface HeaderProps {
  title: string;
}

/**
 * CampusOS App Header
 *
 * Fixed at top of the main content area.
 * Shows the current page title, Cmd+K trigger, and theme toggle.
 * On mobile, doubles as the primary title bar.
 */
export function Header({ title }: HeaderProps) {
  const { open } = useCommandPalette();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch for theme
  useEffect(() => setMounted(true), []);

  const ThemeIcon = !mounted
    ? Monitor
    : theme === "light"
      ? Sun
      : theme === "dark"
        ? Moon
        : Monitor;

  return (
    <header
      className={cn(
        "sticky top-0 z-20",
        "flex items-center justify-between",
        "h-14 px-4 sm:px-6",
        "bg-[var(--header-bg)] border-b border-[var(--header-border)]",
      )}
      aria-label="Page header"
    >
      {/* ── Left: Page title ── */}
      <div className="flex items-center min-w-0">
        <h1
          className={cn(
            "text-base font-semibold text-[var(--text-primary)] truncate",
            "leading-[var(--line-height-tight)]",
          )}
        >
          {title}
        </h1>
      </div>

      {/* ── Right: Controls ── */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Cmd+K search trigger */}
        <Button
          variant="ghost"
          size="icon"
          onClick={open}
          className="text-[var(--text-tertiary)]"
          aria-label="Open command palette (⌘K)"
          title="Command palette (⌘K)"
        >
          <Search className="size-4" />
        </Button>

        {/* Theme toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-[var(--text-tertiary)]"
              aria-label="Toggle color theme"
              title="Color theme"
            >
              <ThemeIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={4}>
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="size-4" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="size-4" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Monitor className="size-4" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
