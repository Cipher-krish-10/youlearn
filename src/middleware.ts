import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/** Pages that require a signed-in user. */
const PROTECTED = [
  /^\/dashboard/,
  /^\/library/,
  /^\/collections/,
  /^\/notes/,
  /^\/flashcards/,
  /^\/chats/,
  /^\/resources/,
  /^\/settings/,
  /^\/workspace/,
];

/** Auth pages a signed-in user shouldn't see. */
const AUTH_PAGES = [/^\/login/, /^\/signup/];

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const path = request.nextUrl.pathname;

  if (!user && PROTECTED.some((re) => re.test(path))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (user && AUTH_PAGES.some((re) => re.test(path))) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Run on everything except static assets; API routes self-guard with requireUser().
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
