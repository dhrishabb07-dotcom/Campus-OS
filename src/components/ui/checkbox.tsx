import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * CampusOS Checkbox
 *
 * Clean, accessible checkbox with animated check icon.
 * Used for task completion throughout the app.
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // Size and shape
      "size-[18px] shrink-0 rounded-[var(--radius-sm)]",
      // Border and background
      "border border-[var(--border-default)] bg-[var(--input-bg)]",
      // Checked state
      "data-[state=checked]:bg-[var(--accent)] data-[state=checked]:border-[var(--accent)]",
      // Focus
      "focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2",
      // Hover
      "hover:border-[var(--border-strong)] transition-colors duration-[var(--duration-small)]",
      // Disabled
      "disabled:cursor-not-allowed disabled:opacity-40",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn(
        "flex items-center justify-center text-white"
      )}
    >
      <Check className="size-3 stroke-[3]" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = "Checkbox";

export { Checkbox };
