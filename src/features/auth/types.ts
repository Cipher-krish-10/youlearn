/** Client-safe shape of the signed-in user (no server-only imports). */
export interface AuthUser {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
}

/** First name or email local-part, for greetings. */
export function displayName(user: AuthUser): string {
  if (user.name) return user.name.split(" ")[0] ?? user.name;
  if (user.email) return user.email.split("@")[0] ?? "there";
  return "there";
}

/** Up-to-two-letter avatar initials. */
export function initials(user: AuthUser): string {
  const source = user.name ?? user.email ?? "U";
  const parts = source.split(/[\s@.]+/).filter(Boolean);
  return (
    (parts[0]?.[0] ?? "U") + (parts[1]?.[0] ?? "")
  ).toUpperCase();
}
