import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AuthRequiredError } from "@/core/errors/provider-errors";

export interface SessionUser {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
}

/** The signed-in user from the Supabase session, or null. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const meta = user.user_metadata ?? {};
  return {
    id: user.id,
    email: user.email ?? null,
    name: (meta.name as string) ?? (meta.full_name as string) ?? null,
    avatarUrl: (meta.avatar_url as string) ?? null,
  };
}

/** Same, but throws a 401-mapped error when there's no session (for API routes). */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new AuthRequiredError();
  return user;
}
