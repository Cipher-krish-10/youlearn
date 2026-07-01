import type { TranscriptSegment } from "@/core/types/transcript";

/**
 * A bundled transcript for one well-known video. Guarantees a working
 * end-to-end demo (and powers MockTranscriptProvider) without any external API.
 */
export const SAMPLE_YOUTUBE_ID = "wjZofJX0v4M";

export const sampleTranscript: TranscriptSegment[] = (
  [
    [0, "Let's start with a deceptively simple question: how does a model like GPT actually predict the next word?"],
    [14, "At its core, a transformer takes a sequence of tokens and produces a probability distribution over what comes next."],
    [31, "But the magic isn't in that final step — it's in how information flows between tokens along the way."],
    [48, "The key mechanism is called attention. Every token gets to look at every other token and decide what's relevant."],
    [67, "Think of each word asking three questions: what am I looking for, what do I offer, and what's my value?"],
    [86, "Those are the query, key, and value vectors. Attention scores come from comparing queries against keys."],
    [109, "When a query and a key point in similar directions, their dot product is large, and attention is high."],
    [131, "We scale those scores, run them through a softmax, and get weights that sum to one — a soft selection."],
    [154, "Each token then pulls in a weighted blend of every other token's value vector. That's one attention head."],
    [178, "Real models run many heads in parallel, each learning a different kind of relationship between words."],
    [201, "One head might track subjects and verbs, another might follow long-range references across paragraphs."],
    [226, "After attention, a feed-forward network processes each position independently to refine the representation."],
    [250, "Stack dozens of these blocks, and the model builds richer and richer abstractions of the input."],
    [274, "Crucially, position is injected separately — transformers have no inherent sense of word order."],
    [297, "That's the whole architecture in miniature: attention, feed-forward, repeat, predict."],
  ] as [number, string][]
).map(([startSec, text], i, arr) => {
  const end = arr[i + 1] ? arr[i + 1]![0] : startSec + 20;
  return { startSec, endSec: end, text };
});
