"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Loader2, MailCheck } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PasswordInput } from "@/features/auth/components/password-input";
import { SocialAuth } from "@/features/auth/components/social-auth";

const perks = [
  "5 free videos every month",
  "AI summaries, transcripts & tutor",
  "No credit card required",
];

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmEmail, setConfirmEmail] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password: String(form.get("password")),
      options: {
        data: { name: String(form.get("name")) },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // If email confirmation is on, there's no session yet.
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setConfirmEmail(email);
      setLoading(false);
    }
  }

  if (confirmEmail) {
    return (
      <div className="text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck className="size-6" />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">
          Confirm your email
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We sent a confirmation link to{" "}
          <span className="font-medium text-foreground">{confirmEmail}</span>.
          Click it to activate your account, then log in.
        </p>
        <Button variant="outline" className="mt-6 w-full" asChild>
          <Link href="/login">Back to login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Start turning videos into workspaces in seconds.
        </p>
      </div>

      <ul className="mt-6 space-y-2">
        {perks.map((perk) => (
          <li key={perk} className="flex items-center gap-2 text-sm">
            <span className="flex size-4 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Check className="size-3" />
            </span>
            <span className="text-muted-foreground">{perk}</span>
          </li>
        ))}
      </ul>

      <div className="mt-7 space-y-6">
        <SocialAuth action="Sign up" />

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
            or sign up with email
          </span>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" placeholder="Kris Uppal" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              name="password"
              placeholder="At least 6 characters"
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
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
