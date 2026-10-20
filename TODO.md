# CampusOS Implementation Roadmap

This document outlines the phased implementation plan for CampusOS, a polished student productivity platform built with Next.js (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL + Auth + RLS), shadcn/ui, Lucide icons, Motion (framer-motion), Recharts, React Hook Form, Zod, and date-fns.

> Status: the hosted Phase 2 auth/onboarding schema and personalized profile/semester/subjects dashboard are implemented. This roadmap has separate phase numbering; see PHASE_2_AUTH_ONBOARDING.md for the delivered flow.

## Phase 0: Project Foundation
- [x] Initialize Next.js project with TypeScript and App Router
- [x] Configure Tailwind CSS with custom design tokens
- [x] Install and configure shadcn/ui
- [x] Set up the hosted Supabase project
- [ ] Set up a local Supabase CLI development stack
- [x] Install `@supabase/ssr` and `@supabase/supabase-js` packages ⚠️ CRITICAL
- [ ] Confirm Supabase Auth email settings and configure optional Google OAuth
- [x] Add local environment variable instructions and ignored .env.local configuration
- [x] Create `.env.example` with required variable stubs ⚠️ CRITICAL
- [x] Create Supabase client utilities (browser, server, proxy) ⚠️ CRITICAL
- [x] Protect auth and app routes with the Supabase proxy and server layouts ⚠️ CRITICAL
- [x] Create base layout (app shell with sidebar placeholder)
- [x] Configure ESLint, Prettier, path aliases
- [x] Install `zod` and `@hookform/resolvers` ⚠️ CRITICAL
- [x] Set up Zod validator structure (`lib/validators/auth.ts`, `profile.ts`, `semester.ts`, `subject.ts`, etc.) ⚠️ CRITICAL
- [x] Create global types file
- [x] Set up error boundary component
- [x] Create `error.tsx` boundary files in `(app)/` and `(auth)/` ⚠️ CRITICAL
- [x] Scaffold `features/` directory structure (`auth/`, `dashboard/`, `tasks/`, `subjects/`, `schedule/`) ⚠️ CRITICAL
- [x] Fix AppShell: make `(app)/layout.tsx` a server component, render client islands as siblings not wrappers ⚠️ CRITICAL
- [x] Fix duplicate Cmd+K shortcut registration (remove from AppShell, keep in CommandPalette) ⚠️ CRITICAL
- [x] Create `lib/constants/academic.ts` (priority order, subject colors, task types, class types)
- [x] Create the Phase 2 profiles, semesters, and subjects migration
- [x] Provision the Phase 2 schema on the hosted Supabase project
- [ ] Reconcile hosted migration history before future CLI database pushes
- [ ] Generate real database types (`supabase gen types typescript > src/types/database.ts`) ⚠️ P0 BLOCKER
- [x] Configure local development copies from .env.example with the Supabase URL and publishable key
- [x] Verify unauthenticated access to /dashboard redirects to /login
- [x] Load the signed-in profile, current semester, and subjects on the dashboard
- [ ] Connect schedule and task pages to user-owned database records
- [ ] Add `loading.tsx` Suspense boundaries for `(app)/dashboard/`, `(app)/tasks/`, `(app)/subjects/`, `(app)/schedule/`

## Phase 1: Core MVP — Sprint 1 (Auth + Layout + Onboarding)
- [x] Build email/password login; keep Google OAuth optional until provider credentials are configured
- [x] Build signup page
- [x] Build auth callback handler (`app/auth/callback/route.ts`)
- [ ] Refactor login/signup forms to use React Hook Form + Zod validation
- [x] Create profiles table + owner-only RLS policies
- [x] Create semesters table + owner-only RLS policies
- [x] Create subjects table + owner-only RLS policies
- [x] Build sidebar navigation component
- [x] Build top header component
- [x] Build responsive app shell layout
- [x] Build onboarding flow: semester setup (`(onboarding)/setup/page.tsx`)
- [x] Build onboarding flow: subject entry (bulk)
- [x] Build command palette (basic navigation)
- [x] Implement theme toggle (light/dark)
- [ ] Replace all `<a href>` with `<Link>` from `next/link` across all pages ⚠️ REGRESSION: subjects/page.tsx SubjectRow still uses `<a>`
- [x] Extract duplicate `GoogleIcon` to `features/auth/components/`
- [x] Define shared domain type interfaces (`Class`, `Task`, `Subject`) — don't derive from mock array types
- [x] Remove `Loader2` spinner usage from auth pages — use disabled button states instead
- [x] Remove unused imports (`Clock`, `useEffect`, `useCallback`, etc.)
- [x] Memoize `useCommands` array in command palette

