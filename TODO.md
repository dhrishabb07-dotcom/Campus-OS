# CampusOS Implementation Roadmap

This document outlines the phased implementation plan for CampusOS, a polished student productivity platform built with Next.js (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL + Auth + RLS), shadcn/ui, Lucide icons, Motion (framer-motion), Recharts, React Hook Form, Zod, and date-fns.

## Phase 0: Project Foundation
- [ ] Initialize Next.js project with TypeScript and App Router
- [ ] Configure Tailwind CSS with custom design tokens
- [ ] Install and configure shadcn/ui
- [ ] Set up Supabase project (local dev + cloud)
- [ ] Configure Supabase Auth (email + Google OAuth)
- [ ] Set up environment variables (.env.local)
- [ ] Create Supabase client utilities (browser, server, middleware)
- [ ] Set up authentication middleware
- [ ] Create base layout (app shell with sidebar placeholder)
- [ ] Configure ESLint, Prettier, path aliases
- [ ] Set up Zod validator structure
- [ ] Create global types file
- [ ] Set up error boundary component

## Phase 1: Core MVP — Sprint 1 (Auth + Layout + Onboarding)
- [ ] Build login page (email + Google OAuth)
- [ ] Build signup page
- [ ] Build auth callback handler
- [ ] Create profiles table + RLS policies
- [ ] Create semesters table + RLS policies
- [ ] Create subjects table + RLS policies
- [ ] Build sidebar navigation component
- [ ] Build top header component
- [ ] Build responsive app shell layout
- [ ] Build onboarding flow: semester setup
- [ ] Build onboarding flow: subject entry (bulk)
- [ ] Build command palette (basic navigation)
- [ ] Implement theme toggle (light/dark)

## Phase 1: Core MVP — Sprint 2 (Subjects + Schedule)
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

## Phase 1: Core MVP — Sprint 3 (Tasks)
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

## Phase 1: Core MVP — Sprint 4 (Dashboard + Settings)
- [ ] Build dashboard page layout (asymmetric, prioritized)
- [ ] Build 'Today's Classes' section
- [ ] Build 'Pending Tasks' section (due today + overdue)
- [ ] Build quick stats row (subjects count, pending tasks, etc.)
- [ ] Build greeting + date header
- [ ] Build settings page: profile editing
- [ ] Build settings page: semester management
- [ ] Build settings page: preferences (theme, sidebar)
- [ ] Add skeleton loading states for all pages
- [ ] Add error states for all pages
- [ ] Polish command palette with quick actions
- [ ] Cross-page navigation polish
- [ ] Responsive testing and fixes

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
- [ ] All pages have error boundaries
- [ ] All pages have empty states
- [ ] All interactive elements are keyboard accessible
- [ ] Dark mode works correctly
- [ ] Responsive down to 768px
