# CampusOS

> **Your entire college life. One calm workspace.**

CampusOS is a student workspace for organizing a semester. The current milestone connects sign-in and first-time setup to a personalized dashboard.

## Current milestone

- Email and password sign-up, sign-in, password recovery, and sign-out use Supabase Auth.
- New students save their university, degree, current semester, and subjects during setup.
- After sign-in, the dashboard reads the student's name, university, degree, current semester, and subjects from their own Supabase records.
- Google sign-in is optional and hidden until its provider is configured.
- Class schedules, assignments, attendance, and analytics are future work; the dashboard does not present sample data as a student's real data.

## Run locally

Install Node.js first, then open a new PowerShell window and check <code>node --version</code>. If pnpm is not installed, enable it through Corepack or install it with <code>npm install --global pnpm</code>.

From the project folder:

~~~powershell
Copy-Item .env.example .env.local
# Add your Supabase project URL and publishable key to .env.local.
pnpm install
pnpm dev
~~~

Open [http://localhost:3000](http://localhost:3000). Create an account at <code>/signup</code>, confirm the email if Supabase requests it, finish <code>/setup</code>, and then sign in at <code>/login</code>.

The app needs these local values:

~~~env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=false
~~~

Only use a Supabase publishable key in the app. Never put a Supabase secret or service-role key in a NEXT_PUBLIC_ variable or commit it to GitHub. .env.local is ignored by Git.

## Supabase setup

The initial schema is in [supabase/migrations/20261020174924_phase_2_auth_onboarding.sql](supabase/migrations/20261020174924_phase_2_auth_onboarding.sql). It creates profiles, semesters, subjects, an atomic onboarding function, and owner-scoped row-level security policies.

For a fresh Supabase project, apply the migration before using signup and onboarding. The existing CampusOS project already has this schema. Its migration history must be reconciled before running a database push against it, so an already-created table is not applied a second time.

Set the Supabase Auth site URL to http://localhost:3000 and allow http://localhost:3000/auth/callback for local email confirmation and password recovery.

### Google sign-in

Email sign-in does not require Google Cloud. Keep NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=false until the Google provider is configured in Supabase with valid OAuth credentials and callback URLs. Then set the flag to true in the local or hosting environment and restart/redeploy the app.

## Later publishing

CampusOS is a server-rendered Next.js app. A public release needs a Next.js-compatible host and production environment variables, plus the production domain in Supabase Auth's allowed redirect URLs. Preview and test signup, email confirmation, password recovery, and dashboard data before a public release.

No Android project is included yet. The hosted app can later be paired with an Android wrapper such as Capacitor or a separate native client; Android sign-in will need a mobile deep-link callback.
