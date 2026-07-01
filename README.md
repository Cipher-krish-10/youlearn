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

## Roadmap

Built as polished vertical slices, one milestone at a time: foundation →
landing → auth → dashboard → YouTube processing → workspace → summary → notes →
chat → transcript → flashcards → quizzes → resources → collections → search →
profile → settings → polish.
