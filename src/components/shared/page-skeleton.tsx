import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";

/**
 * CampusOS Page Skeleton System
 *
 * Modular skeleton blocks that mirror real page structure.
 * Compose these to match the exact layout of your content.
 * NEVER use generic spinners (per DESIGN_SYSTEM.md).
 */

/** Dashboard skeleton */
export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8 p-6 animate-in fade-in-0 duration-200">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Today's classes */}
      <section className="flex flex-col gap-3">
        <Skeleton className="h-4 w-28" />
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <ClassSlotSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* Tasks */}
      <section className="flex flex-col gap-3">
        <Skeleton className="h-4 w-28" />
        <div className="flex flex-col gap-2">
          {[1, 2].map((i) => (
            <TaskItemSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

/** Task list skeleton */
export function TaskListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-2 p-6 animate-in fade-in-0 duration-200">
      {Array.from({ length: count }).map((_, i) => (
        <TaskItemSkeleton key={i} />
      ))}
    </div>
  );
}

/** Schedule skeleton */
export function ScheduleSkeleton() {
  return (
    <div className="p-6 animate-in fade-in-0 duration-200">
      {/* Day headers */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-8" />
        ))}
      </div>
      {/* Time slots */}
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex gap-2">
            <Skeleton className="h-12 w-14 shrink-0" />
            <div className="grid grid-cols-5 gap-2 flex-1">
              {[1, 2, 3, 4, 5].map((j) => (
                <Skeleton
                  key={j}
                  className={cn("h-12", (i + j) % 3 === 0 ? "opacity-0" : "")}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Subject list skeleton */
export function SubjectListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-2 p-6 animate-in fade-in-0 duration-200">
      {Array.from({ length: count }).map((_, i) => (
        <SubjectRowSkeleton key={i} />
      ))}
    </div>
  );
}

// ── Primitive skeleton blocks ─────────────────────────────────────────────────

function ClassSlotSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3 px-4 rounded-[var(--radius-DEFAULT)] border border-[var(--border-subtle)]">
      <Skeleton className="size-10 shrink-0 rounded-[var(--radius-sm)]" />
      <div className="flex flex-col gap-1.5 flex-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-3 w-16 shrink-0" />
    </div>
  );
}

function TaskItemSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3">
      <Skeleton className="size-4 rounded-[var(--radius-sm)] shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-5 w-12 shrink-0" />
    </div>
  );
}

function SubjectRowSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3 px-4 rounded-[var(--radius-DEFAULT)] border border-[var(--border-subtle)]">
      <Skeleton className="size-3 rounded-full shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-5 w-14 shrink-0" />
    </div>
  );
}
