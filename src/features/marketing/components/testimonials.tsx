import { Reveal } from "@/components/shared/reveal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    quote:
      "I used to rewatch lectures three times to take notes. Now I paste the link, skim the summary, and quiz myself. My retention has genuinely doubled.",
    name: "Maya Rodriguez",
    role: "CS student, UC Berkeley",
    initials: "MR",
  },
  {
    quote:
      "The grounded chat is the killer feature. It answers from the actual video and links the timestamp, so I always know it isn't making things up.",
    name: "Daniel Okafor",
    role: "Software engineer, Stripe",
    initials: "DO",
  },
  {
    quote:
      "I run a study group and we turn every conference talk into flashcards now. LearnTube replaced four different tools we were juggling.",
    name: "Priya Nair",
    role: "ML researcher",
    initials: "PN",
  },
  {
    quote:
      "Onboarding new engineers used to mean a pile of YouTube links. Now I send them collections with quizzes attached. It's a real curriculum.",
    name: "Tom Bergström",
    role: "Engineering manager, Klarna",
    initials: "TB",
  },
  {
    quote:
      "As someone with ADHD, the transcript that scrolls with the video and lets me search keeps me focused in a way nothing else has.",
    name: "Alex Chen",
    role: "Self-taught developer",
    initials: "AC",
  },
  {
    quote:
      "I prep for system design interviews entirely in LearnTube. Watch, summarize, generate a quiz, repeat. Got the offer last month.",
    name: "Sofia Almeida",
    role: "Backend engineer",
    initials: "SA",
  },
];

export function Testimonials() {
  return (
    <section className="border-b">
      <div className="container py-20 sm:py-28">
        <Reveal className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            People are finally finishing what they start
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-lg border bg-border md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="flex flex-col bg-card p-6">
              <blockquote className="flex-1 text-sm leading-relaxed text-foreground/90">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs">
                    {t.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
