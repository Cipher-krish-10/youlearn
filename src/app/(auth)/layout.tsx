import { Check } from "lucide-react";
import { Logo, LogoMark } from "@/components/shared/logo";
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
      </div>

      {/* Brand side — quiet, content-first, with a little ambient depth */}
      <div className="relative hidden overflow-hidden border-l lg:flex lg:flex-col lg:justify-center lg:px-14 xl:px-20">
        {/* Brand tint bleeding in from the top-right corner */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-bl from-primary/10 via-transparent to-transparent"
        />
        {/* Faint dot grid, faded at the edges */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(var(--color-border) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 72%)",
          }}
        />

        <div className="relative max-w-md">
          <h2 className="text-balance text-2xl font-medium leading-snug tracking-tight">
            Turn watching into learning — one workspace for every video.
          </h2>

          <ul className="mt-10 space-y-3.5 border-t pt-8">
            {points.map((text) => (
              <li key={text} className="flex items-center gap-3 text-sm">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary">
                  <Check className="size-3" />
                </span>
                <span className="text-foreground/85">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute bottom-8 right-8 flex items-center gap-1.5 text-xs text-muted-foreground/70">
          <LogoMark className="size-3.5" />
          YouLearn
        </div>
      </div>
    </div>
  );
}
