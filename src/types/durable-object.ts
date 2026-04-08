/**
 * Type definitions for Cloudflare Durable Objects in Levi.
 *
 * Durable Objects provide globally unique, strongly consistent,
 * single-threaded compute instances with persistent storage. They are
 * ideal for coordination, real-time collaboration, and stateful
 * applications.
 *
 * @module
 * @see https://developers.cloudflare.com/durable-objects/
 */

// ---------------------------------------------------------------------------
// Durable Object Options
// ---------------------------------------------------------------------------

/**
 * Configuration options for a Cloudflare Durable Object.
 *
 * Passed to `app.addDurableObject()` to declare a Durable Object class
 * in the app graph. The DO is bound to Workers via the `bindings` map
 * in {@link import("./worker.js").WorkerOptions}.
 *
 * @example
 * ```ts
 * const realtimeSessions = app.addDurableObject("RealtimeSession", {
 *   className: "RealtimeSession",
 *   sqlite: true,
 * });
 * ```
 */
export interface DurableObjectOptions {
  /**
   * The exported class name that implements the Durable Object.
   *
   * This must match the name of a class exported from a Worker's
   * entrypoint that extends `DurableObject` (or `DurableObjectState`
   * for the legacy API).
   *
   * @example "RealtimeSession"
   * @example "RateLimiter"
   */
  className: string;

  /**
   * Enable SQLite-backed storage for this Durable Object.
   *
   * When `true`, the DO uses the SQL storage API (`this.ctx.storage.sql`)
   * instead of the key-value storage API. This enables relational queries
   * within a single DO instance.
   *
   * Requires `compatibility_date >= 2024-10-01` on the hosting Worker.
   *
   * @default false
   * @see https://developers.cloudflare.com/durable-objects/api/sql-storage/
   */
  sqlite?: boolean;

  /**
   * Name of an external Worker script that hosts this Durable Object class.
   *
   * When set, the DO binding references a class defined in a different
   * Worker (possibly outside of this Levi app). The hosting Worker must
   * export the specified `className`.
   *
   * Omit this to indicate the DO is hosted in the Worker that binds to it.
   *
   * @example "auth-worker"
   */
  scriptName?: string;

  /**
   * Environment of the external Worker script that hosts this Durable Object.
   *
   * Only meaningful when `scriptName` is set. Specifies which environment
   * of the hosting Worker to reference.
   *
   * @example "production"
   */
  environment?: string;

  /**
   * Location hint for Durable Object instance placement.
   *
   * Suggests a preferred region for new DO instances. Cloudflare uses
   * this as a hint — actual placement depends on request origin and
   * availability.
   *
   * @see https://developers.cloudflare.com/durable-objects/reference/data-location/
   * @example "weur" — Western Europe
   * @example "enam" — Eastern North America
   */
  locationHint?: string;
}
