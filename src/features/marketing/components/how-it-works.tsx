import { Reveal } from "@/components/shared/reveal";

const steps = [
  {
    step: "01",
    title: "Paste a link",
    description:
      "Drop in any public YouTube URL. YouLearn pulls the transcript and metadata in seconds — no downloads, no extensions.",
  },
  {
    step: "02",
    title: "Let the AI process it",
    description:
      "We chunk the transcript and prepare a summary, flashcards, quizzes, and a tutor that understands the whole video.",
  },
  {
    step: "03",
    title: "Learn in one place",
    description:
      "Watch, read, ask questions, take notes, and test yourself — without ever leaving your workspace.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 border-b bg-muted/30">
      <div className="container py-20 sm:py-28">
        <Reveal className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            From link to mastery in three steps
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-3">
          {steps.map((s) => (
            <Reveal key={s.step} className="bg-card">
              <div className="h-full p-6 sm:p-8">
                <span className="font-mono text-sm text-muted-foreground">
                  {s.step}
                </span>
                <h3 className="mt-4 text-lg font-medium">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
