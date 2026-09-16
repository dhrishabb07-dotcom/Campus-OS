# CampusOS Technical Architecture

This document serves as the comprehensive, strategic blueprint for CampusOS. It outlines the technical decisions, architecture, and specific implementation patterns for the entire platform. 

**Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL + Auth + Realtime + Storage), shadcn/ui, Lucide icons, Motion (framer-motion), Recharts, React Hook Form, Zod, date-fns.

---

## 1. Application Architecture

CampusOS utilizes a modern, server-first React architecture leveraging Next.js App Router.

- **Server Components by Default:** All components are React Server Components (RSC) unless interactivity is explicitly required. This reduces JavaScript payload and offloads data fetching to the server.
- **Client Components:** Used strictly at the leaf nodes of the component tree for interactivity (e.g., forms, toggles, charts, animations). Marked explicitly with `'use client'`.
- **Route Groups:** 
  - `(auth)`: Publicly accessible authentication routes (`/login`, `/signup`).
  - `(app)`: Protected application routes (dashboard, schedule, etc.). Wraps content in a layout with a sidebar and global command palette.
  - `(onboarding)`: Protected one-time setup routes for new users.
- **Middleware for Auth Protection:** Supabase middleware intercepts all requests. It verifies the session and routes unauthenticated users to `/login`, authenticated users away from `(auth)` routes, and new users to `(onboarding)` if `current_semester_id` is missing.

---

## 2. Frontend Architecture

- **Component Hierarchy:** 
  - `pages` (Route components mapping to URLs, handle server data fetching).
  - `features` (Domain-specific components, e.g., TaskList, AttendanceChart).
  - `ui` (Generic, reusable components from shadcn/ui).
- **Data Fetching:** Handled strictly in Server Components using Supabase server clients. Responses are passed to Client Components as props.
- **Form Handling:** React Hook Form powered by Zod resolvers (`@hookform/resolvers/zod`). Forms are completely uncontrolled to maximize performance.
- **State Management:** 
  - *Global UI State:* React Context for lightweight visual state (sidebar toggles, command palette visibility, theme).
  - *Server State:* Managed via Server Components (initial render) and Supabase client-side queries/mutations. *No Redux or Zustand will be used.*
- **Optimistic Updates:** Immediate UI mutations on user actions (e.g., checking off a task) using React's `useOptimistic` or local component state before confirming the Supabase mutation.
- **URL State:** Used as the single source of truth for filters, pagination, and views (e.g., `?view=calendar&month=2026-09`).

---

## 3. Backend Architecture

- **BaaS (Backend-as-a-Service):** Supabase handles the entire backend layer. There is no custom Node.js/Express server.
- **Supabase Edge Functions:** Deployed via Deno for isolated executions. Used specifically for:
  - AI Service calls (hiding API keys and enforcing rate limits).
  - Complex multi-step business logic.
  - Third-party webhook handling (if needed).
- **Database Functions & RPCs:** Used for computationally heavy, multi-table aggregations directly in PostgreSQL (e.g., calculating cumulative CGPA, generating semester attendance statistics) to avoid heavy client-side processing.
- **Supabase Realtime:** Built-in listener for specific table events to trigger instant UI updates (e.g., multi-device sync for tasks).

---

## 4. Database Architecture

The application relies on a normalized PostgreSQL database. 

### PostgreSQL Schema definition

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    university TEXT,
    department TEXT,
    enrollment_year INTEGER,
    current_semester_id UUID, -- FK added after semesters table creation
    preferences JSONB DEFAULT '{"theme": "system", "sidebar_collapsed": false}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SEMESTERS
CREATE TABLE semesters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT false,
    academic_year TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (end_date > start_date)
);

-- Update profiles with semester FK
ALTER TABLE profiles 
ADD CONSTRAINT fk_current_semester 
FOREIGN KEY (current_semester_id) REFERENCES semesters(id) ON DELETE SET NULL;

-- SUBJECTS
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    semester_id UUID NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    credits NUMERIC(4,2) NOT NULL,
    teacher_name TEXT,
    teacher_email TEXT,
    color TEXT DEFAULT '#3b82f6',
    type TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_credits CHECK (credits > 0),
    CONSTRAINT valid_type CHECK (type IN ('theory', 'lab', 'elective'))
);

