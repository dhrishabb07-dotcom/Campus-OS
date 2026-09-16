"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  BookOpen,
  Settings,
  Search,
  ArrowRight,
  Plus,
} from "lucide-react";
import { useCommandPalette } from "@/lib/context/command-palette-context";
import { useKeyboardShortcut } from "@/lib/hooks/use-keyboard-shortcut";
import { cn } from "@/lib/utils/cn";

// ── Command definitions ────────────────────────────────────────────────────────

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  group: "navigate" | "create";
  action: () => void;
  shortcut?: string;
}

function useCommands(
  closeCallback: () => void,
  router: ReturnType<typeof useRouter>,
): Command[] {
  const navigate = (href: string) => {
    router.push(href);
    closeCallback();
  };

  return [
    {
      id: "nav-dashboard",
      label: "Dashboard",
      description: "Go to your daily briefing",
      icon: LayoutDashboard,
      group: "navigate",
      action: () => navigate("/dashboard"),
    },
    {
      id: "nav-schedule",
      label: "Schedule",
      description: "View your weekly timetable",
      icon: CalendarDays,
      group: "navigate",
      action: () => navigate("/schedule"),
    },
    {
      id: "nav-tasks",
      label: "Tasks",
      description: "Manage your assignments",
      icon: CheckSquare,
      group: "navigate",
      action: () => navigate("/tasks"),
    },
    {
      id: "nav-subjects",
      label: "Subjects",
      description: "View enrolled subjects",
      icon: BookOpen,
      group: "navigate",
      action: () => navigate("/subjects"),
    },
    {
      id: "nav-settings",
      label: "Settings",
      description: "Profile and preferences",
      icon: Settings,
      group: "navigate",
      action: () => navigate("/settings"),
    },
    {
      id: "create-task",
      label: "New Task",
      description: "Add a new task or assignment",
      icon: Plus,
      group: "create",
      action: () => {
        navigate("/tasks");
        // TODO: Open task creation sheet after navigation
      },
      shortcut: "T",
    },
  ];
}

// ── Command Palette Component ─────────────────────────────────────────────────

/**
 * CampusOS Command Palette
 *
 * Triggered by Cmd/Ctrl+K globally.
 * Fuzzy search through navigation commands and quick actions.
 * Keyboard navigable: ↑↓ to move, Enter to select, Esc to close.
 */
export function CommandPalette() {
  const { isOpen, close } = useCommandPalette();
  const router = useRouter();
  const commands = useCommands(close, router);

  // Cmd+K global shortcut — allow in inputs since this IS a search
  useKeyboardShortcut(
    "k",
    () => {
      if (isOpen) close();
    },
    { ctrl: true, meta: true, allowInInputs: true },
  );

  // Escape closes
  useKeyboardShortcut("Escape", close, { allowInInputs: true });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="cmd-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-[var(--cmd-overlay)]"
            onClick={close}
            aria-hidden="true"
          />

          {/* Palette */}
          <motion.div
            key="cmd-palette"
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "fixed left-1/2 top-[15%] z-50 -translate-x-1/2",
              "w-full max-w-lg mx-4",
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <PaletteContent commands={commands} onClose={close} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Palette Content (cmdk-powered) ────────────────────────────────────────────

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

function PaletteContent({
  commands,
  onClose,
}: {
  commands: Command[];
  onClose: () => void;
}) {
  const navCommands = commands.filter((c) => c.group === "navigate");
  const createCommands = commands.filter((c) => c.group === "create");

  return (
    <Command
      className={cn(
        "overflow-hidden",
        "rounded-[var(--radius-xl)] border border-[var(--cmd-border)]",
        "bg-[var(--cmd-bg)] shadow-[var(--shadow-xl)]",
      )}
    >
      {/* Search input */}
      <div className="flex items-center border-b border-[var(--border-subtle)] px-3">
        <Search
          className="mr-2 size-4 shrink-0 text-[var(--text-tertiary)]"
          aria-hidden="true"
        />
        <CommandInput
          placeholder="Search pages and actions…"
          className={cn(
            "flex h-12 w-full border-0 bg-transparent",
            "text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]",
            "outline-none focus:outline-none focus:ring-0",
          )}
        />
        <kbd
          className={cn(
            "ml-2 hidden sm:inline-flex",
            "h-5 items-center gap-0.5 rounded px-1.5",
            "border border-[var(--border-default)] bg-[var(--bg-muted)]",
            "text-[10px] font-medium text-[var(--text-tertiary)]",
          )}
          aria-label="Escape to close"
        >
          ESC
        </kbd>
      </div>

      <CommandList className="max-h-[360px] overflow-y-auto p-1.5">
        <CommandEmpty className="py-8 text-center text-sm text-[var(--text-tertiary)]">
          No results found.
        </CommandEmpty>

        {/* Navigate group */}
        <CommandGroup
          heading="Navigate"
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[var(--text-tertiary)] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide"
        >
          {navCommands.map((cmd) => (
            <PaletteItem key={cmd.id} command={cmd} />
          ))}
        </CommandGroup>

        <CommandSeparator className="my-1 -mx-1.5 h-px bg-[var(--border-subtle)]" />

        {/* Create group */}
        <CommandGroup
          heading="Quick Actions"
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[var(--text-tertiary)] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide"
        >
          {createCommands.map((cmd) => (
            <PaletteItem key={cmd.id} command={cmd} />
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

function PaletteItem({ command }: { command: Command }) {
  const Icon = command.icon;

  return (
    <CommandItem
      key={command.id}
      value={command.label}
      onSelect={command.action}
      className={cn(
        "flex items-center gap-3 rounded-[var(--radius-md)]",
        "px-2 py-2 text-sm cursor-pointer",
        "text-[var(--text-primary)]",
        "aria-selected:bg-[var(--cmd-item-hover)]",
        "transition-colors duration-[var(--duration-micro)]",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center size-7 shrink-0",
          "rounded-[var(--radius-sm)] bg-[var(--bg-muted)]",
          "text-[var(--text-tertiary)]",
        )}
        aria-hidden="true"
      >
        <Icon className="size-4" />
      </div>

      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="font-medium truncate">{command.label}</span>
        {command.description && (
          <span className="text-xs text-[var(--text-tertiary)] truncate">
            {command.description}
          </span>
        )}
      </div>

      {command.shortcut ? (
        <kbd
          className={cn(
            "hidden sm:inline-flex items-center gap-0.5",
            "h-5 rounded px-1.5 border border-[var(--border-default)]",
            "bg-[var(--bg-muted)] text-[10px] font-medium text-[var(--text-tertiary)]",
          )}
        >
          {command.shortcut}
        </kbd>
      ) : (
        <ArrowRight
          className="size-3.5 text-[var(--text-disabled)] opacity-0 group-aria-selected:opacity-100 transition-opacity"
          aria-hidden="true"
        />
      )}
    </CommandItem>
  );
}
