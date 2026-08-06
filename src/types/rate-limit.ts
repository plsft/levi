/**
 * Types for the Workers Rate Limiting binding.
 *
 * @module
 */

/**
 * Options for a Workers rate limiter.
 *
 * The Rate Limiting binding provides a fast, eventually-consistent
 * per-colo counter with a simple `limit({ key })` API inside your Worker.
 * Counters sharing the same `namespaceId` are shared across all Workers
 * on the account.
 *
 * @see https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
 *
 * @example
 * ```ts
 * const limiter = app.addRateLimit("api-limiter", { limit: 100, period: 60 });
 * app.addWorker("api", {
 *   entrypoint: "./src/index.ts",
 *   bindings: { LIMITER: limiter },
 * });
 * // In the worker: const { success } = await env.LIMITER.limit({ key: ip });
 * ```
 */
export interface RateLimitOptions {
  /**
   * Maximum number of operations allowed within the period.
   *
   * @minimum 1
   */
  limit: number;

  /**
   * The period in seconds over which operations are counted.
   * Cloudflare currently supports only 10 or 60.
   */
  period: 10 | 60;

  /**
   * Numeric namespace ID as a string, unique within your account.
   * Rate limit counters are shared across all Workers that use the
   * same namespace ID.
   *
   * If omitted, Levi derives a stable ID from the resource name via an
   * FNV-1a hash — deterministic across builds. Set it explicitly when
   * the same logical limiter is shared across multiple Levi apps.
   *
   * @example "1001"
   */
  namespaceId?: string;
}
