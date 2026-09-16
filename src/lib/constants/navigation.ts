import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  BookOpen,
  Settings,
} from "lucide-react";
import type { NavItem } from "@/types";

/**
 * Primary sidebar navigation items.
 * Order determines display order in sidebar and bottom nav.
 */
export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Schedule",
    href: "/schedule",
    icon: CalendarDays,
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    label: "Subjects",
    href: "/subjects",
    icon: BookOpen,
  },
];

/**
 * Bottom nav items (mobile) — subset of NAV_ITEMS + Settings.
 * Max 5 items to fit comfortably on 360px screens.
 */
export const BOTTOM_NAV_ITEMS: NavItem[] = [
  ...NAV_ITEMS,
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];
