import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

const protectedRoutes = ["/dashboard", "/schedule", "/tasks", "/subjects", "/settings", "/setup", "/reset-password"];
const authRoutes = ["/login", "/signup", "/forgot-password"];

function isUnder(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

function withRefreshedCookies(response: NextResponse, refreshed: NextResponse) {
  refreshed.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
  return response;
}

export async function updateSession(request: NextRequest) {
  const { url, publishableKey } = getSupabaseConfig();
  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });

  // Validate the JWT. Never use getSession() or user-editable user_metadata
  // as an authorization source in server code.
  const { data } = await supabase.auth.getClaims();
  const isSignedIn = Boolean(data?.claims?.sub);
  const pathname = request.nextUrl.pathname;
  const isProtected = protectedRoutes.some((route) => isUnder(pathname, route));
  const isAuthRoute = authRoutes.some((route) => isUnder(pathname, route));

  if (!isSignedIn && isProtected) {
    const destination = request.nextUrl.clone();
    destination.pathname = "/login";
    destination.search = "";
    destination.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return withRefreshedCookies(NextResponse.redirect(destination), response);
  }

  if (isSignedIn && isAuthRoute) {
    const destination = request.nextUrl.clone();
    destination.pathname = "/dashboard";
    destination.search = "";
    return withRefreshedCookies(NextResponse.redirect(destination), response);
  }

  return response;
}
