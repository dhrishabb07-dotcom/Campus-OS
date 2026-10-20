import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { completeOnboarding } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function SetupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");
  }
  const { error } = await searchParams;
  return <main className="mx-auto w-full max-w-2xl px-6 py-12"><p className="mb-3 text-sm font-medium text-[var(--accent)]">A quick start</p><h1 className="text-3xl font-semibold text-[var(--text-primary)]">Set up your campus</h1><p className="mb-8 mt-2 text-sm text-[var(--text-secondary)]">Add your university, degree, current semester, and subjects. You can edit these later.</p>{error && <p role="alert" className="mb-5 text-sm text-red-600">{error === "invalid" ? "Please check the fields and add at least one subject." : "We couldn't save your setup. Please try again."}</p>}<form action={completeOnboarding} className="flex flex-col gap-6"><section className="grid gap-4 rounded-xl border border-[var(--border-default)] p-5 sm:grid-cols-2"><div className="flex flex-col gap-1.5"><Label htmlFor="university">University</Label><Input id="university" name="university" required maxLength={160} placeholder="e.g. University of Delhi" /></div><div className="flex flex-col gap-1.5"><Label htmlFor="degree">Degree or program</Label><Input id="degree" name="degree" required maxLength={120} placeholder="e.g. B.Sc. Computer Science" /></div></section><section className="grid gap-4 rounded-xl border border-[var(--border-default)] p-5 sm:grid-cols-2"><div className="flex flex-col gap-1.5"><Label htmlFor="semesterName">Current semester name</Label><Input id="semesterName" name="semesterName" required maxLength={80} placeholder="e.g. Semester 3" /></div><div className="flex flex-col gap-1.5"><Label htmlFor="semesterNumber">Semester number (optional)</Label><Input id="semesterNumber" name="semesterNumber" type="number" min={1} max={16} /></div></section><section className="rounded-xl border border-[var(--border-default)] p-5"><h2 className="mb-1 font-medium text-[var(--text-primary)]">Subjects</h2><p className="mb-4 text-sm text-[var(--text-secondary)]">Enter one subject per field.</p><div className="grid gap-3 sm:grid-cols-2">{Array.from({ length: 6 }, (_, index) => <div className="flex flex-col gap-1.5" key={index}><Label htmlFor={`subject-${index}`}>Subject {index + 1}{index === 0 ? "" : " (optional)"}</Label><Input id={`subject-${index}`} name="subject" required={index === 0} maxLength={120} placeholder={index === 0 ? "e.g. Data Structures" : ""} /></div>)}</div></section><Button type="submit" className="self-start">Finish setup</Button></form></main>;
}
