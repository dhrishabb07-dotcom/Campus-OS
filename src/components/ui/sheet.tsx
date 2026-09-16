import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

/**
 * CampusOS Sheet (Drawer)
 *
 * Used for forms that slide in from the right (desktop) or bottom (mobile).
 * Preferred over Dialog for data entry forms.
 */
const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-[var(--cmd-overlay)]",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = "SheetOverlay";

const sheetVariants = cva(
  [
    "fixed z-50",
    "bg-[var(--bg-base)] border-[var(--border-subtle)]",
    "shadow-[var(--shadow-xl)]",
    "transition ease-in-out",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:duration-[var(--duration-medium)]",
    "data-[state=open]:duration-[var(--duration-large)]",
  ],
  {
    variants: {
      side: {
        right: [
          "inset-y-0 right-0 h-full w-full sm:max-w-md border-l",
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        ],
        bottom: [
          "inset-x-0 bottom-0 w-full max-h-[85vh] rounded-t-[var(--radius-xl)] border-t",
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        ],
        left: [
          "inset-y-0 left-0 h-full w-full sm:max-w-md border-r",
          "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        ],
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      <div className="flex flex-col h-full overflow-y-auto">
        {children}
      </div>
      <SheetPrimitive.Close
        className={cn(
          "absolute right-4 top-4 rounded-[var(--radius-sm)]",
          "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]",
          "transition-colors duration-[var(--duration-small)]",
          "focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
        )}
        aria-label="Close"
      >
        <X className="size-4" />
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = "SheetContent";

function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 px-6 pt-6 pb-4",
        "border-b border-[var(--border-subtle)]",
        className
      )}
      {...props}
    />
  );
}
SheetHeader.displayName = "SheetHeader";

function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 px-6 py-4",
        "border-t border-[var(--border-subtle)] mt-auto",
        className
      )}
      {...props}
    />
  );
}
SheetFooter.displayName = "SheetFooter";

function SheetBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1 px-6 py-5 space-y-4", className)} {...props} />
  );
}
SheetBody.displayName = "SheetBody";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn(
      "text-base font-semibold text-[var(--text-primary)] leading-tight",
      className
    )}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-[var(--text-secondary)]", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

export {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};
