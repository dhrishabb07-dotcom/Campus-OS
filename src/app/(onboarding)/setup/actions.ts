"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  university: z.string().trim().min(1).max(160),
  degree: z.string().trim().min(1).max(120),
  semesterName: z.string().trim().min(1).max(80),
  semesterNumber: z.string().optional(),
  subjects: z.array(z.string().trim().min(1).max(120)).min(1).max(20),
});

export async function completeOnboarding(formData: FormData) {
  const subjects = formData.getAll("subject").map(String).filter((value) => value.trim().length > 0);
  const parsed = schema.safeParse({
    university: formData.get("university"), degree: formData.get("degree"),
    semesterName: formData.get("semesterName"), semesterNumber: formData.get("semesterNumber") || undefined,
    subjects,
  });
  if (!parsed.success) redirect("/setup?error=invalid");
  const n = parsed.data.semesterNumber ? Number(parsed.data.semesterNumber) : null;
  if (n !== null && (!Number.isInteger(n) || n < 1 || n > 16)) redirect("/setup?error=invalid");
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/login");
  const { error } = await supabase.rpc("complete_onboarding", {
    p_university: parsed.data.university, p_degree: parsed.data.degree,
    p_semester_name: parsed.data.semesterName, p_semester_number: n,
    p_subjects: parsed.data.subjects,
  });
  if (error) redirect("/setup?error=save");
  redirect("/dashboard");
}
