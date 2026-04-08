/**
 * Type definitions for Cloudflare Pipelines in Levi.
 *
 * Pipelines ingest, transform, and deliver data to R2.
 *
 * @beta Cloudflare Pipelines is in open beta.
 * @module
 * @see https://developers.cloudflare.com/pipelines/
 */

// ---------------------------------------------------------------------------
// Pipeline Options
// ---------------------------------------------------------------------------

/**
 * Configuration options for a Cloudflare Pipeline.
 *
 * Passed to `app.addPipeline()` to declare a Pipeline stream binding
 * in the app graph.
 *
 * @beta Cloudflare Pipelines is in open beta.
 *
 * @example
 * ```ts
 * const pipeline = app.addPipeline("events", {
 *   streamId: "my-event-stream",
 * });
 * ```
 */
export interface PipelineOptions {
  /** The stream ID to bind to for writing events. */
  streamId: string;

  /** Schema file path for the stream (optional — for documentation). */
  schemaFile?: string;
}
