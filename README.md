# CampusOS

> **Your entire college life. One calm workspace.**

CampusOS is a full-stack student productivity platform designed to bring
the most important parts of college life into one focused workspace ---
schedules, tasks, academics, attendance, expenses, goals, and
AI-assisted study planning.

The project is being built as a production-oriented application rather
than a collection of disconnected student utilities. The focus is on
clean architecture, thoughtful UX, strong data ownership, accessibility,
responsive design, and responsible AI integration.

------------------------------------------------------------------------

## 🚧 Project Status

**Active Development --- Phase 1, Sprint 1 completed.**

The initial visual foundation and application shell have been
implemented and pushed to GitHub. The project is now moving into backend
integration, authentication, onboarding, and feature development.

### Current milestone

-   [x] Project foundation
-   [x] Application shell
-   [x] Core visual/design system foundation
-   [x] Responsive navigation foundation
-   [x] Theme foundation
-   [x] Initial reusable UI components
-   [x] Git repository initialized
-   [x] Phase 1 Sprint 1 completed
-   [ ] Supabase integration
-   [ ] Authentication
-   [ ] User onboarding
-   [ ] Dashboard data integration
-   [ ] Task management
-   [ ] Schedule management
-   [ ] Academic tracking
-   [ ] Attendance tracking
-   [ ] Expense tracking
-   [ ] Goals
-   [ ] AI Study Planner
-   [ ] Production hardening

------------------------------------------------------------------------

## 🎯 Why CampusOS?

College students often manage their academic and personal workflows
across multiple disconnected tools:

-   Calendar for classes
-   Notes for assignments
-   Spreadsheets for attendance
-   Calculators for CGPA
-   Separate apps for expenses
-   Random reminders for deadlines
-   AI chatbots for study planning

CampusOS aims to turn these disconnected workflows into one coherent
system.

The goal isn't to add features simply because they are possible. Every
feature should answer a real student need and fit naturally into the
student's daily workflow.

------------------------------------------------------------------------

## ✨ Planned Features

### 📊 Dashboard

A contextual overview of the student's day rather than a generic
collection of dashboard cards.

The dashboard will surface:

-   Upcoming classes
-   Important tasks
-   Approaching deadlines
-   Attendance insights
-   Academic context
-   Study sessions
-   Relevant goals

The primary question the dashboard should answer is:

> **"What do I need to know and do today?"**

### 📅 Schedule

A college timetable designed for both desktop and mobile use.

Planned capabilities include:

-   Daily schedule
-   Weekly schedule
-   Create/edit/delete classes
-   Subject association
-   Instructor information
-   Room information
-   Start/end times
-   Recurring classes
-   Current class indication
-   Upcoming/completed class states
-   Overlapping-class handling
-   Mobile agenda/day view

### ✅ Task Management

A focused assignment and task management system.

Planned capabilities:

-   Create, edit, delete, and complete tasks
-   Due dates
-   Priorities
-   Task types
-   Subject association
-   Search
-   Filtering
-   Sorting
-   Optimistic UI interactions
-   Empty, loading, and error states

### 🎓 Academic Tracking

A structured academic workspace for managing semesters and subjects.

Planned capabilities:

-   Multiple semesters
-   Subject management
-   Credits
-   Grades
-   SGPA calculation
-   CGPA calculation
-   Academic analytics
-   Configurable grading systems

The academic calculation layer will be separated from the UI so the
underlying logic remains testable and maintainable.

### 📈 Attendance Tracking

Attendance tracking designed to provide useful information instead of
simply displaying a percentage.

Planned capabilities:

-   Classes conducted
-   Classes attended
-   Missed classes
-   Attendance percentage
-   Attendance trends
-   Configurable attendance target
-   Classes that can be missed while maintaining a target
-   Classes required to reach a target percentage

Attendance thresholds will not be hard-coded to a single university
policy.

### 💰 Expense Tracking

A simple personal expense system for students.

Planned capabilities:

-   Add expenses
-   Categories
-   Dates
-   Notes
-   Monthly totals
-   Category breakdowns
-   Spending trends
-   Lightweight visual analytics

### 🎯 Goals

A personal goal system for tracking progress outside academics.

Potential areas include:

-   Academic goals
-   Personal goals
-   Fitness goals
-   Project goals
-   Habit-related goals

The goal system will focus on clarity and progress rather than
unnecessary gamification.

### 🤖 AI Study Planner

The AI Study Planner is intended to be more than a chatbot.

Instead of asking an LLM to simply generate a block of text, CampusOS
will provide relevant student context such as:

-   Tasks
-   Deadlines
-   Subjects
-   Schedule
-   Goals
-   Available study time
-   Existing study sessions

The AI can then generate a structured study plan.

Planned architecture:

``` text
Student Context
      ↓
CampusOS Data
      ↓
AI Planning Service
      ↓
LLM
      ↓
Structured Output
      ↓
Schema Validation
      ↓
User Review
      ↓
Application Execution
      ↓
Database
```

The LLM will **not receive unrestricted direct access to the database**.

