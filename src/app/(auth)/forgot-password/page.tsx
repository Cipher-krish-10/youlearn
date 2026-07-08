"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    // Always show the success state (don't reveal whether the email exists).
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck className="size-6" />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">
          Check your inbox
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We sent a password reset link to{" "}
          <span className="font-medium text-foreground">
            {email || "your email"}
          </span>
          . It expires in 30 minutes.
        </p>
        <Button variant="outline" className="mt-6 w-full" asChild>
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
        <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? "Sending link…" : "Send reset link"}
        </Button>
      </form>

      <Button variant="ghost" className="mt-4 w-full" asChild>
        <Link href="/login">
          <ArrowLeft className="size-4" />
          Back to login
        </Link>
      </Button>
    </div>
  );
}
