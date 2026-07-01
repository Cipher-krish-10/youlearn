import Link from "next/link";
import { Check } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ModeToggle } from "@/components/shared/mode-toggle";

const points = [
  "AI summaries from the full transcript",
  "A tutor that cites exact timestamps",
  "Flashcards and quizzes, auto-generated",
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Form side */}
      <div className="flex flex-col px-6 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo />
          <ModeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          By continuing you agree to our{" "}
          <Link
            href="#"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="#"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      {/* Brand side — quiet, content-first */}
      <div className="hidden border-l bg-muted/30 lg:flex lg:flex-col lg:justify-center lg:px-14">
        <figure className="max-w-md">
          <blockquote className="text-xl font-medium leading-snug tracking-tight">
            “I paste a link, skim the summary, and quiz myself. My retention has
            genuinely doubled.”
          </blockquote>
          <figcaption className="mt-5 text-sm text-muted-foreground">
            Maya Rodriguez · CS student, UC Berkeley
          </figcaption>
        </figure>

        <ul className="mt-12 max-w-md space-y-3 border-t pt-8">
          {points.map((text) => (
            <li key={text} className="flex items-center gap-3 text-sm">
              <Check className="size-4 shrink-0 text-muted-foreground" />
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