AI-generated actions will be structured, validated, authorized, and ---
where appropriate --- reviewed by the user before being persisted.

------------------------------------------------------------------------

## 🧠 Architecture

CampusOS follows a modular full-stack architecture designed to keep
presentation, application logic, data access, validation, and AI
services separated.

``` text
                         ┌─────────────────┐
                         │      USER       │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │    Next.js UI   │
                         │ React + TS      │
                         └────────┬────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
              Application       AI Layer     Calculations
                 Logic          Service        & Utilities
                    │             │             │
                    └─────────────┼─────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │    Supabase     │
                         ├─────────────────┤
                         │ PostgreSQL      │
                         │ Authentication  │
                         │ RLS             │
                         │ Storage         │
                         └─────────────────┘
```

### Core architectural principles

1.  Separation of concerns
2.  Database as the source of truth
3.  Server-side protection for sensitive operations
4.  Row Level Security for user-owned data
5.  Schema validation for external and AI-generated data
6.  Reusable UI components
7.  Testable business logic
8.  Responsive-first design
9.  Accessibility as a requirement rather than a final polish step
10. AI as a controlled application capability, not an unrestricted
    database operator

------------------------------------------------------------------------

## 🗄️ Data Model

The planned database structure is centered around the authenticated
student.

``` text
User
 │
 ├── Profile
 │
 ├── Semesters
 │      │
 │      └── Subjects
 │             ├── Tasks
 │             ├── Classes
 │             └── Attendance
 │
 ├── Expenses
 │
 ├── Goals
 │
 ├── Study Sessions
 │
 └── AI Plans
```

Planned primary tables include:

``` text
profiles
semesters
subjects
classes
tasks
attendance
expenses
goals
study_sessions
ai_plans
```

Foreign keys and ownership relationships will be used to maintain data
integrity.

------------------------------------------------------------------------

## 🔐 Security

Security is treated as part of the architecture rather than a final
checklist item.

CampusOS is designed around:

-   Supabase Authentication
-   PostgreSQL Row Level Security
-   User-owned data policies
-   Server/client boundary separation
-   Environment variables for secrets
-   Input validation
-   AI output validation
-   Controlled database mutations
-   Least-privilege data access

A core security principle is:

> **Authentication determines who the user is. Authorization determines
> what that user can access.**

Client-side checks alone will not be treated as sufficient
authorization.

------------------------------------------------------------------------

## 🎨 Design Philosophy

CampusOS intentionally avoids the typical AI-generated SaaS aesthetic.

### The interface aims to be

-   Calm
-   Premium
-   Editorial
-   Information-dense
-   Responsive
-   Accessible
-   Intentional
-   Fast to navigate

### Avoided patterns

-   Excessive card grids
-   Giant dashboard headings
-   Purple/blue AI gradients everywhere
-   Excessive glassmorphism
-   Decorative blobs
-   Unnecessary shadows
-   Excessive rounded containers
-   Icons used purely as decoration
-   Huge empty spaces
-   Generic AI-generated SaaS layouts

The interface takes inspiration from the principles of products such as
Linear, Notion, and Apple Calendar while maintaining its own visual
identity.

------------------------------------------------------------------------

## 🛠️ Technology Stack

### Frontend

-   **Next.js** --- application framework
-   **React** --- UI architecture
-   **TypeScript** --- type safety
-   **Tailwind CSS** --- styling system
-   **shadcn/ui** --- accessible UI primitives
-   **Lucide** --- interface icons
-   **Motion** --- interface animation
-   **Recharts** --- data visualization

### Backend / Data

-   **Supabase**
-   **PostgreSQL**
-   **Supabase Auth**
-   **Row Level Security**
-   **Supabase Storage** where required

### Application Utilities

-   **Zod** --- schema validation
-   **React Hook Form** --- form management
-   **date-fns** --- date/time utilities

### AI

The AI layer is designed to support LLM providers through a dedicated
service boundary rather than scattering provider-specific API calls
throughout the application.

------------------------------------------------------------------------

## 📁 Project Structure

``` text
campus-os/
│
├── app/
│   ├── (auth)/
│   ├── dashboard/
│   ├── schedule/
│   ├── tasks/
│   ├── academics/
│   ├── attendance/
│   ├── expenses/
│   ├── goals/
│   ├── ai-planner/
│   └── settings/
│
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── tasks/
│   ├── schedule/
│   ├── attendance/
│   └── charts/
│
├── lib/
│   ├── supabase/
│   ├── ai/
│   ├── calculations/
│   ├── validations/
│   └── utils/
│
├── hooks/
├── types/
├── public/
│
├── supabase/
│   └── migrations/
│
├── AGENTS.md
├── PRODUCT_SPEC.md
├── DESIGN_SYSTEM.md
├── ARCHITECTURE.md
├── TODO.md
└── README.md
```

The exact structure may evolve as the application develops, but the goal
is to preserve clear boundaries between UI, business logic, data access,
validation, and infrastructure.

------------------------------------------------------------------------

## 🤖 Multi-Agent Development Workflow

CampusOS is being developed using AI coding agents as engineering
collaborators rather than treating AI as a one-shot code generator.

