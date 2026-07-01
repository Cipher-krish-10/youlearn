import "server-only";
import { createClient } from "@supabase/supabase-js";
import { clientEnv, getServerEnv } from "@/lib/env";

/**
 * Service-role client that BYPASSES Row-Level Security.
 * Use only in trusted server contexts (webhooks, admin jobs). Never expose.
 */
export function createSupabaseAdminClient() {
  return createClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    getServerEnv().SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    },
  );
}
