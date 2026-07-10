import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureUserRow } from "@/core/container";

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
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Mirror the auth user into our users table right away, so OAuth
      // signups appear in the database before their first API call.
      const u = data.user;
      if (u) {
        const meta = u.user_metadata ?? {};
        await ensureUserRow({
          id: u.id,
          email: u.email ?? null,
          name:
            (meta.name as string | undefined) ??
            (meta.full_name as string | undefined) ??
            null,
          avatarUrl: (meta.avatar_url as string | undefined) ?? null,
        }).catch(() => {
          // Non-fatal: the row is ensured again on first API use.
        });
      }
      return NextResponse.redirect(new URL(next, url.origin));
    }
    failure = error.message;
  }

  const login = new URL("/login", url.origin);
  login.hash = `auth_error=${encodeURIComponent(failure ?? "Sign-in failed. Please try again.")}`;
  return NextResponse.redirect(login);
}
