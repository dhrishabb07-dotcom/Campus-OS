import * as React from "react";
import { cn } from "@/lib/utils/cn";

/**
 * CampusOS Skeleton
 *
 * Structural skeleton loader with shimmer animation.
 * Always match the shape of the content it replaces.
 * Never use generic spinners (per DESIGN_SYSTEM.md).
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

/**
 * Text skeleton — mimics a line of text with natural irregular widths
 */
function SkeletonText({
  className,
  lines = 1,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { lines?: number }) {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4 rounded-full"
          style={{
            // Natural irregular widths for multi-line text
            width: lines === 1 ? "100%" : i === lines - 1 ? "75%" : "100%",
          }}
        />
      ))}
    </div>
  );
}

export { Skeleton, SkeletonText };