## Phase 1: Core MVP — Sprint 2 (Subjects + Schedule)
- [ ] Extract dashboard sub-components into `features/dashboard/components/`
- [ ] Build subjects list page
- [ ] Build subject create/edit form (React Hook Form + Zod)
- [ ] Build subject detail view
- [ ] Build subject delete with confirmation
- [ ] Create classes table + RLS policies
- [ ] Build schedule/timetable page (weekly grid view)
- [ ] Build class create/edit form
- [ ] Build class slot component
- [ ] Implement recurring class logic
- [ ] Add empty states for subjects and schedule
- [x] Fix command palette `ArrowRight` indicator (add `group` class to `CommandItem`)
- [x] Remove `maximumScale: 1` from viewport config (WCAG accessibility violation)
- [ ] Fix schedule mobile list: use `<button>` or `<a>` instead of plain `<div>` for class items

## Phase 1: Core MVP — Sprint 3 (Tasks)
- [ ] Extract task sub-components into `features/tasks/components/`
- [ ] Create tasks table + RLS policies
- [ ] Build tasks list page with filters (status, priority, subject)
- [ ] Build task create form (inline + modal)
- [ ] Build task edit functionality
- [ ] Build task status toggle (todo → in_progress → done)
- [ ] Build task priority indicator
- [ ] Build task due date display with overdue highlighting
- [ ] Implement task sorting (due date, priority, status)
- [ ] Add empty state for tasks
- [ ] Build task quick-add from command palette

## Phase 1: Core MVP — Sprint 4 (Dashboard + Settings + Polish)
- [x] Build dashboard page with the signed-in profile, current semester, and real subjects
- [ ] Build 'Today's Classes' section with Supabase queries
- [ ] Build 'Pending Tasks' section (due today + overdue)
- [ ] Build quick stats row (subjects count, pending tasks, etc.)
- [x] Build greeting + date header personalized by the saved profile
- [ ] Build settings page: profile editing (React Hook Form + Zod)
- [ ] Build settings page: semester management
- [ ] Build settings page: preferences (theme, sidebar)
- [ ] Add skeleton loading states for all pages
- [ ] Add error states for all pages
- [ ] Polish command palette with quick actions
- [ ] Cross-page navigation polish
- [ ] Responsive testing and fixes
- [ ] Refactor Header into server-rendered `PageHeader` + client-only `HeaderControls`
- [ ] Apply `.page-enter` animation to page `<main>` elements
- [ ] Move sidebar collapsed preference from localStorage to cookie (prevent layout flash)
- [ ] Add Firefox scrollbar support (`scrollbar-width: thin; scrollbar-color`)

## Phase 2: Attendance + Analytics
- [ ] Create attendance table + RLS policies
- [ ] Build attendance marking interface (per-class, per-day)
- [ ] Build attendance overview per subject (percentage, trend)
- [ ] Build attendance calendar heatmap view
- [ ] Create grade/CGPA calculation logic (database functions)
- [ ] Build CGPA calculator page
- [ ] Build CGPA trend chart (Recharts)
- [ ] Build subject-wise grade entry
- [ ] Create goals table + RLS policies
- [ ] Build goals list page
- [ ] Build goal create/edit form
- [ ] Build goal progress tracking
- [ ] Add attendance + CGPA stats to dashboard

## Phase 3: Expenses + AI + Advanced
- [ ] Create expenses table + RLS policies
- [ ] Build expense tracking page
- [ ] Build expense entry form
- [ ] Build expense category breakdown (Recharts)
- [ ] Build monthly expense summary
- [ ] Create study_sessions table + RLS policies
- [ ] Build study session timer/logger
- [ ] Create ai_plans table + RLS policies
- [ ] Set up Supabase Edge Functions for AI
- [ ] Build AI study planner interface
- [ ] Implement AI prompt → structured output → Zod validation pipeline
- [ ] Build AI plan display and acceptance flow
- [ ] Advanced analytics dashboard
- [ ] Performance optimization pass
- [ ] Accessibility audit
- [ ] E2E test suite

## Quality Gates (Apply at each phase)
- [ ] All forms validated with Zod
- [ ] All tables have RLS policies
- [ ] All pages have loading skeletons
- [x] All pages have error boundaries (`error.tsx`)
- [ ] All pages have empty states
- [x] All interactive elements are keyboard accessible
- [x] Dark mode works correctly
- [x] Responsive down to 360px (mobile) and 768px (tablet)
- [ ] No `<a href>` — use `<Link>` for all internal navigation
- [x] No spinner components — use skeleton loaders or disabled states
- [x] All feature code organized in `features/[name]/` modules
- [x] No unused imports

---

## Architectural Remediation Log (Sonnet Handover Takeover)

