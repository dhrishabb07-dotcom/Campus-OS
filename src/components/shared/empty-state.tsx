import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
  variant?: "default" | "search" | "error";
}

/**
 * CampusOS Empty State
 *
 * Helpful text + single CTA. No decorative illustrations (per DESIGN_SYSTEM.md).
 * The text IS the interface — make it actionable, not motivational.
 *
 * @example
 * <EmptyState
 *   icon={CheckSquare}
 *   title="No tasks yet"
 *   description="Add your first task to start tracking your work."
 *   action={{ label: "Add task", onClick: openTaskSheet }}
 * />
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  variant = "default",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        "px-6 py-12 gap-3",
        className
      )}
      role="status"
      aria-live="polite"
    >
      {Icon && (
        <div
          className={cn(
            "flex items-center justify-center size-12 rounded-[var(--radius-DEFAULT)]",
            variant === "error"
              ? "bg-[var(--color-danger-50)] text-[var(--color-danger-500)] dark:bg-[var(--color-danger-500)]/10"
              : "bg-[var(--bg-muted)] text-[var(--text-tertiary)]"
          )}
          aria-hidden="true"
        >
          <Icon className="size-6" strokeWidth={1.5} />
        </div>
      )}

      <div className="flex flex-col gap-1 max-w-xs">
        <p
          className={cn(
            "text-sm font-medium",
            variant === "error"
              ? "text-[var(--color-danger-600)]"
              : "text-[var(--text-primary)]"
          )}
        >
          {title}
        </p>
        {description && (
          <p className="text-sm text-[var(--text-tertiary)] leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && (
        <Button
          variant={variant === "error" ? "outline" : "primary"}
          size="sm"
          onClick={action.onClick}
          asChild={!!action.href}
          className="mt-1"
        >
          {action.href ? (
            <a href={action.href}>{action.label}</a>
          ) : (
            action.label
          )}
        </Button>
      )}
    </div>
  );
}
