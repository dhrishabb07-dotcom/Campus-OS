import * as React from "react";
import { cn } from "@/lib/utils/cn";

/**
 * CampusOS Textarea
 */
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full resize-y",
        "text-sm text-[var(--text-primary)] placeholder:text-[var(--input-placeholder)]",
        "rounded-[var(--radius-md)] border border-[var(--input-border)] bg-[var(--input-bg)]",
        "px-3 py-2",
        "outline-none transition-colors duration-[var(--duration-small)]",
        "focus:border-[var(--input-border-focus)]",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
