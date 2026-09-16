"use client";

import { useState } from "react";
import { Eye, EyeOff, Chrome, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/cn";

/**
 * CampusOS Login Page
 *
 * Clean, minimal login form.
 * Two paths: Google OAuth (primary) + Magic Link email (secondary).
 * No heavy card decoration — the form IS the content.
 */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [showMagicLink, setShowMagicLink] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    // TODO: implement Supabase Google OAuth
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    // TODO: implement Supabase magic link
    setTimeout(() => {
      setIsLoading(false);
      setMagicLinkSent(true);
    }, 1000);
  };

  return (
    <div className="w-full max-w-sm">
      {/* ── Heading ── */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] leading-tight tracking-tight">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
          Sign in to your CampusOS workspace.
        </p>
      </div>

      {/* ── Magic link sent state ── */}
      {magicLinkSent ? (
        <div
          className={cn(
            "rounded-[var(--radius-DEFAULT)] border border-[var(--color-success-500)]/20",
            "bg-[var(--color-success-50)] dark:bg-[var(--color-success-500)]/10",
            "p-4 text-sm",
          )}
          role="alert"
        >
          <p className="font-medium text-[var(--color-success-700)] dark:text-[var(--color-success-500)]">
            Check your inbox
          </p>
          <p className="mt-1 text-[var(--color-success-600)] dark:text-[var(--color-success-500)]/80">
            We sent a sign-in link to <strong>{email}</strong>. It expires in 10
            minutes.
          </p>
          <button
            onClick={() => {
              setMagicLinkSent(false);
              setEmail("");
            }}
            className="mt-3 text-xs font-medium text-[var(--color-success-700)] dark:text-[var(--color-success-500)] underline underline-offset-2"
          >
            Use a different email
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {/* ── Google OAuth (primary) ── */}
          <Button
            variant="outline"
            size="lg"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full gap-3 font-medium"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </Button>

          {/* ── Divider ── */}
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-[var(--text-tertiary)] font-medium">
              or
            </span>
            <Separator className="flex-1" />
          </div>

          {/* ── Magic link / email ── */}
          {!showMagicLink ? (
            <button
              onClick={() => setShowMagicLink(true)}
              className={cn(
                "flex items-center justify-between w-full",
                "h-10 px-4 rounded-[var(--radius-md)]",
                "border border-[var(--border-default)] bg-transparent",
                "text-sm text-[var(--text-secondary)]",
                "hover:bg-[var(--interactive-bg-hover)] hover:text-[var(--text-primary)]",
                "hover:border-[var(--border-strong)]",
                "transition-colors duration-[var(--duration-small)]",
                "focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2",
              )}
            >
              <span>Continue with email</span>
              <ArrowRight className="size-4 text-[var(--text-tertiary)]" />
            </button>
          ) : (
            <form onSubmit={handleMagicLink} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                  required
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!email || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : null}
                Send sign-in link
              </Button>
            </form>
          )}
        </div>
      )}

      {/* ── Sign up link ── */}
      <p className="mt-8 text-center text-xs text-[var(--text-tertiary)]">
        No account?{" "}
        <a
          href="/signup"
          className="font-medium text-[var(--accent)] hover:underline underline-offset-2 transition-colors"
        >
          Create one free
        </a>
      </p>
    </div>
  );
}

/** Inline Google icon SVG — avoids an extra package */
function GoogleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