``` text
                         PRODUCT OWNER
                              │
                              ▼
                           OPUS
                   Architecture / Planning
                    Review / Critical Audit
                              │
                              ▼
                          SONNET
                   UI / UX / Implementation
                       Build / Polish
                              │
                              ▼
                            TEST
                     Manual + Automated
                              │
                              ▼
                           OPUS
                       Review / Audit
                              │
                              ▼
                          SONNET
                         Fix / Polish
```

### Opus responsibilities

-   Architecture
-   Difficult technical decisions
-   Security reviews
-   Database/RLS audits
-   Complex business logic
-   AI architecture review
-   Code review
-   Product and UX critique
-   Release readiness

### Sonnet responsibilities

-   UI implementation
-   UX implementation
-   Application shell
-   Components
-   Responsive behavior
-   Feature implementation
-   Interaction design
-   Motion
-   Accessibility implementation
-   Visual polish

### Human responsibilities

The human developer remains responsible for:

-   Product decisions
-   Requirements
-   Reviewing generated work
-   Testing behavior
-   Understanding architectural decisions
-   Approving changes
-   Maintaining the project's direction

AI agents are implementation and reasoning tools --- not the product
owner.

------------------------------------------------------------------------

## 📋 Development Roadmap

### Phase 1 --- Foundation

-   [x] Sprint 1 --- Visual foundation and application shell
-   [ ] Sprint 2 --- Supabase setup, authentication and onboarding
-   [ ] Sprint 3 --- Dashboard foundation
-   [ ] Sprint 4 --- Tasks and schedule

### Phase 2 --- Academic Systems

-   [ ] Subject management
-   [ ] Attendance tracking
-   [ ] CGPA/SGPA calculations
-   [ ] Academic analytics

### Phase 3 --- Personal Management

-   [ ] Expense tracking
-   [ ] Goals
-   [ ] Study sessions
-   [ ] Supporting analytics

### Phase 4 --- AI Layer

-   [ ] AI Study Planner
-   [ ] Structured AI outputs
-   [ ] Zod validation
-   [ ] User approval workflow
-   [ ] AI failure handling
-   [ ] AI security hardening

### Phase 5 --- Production Readiness

-   [ ] Full accessibility audit
-   [ ] Responsive audit
-   [ ] Performance optimization
-   [ ] Security audit
-   [ ] Automated testing
-   [ ] Error handling audit
-   [ ] Production build validation
-   [ ] Documentation completion
-   [ ] Deployment

------------------------------------------------------------------------

## 🧪 Quality Strategy

Testing will cover:

-   Business logic
-   Attendance calculations
-   CGPA calculations
-   Form validation
-   Authentication flows
-   Authorization/RLS
-   Responsive behavior
-   Accessibility
-   Loading states
-   Error states
-   Empty states
-   AI output validation
-   AI failure scenarios
-   Production builds

Particular attention will be given to edge cases such as:

-   0% attendance
-   100% attendance
-   Threshold boundaries
-   Different credit weights
-   Different grading systems
-   Empty datasets
-   Invalid AI responses
-   Unauthorized data access
-   Network failures

------------------------------------------------------------------------

## 🚀 Getting Started

### Prerequisites

-   Node.js
-   npm/pnpm/yarn
-   A Supabase project once backend integration is enabled

### Installation

``` bash
git clone <your-repository-url>
cd campus-os
npm install
npm run dev
```

Then open:

``` text
http://localhost:3000
```

### Environment variables

Create a local environment file based on the project's environment
configuration.

Example:

``` env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Additional AI/provider variables may be introduced when the AI layer is
implemented.

**Never commit real API keys, service-role keys, passwords, or other
secrets to GitHub.**

------------------------------------------------------------------------

## 📸 Screenshots

Screenshots will be added as major product areas reach stable
milestones.

------------------------------------------------------------------------

## 🧩 Engineering Principles

> **Build the product, not the demo.**

> **Prefer simple architecture over unnecessary abstraction.**

> **The database is the source of truth.**

> **Client-side checks are not security boundaries.**

> **AI suggests; the application validates and controls execution.**

> **Accessibility and responsive behavior are part of implementation,
> not cleanup.**

> **Every new feature should earn its complexity.**

------------------------------------------------------------------------

## 🗺️ Long-Term Vision

The long-term goal is for CampusOS to become a student's central
workspace for managing academic responsibilities and everyday college
life.

A successful version should reduce the need to mentally coordinate
multiple disconnected systems.

The product should answer three questions quickly:

1.  **What is happening?**
2.  **What needs my attention?**
3.  **What should I do next?**

The AI layer is intended to enhance those workflows rather than become
the product itself.

------------------------------------------------------------------------

## 👨‍💻 Development

CampusOS is currently under active development.

The project is being built incrementally with a focus on understanding
the architecture, validating each feature, and continuously reviewing
the system for product, UX, security, and engineering quality.

------------------------------------------------------------------------

## 📄 License

License information will be added before the first public release.

------------------------------------------------------------------------

**CampusOS** --- *Your entire college life. One calm workspace.*
