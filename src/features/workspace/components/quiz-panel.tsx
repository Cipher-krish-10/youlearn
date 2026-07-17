"use client";

import { useState } from "react";
import { Check, ListChecks, RotateCcw, X } from "lucide-react";
import type { QuizQuestion } from "@/features/ai/types";
import { useArtifact, useGenerateArtifact } from "@/features/ai/use-ai";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArtifactState } from "@/features/workspace/components/artifact-state";

export function QuizPanel({
  videoId,
  transcriptReady,
}: {
  videoId: string;
  transcriptReady: boolean;
}) {
  const quiz = useArtifact(videoId, "quiz", transcriptReady);
  const gen = useGenerateArtifact(videoId, "quiz");

  return (
    <ArtifactState
      label="quiz"
      icon={ListChecks}
      transcriptReady={transcriptReady}
      isGenerated={!!quiz.data}
      isBusy={quiz.isLoading || gen.isPending}
      error={gen.error}
      onGenerate={(force) => gen.mutate({ force })}
    >
      {quiz.data && <QuizRunner questions={quiz.data.data.questions} />}
    </ArtifactState>
  );
}

function QuizRunner({ questions }: { questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState(false);

  const choiceQuestions = questions.filter((q) => q.options.length > 0);
  const score = choiceQuestions.reduce((acc, q) => {
    const idx = questions.indexOf(q);
    return acc + (answers[idx] === q.answerIndex ? 1 : 0);
  }, 0);
  const allChoiceAnswered = choiceQuestions.every(
    (q) => answers[questions.indexOf(q)] !== undefined,
  );

  function reset() {
    setAnswers({});
    setRevealed(false);
  }

  return (
    <div className="space-y-6">
      {revealed && choiceQuestions.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border bg-card p-5">
          <div>
            <p className="text-sm text-muted-foreground">Your score</p>
            <p className="text-2xl font-semibold tabular-nums">
              {score} / {choiceQuestions.length}
            </p>
          </div>
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="size-4" />
            Retake
          </Button>
        </div>
      )}

      {questions.map((q, qi) => (
        <div key={qi} className="rounded-lg border bg-card p-5">
          <p className="font-medium">
            <span className="mr-2 text-muted-foreground tabular-nums">
              {qi + 1}.
            </span>
            {q.prompt}
          </p>

          {q.options.length > 0 ? (
            <div className="mt-4 space-y-2">
              {q.options.map((opt, oi) => {
                const selected = answers[qi] === oi;
                const correct = oi === q.answerIndex;
                const showState = revealed && (selected || correct);
                return (
                  <button
                    key={oi}
                    disabled={revealed}
                    onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md border px-3.5 py-2.5 text-left text-sm transition-colors",
                      !revealed && "hover:border-foreground/30 hover:bg-accent",
                      selected && !revealed && "border-primary bg-primary/5",
                      showState && correct && "border-success/50 bg-success/10",
                      showState &&
                        selected &&
                        !correct &&
                        "border-destructive/50 bg-destructive/10",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border text-xs",
                        selected && !revealed && "border-primary text-primary",
                        showState &&
                          correct &&
                          "border-success bg-success text-white",
                        showState &&
                          selected &&
                          !correct &&
                          "border-destructive bg-destructive text-white",
                      )}
                    >
                      {showState && correct ? (
                        <Check className="size-3" />
                      ) : showState && selected && !correct ? (
                        <X className="size-3" />
                      ) : (
                        String.fromCharCode(65 + oi)
                      )}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-3">
              {revealed ? (
                <p className="rounded-md border bg-muted/40 px-3.5 py-2.5 text-sm">
                  <span className="font-medium">Answer: </span>
                  {q.answer}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Short answer — reveal to check yourself.
                </p>
              )}
            </div>
          )}

          {revealed && (
            <p className="mt-3 rounded-md bg-muted/40 px-3.5 py-2.5 text-xs leading-relaxed text-muted-foreground">
              {q.explanation}
            </p>
          )}
        </div>
      ))}

      {!revealed && (
        <Button
          className="w-full"
          disabled={choiceQuestions.length > 0 && !allChoiceAnswered}
          onClick={() => setRevealed(true)}
        >
          {choiceQuestions.length > 0 && !allChoiceAnswered
            ? "Answer all questions to submit"
            : "Submit answers"}
        </Button>
      )}
    </div>
  );
}
