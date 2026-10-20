import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppShell } from "./app-shell";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

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
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: { name: string; email: string } | undefined;
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) redirect("/login");
    const [{ data: profile }, { data: semester }] = await Promise.all([
      supabase.from("profiles").select("full_name, university, degree").eq("id", authUser.id).maybeSingle(),
      supabase.from("semesters").select("id").eq("user_id", authUser.id).eq("is_current", true).maybeSingle(),
    ]);
    const { count } = semester ? await supabase.from("subjects").select("id", { count: "exact", head: true }).eq("user_id", authUser.id).eq("semester_id", semester.id) : { count: 0 };
    if (!profile?.university || !profile.degree || !semester || !count) redirect("/setup");
    user = { name: (profile as { full_name?: string }).full_name || authUser.email || "Student", email: authUser.email ?? "" };
  }
  return <AppShell user={user}>{children}</AppShell>;
}