-- CLASSES (Recurring schedule)
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room TEXT,
    building TEXT,
    type TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_day CHECK (day_of_week BETWEEN 0 AND 6),
    CONSTRAINT valid_time CHECK (end_time > start_time),
    CONSTRAINT valid_class_type CHECK (type IN ('lecture', 'lab', 'tutorial'))
);

-- TASKS
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    due_time TIME,
    priority TEXT NOT NULL DEFAULT 'medium',
    status TEXT NOT NULL DEFAULT 'todo',
    type TEXT NOT NULL DEFAULT 'assignment',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    CONSTRAINT valid_status CHECK (status IN ('todo', 'in_progress', 'done')),
    CONSTRAINT valid_task_type CHECK (type IN ('assignment', 'exam', 'project', 'reading', 'other'))
);

-- ATTENDANCE
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_status CHECK (status IN ('present', 'absent', 'cancelled', 'holiday')),
    CONSTRAINT unique_attendance UNIQUE (user_id, subject_id, class_id, date)
);

-- EXPENSES
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_amount CHECK (amount > 0),
    CONSTRAINT valid_category CHECK (category IN ('food', 'transport', 'stationery', 'entertainment', 'rent', 'other')),
    CONSTRAINT valid_payment CHECK (payment_method IN ('cash', 'upi', 'card', 'other'))
);

-- GOALS
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    semester_id UUID REFERENCES semesters(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_type TEXT NOT NULL,
    target_value NUMERIC NOT NULL,
    current_value NUMERIC DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active',
    deadline DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_target_type CHECK (target_type IN ('attendance_pct', 'cgpa', 'task_completion', 'custom')),
    CONSTRAINT valid_status CHECK (status IN ('active', 'completed', 'abandoned'))
);

-- STUDY SESSIONS
CREATE TABLE study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER NOT NULL,
    type TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_duration CHECK (duration_minutes > 0),
    CONSTRAINT valid_times CHECK (ended_at > started_at),
    CONSTRAINT valid_session_type CHECK (type IN ('reading', 'practice', 'revision', 'project'))
);

-- AI PLANS
CREATE TABLE ai_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    prompt_hash TEXT NOT NULL,
    input_context JSONB NOT NULL,
    plan_output JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'generated',
    model_used TEXT NOT NULL,
    tokens_used INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_status CHECK (status IN ('generated', 'accepted', 'modified', 'rejected'))
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_semesters_user ON semesters(user_id);
CREATE INDEX idx_subjects_user_sem ON subjects(user_id, semester_id);
CREATE INDEX idx_classes_user_subj ON classes(user_id, subject_id);
CREATE INDEX idx_classes_user_day ON classes(user_id, day_of_week);
CREATE INDEX idx_tasks_user_date ON tasks(user_id, due_date);
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);
CREATE INDEX idx_attendance_user_subj_date ON attendance(user_id, subject_id, date);
CREATE INDEX idx_expenses_user_date ON expenses(user_id, date);
CREATE INDEX idx_study_user_date ON study_sessions(user_id, started_at);
CREATE INDEX idx_goals_user_status ON goals(user_id, status);

-- AUTO-UPDATE updated_at TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON semesters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON subjects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 5. Row Level Security (RLS)

- **Mandatory Policy:** EVERY table has RLS enabled (`ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`).
- **Service Role:** The service role key is strictly forbidden on the client side. It is used exclusively in Edge Functions where admin-level operations are strictly necessary.

### Complete RLS Policies

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_plans ENABLE ROW LEVEL SECURITY;

-- PROFILES: Special case (PK is id, not user_id)
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- STANDARD USER-OWNED TABLES: semesters, subjects, classes, tasks,
-- attendance, expenses, goals, study_sessions, ai_plans
-- All follow the same pattern:
CREATE POLICY "Users manage own semesters" ON semesters
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own subjects" ON subjects
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own classes" ON classes
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own tasks" ON tasks
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own attendance" ON attendance
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own expenses" ON expenses
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own goals" ON goals
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own study_sessions" ON study_sessions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own ai_plans" ON ai_plans
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

