import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <Header title="Settings" />

      <main className="flex-1 px-4 sm:px-6 py-6 max-w-2xl">
        {/* ── Profile section ── */}
        <section aria-labelledby="profile-heading" className="mb-8">
          <h2
            id="profile-heading"
            className="text-base font-semibold text-[var(--text-primary)] mb-4"
          >
            Profile
          </h2>

          {/* Avatar row */}
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="size-14">
              <AvatarFallback className="text-base font-medium">
                RK
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Rahul K.
              </p>
              <p className="text-xs text-[var(--text-tertiary)]">
                rahul@campus.edu
              </p>
              <Button
                variant="ghost"
                size="xs"
                className="mt-1 text-[var(--accent)] px-0"
              >
                Change photo
              </Button>
            </div>
          </div>

          {/* Profile form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="full-name">Full name</Label>
              <Input
                id="full-name"
                defaultValue="Rahul K."
                placeholder="Your full name"
                autoComplete="name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="university">University</Label>
              <Input
                id="university"
                defaultValue="IIT Delhi"
                placeholder="Your university"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                defaultValue="Computer Science"
                placeholder="Your department"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="enrollment-year">Enrollment year</Label>
              <Input
                id="enrollment-year"
                type="number"
                defaultValue="2023"
                placeholder="e.g. 2023"
              />
            </div>
          </div>

          <Button variant="primary" size="sm" className="mt-5">
            Save changes
          </Button>
        </section>

        <Separator />

        {/* ── Semester section ── */}
        <section aria-labelledby="semester-heading" className="mt-8 mb-8">
          <h2
            id="semester-heading"
            className="text-base font-semibold text-[var(--text-primary)] mb-1"
          >
            Current semester
          </h2>
          <p className="text-sm text-[var(--text-tertiary)] mb-4">
            Manage your active semester and archived ones.
          </p>

          <div className="flex items-center justify-between p-4 rounded-[var(--radius-DEFAULT)] border border-[var(--border-default)]">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Fall 2026
              </p>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                Aug 1 – Dec 15, 2026 · Active
              </p>
            </div>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>
        </section>

        <Separator />

        {/* ── Preferences section ── */}
        <section aria-labelledby="prefs-heading" className="mt-8 mb-8">
          <h2
            id="prefs-heading"
            className="text-base font-semibold text-[var(--text-primary)] mb-4"
          >
            Preferences
          </h2>

          <div className="flex flex-col gap-4">
            <PreferenceRow
              label="Theme"
              description="Choose light, dark, or match your system."
            >
              <select
                className="h-8 px-2 text-sm rounded-[var(--radius-md)] border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] outline-none focus:border-[var(--input-border-focus)]"
                defaultValue="system"
                aria-label="Color theme"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </PreferenceRow>

            <Separator />

            <PreferenceRow
              label="Sidebar"
              description="Start with sidebar expanded or collapsed."
            >
              <select
                className="h-8 px-2 text-sm rounded-[var(--radius-md)] border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] outline-none focus:border-[var(--input-border-focus)]"
                defaultValue="expanded"
                aria-label="Sidebar default state"
              >
                <option value="expanded">Expanded</option>
                <option value="collapsed">Collapsed</option>
              </select>
            </PreferenceRow>
          </div>
        </section>

        <Separator />

        {/* ── Danger zone ── */}
        <section aria-labelledby="danger-heading" className="mt-8">
          <h2
            id="danger-heading"
            className="text-sm font-medium text-[var(--color-danger-500)] mb-3"
          >
            Danger zone
          </h2>
          <div className="flex items-center justify-between p-4 rounded-[var(--radius-DEFAULT)] border border-[var(--color-danger-500)]/20">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Delete account
              </p>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                Permanently delete your account and all data. Cannot be undone.
              </p>
            </div>
            <Button variant="ghost-destructive" size="sm">
              Delete
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}

function PreferenceRow({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
        <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  );
}
