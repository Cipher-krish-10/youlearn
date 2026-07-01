"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AuthUser } from "@/features/auth/types";

/** Reads the current Supabase user on the client (for components below the layout). */
export function useAuthUser(): AuthUser | null {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (!u) return;
      const meta = u.user_metadata ?? {};
      setUser({
        id: u.id,
        email: u.email ?? null,
        name: (meta.name as string) ?? (meta.full_name as string) ?? null,
        avatarUrl: (meta.avatar_url as string) ?? null,
      });
    });
  }, []);

  return user;
}
