# LearnTube

Turn any YouTube video into an AI-powered learning workspace — summaries,
grounded chat, transcript search, flashcards, quizzes, and notes.

## Tech Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · Framer
Motion · TanStack Query · Supabase (Auth + Postgres + RLS) · Prisma · OpenAI ·
Vercel.

## Architecture

The codebase is **layered** and **feature-sliced**. The UI never touches Prisma
or OpenAI directly — everything funnels through a server layer.

```
src/
├── app/            # Routing, layouts, Route Handlers — thin wiring only
├── features/       # Domain slices (ingestion, workspace, chat, summary, ...)
│   └── <feature>/  #   components · hooks · services · types  (co-located)
├── server/         # Server-only code (never bundled to the client)
│   ├── db/         #   Prisma client + repositories (all data access)
│   ├── ai/         #   AIProvider abstraction + OpenAI implementation
│   └── transcript/ #   TranscriptProvider abstraction (captions → Whisper later)
├── components/
│   ├── ui/         # shadcn/ui primitives
│   └── shared/     # Composed app components
├── lib/            # Framework glue: supabase clients, react-query, env, utils
├── config/         # Constants, feature flags
└── generated/      # Prisma client output (git-ignored)
```

**Principles**

- **Server-first.** Transcript fetch, embeddings, and LLM calls run server-side;
  API keys never reach the browser.
- **Provider seams.** `TranscriptProvider` and the AI layer are interfaces, so
  swapping caption sources or models doesn't touch feature code.
- **RLS as the backbone.** Every row is scoped to `auth.uid()` at the database.
- **Job-based ingestion.** `Video.status` (`PENDING → PROCESSING → READY →
  FAILED`) is the source of truth; the client subscribes for live updates.

## Getting Started

```bash
npm install
cp .env.example .env      # fill in Supabase + OpenAI credentials
npm run db:generate       # generate the Prisma client
npm run db:push           # push schema to your database
npm run dev
```

Open http://localhost:3000.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (runs `prisma generate` first) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |
| `npm run db:studio` | Prisma Studio |

## Deploying to Vercel

1. Import the repo at [vercel.com/new](https://vercel.com/new) — the defaults work
   (`npm run build` already runs `prisma generate`).
2. Add the environment variables below in **Project Settings → Environment Variables**.
3. In Supabase **Authentication → URL Configuration**, set the Site URL to your
   Vercel domain and add `https://<your-domain>/**` to Redirect URLs.

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | `https://<your-domain>` |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (server-only) |
| `DATABASE_URL` | Pooled connection string (port 6543, `?pgbouncer=true`) |
| `DIRECT_URL` | Direct connection string (port 5432) |
| `DATABASE_PROVIDER` | `prisma` — **required in production**; `memory` doesn't survive serverless invocations |
| `AI_PROVIDER` | `groq` (or `openai` / `anthropic` / `gemini`) |
| `GROQ_API_KEY` | Key for the selected AI provider |
| `TRANSCRIPT_PROVIDER` | `supadata` |
| `SUPADATA_API_KEY` | [supadata.ai](https://supadata.ai) key for live transcripts |
| `VECTOR_STORE` | `memory` (Groq has no embeddings; use `pgvector` with OpenAI) |

Long-running routes (ingestion, AI generation, chat) declare `maxDuration = 60`,
which fits within the Hobby plan's limit.

## Roadmap

Built as polished vertical slices, one milestone at a time: foundation →
landing → auth → dashboard → YouTube processing → workspace → summary → notes →
chat → transcript → flashcards → quizzes → resources → collections → search →
profile → settings → polish.
