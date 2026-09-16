import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * CampusOS Auth Middleware
 *
 * Current state: STUB — passes all requests through.
 * Phase 1 will replace this with Supabase session verification.
 *
 * Future behavior:
 * - Unauthenticated → redirect to /login
 * - Authenticated on /login or /signup → redirect to /dashboard
 * - Authenticated but missing current_semester_id → redirect to /setup
 */
export function middleware(request: NextRequest) {
  // TODO (Phase 1): Add @supabase/ssr session verification
  // const supabase = createServerClient(...)
  // const { data: { session } } = await supabase.auth.getSession()
  // if (!session) return NextResponse.redirect(new URL('/login', request.url))

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
