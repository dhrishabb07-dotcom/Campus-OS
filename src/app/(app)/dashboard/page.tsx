import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { format } from "date-fns";
import { ArrowRight, BookOpen, Building2, CalendarDays, GraduationCap } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Dashboard" };

type Profile = {
  full_name: string;
  university: string | null;
  degree: string | null;
};

type Semester = {
  id: string;
  name: string;
  semester_number: number | null;
};

type Subject = {
  id: string;
  name: string;
  code: string | null;
  credits: number | string | null;
  color: string;
  subject_type: "theory" | "lab" | "elective";
};

type DashboardData =
  | { status: "ready"; name: string; profile: Profile; semester: Semester; subjects: Subject[] }
  | { status: "unconfigured" | "error" };

async function getDashboardData(): Promise<DashboardData> {
  if (!isSupabaseConfigured()) return { status: "unconfigured" };

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) redirect("/login");

  const [profileResult, semesterResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, university, degree")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("semesters")
      .select("id, name, semester_number")
      .eq("user_id", user.id)
      .eq("is_current", true)
      .maybeSingle(),
  ]);

  if (profileResult.error || semesterResult.error) return { status: "error" };

  const profile = profileResult.data as Profile | null;
  const semester = semesterResult.data as Semester | null;
  if (!profile?.university || !profile.degree || !semester) redirect("/setup");

  const subjectsResult = await supabase
    .from("subjects")
    .select("id, name, code, credits, color, subject_type")
    .eq("user_id", user.id)
    .eq("semester_id", semester.id)
    .order("name");

  if (subjectsResult.error) return { status: "error" };

  return {
    status: "ready",
    name: profile.full_name.trim() || user.email?.split("@")[0] || "there",
    profile,
    semester,
    subjects: (subjectsResult.data ?? []) as Subject[],
  };
}

export default async function DashboardPage() {
  await connection();
  const data = await getDashboardData();
  const today = new Date();
  const dayName = format(today, "EEEE");
  const dateLabel = format(today, "d MMMM yyyy");
  const hour = today.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const firstName = data.status === "ready" ? data.name.split(/\s+/)[0] : "there";
  const subjectCount = data.status === "ready" ? data.subjects.length : 0;

  return (
    <>
      <Header title="Dashboard" />

      <main className="max-w-4xl flex-1 space-y-8 px-4 py-6 sm:px-6">
        <section aria-label="Overview">
          <p className="text-label mb-1">
            {data.status === "ready" ? dayName : "Your student workspace"}
          </p>
          <h2 className="text-2xl font-semibold leading-tight tracking-tight text-[var(--text-primary)]">
            {data.status === "ready"
              ? greeting + ", " + firstName + "."
              : "Your day at a glance."}
          </h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {data.status === "ready"
              ? data.semester.name +
                " · " +
                subjectCount +
                " " +
                (subjectCount === 1 ? "subject" : "subjects") +
                " · " +
                dateLabel
              : data.status === "unconfigured"
                ? "Connect CampusOS to your Supabase project to load your student profile."
                : "We couldn’t load your student profile. Refresh the dashboard to try again."}
          </p>
        </section>

        <section
          aria-label="Academic profile"
          className="flex flex-col justify-between gap-5 rounded-[var(--radius-DEFAULT)] border border-[var(--border-subtle)] bg-[var(--bg-base)] p-5 sm:flex-row sm:items-center"
        >
          {data.status === "ready" ? (
            <>
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-muted)] text-[var(--accent)]">
                  <GraduationCap className="size-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-label mb-1">CURRENT SEMESTER</p>
                  <h3 className="truncate text-base font-semibold text-[var(--text-primary)]">
                    {data.semester.name}
                  </h3>
                  <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-sm text-[var(--text-secondary)]">
                    <span>{data.profile.degree}</span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Building2 className="size-3.5" aria-hidden="true" />
                      {data.profile.university}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2 border-t border-[var(--border-subtle)] pt-4 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                <BookOpen
                  className="size-4 text-[var(--text-tertiary)]"
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {subjectCount}
                </span>
                <span className="text-sm text-[var(--text-tertiary)]">
                  {subjectCount === 1 ? "subject" : "subjects"}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-muted)] text-[var(--accent)]">
                <CalendarDays className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-label mb-1">YOUR STUDY CONTEXT</p>
                <h3 className="text-base font-semibold text-[var(--text-primary)]">
                  {data.status === "unconfigured"
                    ? "Supabase is not connected"
                    : "Your semester details are temporarily unavailable"}
                </h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {data.status === "unconfigured"
                    ? "Add the Supabase values from .env.example to .env.local."
                    : "Your saved profile and academic data are still in Supabase."}
                </p>
              </div>
            </div>
          )}
        </section>

        <section aria-labelledby="subjects-heading">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3
              id="subjects-heading"
              className="text-sm font-semibold text-[var(--text-primary)]"
            >
              Your subjects
            </h3>
            {data.status === "ready" && (
              <Button
                variant="ghost"
                size="xs"
                asChild
                className="gap-1 text-[var(--text-tertiary)]"
              >
                <Link href="/subjects">
                  View subjects <ArrowRight className="size-3" />
                </Link>
              </Button>
            )}
          </div>

          {data.status === "ready" && data.subjects.length > 0 ? (
            <div className="flex flex-col divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
              {data.subjects.map((subject) => (
                <SubjectRow key={subject.id} subject={subject} />
              ))}
            </div>
          ) : (
            <div className="rounded-[var(--radius-DEFAULT)] border border-dashed border-[var(--border-default)] px-4 py-5 text-sm text-[var(--text-secondary)]">
              {data.status === "ready"
                ? "No subjects are saved for this semester yet."
                : data.status === "unconfigured"
                  ? "Your subject list will appear here once Supabase is connected."
                  : "Your subject list will appear here as soon as the connection recovers."}
            </div>
          )}
        </section>

        <Separator />

        <section aria-label="Dashboard status" className="flex items-start gap-3">
          <CalendarDays
            className="mt-0.5 size-4 shrink-0 text-[var(--text-tertiary)]"
            aria-hidden="true"
          />
          <p className="text-sm text-[var(--text-tertiary)]">
            Your profile, current semester, and subjects are personalized from your account.
            Class times and assignments will appear here when those modules are connected to
            your saved data.
          </p>
        </section>
      </main>
    </>
  );
}

function SubjectRow({ subject }: { subject: Subject }) {
  const details = [
    subject.code,
    subject.credits === null ? null : String(subject.credits) + " credits",
  ]
    .filter(Boolean)
    .join(" · ");
  const typeLabel =
    subject.subject_type.charAt(0).toUpperCase() + subject.subject_type.slice(1);

  return (
    <div className="flex min-w-0 items-center gap-3 py-3">
      <span
        className="size-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: subject.color }}
        aria-hidden="true"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-[var(--text-primary)]">
          {subject.name}
        </span>
        <span className="text-xs text-[var(--text-tertiary)]">
          {details || "Current semester"}
        </span>
      </div>
      <Badge variant={subject.subject_type === "lab" ? "accent" : "default"}>
        {typeLabel}
      </Badge>
    </div>
  );
}
