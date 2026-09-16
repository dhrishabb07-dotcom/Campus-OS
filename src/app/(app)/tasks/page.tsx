import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { CheckSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/empty-state";
import type { TaskStatus } from "@/types";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = { title: "Tasks" };

const MOCK_TASKS = [
  {
    id: "1",
    title: "Assignment 3 — Linked Lists",
    subject: "Data Structures",
    subjectColor: "#3b82f6",
    due: "Today",
    priority: "high" as const,
    status: "todo" as TaskStatus,
    isOverdue: false,
    isDueToday: true,
  },
  {
    id: "2",
    title: "Lab Report — Experiment 5",
    subject: "Systems Lab",
    subjectColor: "#8b5cf6",
    due: "2 days ago",
    priority: "urgent" as const,
    status: "todo" as TaskStatus,
    isOverdue: true,
    isDueToday: false,
  },
  {
    id: "3",
    title: "Read Chapter 7 — Integration",
    subject: "Engineering Maths",
    subjectColor: "#10b981",
    due: "Tomorrow",
    priority: "medium" as const,
    status: "todo" as TaskStatus,
    isOverdue: false,
    isDueToday: false,
  },
  {
    id: "4",
    title: "Mid-term revision — Data Structures",
    subject: "Data Structures",
    subjectColor: "#3b82f6",
    due: "Sep 20",
    priority: "medium" as const,
    status: "in_progress" as TaskStatus,
    isOverdue: false,
    isDueToday: false,
  },
  {
    id: "5",
    title: "Project proposal draft",
    subject: "Software Engineering",
    subjectColor: "#f97316",
    due: "Sep 25",
    priority: "low" as const,
    status: "todo" as TaskStatus,
    isOverdue: false,
    isDueToday: false,
  },
];

const PRIORITY_ORDER = { urgent: 0, high: 1, medium: 2, low: 3 };

export default function TasksPage() {
  const todoTasks = MOCK_TASKS.filter((t) => t.status !== "done").sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
  );
  const overdueTasks = todoTasks.filter((t) => t.isOverdue);
  const todayTasks = todoTasks.filter((t) => t.isDueToday && !t.isOverdue);
  const upcomingTasks = todoTasks.filter((t) => !t.isOverdue && !t.isDueToday);

  return (
    <>
      <Header title="Tasks" />

      <main className="flex-1 px-4 sm:px-6 py-6 max-w-3xl">
        {/* ── Page header ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              All tasks
            </h2>
            <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
              {todoTasks.length} pending
            </p>
          </div>
          <Button variant="primary" size="sm" className="gap-1.5">
            <Plus className="size-4" />
            Add task
          </Button>
        </div>

        {/* ── Overdue ── */}
        {overdueTasks.length > 0 && (
          <TaskGroup
            label="Overdue"
            tasks={overdueTasks}
            labelClass="text-[var(--color-danger-500)]"
          />
        )}

        {/* ── Due today ── */}
        {todayTasks.length > 0 && (
          <TaskGroup label="Due today" tasks={todayTasks} />
        )}

        {/* ── Upcoming ── */}
        {upcomingTasks.length > 0 && (
          <TaskGroup label="Upcoming" tasks={upcomingTasks} />
        )}

        {/* ── Empty state ── */}
        {todoTasks.length === 0 && (
          <EmptyState
            icon={CheckSquare}
            title="No pending tasks"
            description="You're all caught up. Add a task to start tracking your work."
            action={{ label: "Add task", onClick: () => {} }}
            className="mt-16"
          />
        )}
      </main>
    </>
  );
}

function TaskGroup({
  label,
  tasks,
  labelClass,
}: {
  label: string;
  tasks: typeof MOCK_TASKS;
  labelClass?: string;
}) {
  return (
    <section className="mb-6" aria-labelledby={`group-${label}`}>
      <h3
        id={`group-${label}`}
        className={cn("text-label mb-3", labelClass)}
      >
        {label}
      </h3>
      <div className="flex flex-col divide-y divide-[var(--border-subtle)]">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
      <Separator className="mt-6" />
    </section>
  );
}

function TaskItem({ task }: { task: (typeof MOCK_TASKS)[number] }) {
  return (
    <div className="flex items-start gap-3 py-3 group">
      {/* Checkbox */}
      <button
        className={cn(
          "mt-0.5 size-[18px] shrink-0 rounded-[var(--radius-sm)]",
          "border border-[var(--border-default)] bg-[var(--input-bg)]",
          "hover:border-[var(--accent)] transition-colors duration-[var(--duration-small)]",
          "focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2",
        )}
        aria-label={`Mark "${task.title}" as complete`}
      />

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0 gap-1">
        <span
          className={cn(
            "text-sm text-[var(--text-primary)]",
            task.status === "in_progress" &&
              "text-[var(--accent)]",
            task.isOverdue && "text-[var(--color-danger-600)]",
          )}
        >
          {task.title}
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="size-1.5 rounded-full shrink-0"
            style={{ backgroundColor: task.subjectColor }}
            aria-hidden="true"
          />
          <span className="text-xs text-[var(--text-tertiary)]">
            {task.subject}
          </span>
          <span
            className={cn(
              "text-xs",
              task.isOverdue
                ? "text-[var(--color-danger-500)] font-medium"
                : task.isDueToday
                  ? "text-[var(--color-warning-600)]"
                  : "text-[var(--text-disabled)]",
            )}
          >
            · {task.due}
          </span>
        </div>
      </div>

      {/* Priority badge */}
      <div className="shrink-0 mt-0.5">
        <Badge variant={task.priority}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </Badge>
      </div>
    </div>
  );
}
