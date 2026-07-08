"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/features/auth/components/password-input";

/**
 * Landing page for the password-reset email. The link goes through
 * /auth/callback, which exchanges the code for a session — so by the time the
 * user is here they're signed in and can set a new password.
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [linkValid, setLinkValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      setLinkValid(Boolean(data.user));
      setChecking(false);
    });
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const password = String(form.get("password"));
    if (password !== String(form.get("confirm"))) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (checking) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!linkValid) {
    return (
      <div className="text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="size-6" />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">
          Link expired or invalid
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Password reset links only work once and expire after 30 minutes.
          Request a new one and try again.
        </p>
        <Button className="mt-6 w-full" asChild>
          <Link href="/forgot-password">Request a new link</Link>
        </Button>
        <Button variant="ghost" className="mt-2 w-full" asChild>
          <Link href="/login">
            <ArrowLeft className="size-4" />
            Back to login
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Set a new password
        </h1>
        <p className="text-sm text-muted-foreground">
          Choose a new password for your account.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <PasswordInput
            id="password"
            name="password"
            placeholder="At least 6 characters"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm new password</Label>
          <PasswordInput
            id="confirm"
            name="confirm"
            placeholder="Repeat your new password"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </div>

        {error && (
          <p className="flex items-center gap-1.5 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? "Updating password…" : "Update password"}
        </Button>
      </form>
    </div>
  );
}
