import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

/**
 * CampusOS Badge
 *
 * Small, muted, informational labels. Not decorative.
 * Used for task priorities, statuses, subject types, etc.
 */
const badgeVariants = cva(
  [
    "inline-flex items-center gap-1",
    "text-xs font-medium leading-none",
    "rounded-[var(--radius-sm)]",
    "px-2 py-1",
    "border",
    "select-none",
  ],
  {
    variants: {
      variant: {
        default: [
          "border-[var(--border-subtle)] bg-[var(--bg-muted)]",
          "text-[var(--text-secondary)]",
        ],
        // Priority variants
        urgent: [
          "border-[var(--color-danger-500)]/30 bg-[var(--color-danger-50)]",
          "text-[var(--color-danger-700)]",
          "dark:bg-[var(--color-danger-500)]/10 dark:text-[var(--color-danger-500)] dark:border-[var(--color-danger-500)]/20",
        ],
        high: [
          "border-[var(--color-warning-500)]/30 bg-[var(--color-warning-50)]",
          "text-[var(--color-warning-600)]",
          "dark:bg-[var(--color-warning-500)]/10 dark:text-[var(--color-warning-500)] dark:border-[var(--color-warning-500)]/20",
        ],
        medium: [
          "border-[var(--accent)]/20 bg-[var(--accent-muted)]",
          "text-[var(--accent-text)]",
        ],
        low: [
          "border-[var(--border-subtle)] bg-[var(--bg-muted)]",
          "text-[var(--text-tertiary)]",
        ],
        // Status variants
        success: [
          "border-[var(--color-success-500)]/30 bg-[var(--color-success-50)]",
          "text-[var(--color-success-700)]",
          "dark:bg-[var(--color-success-500)]/10 dark:text-[var(--color-success-500)] dark:border-[var(--color-success-500)]/20",
        ],
        // Accent
        accent: [
          "border-[var(--accent)]/30 bg-[var(--accent-muted)]",
          "text-[var(--accent-text)]",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
