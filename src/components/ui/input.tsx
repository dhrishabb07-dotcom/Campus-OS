import * as React from "react";
import { cn } from "@/lib/utils/cn";

/**
 * CampusOS Input
 *
 * Clean, labeled input with custom focus ring.
 * No floating labels — labels must always be visible (per DESIGN_SYSTEM.md).
 */
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        // Layout
        "flex h-9 w-full",
        // Typography
        "text-sm text-[var(--text-primary)] placeholder:text-[var(--input-placeholder)]",
        // Surface
        "rounded-[var(--radius-md)] border border-[var(--input-border)] bg-[var(--input-bg)]",
        // Spacing
        "px-3 py-2",
        // Focus
        "outline-none transition-colors duration-[var(--duration-small)]",
        "focus:border-[var(--input-border-focus)] focus:ring-0",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-40",
        // File input styling
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--text-secondary)]",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
