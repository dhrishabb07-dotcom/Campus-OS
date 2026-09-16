import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { CalendarDays } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = { title: "Schedule" };

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const FULL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8am – 7pm

// Mock recurring classes [dayIndex (0=Mon), startHour, durationHours, subject, room, color]
const CLASSES = [
  { day: 0, start: 9,  dur: 1.5, subject: "Data Structures", code: "CS301", room: "LH-3", color: "#3b82f6" },
  { day: 0, start: 11, dur: 1,   subject: "Engineering Maths", code: "MA201", room: "LH-1", color: "#10b981" },
  { day: 1, start: 10, dur: 1,   subject: "Software Engineering", code: "CS401", room: "LH-2", color: "#f97316" },
  { day: 1, start: 14, dur: 2,   subject: "Systems Lab", code: "CS302L", room: "CL-2", color: "#8b5cf6" },
  { day: 2, start: 9,  dur: 1.5, subject: "Data Structures", code: "CS301", room: "LH-3", color: "#3b82f6" },
  { day: 2, start: 11, dur: 1,   subject: "Engineering Maths", code: "MA201", room: "LH-1", color: "#10b981" },
  { day: 3, start: 10, dur: 1,   subject: "Software Engineering", code: "CS401", room: "LH-2", color: "#f97316" },
  { day: 4, start: 9,  dur: 1,   subject: "Data Structures", code: "CS301", room: "LH-3", color: "#3b82f6" },
  { day: 4, start: 14, dur: 2,   subject: "Systems Lab", code: "CS302L", room: "CL-2", color: "#8b5cf6" },
];

const SLOT_HEIGHT = 56; // px per hour
const GRID_START = 8; // 8 AM

export default function SchedulePage() {
  const todayIndex = new Date().getDay() - 1; // 0 = Monday

  return (
    <>
      <Header title="Schedule" />

      <main className="flex-1 px-4 sm:px-6 py-6">
        {/* ── Page header ── */}
        <div className="mb-5">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            Weekly timetable
          </h2>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
            Fall 2026 · {CLASSES.length} recurring classes
          </p>
        </div>

        {/* ── Schedule grid (hidden on very small mobile, show list instead) ── */}
        <div className="hidden sm:block overflow-x-auto">
          <div className="min-w-[560px]">
            {/* Day headers */}
            <div className="flex mb-1 ml-12">
              {DAYS.map((day, i) => (
                <div
                  key={day}
                  className={cn(
                    "flex-1 text-center pb-2",
                    "text-xs font-medium",
                    i === todayIndex
                      ? "text-[var(--accent)]"
                      : "text-[var(--text-tertiary)]",
                  )}
                >
                  <span className="hidden md:inline">{FULL_DAYS[i]}</span>
                  <span className="md:hidden">{day}</span>
                  {i === todayIndex && (
                    <div className="mx-auto mt-1 size-1 rounded-full bg-[var(--accent)]" />
                  )}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex">
              {/* Time axis */}
              <div className="w-12 shrink-0 flex flex-col">
                {HOURS.map((h) => (
                  <div
                    key={h}
                    className="flex items-start justify-end pr-3 text-[10px] text-mono text-[var(--text-disabled)]"
                    style={{ height: SLOT_HEIGHT }}
                  >
                    {h < 12 ? `${h}am` : h === 12 ? "12pm" : `${h - 12}pm`}
                  </div>
                ))}
              </div>

              {/* Day columns */}
              <div className="flex flex-1 border-l border-[var(--border-subtle)]">
                {DAYS.map((_, dayIndex) => {
                  const dayClasses = CLASSES.filter((c) => c.day === dayIndex);
                  return (
                    <div
                      key={dayIndex}
                      className={cn(
                        "flex-1 relative border-r border-[var(--border-subtle)] last:border-r-0",
                        dayIndex === todayIndex && "bg-[var(--accent-muted)]/10",
                      )}
                      style={{ height: HOURS.length * SLOT_HEIGHT }}
                    >
                      {/* Hour lines */}
                      {HOURS.map((h) => (
                        <div
                          key={h}
                          className="absolute left-0 right-0 border-t border-[var(--border-subtle)]"
                          style={{ top: (h - GRID_START) * SLOT_HEIGHT }}
                        />
                      ))}

                      {/* Classes */}
                      {dayClasses.map((cls, i) => {
                        const top = (cls.start - GRID_START) * SLOT_HEIGHT;
                        const height = cls.dur * SLOT_HEIGHT - 2;
                        return (
                          <button
                            key={i}
                            className={cn(
                              "absolute left-0.5 right-0.5 rounded-[var(--radius-sm)]",
                              "px-1.5 py-1 text-left",
                              "border border-white/20",
                              "hover:brightness-95 transition-all duration-[var(--duration-small)]",
                              "focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-1",
                              "overflow-hidden",
                            )}
                            style={{
                              top,
                              height,
                              backgroundColor: cls.color + "22",
                              borderLeftWidth: 2,
                              borderLeftColor: cls.color,
                            }}
                            aria-label={`${cls.subject} at ${cls.start}:00 in ${cls.room}`}
                          >
                            <p
                              className="text-[11px] font-medium leading-tight truncate"
                              style={{ color: cls.color }}
                            >
                              {cls.subject}
                            </p>
                            {height > 40 && (
                              <p className="text-[10px] text-[var(--text-tertiary)] truncate">
                                {cls.room}
                              </p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile list view (< sm) ── */}
        <div className="sm:hidden flex flex-col gap-2">
          {DAYS.map((day, dayIndex) => {
            const dayClasses = CLASSES.filter((c) => c.day === dayIndex);
            if (dayClasses.length === 0) return null;
            return (
              <div key={day}>
                <p
                  className={cn(
                    "text-label mb-2",
                    dayIndex === todayIndex && "text-[var(--accent)]",
                  )}
                >
                  {FULL_DAYS[dayIndex]}{dayIndex === todayIndex ? " · Today" : ""}
                </p>
                <div className="flex flex-col gap-1.5">
                  {dayClasses.map((cls, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] border border-[var(--border-subtle)]"
                      style={{ borderLeftWidth: 3, borderLeftColor: cls.color }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                          {cls.subject}
                        </p>
                        <p className="text-xs text-[var(--text-tertiary)]">
                          {cls.start}:00 · {cls.room}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
