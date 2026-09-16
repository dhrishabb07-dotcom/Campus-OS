import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = { title: "Subjects" };

const SUBJECTS = [
  {
    id: "1",
    name: "Data Structures",
    code: "CS301",
    credits: 4,
    teacher: "Prof. Sharma",
    type: "theory",
    color: "#3b82f6",
    tasksCount: 3,
    classesPerWeek: 3,
  },
  {
    id: "2",
    name: "Engineering Maths",
    code: "MA201",
    credits: 3,
    teacher: "Prof. Gupta",
    type: "theory",
    color: "#10b981",
    tasksCount: 1,
    classesPerWeek: 2,
  },
  {
    id: "3",
    name: "Systems Lab",
    code: "CS302L",
    credits: 2,
    teacher: "Prof. Kumar",
    type: "lab",
    color: "#8b5cf6",
    tasksCount: 2,
    classesPerWeek: 1,
  },
  {
    id: "4",
    name: "Software Engineering",
    code: "CS401",
    credits: 4,
    teacher: "Prof. Singh",
    type: "theory",
    color: "#f97316",
    tasksCount: 1,
    classesPerWeek: 2,
  },
  {
    id: "5",
    name: "Computer Networks",
    code: "CS402",
    credits: 3,
    teacher: "Prof. Rao",
    type: "theory",
    color: "#06b6d4",
    tasksCount: 0,
    classesPerWeek: 2,
  },
  {
    id: "6",
    name: "Open Elective",
    code: "OE101",
    credits: 2,
    teacher: "Prof. Mehta",
    type: "elective",
    color: "#84cc16",
    tasksCount: 0,
    classesPerWeek: 1,
  },
];

const totalCredits = SUBJECTS.reduce((sum, s) => sum + s.credits, 0);

export default function SubjectsPage() {
  return (
    <>
      <Header title="Subjects" />

      <main className="flex-1 px-4 sm:px-6 py-6 max-w-3xl">
        {/* ── Page header ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              This semester
            </h2>
            <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
              {SUBJECTS.length} subjects · {totalCredits} credits total
            </p>
          </div>
          <Button variant="primary" size="sm" className="gap-1.5">
            <Plus className="size-4" />
            Add subject
          </Button>
        </div>

        {/* ── Subject list ── */}
        {SUBJECTS.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No subjects yet"
            description="Add your enrolled subjects to start tracking tasks and attendance."
            action={{ label: "Add subject", onClick: () => {} }}
            className="mt-16"
          />
        ) : (
          <div className="flex flex-col gap-2">
            {SUBJECTS.map((subject) => (
              <SubjectRow key={subject.id} subject={subject} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

function SubjectRow({ subject }: { subject: (typeof SUBJECTS)[number] }) {
  return (
    <a
      href={`/subjects/${subject.id}`}
      className={cn(
        "flex items-center gap-4 px-4 py-3.5",
        "rounded-[var(--radius-DEFAULT)] border border-[var(--border-subtle)] bg-[var(--bg-base)]",
        "hover:border-[var(--border-default)] hover:bg-[var(--bg-subtle)]",
        "transition-colors duration-[var(--duration-small)]",
        "focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2",
        "group",
      )}
      aria-label={`${subject.name} — ${subject.code}`}
    >
      {/* Color indicator */}
      <div
        className="size-2.5 rounded-full shrink-0"
        style={{ backgroundColor: subject.color }}
        aria-hidden="true"
      />

      {/* Subject info */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-sm font-medium text-[var(--text-primary)] truncate">
            {subject.name}
          </span>
          <span className="text-xs text-[var(--text-tertiary)] font-mono shrink-0">
            {subject.code}
          </span>
        </div>
        <p className="text-xs text-[var(--text-tertiary)] mt-0.5 truncate">
          {subject.teacher} · {subject.classesPerWeek}× per week
        </p>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-2 shrink-0">
        {subject.tasksCount > 0 && (
          <span className="text-xs text-[var(--text-tertiary)]">
            {subject.tasksCount} tasks
          </span>
        )}
        <Badge variant="default" className="hidden sm:inline-flex">
          {subject.credits} cr
        </Badge>
        <Badge
          variant="default"
          className={cn(
            subject.type === "lab"
              ? "border-[var(--color-subject-violet)]/20 text-[var(--color-subject-violet)] bg-[var(--color-subject-violet)]/10"
              : subject.type === "elective"
                ? "border-[var(--color-subject-lime)]/20 text-[var(--color-subject-lime)] bg-[var(--color-subject-lime)]/10"
                : "",
          )}
        >
          {subject.type.charAt(0).toUpperCase() + subject.type.slice(1)}
        </Badge>
      </div>
    </a>
  );
}
