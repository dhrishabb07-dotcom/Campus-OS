# CampusOS Product Specification
*Your entire college life. One calm workspace.*

## 1. Product Vision & Principles

### 1.1 Product Principles
1. **Calm over cluttered:** The UI must aggressively filter out noise. Information density should be comfortable, not overwhelming.
2. **Useful on day one:** Users should experience value within 3 minutes of signing up. No complex initial configurations.
3. **Data belongs to the student:** Export options are mandatory. Lock-in is a failure of product quality.
4. **Smart defaults over endless configuration:** Provide the best practice out-of-the-box. Configuration is an escape hatch, not the default path.
5. **Academic-first:** This is not a generic productivity tool. Every feature is viewed through the lens of a student's lifecycle.
6. **Offline-resilient:** The core experience shouldn't break entirely if the campus Wi-Fi drops. Optimistic UI updates are required.
7. **Mobile-conscious:** A fully responsive web app that feels native on a phone browser. We are not building a dedicated mobile app yet.

### 1.2 Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database & Backend:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **UI Components:** shadcn/ui
- **Icons:** Lucide
- **Animations:** Motion (framer-motion)
- **Charts:** Recharts
- **Forms & Validation:** React Hook Form + Zod
- **Date Handling:** date-fns

## 2. Target Users & Problems

### 2.1 Core Problems
- **Tool Fragmentation:** Students juggle 5-7 different apps (Google Calendar, Notion, Excel, paper planners, random CGPA calculators).
- **Generic Tools:** Existing tools are built for enterprise workers or general life, lacking academic context (semesters, credits, attendance).
- **Manual Overhead:** Tracking attendance is tedious and quickly forgotten.
- **Fragmented Academic Tracking:** CGPA calculation happens on ad-hoc websites; study planning lacks structured execution.
- **Financial Friction:** Expense tracking for students is often abandoned after two days due to friction.

### 2.2 Target Users
- **Primary:** Undergraduate university/college students.
- **Secondary:** Graduate students.

### 2.3 User Personas
#### Persona 1: Rahul (Indian Engineering Student)
- **Scenario:** Juggling 6 subjects, stringent 75% attendance criteria, multiple lab files, and placement preparation.
- **Current Stack:** WhatsApp groups for updates, scattered PDFs, Notion (rarely updated), a physical diary.
- **Pain Points:** Calculating if he can afford to skip tomorrow's 8 AM lecture; tracking aggregate SGPA across 8 semesters.

#### Persona 2: Sarah (US Liberal Arts Student)
- **Scenario:** Balancing a major, a minor, part-time campus job, and club activities. Classes are spread out across the week.
- **Current Stack:** Google Calendar (cluttered with both academic and personal), Apple Notes, physical planner.
- **Pain Points:** Context switching between academic deadlines and personal life; feeling overwhelmed during midterms because due dates sneak up.

## 3. Scope & Phasing

### 3.1 Phase 1: MVP Scope
*The foundation for daily academic life.*
- Authentication (Email + Google OAuth)
- Onboarding (Semester setup, adding subjects)
- Dashboard (Daily briefing: classes, tasks, stats)
- Schedule/Timetable (Weekly grid, recurring classes)
- Tasks (Subject-linked, deadlines, priorities)
- Subjects (CRUD, credits, instructor details)
- Settings (Profile, semester toggle)
- Command Palette (Global navigation & quick actions)

### 3.2 Phase 2: Academic Tracking
*Moving from organization to optimization.*
- Attendance tracking (with predictive "can I skip?" calculations)
- CGPA/SGPA calculator and historical analytics
- Academic Goals (target grades)

### 3.3 Phase 3: The Complete Ecosystem
*Expanding into the rest of student life.*
- Expense tracking (tailored for student budgets/allowances)
- AI Study Planner (breaking down syllabi into daily chunks)
- Advanced analytics (time spent vs. grade correlation)

## 4. MVP Feature Specifications

### 4.1 Authentication & Onboarding
- **User Story:** As a new student, I want to quickly sign up and set up my current semester so I can start managing my academic life.
- **Acceptance Criteria:**
  - Google OAuth and Magic Link email login functional.
  - Guided onboarding flow (3 steps max): Name -> Current Semester -> Add 2 Subjects.
  - Generates a default semester if none is provided.
- **Key Interactions:** Smooth framer-motion transitions between onboarding steps.
- **Edge Cases:** User abandons onboarding midway (resume on next login).
- **What it does NOT do:** Complex university integrations (SSO via university portals).

### 4.2 Dashboard (The Daily Briefing)
- **User Story:** As a student, I want to see exactly what I need to do and attend today at a single glance.
- **Acceptance Criteria:**
  - Displays today's schedule chronologically.
  - Highlights urgent tasks (due today/overdue).
  - Shows quick stats (tasks completed this week).
- **Key Interactions:** One-click task completion from the dashboard.
- **Edge Cases:** Empty schedule (weekend/holiday) shows a visually pleasing "Rest Day" state.
- **What it does NOT do:** It is not a wall of generic widgets. It is a curated, non-configurable daily brief.

### 4.3 Schedule / Timetable
- **User Story:** As a student, I want to view my weekly class schedule so I know where I need to be.
- **Acceptance Criteria:**
  - Weekly grid view (Monday-Friday/Saturday).
  - Ability to add recurring classes tied to subjects.
  - Color-coded by subject.
