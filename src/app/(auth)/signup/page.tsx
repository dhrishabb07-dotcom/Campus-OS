"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    // TODO: Supabase Google OAuth
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Supabase email sign up
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] leading-tight tracking-tight">
          Create your account
        </h1>
        <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
          Your entire college life. One calm workspace.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Google */}
        <Button
          variant="outline"
          size="lg"
          onClick={handleGoogleSignUp}
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

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-[var(--text-tertiary)] font-medium">or</span>
          <Separator className="flex-1" />
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Rahul Kumar"
              autoComplete="name"
              required
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@university.edu"
              autoComplete="email"
              required
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              minLength={8}
              required
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isLoading}
            className="w-full mt-1"
          >
            {isLoading && <Loader2 className="size-4 animate-spin" />}
            Create account
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-[var(--text-tertiary)]">
        Already have an account?{" "}
        <a
          href="/login"
          className="font-medium text-[var(--accent)] hover:underline underline-offset-2"
        >
          Sign in
        </a>
      </p>

      <p className="mt-4 text-center text-[10px] text-[var(--text-disabled)] leading-relaxed">
        By creating an account, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
