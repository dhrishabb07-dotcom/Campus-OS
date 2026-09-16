import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils/cn";

/**
 * CampusOS Label
 * Always visible — never used as placeholder-only (per DESIGN_SYSTEM.md).
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-sm font-medium text-[var(--text-primary)] leading-none",
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-40",
      "select-none",
      className
    )}
    {...props}
  />
));

Label.displayName = "Label";

export { Label };
