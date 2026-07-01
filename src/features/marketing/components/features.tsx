import {
  FileText,
  MessageSquareText,
  ScrollText,
  Layers,
  ListChecks,
  FolderTree,
} from "lucide-react";
import { Reveal } from "@/components/shared/reveal";

const features = [
  {
    icon: FileText,
    title: "AI summaries that respect your time",
    description:
      "An executive overview, key takeaways, and a detailed breakdown — generated from the full transcript, not just the title.",
  },
  {
    icon: MessageSquareText,
    title: "A tutor that knows the video",
    description:
      "Ask anything and get answers grounded in what was said, with citations linking to the exact timestamp.",
  },
  {
    icon: ScrollText,
    title: "Transcripts you can actually use",
    description:
      "Search every word, jump to any moment, and follow along as the transcript scrolls with the video.",
  },
  {
    icon: Layers,
    title: "Flashcards, generated for you",
    description:
      "Turn dense explanations into review-ready cards, then practice with spaced repetition.",
  },
  {
    icon: ListChecks,
    title: "Quizzes that check understanding",
    description:
      "Multiple choice, true/false, and short answer drawn from the material — with explanations for each.",
  },
  {
    icon: FolderTree,
    title: "Organize everything you learn",
    description:
      "Group videos into collections, tag your notes, and search across your whole library.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-16 border-b">
      <div className="container py-20 sm:py-28">
        <Reveal className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            A complete learning workspace, not just a summarizer
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
            Most tools hand you a paragraph and call it a day. LearnTube gives
            you everything you need to actually learn the material.
          </p>
        </Reveal>

        <div className="mt-14 grid border-l border-t sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="border-b border-r p-6 transition-colors hover:bg-muted/40 sm:p-8"
            >
              <feature.icon
                className="size-5 text-muted-foreground"
                strokeWidth={1.75}
              />
              <h3 className="mt-4 font-medium">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
