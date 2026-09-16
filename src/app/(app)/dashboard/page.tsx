import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { format } from "date-fns";
import {
  CheckSquare,
  CalendarDays,
  Clock,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = { title: "Dashboard" };

// ── Static mock data (replaced by Supabase queries in Phase 1 Sprint 4) ───────

const TODAY_CLASSES = [
  {
    id: "1",
    subject: "Data Structures",
    code: "CS301",
    time: "09:00 – 10:30",
    room: "LH-3",
    type: "lecture",
    color: "#3b82f6",
    isNext: true,
  },
  {
    id: "2",
    subject: "Engineering Maths",
    code: "MA201",
    time: "11:00 – 12:00",
    room: "LH-1",
    type: "lecture",
    color: "#10b981",
    isNext: false,
  },
  {
    id: "3",
    subject: "Systems Lab",
    code: "CS302L",
    time: "14:00 – 16:00",
    room: "CL-2",
    type: "lab",
    color: "#8b5cf6",
    isNext: false,
  },
];

const PENDING_TASKS = [
  {
    id: "1",
    title: "Assignment 3 — Linked Lists",
    subject: "Data Structures",
    subjectColor: "#3b82f6",
    dueLabel: "Due today",
    priority: "high" as const,
    isOverdue: false,
    isDueToday: true,
  },
  {
    id: "2",
    title: "Lab Report — Experiment 5",
    subject: "Systems Lab",
    subjectColor: "#8b5cf6",
    dueLabel: "Overdue · 2 days",
    priority: "urgent" as const,
    isOverdue: true,
    isDueToday: false,
  },
  {
    id: "3",
    title: "Read Chapter 7 — Integration",
    subject: "Engineering Maths",
    subjectColor: "#10b981",
    dueLabel: "Due tomorrow",
    priority: "medium" as const,
    isOverdue: false,
    isDueToday: false,
  },
];

const QUICK_STATS = [
  { label: "Subjects", value: "6", icon: BookOpen },
  { label: "Due this week", value: "4", icon: CheckSquare },
  { label: "Classes today", value: "3", icon: CalendarDays },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const today = new Date();
  const dayName = format(today, "EEEE");
  const dateLabel = format(today, "d MMMM yyyy");

  const hour = today.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <Header title="Dashboard" />

      <main className="flex-1 px-4 sm:px-6 py-6 space-y-8 max-w-4xl">
        {/* ── Greeting & date ── */}
        <section aria-label="Overview">
          <p className="text-label mb-1">{dayName}</p>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] leading-tight tracking-tight">
            {greeting}, Rahul.
          </h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {dateLabel} · {TODAY_CLASSES.length} classes today ·{" "}
            {PENDING_TASKS.filter((t) => t.isDueToday || t.isOverdue).length}{" "}
            tasks need attention
          </p>
        </section>

        {/* ── Today's Schedule ── */}
        <section aria-labelledby="schedule-heading">
          <div className="flex items-center justify-between mb-3">
            <h3
              id="schedule-heading"
              className="text-sm font-semibold text-[var(--text-primary)]"
            >
              Today&apos;s classes
            </h3>
            <Button
              variant="ghost"
              size="xs"
              asChild
              className="text-[var(--text-tertiary)] gap-1"
            >
              <a href="/schedule">
                View schedule <ArrowRight className="size-3" />
              </a>
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            {TODAY_CLASSES.map((cls) => (
              <ClassSlot key={cls.id} cls={cls} />
            ))}
          </div>
        </section>

        <Separator />

        {/* ── Pending Tasks ── */}
        <section aria-labelledby="tasks-heading">
          <div className="flex items-center justify-between mb-3">
            <h3
              id="tasks-heading"
              className="text-sm font-semibold text-[var(--text-primary)]"
            >
              Pending tasks
            </h3>
            <Button
              variant="ghost"
              size="xs"
              asChild
              className="text-[var(--text-tertiary)] gap-1"
            >
              <a href="/tasks">
                All tasks <ArrowRight className="size-3" />
              </a>
            </Button>
          </div>

          <div className="flex flex-col divide-y divide-[var(--border-subtle)]">
            {PENDING_TASKS.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        </section>

        <Separator />

        {/* ── Quick Stats (tertiary — lowest visual weight) ── */}
        <section
          aria-label="Quick stats"
          className="flex items-center gap-6 flex-wrap"
        >
          {QUICK_STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-center gap-2">
                <Icon
                  className="size-4 text-[var(--text-tertiary)]"
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold text-[var(--text-primary)] text-mono">
                  {stat.value}
                </span>
                <span className="text-sm text-[var(--text-tertiary)]">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </section>
      </main>
    </>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ClassSlot({
  cls,
}: {
  cls: (typeof TODAY_CLASSES)[number];
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3",
        "rounded-[var(--radius-DEFAULT)] border",
        cls.isNext
          ? "border-[var(--accent)]/20 bg-[var(--accent-muted)]/30"
          : "border-[var(--border-subtle)] bg-[var(--bg-base)]",
      )}
    >
      {/* Subject color dot */}
      <div
        className="size-2.5 rounded-full shrink-0 mt-0.5"
        style={{ backgroundColor: cls.color }}
        aria-hidden="true"
      />

      {/* Subject info */}
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-sm font-medium text-[var(--text-primary)] truncate">
          {cls.subject}
        </span>
        <span className="text-xs text-[var(--text-tertiary)]">
          {cls.code} · {cls.room}
        </span>
      </div>

      {/* Time + badges */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-xs text-mono text-[var(--text-secondary)]">
          {cls.time}
        </span>
        <div className="flex items-center gap-1">
          {cls.isNext && (
            <Badge variant="accent" className="text-[10px] px-1.5 py-0.5">
              Next up
            </Badge>
          )}
          {cls.type === "lab" && (
            <Badge variant="default" className="text-[10px] px-1.5 py-0.5">
              Lab
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

function TaskRow({
  task,
}: {
  task: (typeof PENDING_TASKS)[number];
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      {/* Completion checkbox — static for now */}
      <button
        className={cn(
          "size-[18px] shrink-0 rounded-[var(--radius-sm)]",
          "border border-[var(--border-default)] bg-[var(--input-bg)]",
          "hover:border-[var(--accent)] transition-colors duration-[var(--duration-small)]",
          "focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2",
        )}
        aria-label={`Mark "${task.title}" as complete`}
      />

      {/* Task info */}
      <div className="flex flex-col flex-1 min-w-0">
        <span
          className={cn(
            "text-sm text-[var(--text-primary)] truncate",
            task.isOverdue && "text-[var(--color-danger-600)]",
          )}
        >
          {task.title}
        </span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className="size-1.5 rounded-full shrink-0"
            style={{ backgroundColor: task.subjectColor }}
            aria-hidden="true"
          />
          <span className="text-xs text-[var(--text-tertiary)] truncate">
            {task.subject}
          </span>
        </div>
      </div>

      {/* Due label + priority */}
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={cn(
            "text-xs font-medium",
            task.isOverdue
              ? "text-[var(--color-danger-500)]"
              : task.isDueToday
                ? "text-[var(--color-warning-600)]"
                : "text-[var(--text-tertiary)]",
          )}
        >
          {task.dueLabel}
        </span>
        <Badge variant={task.priority} className="hidden sm:inline-flex">
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </Badge>
      </div>
    </div>
  );
}
