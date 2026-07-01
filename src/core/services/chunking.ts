import type { TranscriptSegment } from "@/core/types/transcript";

export interface TranscriptChunk {
  index: number;
  startSec: number;
  endSec: number;
  text: string;
}

const TARGET_CHARS = 600;

/**
 * Group fine-grained caption segments into ~paragraph-sized chunks for
 * retrieval, preserving each chunk's time range so answers can cite a timestamp.
 */
export function chunkTranscript(
  segments: TranscriptSegment[],
  targetChars = TARGET_CHARS,
): TranscriptChunk[] {
  const chunks: TranscriptChunk[] = [];
  let buffer: TranscriptSegment[] = [];
  let length = 0;

  const flush = () => {
    if (buffer.length === 0) return;
    const first = buffer[0]!;
    const last = buffer[buffer.length - 1]!;
    chunks.push({
      index: chunks.length,
      startSec: first.startSec,
      endSec: last.endSec,
      text: buffer
        .map((s) => s.text)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim(),
    });
    buffer = [];
    length = 0;
  };

  for (const segment of segments) {
    buffer.push(segment);
    length += segment.text.length + 1;
    if (length >= targetChars) flush();
  }
  flush();
  return chunks;
}
