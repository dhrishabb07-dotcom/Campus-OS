"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { BOTTOM_NAV_ITEMS } from "@/lib/constants/navigation";

/**
 * CampusOS Mobile Bottom Navigation
 *
 * Shown only on mobile (< 1024px).
 * 5 tabs: Dashboard, Schedule, Tasks, Subjects, Settings.
 * Active indicator: accent color on icon + label. Subtle top border.
 * Safe area aware for iOS devices.
 */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        // Only on mobile/tablet
        "flex lg:hidden",
        // Position
        "fixed bottom-0 left-0 right-0 z-30",
        // Surface
        "bg-[var(--header-bg)] border-t border-[var(--header-border)]",
        // Layout
        "h-16 pb-[env(safe-area-inset-bottom,0px)]",
        "px-2",
      )}
      aria-label="Mobile navigation"
    >
      <ul
        className="flex items-center justify-around w-full h-full list-none m-0 p-0"
        role="list"
      >
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (
            <li key={item.href} className="flex flex-1 justify-center">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1",
                  "min-w-[44px] h-12 px-1 rounded-[var(--radius-md)]",
                  "transition-colors duration-[var(--duration-small)]",
                  "focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-1",
                  isActive
                    ? "text-[var(--accent)]"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]",
                )}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label}
              >
                <Icon
                  className={cn(
                    "size-5 transition-transform duration-[var(--duration-small)]",
                    isActive && "scale-[1.08]",
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "text-[10px] font-medium leading-none",
                    isActive ? "text-[var(--accent)]" : "text-[var(--text-tertiary)]",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
