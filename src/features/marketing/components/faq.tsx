import { Reveal } from "@/components/shared/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Which videos work with YouLearn?",
    a: "Any public YouTube video that has captions — whether human-written or auto-generated. We read the existing transcript, so there's nothing to upload. Support for audio transcription of caption-less videos is on the roadmap.",
  },
  {
    q: "Is the AI just summarizing the title and description?",
    a: "No. Everything is generated from the full transcript. Summaries, flashcards, quizzes, and tutor answers all draw on what was actually said in the video, which is why the tutor can cite specific timestamps.",
  },
  {
    q: "How accurate is the AI tutor?",
    a: "The tutor is grounded in the transcript and cites the moments it draws from, so you can verify any answer in one click. It's designed to say when something wasn't covered rather than guess.",
  },
  {
    q: "Do I need a credit card to start?",
    a: "No. The Free plan lets you process five videos a month with summaries, transcripts, and the tutor. You only add a card if you upgrade to Pro.",
  },
  {
    q: "Can I organize videos into courses?",
    a: "Yes. Group related videos into collections, tag your notes, and search across your entire library. Teams can share collections and assign quizzes.",
  },
  {
    q: "Is my data private?",
    a: "Your library, notes, and chats are tied to your account and never shared. You can export or delete your data at any time from Settings.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 border-b">
      <div className="container grid gap-12 py-20 sm:py-28 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Questions, answered
          </h2>
          <p className="mt-4 text-muted-foreground">
            Can&apos;t find what you&apos;re looking for? Reach out at{" "}
            <a
              href="mailto:hello@youlearn.app"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              hello@youlearn.app
            </a>
            .
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
