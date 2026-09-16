"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  LogOut,
} from "lucide-react";
import { useSidebar } from "@/lib/context/sidebar-context";
import { NAV_ITEMS } from "@/lib/constants/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils/cn";

// Placeholder user — will be replaced by real auth data
const MOCK_USER = {
  name: "Rahul K.",
  email: "rahul@campus.edu",
  avatar: null as string | null,
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * CampusOS Desktop Sidebar
 *
 * Fixed on desktop (≥1024px), hidden on mobile (bottom nav handles mobile).
 * Collapsed state: icon-only with tooltips.
 * Active state: subtle bg + accent left border, NOT color change of icon.
 */
export function Sidebar() {
  const { isCollapsed, toggle } = useSidebar();
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={300}>
      <aside
        className={cn(
          // Only show on desktop
          "hidden lg:flex",
          "flex-col h-screen",
          "fixed left-0 top-0 z-30",
          // Surface
          "bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)]",
          // Smooth width transition
          "transition-[width] duration-200 ease-in-out",
          isCollapsed ? "w-16" : "w-60",
        )}
        aria-label="Main navigation"
      >
        {/* ── Logo / Brand ── */}
        <div
          className={cn(
            "flex items-center h-14 shrink-0 px-3",
            "border-b border-[var(--sidebar-border)]",
          )}
        >
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-2.5 min-w-0",
              "rounded-[var(--radius-md)] focus-visible:outline-2",
              "focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2",
            )}
            aria-label="CampusOS — go to dashboard"
          >
            {/* Logo mark */}
            <div
              className={cn(
                "flex items-center justify-center shrink-0",
                "size-7 rounded-[var(--radius-sm)]",
                "bg-[var(--accent)] text-white",
                "text-xs font-semibold leading-none",
                "select-none",
              )}
              aria-hidden="true"
            >
              C
            </div>
            {/* Wordmark — hidden when collapsed */}
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.span
                  key="wordmark"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <span className="text-sm font-semibold text-[var(--text-primary)] tracking-tight">
                    CampusOS
                  </span>
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* ── Navigation ── */}
        <nav
          className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 gap-0.5"
          aria-label="Application navigation"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");

            const itemContent = (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-[var(--radius-md)]",
                  "px-2.5 py-2 min-w-0",
                  "transition-colors duration-[var(--duration-small)]",
                  "focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-1",
                  isActive
                    ? [
                        "bg-[var(--sidebar-item-active-bg)]",
                        "text-[var(--sidebar-item-active-text)]",
                        "border-l-2 border-l-[var(--sidebar-item-active-border)]",
                        "pl-[calc(0.625rem-2px)]", // compensate for border
                      ]
                    : [
                        "text-[var(--text-secondary)]",
                        "hover:bg-[var(--sidebar-item-hover)]",
                        "hover:text-[var(--text-primary)]",
                        "border-l-2 border-l-transparent",
                      ],
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={cn(
                    "size-4 shrink-0",
                    isActive
                      ? "text-[var(--sidebar-item-active-text)]"
                      : "text-[var(--text-tertiary)]",
                  )}
                  aria-hidden="true"
                />
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.span
                      key={`label-${item.href}`}
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15, ease: "easeInOut" }}
                      className="overflow-hidden whitespace-nowrap text-sm font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{itemContent}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.href}>{itemContent}</div>;
          })}
        </nav>

        {/* ── Bottom: user + settings + collapse ── */}
        <div
          className={cn(
            "shrink-0 border-t border-[var(--sidebar-border)]",
            "p-2 flex flex-col gap-0.5",
          )}
        >
          {/* Settings link */}
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/settings"
                  className={cn(
                    "flex items-center justify-center gap-3 rounded-[var(--radius-md)]",
                    "px-2.5 py-2",
                    "text-[var(--text-secondary)] hover:bg-[var(--sidebar-item-hover)] hover:text-[var(--text-primary)]",
                    "transition-colors duration-[var(--duration-small)]",
                    "focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-1",
                    pathname === "/settings" && "bg-[var(--sidebar-item-active-bg)] text-[var(--sidebar-item-active-text)]",
                  )}
                  aria-label="Settings"
                  aria-current={pathname === "/settings" ? "page" : undefined}
                >
                  <Settings className="size-4 shrink-0" aria-hidden="true" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          ) : (
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-3 rounded-[var(--radius-md)]",
                "px-2.5 py-2",
                "text-[var(--text-secondary)] hover:bg-[var(--sidebar-item-hover)] hover:text-[var(--text-primary)]",
                "transition-colors duration-[var(--duration-small)]",
                "focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-1",
                pathname === "/settings" && "bg-[var(--sidebar-item-active-bg)] text-[var(--sidebar-item-active-text)]",
              )}
              aria-current={pathname === "/settings" ? "page" : undefined}
            >
              <Settings className="size-4 shrink-0 text-[var(--text-tertiary)]" aria-hidden="true" />
              <span className="text-sm font-medium">Settings</span>
            </Link>
          )}

          {/* User avatar + menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-2.5 rounded-[var(--radius-md)]",
                  "p-2 w-full text-left",
                  "hover:bg-[var(--sidebar-item-hover)]",
                  "transition-colors duration-[var(--duration-small)]",
                  "focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-1",
                )}
                aria-label="User menu"
              >
                <Avatar className="size-7 shrink-0">
                  {MOCK_USER.avatar && (
                    <AvatarImage src={MOCK_USER.avatar} alt={MOCK_USER.name} />
                  )}
                  <AvatarFallback className="text-xs">
                    {getInitials(MOCK_USER.name)}
                  </AvatarFallback>
                </Avatar>
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div
                      key="user-info"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15, ease: "easeInOut" }}
                      className="overflow-hidden whitespace-nowrap min-w-0"
                    >
                      <p className="text-xs font-medium text-[var(--text-primary)] truncate">
                        {MOCK_USER.name}
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)] truncate">
                        {MOCK_USER.email}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="right"
              align="end"
              sideOffset={4}
              className="w-52"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="size-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive>
                <LogOut className="size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Collapse toggle */}
          <button
            onClick={toggle}
            className={cn(
              "flex items-center justify-center gap-2 rounded-[var(--radius-md)]",
              "px-2.5 py-2 w-full",
              "text-[var(--text-tertiary)] hover:bg-[var(--sidebar-item-hover)] hover:text-[var(--text-primary)]",
              "transition-colors duration-[var(--duration-small)]",
              "focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-1",
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="size-4" aria-hidden="true" />
            ) : (
              <>
                <PanelLeftClose className="size-4 shrink-0" aria-hidden="true" />
                <span className="text-xs font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
