/**
 * Common shared types for the Levi AppHost framework for Cloudflare.
 *
 * These types are used across all resource builders and form the
 * foundation of the Levi type system.
 *
 * @module
 */

// ---------------------------------------------------------------------------
// Resource Type
// ---------------------------------------------------------------------------

/**
 * Discriminated union of all Cloudflare resource types that Levi can manage.
 *
 * Each value maps 1:1 to a Cloudflare primitive and determines how the
 * resource is provisioned, bound, and represented in generated wrangler.jsonc.
 */
export type ResourceType =
  | "worker"
  | "d1"
  | "kv"
  | "r2"
  | "queue"
  | "durable-object"
  | "vectorize"
  | "hyperdrive"
  | "workers-ai"
  | "ai-gateway"
  | "domain"
  | "workflow"
  | "tail-worker"
  | "mtls"
  | "secret"
  | "var"
  | "container"
  | "pipeline";

// ---------------------------------------------------------------------------
// Framework
// ---------------------------------------------------------------------------

/**
 * Supported application frameworks for Workers.
 *
 * - `"hono"` — Hono web framework. Levi auto-detects entry exports.
 * - `"vinext"` — Cloudflare's Vite-based framework (first-class support).
 *   When selected, Levi generates assets config and server settings
 *   appropriate for vinext deployments.
 * - `"tanstack"` — TanStack (Query + Router) SPA frontend. Levi generates
 *   assets config for static file serving and service binding to API workers.
 * - `"raw"` — No framework. The entrypoint must export a `fetch` handler
 *   (and optionally `scheduled`, `queue`, etc.) directly.
 */
export type Framework = "hono" | "vinext" | "tanstack" | "raw";

// ---------------------------------------------------------------------------
// Secret & Var References
// ---------------------------------------------------------------------------

/**
 * A reference to a secret value managed outside of source control.
 *
 * Secrets are never written into generated wrangler.jsonc files. Instead,
 * Levi records the secret name and provisions it via `wrangler secret put`
 * or the Cloudflare API during `levi provision`.
 */
export interface SecretRef {
  /** Discriminator for runtime type checks. */
  readonly __type: "secret";

  /** The name of the secret as it appears in the Cloudflare dashboard and Worker bindings. */
  readonly name: string;
}

/**
 * A reference to an environment variable (plain text).
 *
 * Unlike {@link SecretRef}, var values **are** written into the generated
 * wrangler.jsonc under the `vars` block.
 */
export interface VarRef {
  /** Discriminator for runtime type checks. */
  readonly __type: "var";

  /** The variable name (binding key). */
  readonly name: string;

  /** The variable value. */
  readonly value: string;
}

// ---------------------------------------------------------------------------
// Cron Config
// ---------------------------------------------------------------------------

/**
 * Configuration for a Cron Trigger attached to a Worker.
 *
 * Cloudflare Cron Triggers invoke the Worker's `scheduled` event handler
 * on the specified schedule.
 *
 * @see https://developers.cloudflare.com/workers/configuration/cron-triggers/
 */
export interface CronConfig {
  /**
   * A cron expression (5 or 6 fields) defining when the trigger fires.
   *
   * @example "0 *\/6 * * *"  — every 6 hours
   * @example "30 8 * * 1-5"  — weekdays at 08:30 UTC
   */
  pattern: string;

  /**
   * Optional name of the handler function or route within the Worker
   * that should process this cron event. This is metadata for Levi's
   * graph/dashboard — Cloudflare always calls the `scheduled` export.
   */
  handler?: string;
}

// ---------------------------------------------------------------------------
// Resource (base)
// ---------------------------------------------------------------------------

/**
 * Base interface for all Levi-managed Cloudflare resources.
 *
 * Every resource in the app graph implements this interface. The `type`
 * discriminant enables exhaustive switches when processing the graph.
 */
export interface ResourceShape {
  /** The Cloudflare resource type. */
  readonly type: ResourceType;

  /**
   * The logical name of the resource within the Levi app.
   * This is used as the default Cloudflare resource name unless
   * overridden by service-specific options.
   */
  readonly name: string;
}

/**
 * @deprecated Use `ResourceShape` instead. Kept for backwards compatibility.
 */
export type Resource = ResourceShape;

// ---------------------------------------------------------------------------
// Forward-declared resource interfaces (for cross-references)
// ---------------------------------------------------------------------------

/**
 * Minimal shape of a Queue resource, used by {@link ConsumerConfig} to
 * reference a queue without creating a circular import.
 */
export interface QueueResourceShape extends ResourceShape {
  readonly type: "queue";
}

// ---------------------------------------------------------------------------
// Consumer Config
// ---------------------------------------------------------------------------

/**
 * Configuration for a Queue Consumer attached to a Worker.
 *
 * A consumer pulls messages from a Cloudflare Queue and delivers them
 * to the Worker's `queue` event handler in batches.
 *
 * @see https://developers.cloudflare.com/queues/configuration/consumer/
 */
export interface ConsumerConfig {
  /**
   * The queue resource to consume messages from.
   * Must be a queue created via `app.addQueue()`.
   */
  queue: QueueResourceShape;

  /**
   * Maximum number of messages delivered per batch.
   *
   * @default 10
   * @minimum 1
   * @maximum 100
   */
  maxBatchSize?: number;

  /**
   * Maximum number of times a message will be retried after the consumer
   * throws an error or explicitly retries.
   *
   * @default 3
   * @minimum 0
   * @maximum 100
   */
  maxRetries?: number;

