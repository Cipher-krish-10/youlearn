/**
 * Provider-agnostic error hierarchy. Implementations translate raw SDK failures
 * into these, so routes, services, and the UI never see provider-specific
 * errors. Each carries an `code` that maps to the stable API envelope contract.
 */

export type ErrorCode =
  | "NOT_CONFIGURED"
  | "AUTHENTICATION"
  | "UNAUTHENTICATED"
  | "RATE_LIMITED"
  | "NOT_IMPLEMENTED"
  | "NO_TRANSCRIPT"
  | "NO_CAPTIONS"
  | "VIDEO_UNAVAILABLE"
  | "INVALID_URL"
  | "INVALID_INPUT"
  | "NOT_FOUND"
  | "NETWORK"
  | "GENERATION_FAILED"
  | "QUOTA_EXCEEDED"
  | "UNKNOWN";

export abstract class ProviderError extends Error {
  abstract readonly code: ErrorCode;

  constructor(
    message: string,
    readonly provider?: string,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = new.target.name;
  }
}

/** The selected provider has no usable credentials / isn't reachable. */
export class ProviderUnavailableError extends ProviderError {
  readonly code = "NOT_CONFIGURED";
}

/** Credentials were present but rejected by the provider. */
export class AuthenticationError extends ProviderError {
  readonly code = "AUTHENTICATION";
}

export class RateLimitError extends ProviderError {
  readonly code = "RATE_LIMITED";
}

/** A stub provider that matches the interface but isn't built yet. */
export class NotImplementedError extends ProviderError {
  readonly code = "NOT_IMPLEMENTED";
  constructor(provider: string, capability = "this capability") {
    super(`${provider} does not implement ${capability} yet.`, provider);
  }
}

export class TranscriptUnavailableError extends ProviderError {
  readonly code = "NO_TRANSCRIPT";
}

export class VideoUnavailableError extends ProviderError {
  readonly code = "VIDEO_UNAVAILABLE";
}

export class NetworkError extends ProviderError {
  readonly code = "NETWORK";
}

export class GenerationFailedError extends ProviderError {
  readonly code = "GENERATION_FAILED";
}

/** The user's plan ran out of the requested resource this month. */
export class QuotaExceededError extends ProviderError {
  readonly code = "QUOTA_EXCEEDED";
}

/**
 * Non-provider domain errors that still need a stable envelope. Defaults to
 * the generic "INVALID_INPUT" — pass an explicit code only when the failure
 * is genuinely about that specific thing (e.g. "INVALID_URL" for a malformed
 * YouTube link), so callers don't accidentally mislabel unrelated validation
 * errors (empty note, bad chat message, etc.) as URL problems.
 */
export class InvalidInputError extends ProviderError {
  readonly code: ErrorCode;
  constructor(message: string, code: ErrorCode = "INVALID_INPUT") {
    super(message);
    this.code = code;
  }
}

export class NotFoundError extends ProviderError {
  readonly code = "NOT_FOUND";
}

export class AuthRequiredError extends ProviderError {
  readonly code = "UNAUTHENTICATED";
  constructor(message = "You need to sign in to do that.") {
    super(message);
  }
}

/** Map an error code to its HTTP status. */
export function httpStatusForCode(code: ErrorCode): number {
  switch (code) {
    case "INVALID_URL":
    case "INVALID_INPUT":
      return 400;
    case "NO_TRANSCRIPT":
      return 409;
    case "NO_CAPTIONS":
    case "VIDEO_UNAVAILABLE":
      return 422;
    case "NOT_FOUND":
      return 404;
    case "UNAUTHENTICATED":
      return 401;
    case "RATE_LIMITED":
      return 429;
    case "QUOTA_EXCEEDED":
      return 402;
    case "NOT_CONFIGURED":
    case "AUTHENTICATION":
      return 503;
    case "NETWORK":
    case "GENERATION_FAILED":
    case "NOT_IMPLEMENTED":
      return 502;
    default:
      return 500;
  }
}

/**
 * Normalize any thrown value into the API envelope `{ code, message, status }`.
 * The only place SDK/raw errors are converted for transport.
 */
export function toErrorEnvelope(err: unknown): {
  code: ErrorCode;
  message: string;
  status: number;
} {
  if (err instanceof ProviderError) {
    return {
      code: err.code,
      message: err.message,
      status: httpStatusForCode(err.code),
    };
  }
  return {
    code: "UNKNOWN",
    message: "Something went wrong. Please try again.",
    status: 500,
  };
}