| Issue ID | Description & Changes Made | Status | Verification Result | Remaining Limitations |
| :--- | :--- | :--- | :--- | :--- |
| **C1** | **Supabase SSR Foundation & Clients**: Installed `@supabase/ssr` & `@supabase/supabase-js`. Fixed premature block-comment syntax error in `server.ts`. Implemented environment guard checks (`isSupabaseConfigured`, `isSupabaseServerConfigured`). Updated `updateSession` in `middleware.ts` to clone redirect responses and preserve cookie synchronization. Created `.env.example` with public and secret variable documentation. Updated `src/types/database.ts` to make `completed_at` optional on task insert. Created `(auth)/callback/route.ts` PKCE exchange handler. | **Fixed** | `npx tsc --noEmit` (0 errors)<br>`npm run lint` (0 errors)<br>`next build` (success, static + dynamic routes) | Requires user to create actual Supabase project and provide credentials in `.env.local` to connect live database. |
| **C4** | **AppShell Server/Client Boundary**: Refactored `src/app/(app)/layout.tsx` into an async React Server Component. Server component fetches current user without exposing service keys. Refactored `AppShell` into `AppContent` client island managing only responsive margin offsets. Removed duplicate Cmd+K registration from AppShell. Rendered `Sidebar`, `AppContent`, `MobileNav`, and `CommandPalette` as sibling islands. Added `toggle` to Cmd+K in `CommandPalette` and memoized commands array via `useMemo`. Added `user` prop to `Sidebar`. | **Fixed** | `npx tsc --noEmit` (0 errors)<br>`npm run lint` (0 errors)<br>`next build` (success) | None. Fully separated server and client boundaries with intact responsive layouts. |
| **C2** | **Feature-Oriented Architecture**: Scaffolded `src/features/` with isolated modules: `auth/` (types, mutations, shared `GoogleIcon`), `dashboard/` (types, queries), `schedule/` (types, queries, mutations), `tasks/` (types, queries, mutations), `subjects/` (types, queries, mutations). Extracted domain types from mock page arrays. Provided safe fallback responses for all queries when Supabase is not configured. | **Fixed** | `npx tsc --noEmit` (0 errors)<br>`npm run lint` (0 errors)<br>`next build` (success) | Pages currently consume fallback queries; connecting pages to live queries with suspense skeletons will occur in feature sprints. |
| **C3** | **Zod Validator Foundation**: Installed `zod`, `react-hook-form`, and `@hookform/resolvers`. Created single source of truth schemas in `src/lib/validators/`: `auth.ts`, `profile.ts`, `semester.ts`, `subject.ts`, `class.ts`, `task.ts`, `attendance.ts`, `expense.ts`, `goal.ts`, `ai-plan.ts`, and barrel export in `index.ts`. Compatible with Zod v4. | **Fixed** | `npx tsc --noEmit` (0 errors)<br>`npm run lint` (0 errors)<br>`next build` (success) | None. Ready for React Hook Form integration across all entity CRUD forms. |
| **Q1** | **Error Boundaries**: Created `src/app/(app)/error.tsx` and `src/app/(auth)/error.tsx` matching CampusOS calm design with structured error logging and recovery reset actions. | **Fixed** | `npx tsc --noEmit` (0 errors)<br>`npm run lint` (0 errors)<br>`next build` (success) | None. |
| **Q2** | **Academic Domain Constants**: Created `src/lib/constants/academic.ts` defining 10-color subject palette from `DESIGN_SYSTEM.md`, priority weights, task types, class types, and attendance statuses. | **Fixed** | `npx tsc --noEmit` (0 errors)<br>`npm run lint` (0 errors)<br>`next build` (success) | None. |
| **Q3** | **Accessibility & Navigation Polish**: Replaced most native `<a href>` tags across auth layout, login, signup, dashboard, and empty-state with Next.js `<Link>`. Removed `maximumScale: 1` from root `viewport` configuration to comply with WCAG AA 1.4.4. Fixed `ArrowRight` hover indicator in CommandPalette by adding `group` class to `CommandItem`. Removed `Loader2` spinners from auth pages in favor of calm disabled states. | **Partial** | `npx tsc --noEmit` (0 errors)<br>`npm run lint` (0 errors)<br>`next build` (success) | `SubjectRow` in `subjects/page.tsx` L127 still uses `<a href>` instead of `<Link>`. |
| **Q4** | **React 19 & Hooks Remediation**: Resolved React 19 `set-state-in-effect` warnings in `header.tsx`, `use-media-query.ts`, and `sidebar-context.tsx` by leveraging `useSyncExternalStore` for hydration checks, media queries, and localStorage synchronization. Stabilized `useKeyboardShortcut` using `useRef`. | **Fixed** | `npm run lint` (0 errors, 0 warnings) | None. |
| **AUDIT-1** | **Independent Architectural & Security Audit**: Conducted full verification of TypeScript (`npx tsc --noEmit`), ESLint (`npm run lint`), and Next.js 16.3.5 Turbopack production build (`npm run build`). All passed code 0. Patched P1 middleware OAuth callback interception flaw in `src/lib/supabase/middleware.ts` to permit PKCE code exchange on `/callback`. Generated comprehensive `ARCHITECTURAL_AUDIT.md`. | **Completed** | `npx tsc --noEmit` (0 errors)<br>`npm run lint` (0 errors)<br>`npm run build` (success, 12 routes) | Phase 1 feature implementation unblocked. |
