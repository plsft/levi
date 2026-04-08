/**
 * Type definitions for Cloudflare Workers KV namespaces in Levi.
 *
 * KV is Cloudflare's globally distributed key-value store. Levi manages
 * KV namespace provisioning and binding generation.
 *
 * @module
 * @see https://developers.cloudflare.com/kv/
 */

// ---------------------------------------------------------------------------
// KV Options
// ---------------------------------------------------------------------------

/**
 * Configuration options for a Cloudflare KV namespace.
 *
 * Passed to `app.addKV()` to declare a KV namespace in the app graph.
 *
 * @example
 * ```ts
 * const sessionCache = app.addKV("sessions", {
 *   ttl: 3600,
 * });
 * ```
 */
export interface KVOptions {
  /**
   * Default time-to-live in seconds for values stored in this namespace.
   *
   * This is a Levi-level default — the actual TTL is set per `put()`
   * call at runtime. Levi uses this value to document the intended
   * caching behavior and can enforce it in generated helper code.
   *
   * A value of `0` or `undefined` means no default TTL (values persist
   * until explicitly deleted).
   *
   * @minimum 60 — Cloudflare KV requires TTL >= 60 seconds
   */
  ttl?: number;

  /**
   * Existing KV namespace ID to use for preview/development environments.
   *
   * When set, `levi dev` binds to this namespace instead of creating a
   * local one. Useful for sharing a development namespace across a team.
   *
   * @example "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   */
  previewId?: string;

  /**
   * Existing KV namespace ID to bind to in production.
   *
   * When set, Levi skips provisioning and binds directly to this
   * existing namespace. Useful for importing namespaces created outside
   * of Levi.
   *
   * @example "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   */
  namespaceId?: string;
}
