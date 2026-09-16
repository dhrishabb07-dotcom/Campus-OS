import type { Metadata } from "next";
import { AppShell } from "./app-shell";

export const metadata: Metadata = {
  title: {
    template: "%s — CampusOS",
    default: "CampusOS",
  },
};

/**
 * (app) route group layout.
 * Wraps all protected routes in the application shell
 * (sidebar + mobile nav + command palette).
 *
 * Auth protection will be enforced via middleware.ts (future phase).
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
