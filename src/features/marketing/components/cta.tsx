import Link from "next/link";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";

export function Cta() {
  return (
    <section className="border-b">
      <div className="container py-20 text-center sm:py-28">
        <Reveal className="mx-auto max-w-xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Stop watching. Start learning.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
            Turn the next video on your list into a workspace you&apos;ll
            actually finish.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/signup">Get started free</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">Log in</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
