import { redirect } from "next/navigation";

/**
 * Root page — redirects to /dashboard (or /login when auth is wired up).
 * Middleware will handle auth protection. For now, send to dashboard.
 */
export default function RootPage() {
  redirect("/dashboard");
}
