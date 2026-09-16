import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
};

/**
 * (auth) route group layout.
 * Centered, minimal layout for login/signup pages.
 * No sidebar — clean authentication experience.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-subtle)]">
      {/* Minimal brand header */}
      <header className="flex items-center h-14 px-6 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]">
        <a
          href="/"
          className="flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 rounded-[var(--radius-sm)]"
          aria-label="CampusOS home"
        >
          <div
            className="flex items-center justify-center size-7 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-xs font-semibold select-none"
            aria-hidden="true"
          >
            C
          </div>
          <span className="text-sm font-semibold text-[var(--text-primary)] tracking-tight">
            CampusOS
          </span>
        </a>
      </header>

      {/* Auth content — vertically centered */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="h-12 flex items-center justify-center px-6">
        <p className="text-xs text-[var(--text-tertiary)]">
          © {new Date().getFullYear()} CampusOS. Built for students.
        </p>
      </footer>
    </div>
  );
}