  /**
   * Maximum time in milliseconds the runtime will wait to fill a batch
   * before delivering a partial batch.
   *
   * @default 5000
   * @minimum 0
   * @maximum 30000
   */
  maxWaitMs?: number;

  /**
   * Optional dead-letter queue that receives messages which have
   * exhausted all retries. Must be a queue created via `app.addQueue()`.
   */
  deadLetterQueue?: QueueResourceShape;

  /**
   * Maximum number of concurrent consumers (parallel invocations).
   *
   * @default 1
   * @minimum 1
   * @maximum 20
   */
  maxConcurrency?: number;

  /**
   * Delay in seconds before a retried message becomes visible again.
   *
   * @minimum 0
   * @maximum 43200
   */
  retryDelay?: number;
}

// ---------------------------------------------------------------------------
// Binding Map
// ---------------------------------------------------------------------------

/**
 * A record mapping binding names to Levi resources.
 *
 * Keys become the binding name in the Worker's environment (e.g., `env.DB`),
 * and values are resource references returned by `app.addD1()`, `app.addKV()`,
 * etc.
 *
 * @example
 * ```ts
 * const bindings: BindingMap = {
 *   DB: mainDb,
 *   CACHE: sessionCache,
 *   UPLOADS: uploads,
 * };
 * ```
 */
export type BindingMap = Record<string, Resource | ServiceBindingRef>;

/**
 * Minimal shape of a service binding reference.
 *
 * This allows `.asService()` return values to be used in worker
 * binding maps without importing the runtime class.
 */
export interface ServiceBindingRef {
  readonly workerName: string;
}

// ---------------------------------------------------------------------------
// Environment Config
// ---------------------------------------------------------------------------

/**
 * Per-environment overrides for a Levi application.
 *
 * Cloudflare Workers support named environments (e.g., `staging`,
 * `production`) that can override routes, vars, secrets, and more.
 * These overrides are merged into the generated wrangler.jsonc `[env.*]`
 * blocks.
 *
 * @see https://developers.cloudflare.com/workers/wrangler/environments/
 */
export interface EnvironmentConfig {
  /**
   * Plain-text environment variables for this environment.
   * These override any vars set at the top level.
   */
  vars?: Record<string, string>;

  /**
   * Secret names that should be provisioned for this environment.
   * Values are set via `wrangler secret put` or the Cloudflare API.
   */
  secrets?: string[];

  /**
   * Route patterns for this environment.
   * Overrides the top-level routes for workers deployed to this env.
   *
   * @example ["staging.acme.com/*"]
   */
  routes?: string[];

  /**
   * Primary domain for this environment.
   * Used by Levi to configure custom domains on Workers.
   *
   * @example "staging.acme.com"
   */
  domain?: string;

  /**
   * Compatibility date override for this environment.
   *
   * @example "2026-04-01"
   */
  compatibilityDate?: string;

  /**
   * Compatibility flags override for this environment.
   */
  compatibilityFlags?: string[];

  /**
   * Custom environment-specific bindings that override or supplement
   * the top-level worker bindings.
   */
  bindings?: BindingMap;

  /**
   * Worker-level limits override for this environment.
   */
  limits?: {
    /** CPU time limit in milliseconds per invocation. */
    cpuMs?: number;

    /** Memory limit in megabytes. */
    memoryMb?: number;
  };
}

// ---------------------------------------------------------------------------
// App Options
// ---------------------------------------------------------------------------

/**
 * Options for the `FlareApp` constructor.
 *
 * These configure the top-level application settings that apply across
 * all resources and workers in the app graph.
 *
 * @example
 * ```ts
 * const app = new FlareApp("my-app", {
 *   account: process.env.CF_ACCOUNT_ID,
 *   compatibility_date: "2026-04-01",
 *   environments: {
 *     staging: { domain: "staging.example.com" },
 *     production: { domain: "example.com" },
 *   },
 * });
 * ```
 */
export interface AppOptions {
  /**
   * Cloudflare Account ID.
   *
   * Required for provisioning and deployment. Can be provided via
   * environment variable and referenced here.
   */
  account?: string;

  /**
   * Default compatibility date for all workers in the application.
   *
   * Individual workers can override this. Cloudflare uses this date to
   * determine which runtime behavior changes are applied.
   *
   * @see https://developers.cloudflare.com/workers/configuration/compatibility-dates/
   * @example "2026-04-01"
   */
  compatibility_date?: string;

  /**
   * Default compatibility flags applied to all workers.
   *
   * Individual workers can extend or override these.
   *
   * @see https://developers.cloudflare.com/workers/configuration/compatibility-flags/
   * @example ["nodejs_compat", "streams_enable_constructors"]
   */
  compatibility_flags?: string[];

  /**
   * Named environment configurations.
   *
   * Each key is an environment name (e.g., "staging", "production") and
   * the value contains env-specific overrides for vars, routes, domains,
   * and other settings.
   */
  environments?: Record<string, EnvironmentConfig>;

  /**
   * Base directory for resolving relative paths in resource configurations
   * (e.g., migration directories, entrypoints).
   *
   * Defaults to the directory containing the `levi.app.ts` file.
   */
  basePath?: string;

  /**
   * Output directory for generated wrangler.jsonc configs and other
   * Levi artifacts.
   *
   * @default ".levi"
   */
  outDir?: string;
}
