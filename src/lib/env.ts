import { z } from "zod";

/**
 * Centralized, validated environment access.
 *
 * - `clientEnv` holds only `NEXT_PUBLIC_*` values and is safe to import anywhere.
 * - `serverEnv` holds secrets and is lazily validated so importing it from a
 *   client component throws a clear error instead of leaking values.
 *
 * Validation happens once, the first time each accessor is read. This fails
 * fast with a readable message instead of producing `undefined`-driven bugs
 * deep inside the app.
 */

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_CHAT_MODEL: z.string().min(1).default("gpt-4o-mini"),
  OPENAI_EMBEDDING_MODEL: z
    .string()
    .min(1)
    .default("text-embedding-3-small"),
  // Google Gemini (free tier). Optional unless AI_PROVIDER=gemini.
  GEMINI_API_KEY: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.string().min(1).optional(),
  ),
  GEMINI_CHAT_MODEL: z.string().min(1).default("gemini-2.0-flash"),
  GEMINI_EMBEDDING_MODEL: z.string().min(1).default("text-embedding-004"),
  // Groq (free tier, OpenAI-compatible). Optional unless AI_PROVIDER=groq.
  GROQ_API_KEY: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.string().min(1).optional(),
  ),
  GROQ_CHAT_MODEL: z.string().min(1).default("llama-3.3-70b-versatile"),
  // Optional hosted transcript provider (e.g. Supadata). When unset, the
  // hosted provider stays disabled and ingestion falls back gracefully.
  // An empty string is treated as "not set" so a blank .env entry is fine.
  SUPADATA_API_KEY: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.string().min(1).optional(),
  ),
  SUPADATA_API_URL: z
    .string()
    .url()
    .default("https://api.supadata.ai/v1/youtube/transcript"),
  // --- Provider selection (swap implementations via env, no code changes) ---
  AI_PROVIDER: z.enum(["openai", "anthropic", "gemini", "groq"]).default("openai"),
  TRANSCRIPT_PROVIDER: z
    .enum(["supadata", "whisper", "mock"])
    .default("supadata"),
  // RAG vector backend. "pgvector" requires a database + the pgvector migration.
  VECTOR_STORE: z.enum(["memory", "pgvector"]).default("memory"),
  DATABASE_PROVIDER: z.enum(["memory", "prisma"]).default("memory"),
});

function format(error: z.ZodError): string {
  return error.issues
    .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
    .join("\n");
}

// `NEXT_PUBLIC_*` vars are statically inlined by Next, so reference them
// explicitly rather than spreading `process.env`.
const clientParsed = clientSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

if (!clientParsed.success) {
  throw new Error(
    `❌ Invalid public environment variables:\n${format(clientParsed.error)}`,
  );
}

export const clientEnv = clientParsed.data;

let _serverEnv: z.infer<typeof serverSchema> | null = null;

/**
 * Access validated server-only environment variables.
 * Throws if called in a browser bundle or if any secret is missing.
 */
export function getServerEnv(): z.infer<typeof serverSchema> {
  if (typeof window !== "undefined") {
    throw new Error("getServerEnv() must not be called on the client.");
  }
  if (_serverEnv) return _serverEnv;

  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(
      `❌ Invalid server environment variables:\n${format(parsed.error)}`,
    );
  }
  _serverEnv = parsed.data;
  return _serverEnv;
}
