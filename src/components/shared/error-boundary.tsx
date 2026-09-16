"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryFallbackProps {
  error: Error;
  reset: () => void;
}

/**
 * CampusOS Error State
 *
 * Compatible with Next.js error.tsx boundary files.
 * Always provides a Retry action — never leaves the user stuck.
 */
export function ErrorFallback({ error, reset }: ErrorBoundaryFallbackProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center text-center px-6 py-12 gap-4"
    >
      <div
        className="flex items-center justify-center size-12 rounded-[var(--radius-DEFAULT)] bg-[var(--color-danger-50)] text-[var(--color-danger-500)] dark:bg-[var(--color-danger-500)]/10"
        aria-hidden="true"
      >
        <AlertTriangle className="size-6" strokeWidth={1.5} />
      </div>

      <div className="flex flex-col gap-1 max-w-sm">
        <p className="text-sm font-medium text-[var(--text-primary)]">
          Something went wrong
        </p>
        <p className="text-sm text-[var(--text-tertiary)] leading-relaxed">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={reset}
        className="gap-2"
      >
        <RefreshCw className="size-3.5" />
        Try again
      </Button>
    </div>
  );
}

/**
 * Default Next.js error.tsx compatible page
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <ErrorFallback error={error} reset={reset} />
    </main>
  );
}
