import type { TranscriptSegment } from "@/core/types/transcript";

/**
 * Render a transcript to text within a character budget.
 *
 * Short transcripts are returned whole. Long ones (e.g. a 1-hour video, which
 * far exceeds any single-prompt budget) are **sampled evenly across the
 * timeline** rather than truncated from the start — so the model sees the whole
 * video (beginning → middle → end) instead of only the opening minutes. This is
 * the fix for long videos whose summaries/notes previously covered just the
 * first stretch. Depth is still bounded by the budget; full fidelity needs a
 * map-reduce pass over the transcript (a larger, cost-heavier change).
 */
export function renderTranscript(
  segments: TranscriptSegment[],
  budget: number,
  format: (s: TranscriptSegment) => string = (s) => `${s.text} `,
): string {
  if (segments.length === 0) return "";

  const rendered = segments.map(format);
  const total = rendered.reduce((n, s) => n + s.length, 0);
  if (total <= budget) return rendered.join("").trimEnd();

  const avgLen = total / segments.length;
  const keep = Math.max(1, Math.floor(budget / avgLen));
  const step = segments.length / keep;

  const out: string[] = [];
  let used = 0;
  for (let i = 0; i < keep; i++) {
    const piece = rendered[Math.floor(i * step)]!;
    if (used + piece.length > budget) break;
    out.push(piece);
    used += piece.length;
  }
  return out.join("").trimEnd();
}
