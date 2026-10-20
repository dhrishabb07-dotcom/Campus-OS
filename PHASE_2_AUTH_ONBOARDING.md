# Phase 2 — Authentication, onboarding, and personalized dashboard

This file describes the Phase 2 milestone requested for CampusOS. The older implementation roadmap in TODO.md uses separate phase numbers.

## Student flow

1. A student signs up or signs in with email and password.
2. A new student confirms their email when Supabase requires it, then completes setup.
3. Setup saves the university, degree, current semester, and subject list to the student's Supabase records.
4. The protected app layout sends incomplete profiles to setup and completed profiles to the dashboard.
5. The dashboard loads the signed-in student's profile, current semester, and subjects from Supabase.

Google sign-in is optional. The login and signup pages hide the Google action unless NEXT_PUBLIC_GOOGLE_AUTH_ENABLED is set to true. Keep it false until Google is configured as a Supabase Auth provider; email sign-in does not require Google Cloud.

## Data and access control

The migration creates:

- profiles, one row per auth user;
- semesters, owned by the signed-in user, with at most one current semester;
- subjects, linked to an owned semester;
- a private new-user trigger and an atomic onboarding RPC;
- RLS policies that scope table access to the authenticated owner.

Server-rendered dashboard reads use the request-scoped Supabase client and the user's cookie-backed session. Row Level Security remains the data authorization boundary. The client receives only the project URL and publishable key.

The dashboard intentionally omits sample classes and assignments. Those modules are not yet backed by the Phase 2 schema, so their data should not be shown as if it belonged to the signed-in student.

## Migration and hosted project

The migration file is supabase/migrations/20261020174924_phase_2_auth_onboarding.sql. The existing hosted CampusOS project is active and has the profiles, semesters, and subjects tables with RLS enabled, plus the onboarding function. Its migration history currently returns no recorded versions even though the schema is present. Reconcile migration history before running a database push against that project; do not apply the schema a second time.

This milestone changes no hosted database schema or student records.

## Local configuration

Copy .env.example to .env.local and set:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
- NEXT_PUBLIC_APP_URL
- NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=false

In Supabase Auth, set the local Site URL to http://localhost:3000 and add http://localhost:3000/auth/callback to the allowed redirect URLs. Confirm the Email provider is enabled.

## Verification notes

- TypeScript checking completed without errors.
- ESLint completed on the changed dashboard, login, signup, and Supabase config files without diagnostics.
- The production build passed. The route manifest marks /dashboard as request-time rendered.
- With Supabase configured and no session, the production server returned HTTP 200 for /login and /signup and redirected /dashboard to /login with HTTP 307. The auth pages did not render a Google button while the Google flag was off.
- A separate no-configuration smoke check rendered the dashboard connection state and found none of the previous static sample names or assignments.
- A new signup, email confirmation, and password sign-in were not run because they require an account and access to its email. Google OAuth remains unconfigured.
