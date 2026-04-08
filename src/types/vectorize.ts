/**
 * Type definitions for Cloudflare Vectorize indexes in Levi.
 *
 * Vectorize is Cloudflare's vector database for building AI-powered
 * search and retrieval-augmented generation (RAG) applications. Levi
 * manages Vectorize index provisioning, configuration, and binding
 * generation.
 *
 * @module
 * @see https://developers.cloudflare.com/vectorize/
 */

// ---------------------------------------------------------------------------
// Vectorize Metric
// ---------------------------------------------------------------------------

/**
 * Distance metric used for vector similarity search.
 *
 * The metric must match the embedding model's output space:
 * - `"cosine"` — Cosine similarity. Best for normalized embeddings
 *   (e.g., OpenAI `text-embedding-3-small`).
 * - `"euclidean"` — Euclidean (L2) distance. Best when magnitude matters.
 * - `"dot-product"` — Dot product similarity. Fastest, but requires
 *   normalized vectors for meaningful results.
 */
export type VectorizeMetric = "cosine" | "euclidean" | "dot-product";

// ---------------------------------------------------------------------------
// Vectorize Options
// ---------------------------------------------------------------------------

/**
 * Configuration options for a Cloudflare Vectorize index.
 *
 * Passed to `app.addVectorize()` to declare a Vectorize index in the
 * app graph.
 *
 * @example
 * ```ts
 * const embeddings = app.addVectorize("doc-embeddings", {
 *   dimensions: 1536,
 *   metric: "cosine",
 * });
 * ```
 */
export interface VectorizeOptions {
  /**
   * Number of dimensions per vector.
   *
   * Must match the output dimensions of the embedding model you are
   * using. Common values:
   * - 384 — `all-MiniLM-L6-v2`
   * - 768 — `bge-base-en-v1.5`
   * - 1024 — `bge-large-en-v1.5`
   * - 1536 — `text-embedding-3-small` (OpenAI)
   * - 3072 — `text-embedding-3-large` (OpenAI)
   *
   * @minimum 1
   * @maximum 65536
   */
  dimensions: number;

  /**
   * Distance metric for similarity search.
   *
   * Must match the vector space of your embedding model. Cannot be
   * changed after the index is created.
   *
   * @see {@link VectorizeMetric}
   */
  metric: VectorizeMetric;

  /**
   * Existing Vectorize index ID to use for preview/development environments.
   *
   * When set, `levi dev` binds to this index instead of creating a
   * local mock. Useful for sharing a development index across a team.
   *
   * @example "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
   */
  previewIndexId?: string;

  /**
   * Existing Vectorize index ID to bind to in production.
   *
   * When set, Levi skips provisioning and binds directly to this
   * existing index.
   */
  indexId?: string;

  /**
   * Optional description for the Vectorize index.
   *
   * Displayed in the Cloudflare dashboard. Useful for documenting
   * the index's purpose and the embedding model used.
   *
   * @example "Product descriptions embedded with text-embedding-3-small"
   */
  description?: string;
}
