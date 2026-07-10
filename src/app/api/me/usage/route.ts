import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { getQuotaService } from "@/core/container";
import { errorResponse } from "@/server/http/respond";

/** GET /api/me/usage — the signed-in user's plan, counters, and limits. */
export async function GET() {
  try {
    const user = await requireUser();
    const usage = await getQuotaService().usage(user.id);
    return NextResponse.json({ usage });
  } catch (err) {
    return errorResponse(err);
  }
}
