# Production Readiness Sprint — Deliverables

Target: first 1,000 users. Branch: `feature/production-readiness`.
Phases 7 (AI provider abstraction), 8 (transcript provider), and the architecture half of 6 (RAG)
were already built in the earlier provider-agnostic refactor; this sprint verified them and added
quotas, caching, rate limiting, idempotent generation, monitoring, and audit fixes.

---

## 1. Architecture Diagram

```
Client (Next.js App Router, TanStack Query)
  │  fetch /api/*  — typed error envelope { error: { code, message } }
  ▼
API Route Handlers (thin: validate → auth → rate limit → quota → service)
  │        requireUser() · getOwnedVideo() · enforceRateLimit() · QuotaService
  ▼
Composition Root (core/container.ts) — constructor injection, env-selected implementations
  │
  ├─ IngestionService ──► TranscriptProvider (supadata | whisper | mock)
  ├─ AiContentService ──► AIProvider (groq | openai | anthropic | gemini)
  ├─ ChatService      ──► AIProvider + VectorStoreProvider (memory | pgvector)
  ├─ QuotaService     ──► QuotaRepository (atomic counters on users)
  │
  ├─ CacheProvider (memory | upstash) ◄── read-through on artifacts/transcripts/chat
  └─ Repositories (memory | prisma) ──► Supabase Postgres (pooled via pgBouncer)
```

Request path for a metered call: `auth → rate limit (429) → quota (402) → cache (hit = free) → LLM → Postgres → cache → response`.

## 2. Updated Folder Structure (new files only)

```
src/core/
├── interfaces/cache-provider.ts        # get/set/delete/increment
├── providers/cache/memory-cache.ts     # dev default, per-instance
├── providers/cache/upstash-cache.ts    # REST, serverless-safe, fails open
├── factories/cache-provider-factory.ts # env-selected, auto-detects Upstash creds
├── repositories/{prisma,memory}/*quota-repository.ts
└── services/quota-service.ts           # PLAN_LIMITS + consume/usage
src/server/http/rate-limit.ts           # fixed-window limiter on the cache
src/app/api/me/usage/route.ts           # GET plan + counters + limits
src/features/billing/quota-events.ts    # client event bridge
src/features/billing/upgrade-dialog.tsx # global upgrade modal
```

## 3. Redis Key Strategy

| Key | TTL | Notes |
|---|---|---|
| `{kind}:{videoId}` (summary:, notes:, quiz:, flashcards:, takeaways:, concepts:) | 1 h | Hot copy; Postgres is source of truth |
| `transcript:{videoId}` | 6 h | Immutable once saved |
| `chat:{videoId}:{sha256(question)[:32]}` | 24 h | Question normalized (trim+lowercase) |
| `rl:{scope}:{userId}:{minuteEpoch}` | 90 s | Fixed-window rate counters |

Rules: cache only regenerable data; every read has a Postgres fallback; Upstash failures degrade
to cache misses (never break a request); rate limiting fails open if Redis is down.
Not implemented (features don't exist server-side): `resources:`, `mindmap:`, recently-viewed,
popular-videos, dashboard-metrics (computed client-side from the already-cached video list).

## 4. Database Schema Changes

`users` gains (all additive, defaulted — old code unaffected):
`plan text default 'free'`, `workspaceCount int`, `chatCount int`, `generationCount int`,
`exportCount int`, `usageResetMonth text default ''`.
Reset is **lazy**: on first consume in a new `YYYY-MM`, counters zero atomically — no cron.
Enforcement is a guarded `UPDATE … WHERE counter < limit` (atomic; two racing requests can't
both pass). Index audit found existing coverage complete: `videos(userId,createdAt)`,
`chat_messages(userId,createdAt)+(videoId,createdAt)`, `notes(userId)+(videoId)`, etc.

## 5. Queue Architecture — deliberate deviation

**BullMQ was not integrated, and shouldn't be on this deployment target.** BullMQ requires a
long-running worker and a TCP Redis connection; Vercel serverless offers neither. Options ranked:
1. (Now) Synchronous with `maxDuration=60` + `Video.status` lifecycle the client already polls — fine at 1k users.
2. (Next) Upstash QStash: HTTP-delivered jobs to a `/api/jobs/*` handler — queue semantics with zero infrastructure.
3. (Later) Dedicated worker (Railway/Fly) + BullMQ when off serverless or >10k users.
The `Video.status` enum (PENDING→PROCESSING→READY→FAILED) already models the job lifecycle, so
migrating to 2/3 does not change the client contract.

## 6. RAG Architecture

Already in place, verified: transcript → `chunkTranscript` → `AIProvider.createEmbeddings` →
`VectorStoreProvider` (memory | pgvector) → top-5 cosine retrieval → LLM with citations.
Strategy selection is capability-based (`supportsEmbeddings`): Groq gracefully falls back to
capped full-transcript context — exactly the required fallback. Activating true RAG = set
`AI_PROVIDER=openai` (+ optionally `VECTOR_STORE=pgvector` after `prisma/sql/pgvector.sql`).

## 7. Cost Analysis (per active user/month: 4 ingests, 12 generations, 20 chats)

| | Before | After |
|---|---|---|
| Duplicate generations | Unbounded (every tab re-click could bill) | 0 (Postgres + Redis + quota) |
| Repeated questions | Full LLM call each | Redis hit, $0 |
| Chat tokens | ~160k (full context each) | ~160k on Groq path; ~30k with RAG on |
| Abuse ceiling | None — one user could drain the org | 5/50/15 hard caps + 2/5/20 per-minute |
| Worst-case monthly LLM spend | Unbounded | Bounded: users × quota × per-call cost |

The quota system converts cost from *unbounded* to *linear and capped* — the structural change
that matters more than any per-call optimization.

## 8. Scalability Estimate

- **1,000 users:** holds. Bottlenecks are external quotas (Groq daily tokens, Supadata transcripts),
  now individually capped per user. Postgres via pgBouncer: trivial load. Rate limiting global once
  Upstash env vars are set (per-instance best effort until then).
- **10,000 users:** move generation behind QStash (deliverable 5), activate RAG (5–8× chat token cut),
  paid AI tier, custom SMTP; Postgres still fine (read-heavy, user-partitioned).
- **100,000 users:** read replicas, transcript dedup across users (global cache by youtubeId),
  observability stack (OTel traces + cost metrics per user), dedicated workers.

## 9. Remaining Technical Debt

1. Export quota is enforced-ready but no export feature exists yet (counter unused).
2. `plan` column exists; there is no billing/upgrade path — "See plans" links to the pricing section.
3. Token usage not logged per call (needs usage plumbing from provider responses).
4. No per-route API latency middleware (only expensive operations are timed).
5. Memory cache/rate-limit are per-instance on serverless — correct but weak until Upstash creds are set.
6. Search is client-side (no server endpoint to rate limit — spec's 60/min N/A).
7. No automated test suite; verification is scripted E2E through the real authed API.

## 10. Future Recommendations (ordered)

1. Set the two Upstash env vars in Vercel (free tier) — flips cache + rate limiting to global.
2. Stripe checkout writing `plan="pro"` — everything else (unmetered pro) already works.
3. QStash-backed ingestion pipeline; client contract unchanged.
4. Switch `AI_PROVIDER=openai` + pgvector to activate retrieval and cut chat tokens ~5×.
5. Playwright suite on the golden path, run in CI on every PR.
6. Sentry (or similar) for error aggregation on top of the structured logs.
```
