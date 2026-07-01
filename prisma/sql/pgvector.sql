-- pgvector setup for Chat-with-Video (RAG).
-- Run against your Postgres (Supabase: SQL editor) when VECTOR_STORE=pgvector.
--
-- Adds the vector extension, an embedding column on transcript_chunks, and an
-- HNSW index for fast cosine nearest-neighbour search.

CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE "transcript_chunks"
  ADD COLUMN IF NOT EXISTS "embedding" vector(1536);

-- HNSW gives fast approximate nearest-neighbour with cosine distance (<=>).
CREATE INDEX IF NOT EXISTS "transcript_chunks_embedding_idx"
  ON "transcript_chunks"
  USING hnsw ("embedding" vector_cosine_ops);
