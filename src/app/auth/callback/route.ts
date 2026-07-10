import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * OAuth / email-confirmation / password-reset callback. Exchanges the code for
 * a session cookie, then redirects to `next` (or the dashboard). Failures go
 * back to /login with the reason in the hash so the page can show it.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/dashboard";

  let failure = url.searchParams.get("error_description");

  if (code && !failure) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
    failure = error.message;
  }

  const login = new URL("/login", url.origin);
  login.hash = `auth_error=${encodeURIComponent(failure ?? "Sign-in failed. Please try again.")}`;
  return NextResponse.redirect(login);
}
