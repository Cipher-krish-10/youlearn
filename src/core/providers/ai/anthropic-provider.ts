import { UnimplementedAIProvider } from "@/core/providers/ai/unimplemented-provider";

/**
 * Stub. Implement against the Anthropic SDK by giving the shared generators an
 * Anthropic-backed LlmTextModel — no business logic changes required.
 */
export class AnthropicProvider extends UnimplementedAIProvider {
  readonly name = "anthropic";
}
