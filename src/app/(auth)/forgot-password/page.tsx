"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getAppUrl, isSupabaseConfigured } from "@/lib/supabase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    if (!isSupabaseConfigured()) { setError("Connect Supabase in .env.local first."); setBusy(false); return; }
    const { error: requestError } = await createClient().auth.resetPasswordForEmail(email, { redirectTo: `${getAppUrl()}/auth/callback?next=/reset-password` });
    setBusy(false);
    if (requestError) setError(requestError.message); else setMessage("If an account exists for that address, a reset link is on its way.");
  }
  return <div className="w-full max-w-sm"><h1 className="text-2xl font-semibold text-[var(--text-primary)]">Reset your password</h1><p className="mt-2 mb-7 text-sm text-[var(--text-secondary)]">We’ll email you a secure reset link.</p><form onSubmit={submit} className="flex flex-col gap-4"><div className="flex flex-col gap-1.5"><Label htmlFor="email">Email address</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></div>{error && <p role="alert" className="text-sm text-red-600">{error}</p>}{message && <p role="status" className="text-sm text-green-700">{message}</p>}<Button type="submit" disabled={busy}>{busy ? "Sending…" : "Send reset link"}</Button></form><p className="mt-6 text-sm text-center"><Link className="text-[var(--accent)] hover:underline" href="/login">Back to sign in</Link></p></div>;
}
