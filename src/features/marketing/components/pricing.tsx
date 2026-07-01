import Link from "next/link";
import { Check } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    description: "Everything you need to try LearnTube on a few videos.",
    cta: "Start for free",
    href: "/signup",
    featured: false,
    features: [
      "5 videos per month",
      "AI summaries & key takeaways",
      "Searchable transcripts",
      "20 tutor messages per day",
      "Basic flashcards",
    ],
  },
  {
    name: "Pro",
    price: "$12",
    cadence: "per month",
    description: "For serious learners who live in their workspace.",
    cta: "Start free trial",
    href: "/signup",
    featured: true,
    features: [
      "Unlimited videos",
      "Unlimited AI tutor with citations",
      "Flashcards with spaced repetition",
      "Quizzes & short-answer grading",
      "Collections, tags & global search",
      "Priority processing",
    ],
  },
  {
    name: "Teams",
    price: "$29",
    cadence: "per seat / month",
    description: "Shared libraries and curricula for study groups and teams.",
    cta: "Contact sales",
    href: "/signup",
    featured: false,
    features: [
      "Everything in Pro",
      "Shared collections & workspaces",
      "Assign videos and quizzes",
      "Team progress analytics",
      "Centralized billing",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-16 border-b bg-muted/30">
      <div className="container py-20 sm:py-28">
        <Reveal className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Simple pricing that scales with you
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
            Start free. Upgrade when learning becomes a habit. Cancel anytime.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "flex flex-col rounded-lg border bg-card p-6",
                tier.featured && "border-primary",
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{tier.name}</h3>
                {tier.featured && (
                  <span className="rounded-md bg-primary/8 px-2 py-0.5 text-xs font-medium text-primary">
                    Popular
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-3xl font-semibold tracking-tight tabular-nums">
                  {tier.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {tier.cadence}
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {tier.description}
              </p>
              <Button
                asChild
                variant={tier.featured ? "default" : "outline"}
                className="mt-6 w-full"
              >
                <Link href={tier.href}>{tier.cta}</Link>
              </Button>
              <ul className="mt-6 space-y-2.5 border-t pt-6">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