### Auto-create Profile on Signup

```sql
-- Trigger function: auto-create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 6. Authentication

- **Provider:** Supabase Auth providing Email/Password and Google OAuth integrations.
- **Session Management:** `@supabase/ssr` client for secure, cookie-based session management.
- **Routing Rules (Middleware):**
  - Unauthenticated → Redirect to `/login`.
  - Authenticated on `/login` or `/signup` → Redirect to `/dashboard`.
  - Authenticated but missing `current_semester_id` → Redirect to `/setup` (Onboarding).
- **Onboarding Flow:** After initial signup, users must complete a 3-step setup (University info → Add Semester → Add Subjects).

---

## 7. API / Service Boundaries

To maintain clean separation of concerns, database interactions are strictly separated by context:

- `lib/supabase/client.ts` — Browser-side client instance.
- `lib/supabase/server.ts` — Server component client instance (read-only cookies).
- `lib/supabase/middleware.ts` — Middleware client instance (read/write cookies).
- `features/[feature]/queries.ts` — Select queries using Supabase server client.
- `features/[feature]/mutations.ts` — Insert/Update/Delete operations (often client-side or server actions).
- `features/[feature]/types.ts` — Feature-specific domain types.
- `lib/validators/` — Single source of truth for schema definitions (Zod).

---

## 8. AI Architecture

- **Security & Execution:** Client never calls OpenAI/Anthropic APIs directly. Client calls a Supabase Edge Function (`/functions/v1/generate-plan`).
- **Validation Pipeline:**
  1. Client sends JSON request.
  2. Edge Function validates request with Zod schema.
  3. Edge Function injects context (fetching tasks/schedule via Service Role if needed) and calls LLM.
  4. LLM response is returned natively as JSON (e.g. using structured outputs via provider API).
  5. Edge Function validates output JSON against a Zod schema before saving to `ai_plans` and returning to client.
- **Rate Limiting:** IP and user-based rate limits enforced at the Edge Function level to prevent abuse.
- **Resilience:** The application gracefully handles AI downtime.

---

## 9. Validation Strategy

- **Single Source of Truth:** `zod` schemas define shape and validation rules.
- **Implementation:** Schemas live in `lib/validators/[entity].ts` (e.g., `taskSchema`, `expenseSchema`).
- **Shared Usage:**
  - Form validation: `useForm({ resolver: zodResolver(taskSchema) })`
  - API validation: `taskSchema.parse(request.body)`
  - Type Inference: `export type Task = z.infer<typeof taskSchema>`

---

## 10. Error Handling

- **Error Types:** Strictly categorized into `ValidationError`, `AuthError`, `DatabaseError`, `AIError`, `NetworkError`.
- **UI Fallbacks:** Use of Next.js `error.tsx` boundary files at the route group and feature levels.
- **User Feedback:** Unified toast notification system for localized client errors.
- **Graceful Degradation:** If the Edge Function fails, AI UI components degrade silently to manual entry forms, while the core app remains unaffected.
- **Logging:** Structured error logging capturing `user_id`, `context`, and `stack_trace`.

---

## 11. Performance Strategy

- **Server-Side Rendered:** Zero JS shipped for dashboards and read-only views. Data is injected directly as HTML.
- **Dynamic Imports:** Heavy components like Recharts and the Command Palette are dynamically loaded (`next/dynamic`) to shrink the initial JS bundle.
- **Image Optimization:** Strict use of `next/image` for avatars and UI assets.
- **Database Optimization:** All heavy-read columns indexed (e.g., `date` ranges, `user_id`, `semester_id`).
- **UX Perception:** Extensive use of Skeleton components (`components/shared/skeleton.tsx`) during client-side suspense.
- **Navigation:** `<Link href="...">` automatically pre-fetches RSC payloads on hover for instant perceived page loads.

---

## 12. Testing Strategy

- **Unit Tests:** Run with `Vitest`. Covering all Zod schemas, utility math (CGPA), and date manipulation functions (`date-fns` wrappers).
- **Component Tests:** React Testing Library for verifying complex form validation behaviors (e.g., ensuring a recurring class cannot have `end_time` before `start_time`).
- **E2E Tests:** `Playwright` for testing critical user journeys: Authentication → Setup Semester → Add Task → Complete Task.

---

## 13. Complete Folder Structure

```text
├── middleware.ts                # Next.js middleware (auth route protection)
├── src/
│   ├── app/
│   │   ├── (auth)/             # Authentication routes (unprotected)
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── callback/route.ts  # Supabase OAuth callback handler
│   │   ├── (app)/              # Main application routes (protected)
│   │   │   ├── layout.tsx      # App layout with Sidebar and Header
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── schedule/page.tsx
│   │   │   ├── tasks/page.tsx
│   │   │   ├── subjects/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx  # Subject detail view
│   │   │   ├── attendance/page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   ├── expenses/page.tsx
│   │   │   ├── goals/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── (onboarding)/       # First-time user setup (protected)
│   │   │   └── setup/page.tsx
│   │   ├── layout.tsx          # Root layout (Providers, Fonts, Meta)
│   │   └── globals.css         # Tailwind imports and CSS variables
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components (buttons, inputs, etc.)
│   │   ├── layout/             # Global UI framing
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   └── command-palette.tsx
│   │   └── shared/             # Reusable generic components
│   │       ├── empty-state.tsx
│   │       ├── error-boundary.tsx
│   │       └── page-skeleton.tsx
│   ├── features/               # Domain-driven feature modules
│   │   ├── auth/
│   │   │   ├── components/     # LoginForm, SignupForm
│   │   │   └── mutations.ts    # signIn, signUp, signOut
│   │   ├── dashboard/
│   │   │   ├── components/     # TodayClasses, PendingTasks, QuickStats
│   │   │   └── queries.ts      # getDashboardData
│   │   ├── schedule/
│   │   │   ├── components/     # WeeklyGrid, ClassSlot, ClassForm
│   │   │   ├── queries.ts
│   │   │   └── mutations.ts
│   │   ├── tasks/
│   │   │   ├── components/     # TaskList, TaskItem, TaskForm, TaskFilters
│   │   │   ├── queries.ts
│   │   │   └── mutations.ts
│   │   ├── subjects/
│   │   │   ├── components/     # SubjectList, SubjectCard, SubjectForm
│   │   │   ├── queries.ts
│   │   │   └── mutations.ts
│   │   ├── attendance/
│   │   ├── analytics/
│   │   ├── expenses/
│   │   ├── goals/
│   │   └── ai/
│   │       ├── components/     # StudyPlanView, PlanAcceptFlow
│   │       └── actions.ts      # Server actions bridging to Edge Functions
│   ├── lib/
│   │   ├── supabase/           # Supabase infrastructure
│   │   │   ├── client.ts       # Browser client (createBrowserClient)
│   │   │   ├── server.ts       # RSC client (createServerClient)
│   │   │   └── middleware.ts   # Middleware client (updateSession)
│   │   ├── validators/         # Zod schemas (Single source of truth)
│   │   │   ├── auth.ts
│   │   │   ├── profile.ts
│   │   │   ├── semester.ts
│   │   │   ├── subject.ts
│   │   │   ├── class.ts
│   │   │   ├── task.ts
│   │   │   ├── attendance.ts
│   │   │   ├── expense.ts
│   │   │   ├── goal.ts
│   │   │   └── ai-plan.ts
│   │   ├── utils/
│   │   │   ├── cn.ts           # Tailwind class merging (clsx + twMerge)
│   │   │   ├── format.ts       # Date/currency formatting helpers
│   │   │   └── academic.ts     # CGPA calculation, attendance % helpers
│   │   ├── constants/          # Enums, configuration arrays, subject colors
│   │   │   ├── navigation.ts   # Sidebar route definitions
│   │   │   └── academic.ts     # Grade scales, priority levels, etc.
│   │   └── hooks/              # Custom React hooks
│   │       ├── use-media-query.ts
│   │       └── use-keyboard-shortcut.ts
│   └── types/
│       ├── database.ts         # Generated Supabase types (npx supabase gen types)
│       └── index.ts            # Re-exports and app-wide type aliases
```