- **Key Interactions:** Click on a time block to view/edit details.
- **Edge Cases:** Overlapping classes (handle visually or prevent creation).
- **What it does NOT do:** Not a full calendar app. Does not sync with Google Calendar (yet). No complex recurrence rules (only weekly).

### 4.4 Task Management
- **User Story:** As a student, I want to track my assignments and readings tied to specific subjects.
- **Acceptance Criteria:**
  - Create tasks linked to subjects.
  - Set due dates and priorities (High, Medium, Low).
  - Mark complete.
- **Key Interactions:** Inline editing. Pressing 'Enter' saves and focuses next input.
- **Edge Cases:** Overdue tasks persist and turn red.
- **What it does NOT do:** No sub-tasks. No complex Kanban boards. No collaboration.

### 4.5 Subjects Management
- **User Story:** As a student, I want to manage my enrolled subjects for the semester.
- **Acceptance Criteria:**
  - CRUD operations for subjects.
  - Fields: Name, Code (e.g., CS101), Credits, Instructor, Color.
- **Key Interactions:** Picking a color theme for the subject.
- **Edge Cases:** Deleting a subject with associated tasks (requires confirmation and cascades or unlinks).
- **What it does NOT do:** Syllabus file hosting.

### 4.6 Command Palette
- **User Story:** As a power user, I want to navigate the app and perform actions using only my keyboard.
- **Acceptance Criteria:**
  - Triggered via `Cmd/Ctrl + K`.
  - Search subjects, navigate routes, quick create task.
- **Key Interactions:** Fuzzy search and keyboard navigation.
- **Edge Cases:** Handles slow network when fetching dynamic results.
- **What it does NOT do:** Complex multi-step wizard flows.

## 5. User Journeys

### 5.1 First-Time User Onboarding
1. Lands on marketing page -> Clicks "Get Started".
2. Signs in via Google OAuth.
3. Welcomed by a clean onboarding modal.
4. Enters University Name and Current Semester (e.g., "Fall 2026").
5. Prompted to add their first 3 subjects.
6. Dropped into the Dashboard. An empty state nudges them to add tasks or set up their timetable.

### 5.2 Daily Usage Pattern (Morning)
1. Opens CampusOS on phone over breakfast.
2. Checks Dashboard to see the first class time.
3. Sees a "Due Today" task and mentally prepares to submit it by evening.
4. Uses Command Palette to quickly add a "Buy lab manual" task before closing the app.

### 5.3 Weekly Review Pattern (Sunday Evening)
1. Opens CampusOS on laptop.
2. Navigates to Tasks view. Checks off completed items from the past week.
3. Reviews the upcoming Schedule.
4. Adds new reading assignments for the week based on syllabi.

### 5.4 End-of-Semester Flow
1. Navigates to Settings -> Semesters.
2. Marks current semester as "Archived".
3. Creates new semester.
4. Begins adding new subjects, enjoying a clean slate.

## 6. UX & Design Decisions

- **Navigation:** Sidebar navigation on desktop (collapsible to icons). Bottom tab bar or hamburger menu on mobile.
- **Dashboard:** Curated daily briefing. Strict layout, zero widgets configuration.
- **Task Input:** Inline editing. Fluid, keyboard-first entry. No heavy modals for basic task creation.
- **Schedule:** Clean weekly grid. Academic-focused (e.g., standard 8 AM - 8 PM scale).
- **Command Palette:** The primary navigation tool for power users. Must feel instant.
- **Empty States:** Must be helpful and actionable (e.g., "No classes today. Want to add a task?"), not just decorative illustrations.
- **Loading States:** Skeleton loaders matching the component structure. No generic spinners.
- **Error States:** Actionable error messages. ("Failed to save task. [Retry]")
- **Typography & Colors:** High contrast, readable fonts (Inter/Geist). Calm palette (slate, zinc, muted blues).

## 7. Feature Priorities (MoSCoW for MVP)

### Must Have
- User Auth (Supabase Auth: Email/Password + Google OAuth)
- Onboarding flow (semester + subject setup)
- Semester & Subject CRUD
- Weekly Schedule Grid with recurring classes
- Basic Task Management (CRUD, due dates, priorities, subject linking)
- Dashboard (curated daily briefing)
- Command Palette (`Cmd/Ctrl+K` — core navigation infrastructure)
- Dark/Light mode with system preference detection
- Responsive design (desktop-first, functional down to 768px)
- Skeleton loading states for all views
- Actionable error states and empty states

### Should Have
- Task filtering and sorting (by status, priority, subject, due date)
- Inline task editing (keyboard-first)
- Task quick-add from Command Palette
- Settings page (profile, semester management, preferences)
- Class overlap detection in schedule

### Could Have
- Email notifications for overdue tasks
- Task type categorization (assignment/exam/project/reading)
- Semester archival flow

### Won't Have (in Phase 1)
- Attendance Tracking (Phase 2)
- CGPA Calculator (Phase 2)
- Goals (Phase 2)
- Expense Tracking (Phase 3)
- AI Study Planner (Phase 3)
- Google Calendar sync
- Push Notifications
- Mobile App (iOS/Android)
- Collaboration/Sharing features
- Sub-tasks or Kanban boards
- University SSO integration
