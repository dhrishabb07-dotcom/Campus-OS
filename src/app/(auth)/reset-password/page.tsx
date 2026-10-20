"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  const router = useRouter(); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); setError(""); const { error: updateError } = await createClient().auth.updateUser({ password }); setBusy(false); if (updateError) setError(updateError.message); else router.replace("/dashboard"); }
  return <div className="w-full max-w-sm"><h1 className="mb-6 text-2xl font-semibold text-[var(--text-primary)]">Choose a new password</h1><form onSubmit={submit} className="flex flex-col gap-4"><div className="flex flex-col gap-1.5"><Label htmlFor="password">New password</Label><Input id="password" type="password" minLength={8} required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>{error && <p role="alert" className="text-sm text-red-600">{error}</p>}<Button type="submit" disabled={busy}>{busy ? "Saving…" : "Update password"}</Button></form></div>;
}
