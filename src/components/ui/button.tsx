import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

/**
 * CampusOS Button
 *
 * Customized from shadcn/ui defaults to match CampusOS visual identity.
 * Three variants: solid (primary), outline (secondary), ghost (tertiary).
 * No excessive shadows, no gradients.
 */
const buttonVariants = cva(
  // Base styles
  [
    "inline-flex items-center justify-center gap-2",
    "font-medium text-sm leading-none",
    "rounded-[var(--radius-md)]",
    "border border-transparent",
    "transition-colors duration-[var(--duration-small)]",
    "focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2",
    "disabled:pointer-events-none disabled:opacity-40",
    "select-none",
    // Icon sizing inside buttons
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        /** Primary action — solid accent background */
        primary: [
          "bg-[var(--accent)] text-white",
          "hover:bg-[var(--accent-hover)]",
          "active:scale-[0.98]",
        ],
        /** Secondary action — outlined */
        outline: [
          "border-[var(--border-default)] bg-transparent text-[var(--text-primary)]",
          "hover:bg-[var(--interactive-bg-hover)] hover:border-[var(--border-strong)]",
          "active:bg-[var(--interactive-bg-active)]",
        ],
        /** Tertiary action — ghost, no border */
        ghost: [
          "bg-transparent text-[var(--text-secondary)]",
          "hover:bg-[var(--interactive-bg-hover)] hover:text-[var(--text-primary)]",
          "active:bg-[var(--interactive-bg-active)]",
        ],
        /** Destructive action */
        destructive: [
          "bg-[var(--color-danger-500)] text-white",
          "hover:bg-[var(--color-danger-600)]",
          "active:scale-[0.98]",
        ],
        /** Ghost destructive — for confirmations */
        "ghost-destructive": [
          "bg-transparent text-[var(--color-danger-500)]",
          "hover:bg-[var(--color-danger-50)] dark:hover:bg-[var(--color-danger-50)]/10",
        ],
        /** Link style */
        link: [
          "bg-transparent text-[var(--accent)]",
          "underline-offset-4 hover:underline",
          "h-auto p-0",
        ],
      },
      size: {
        xs: "h-7 px-2.5 text-xs gap-1.5",
        sm: "h-8 px-3 text-sm",
        md: "h-9 px-4 text-sm",
        lg: "h-10 px-5 text-base",
        xl: "h-11 px-6 text-base",
        /** Square icon-only button */
        icon: "size-9 p-0",
        "icon-sm": "size-7 p-0",
        "icon-lg": "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Renders the button's inner element as a child component (e.g. for Next.js Link) */
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
