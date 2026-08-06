/**
 * Type definitions for the Wrangler configuration file (wrangler.jsonc).
 *
 * These types represent the full surface area of a wrangler.jsonc
 * configuration. Levi generates these files from the app graph, but
 * the types are also useful for:
 * - Validating generated output
 * - The `wrangler` escape-hatch property on WorkerOptions
 * - IDE intellisense when working with raw wrangler.jsonc
 *
 * All types use `interface` so they can be extended by consumers.
 *
 * @module
 * @see https://developers.cloudflare.com/workers/wrangler/configuration/
 */

// ---------------------------------------------------------------------------
// Binding Types (wrangler.jsonc representation)
// ---------------------------------------------------------------------------

/**
 * A D1 database binding in wrangler.jsonc.
 *
 * @see https://developers.cloudflare.com/d1/wrangler-commands/#d1_databases
 */
export interface WranglerD1Binding {
  /** Binding name available as `env.BINDING` at runtime. */
  binding: string;

  /** The D1 database name (as shown in the Cloudflare dashboard). */
  database_name: string;

  /** The D1 database UUID. Populated during provisioning. */
  database_id?: string;

  /** Path to the migrations directory, relative to wrangler.jsonc. */
  migrations_dir?: string;

  /** Name of the table used to track applied migrations. */
  migrations_table?: string;

  /** D1 database ID to use for `wrangler dev` (preview). */
  preview_database_id?: string;
}

/**
 * A KV namespace binding in wrangler.jsonc.
 *
 * @see https://developers.cloudflare.com/kv/reference/wrangler-configuration/
 */
export interface WranglerKVBinding {
  /** Binding name available as `env.BINDING` at runtime. */
  binding: string;

  /** The KV namespace UUID. Populated during provisioning. */
  id?: string;

  /** KV namespace ID to use for `wrangler dev` (preview). */
  preview_id?: string;
}

/**
 * An R2 bucket binding in wrangler.jsonc.
 *
 * @see https://developers.cloudflare.com/r2/api/workers/workers-api-usage/#r2-binding
 */
export interface WranglerR2Binding {
  /** Binding name available as `env.BINDING` at runtime. */
  binding: string;

  /** The R2 bucket name. */
  bucket_name: string;

  /** Jurisdiction restriction (e.g., "eu"). */
  jurisdiction?: string;

  /** R2 bucket name to use for `wrangler dev` (preview). */
  preview_bucket_name?: string;
}

/**
 * Queue producer configuration in wrangler.jsonc.
 *
 * @see https://developers.cloudflare.com/queues/configuration/configure-queues/#producer
 */
export interface WranglerQueueProducer {
  /** Binding name available as `env.BINDING` at runtime. */
  binding: string;

  /** The queue name. */
  queue: string;

  /** Default delivery delay in seconds. */
  delivery_delay?: number;
}

/**
 * Queue consumer configuration in wrangler.jsonc.
 *
 * @see https://developers.cloudflare.com/queues/configuration/configure-queues/#consumer
 */
export interface WranglerQueueConsumer {
  /** The queue name to consume from. */
  queue: string;

  /** Maximum number of messages per batch. */
  max_batch_size?: number;

  /** Maximum time in milliseconds to wait for a full batch. */
  max_batch_timeout?: number;

  /** Maximum number of retries per message. */
  max_retries?: number;

  /** Dead letter queue name for failed messages. */
  dead_letter_queue?: string;

  /** Maximum concurrent consumer invocations. */
  max_concurrency?: number;

  /** Delay in seconds before retrying a failed message. */
  retry_delay?: number;
}

/**
 * Queue configuration block in wrangler.jsonc.
 */
export interface WranglerQueuesConfig {
  /** Queue producer bindings. */
  producers?: WranglerQueueProducer[];

  /** Queue consumer configurations. */
  consumers?: WranglerQueueConsumer[];
}

/**
 * A single Durable Object binding entry in wrangler.jsonc.
 */
export interface WranglerDurableObjectBinding {
  /** Binding name available as `env.BINDING` at runtime. */
  name: string;

  /** The exported Durable Object class name. */
  class_name: string;

  /** Script name for external DO references. */
  script_name?: string;

  /** Environment of the external script. */
  environment?: string;
}

/**
 * A single Durable Object migration step.
 *
 * @see https://developers.cloudflare.com/durable-objects/reference/durable-objects-migrations/
 */
export interface WranglerDurableObjectMigration {
  /** A unique tag identifying this migration step. */
  tag: string;

  /** New Durable Object classes introduced in this step. */
  new_classes?: string[];

  /** Renamed Durable Object classes: `{ from: "OldName", to: "NewName" }`. */
  renamed_classes?: Array<{ from: string; to: string }>;

  /** Deleted Durable Object classes. */
  deleted_classes?: string[];

  /** New SQLite-backed Durable Object classes introduced in this step. */
  new_sqlite_classes?: string[];
}

/**
 * Durable Objects configuration block in wrangler.jsonc.
 *
 * @see https://developers.cloudflare.com/durable-objects/get-started/
 */
export interface WranglerDurableObjectsConfig {
  /** Durable Object bindings. */
  bindings: WranglerDurableObjectBinding[];
}

/**
 * A Vectorize index binding in wrangler.jsonc.
 *
 * @see https://developers.cloudflare.com/vectorize/reference/wrangler-commands/
 */
export interface WranglerVectorizeBinding {
  /** Binding name available as `env.BINDING` at runtime. */
  binding: string;

  /** The Vectorize index name. */
  index_name: string;
}

/**
 * A Hyperdrive binding in wrangler.jsonc.
 *
 * @see https://developers.cloudflare.com/hyperdrive/configuration/wrangler/
 */
export interface WranglerHyperdriveBinding {
  /** Binding name available as `env.BINDING` at runtime. */
  binding: string;

  /** The Hyperdrive configuration UUID. */
  id: string;

  /** Local connection string for `wrangler dev`. */
  local_connection_string?: string;
}

/**
 * A service binding (Worker-to-Worker) in wrangler.jsonc.
 *
 * @see https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/
 */
export interface WranglerServiceBinding {
  /** Binding name available as `env.BINDING` at runtime. */
  binding: string;

  /** The target Worker service name. */
  service: string;

  /** The target Worker environment. */
  environment?: string;

  /**
   * Entrypoint (named export) to bind to on the target Worker.
   *
   * @see https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/rpc/
   */
  entrypoint?: string;
}

/**
 * An Analytics Engine dataset binding in wrangler.jsonc.
 *
 * @see https://developers.cloudflare.com/analytics/analytics-engine/
 */
export interface WranglerAnalyticsEngineBinding {
  /** Binding name available as `env.BINDING` at runtime. */
  binding: string;

  /** The dataset name. */
  dataset?: string;
}

/**
 * An mTLS certificate binding in wrangler.jsonc.
 *
 * @see https://developers.cloudflare.com/workers/runtime-apis/bindings/mtls/
 */
export interface WranglerMTLSBinding {
  /** Binding name available as `env.BINDING` at runtime. */
  binding: string;

  /** The uploaded mTLS certificate UUID. */
  certificate_id: string;
}

/**
 * A Workers AI binding in wrangler.jsonc.
 *
 * @see https://developers.cloudflare.com/workers-ai/configuration/bindings/
 */
export interface WranglerAIBinding {
  /** Binding name available as `env.BINDING` at runtime. */
  binding: string;

  /**
   * Optional AI Gateway configuration.
   * When set, AI requests are routed through the specified gateway
   * for caching, rate limiting, and observability.
   */
  gateway?: {
    /** The AI Gateway identifier. */
    id: string;
  };
}

/**
 * A Browser Rendering binding in wrangler.jsonc.
 *
 * @see https://developers.cloudflare.com/browser-rendering/
 */
export interface WranglerBrowserBinding {
  /** Binding name available as `env.BINDING` at runtime. */
  binding: string;
}

/**
 * A Workers rate limiting binding in wrangler.jsonc.
 *
 * Note: rate limit entries use `name` (not `binding`) for the env
 * accessor, and `namespace_id` is a string-encoded positive integer.
 *
 * @see https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
 */
export interface WranglerRateLimitBinding {
  /** Binding name available as `env.NAME` at runtime. */
  name: string;

  /**
   * Numeric namespace ID as a string, unique within the account.
   * Counters are shared across Workers using the same ID.
   */
  namespace_id: string;

  /** The rate limit configuration. */
  simple: {
    /** Max operations per period. */
    limit: number;

    /** Period in seconds — only 10 or 60 are supported. */
    period: number;
  };
}

/**
 * A Secrets Store secret binding in wrangler.jsonc.
 *
 * @see https://developers.cloudflare.com/secrets-store/
 */
export interface WranglerSecretsStoreSecretBinding {
  /** Binding name available as `env.BINDING` at runtime. */
  binding: string;

  /** The Secrets Store ID (32-char hex). */
  store_id: string;

  /** The secret name inside the store. */
  secret_name: string;
}

/**
 * A Workers for Platforms dispatch namespace binding in wrangler.jsonc.
 *
 * @see https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/
 */
export interface WranglerDispatchNamespaceBinding {
  /** Binding name available as `env.BINDING` at runtime. */
  binding: string;

  /** The dispatch namespace name. */
  namespace: string;

  /** Outbound Worker intercepting egress from namespaced Workers. */
  outbound?: {
    /** The outbound Worker service name. */
    service: string;

    /** Parameter names passed to the outbound Worker. */
    parameters?: string[];
  };

  /** Connect to the remote namespace during local dev. */
  remote?: boolean;
}

/**
 * An Email sending binding (`send_email`) in wrangler.jsonc.
 *
 * Note: send_email entries use `name` (not `binding`) for the env accessor.
 *
 * @see https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/
 */
export interface WranglerSendEmailBinding {
  /** Binding name available as `env.NAME` at runtime. */
  name: string;

  /** Restrict sending to a single verified destination address. */
  destination_address?: string;

  /** Restrict sending to an allowlist of verified destination addresses. */
  allowed_destination_addresses?: string[];

  /** Restrict which sender addresses this binding may use. */
  allowed_sender_addresses?: string[];

  /** Use the real Email Routing API during local dev. */
  remote?: boolean;
}

/**
 * A Workflow binding in wrangler.jsonc.
 *
 * @see https://developers.cloudflare.com/workflows/
 */
export interface WranglerWorkflowBinding {
  /** Binding name — wrangler uses `name` for workflow bindings. */
  name: string;

  /** Binding alias (also used as env accessor name). */
  binding: string;

  /** The exported Workflow class name. */
  class_name: string;

  /** Script name for external Workflow references. */
  script_name?: string;
}

// ---------------------------------------------------------------------------
// Routes & Triggers
// ---------------------------------------------------------------------------

/**
 * A route pattern in wrangler.jsonc.
 *
 * Can be a simple string pattern or an object with zone info.
 */
export type WranglerRoute =
  | string
  | {
      /** Route pattern (e.g., "api.example.com/*"). */
      pattern: string;

      /** Zone name (domain) the route belongs to. */
      zone_name?: string;

      /** Zone ID the route belongs to. */
      zone_id?: string;

      /** Custom domain flag. */
      custom_domain?: boolean;
    };

/**
 * Cron trigger configuration in wrangler.jsonc.
 *
 * @see https://developers.cloudflare.com/workers/configuration/cron-triggers/
 */
export interface WranglerCronTrigger {
  /** Cron expressions. */
  crons: string[];
}

// ---------------------------------------------------------------------------
// Tail Consumer / Producer
// ---------------------------------------------------------------------------

/**
 * A tail consumer configuration in wrangler.jsonc.
 *
 * Tail consumers receive structured log events from this Worker.
 *
 * @see https://developers.cloudflare.com/workers/observability/tail-workers/
 */
export interface WranglerTailConsumer {
  /** The tail Worker service name. */
  service: string;

  /** The target Worker environment. */
  environment?: string;
}

/**
 * Tail producer configuration — makes this Worker a source of
 * tail events that other Workers can consume.
 */
export interface WranglerTailProducer {
  /** Binding name available as `env.BINDING` at runtime. */
  binding: string;

  /** The tail Worker service name. */
  service: string;

  /** The target Worker environment. */
  environment?: string;
}

// ---------------------------------------------------------------------------
// Placement & Limits
// ---------------------------------------------------------------------------

/**
 * Worker placement configuration in wrangler.jsonc.
 *
 * @see https://developers.cloudflare.com/workers/configuration/smart-placement/
 */
export interface WranglerPlacement {
  /** Placement mode. */
  mode: "smart" | "off";
}

/**
 * Worker invocation limits in wrangler.jsonc.
 *
 * @see https://developers.cloudflare.com/workers/platform/limits/
 */
export interface WranglerLimits {
  /** CPU time limit in milliseconds. */
  cpu_ms?: number;

  /** Memory limit in megabytes. */
  memory_mb?: number;
}

// ---------------------------------------------------------------------------
// Observability
// ---------------------------------------------------------------------------

/**
 * Worker observability configuration in wrangler.jsonc.
 *
 * @see https://developers.cloudflare.com/workers/observability/
 */
export interface WranglerObservability {
  /** Enable observability features. */
  enabled: boolean;

  /** Head-based sampling rate (0.0 to 1.0). */
  head_sampling_rate?: number;
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

/**
 * Custom build configuration in wrangler.jsonc.
 *
 * @see https://developers.cloudflare.com/workers/wrangler/custom-builds/
 */
export interface WranglerBuild {
  /** Build command to execute before bundling. */
  command?: string;

  /** Working directory for the build command. */
  cwd?: string;

  /** Directory or directories to watch for changes. */
  watch_dir?: string | string[];
}

// ---------------------------------------------------------------------------
// Assets
// ---------------------------------------------------------------------------

/**
 * Static assets configuration in wrangler.jsonc.
 *
 * Used for Workers with static assets (vinext, SPA, etc.).
 *
 * @see https://developers.cloudflare.com/workers/static-assets/
 */
export interface WranglerAssets {
  /** Directory containing the static assets. */
  directory: string;

  /** Binding name for the Assets API. */
  binding?: string;

  /**
   * HTML handling mode.
   *
   * Controls how requests for HTML files are resolved.
   */
  html_handling?: "auto-trailing-slash" | "force-trailing-slash" | "drop-trailing-slash" | "none";

  /**
   * Behavior when no matching asset is found.
   */
  not_found_handling?: "single-page-application" | "404-page" | "none";

  /**
   * Run the Worker for all requests, even asset requests.
   */
  run_worker_first?: boolean;
}

// ---------------------------------------------------------------------------
// Environment Override
// ---------------------------------------------------------------------------

/**
 * Per-environment overrides in wrangler.jsonc.
 *
 * Each key under `env` is an environment name, and its value can
 * override most top-level settings.
 *
 * @see https://developers.cloudflare.com/workers/wrangler/environments/
 */
export interface WranglerEnvironment {
  /** Override the Worker name for this environment. */
  name?: string;

  /** Override the main entrypoint for this environment. */
  main?: string;

  /** Override compatibility date for this environment. */
  compatibility_date?: string;

  /** Override compatibility flags for this environment. */
  compatibility_flags?: string[];

  /** Override plain-text environment variables. */
  vars?: Record<string, string>;

  /** Override route patterns. */
  routes?: WranglerRoute[];

  /** Override cron triggers. */
  triggers?: WranglerCronTrigger;

  /** Override D1 bindings. */
  d1_databases?: WranglerD1Binding[];

  /** Override KV bindings. */
  kv_namespaces?: WranglerKVBinding[];

  /** Override R2 bindings. */
  r2_buckets?: WranglerR2Binding[];

  /** Override queue configuration. */
  queues?: WranglerQueuesConfig;

  /** Override Durable Object bindings. */
  durable_objects?: WranglerDurableObjectsConfig;

  /** Override Vectorize bindings. */
  vectorize?: WranglerVectorizeBinding[];

  /** Override Hyperdrive bindings. */
  hyperdrive?: WranglerHyperdriveBinding[];

  /** Override service bindings. */
  services?: WranglerServiceBinding[];

  /** Override AI binding. */
  ai?: WranglerAIBinding;

  /** Override Analytics Engine bindings. */
  analytics_engine_datasets?: WranglerAnalyticsEngineBinding[];

  /** Override mTLS certificate bindings. */
  mtls_certificates?: WranglerMTLSBinding[];

  /** Override Browser binding. */
  browser?: WranglerBrowserBinding;

  /** Override Workflow bindings. */
  workflows?: WranglerWorkflowBinding[];

  /** Override placement configuration. */
  placement?: WranglerPlacement;

  /** Override resource limits. */
  limits?: WranglerLimits;

  /** Override logpush setting. */
  logpush?: boolean;

  /** Override observability settings. */
  observability?: WranglerObservability;

  /** Override build configuration. */
  build?: WranglerBuild;

  /** Override assets configuration. */
  assets?: WranglerAssets;

  /** Override tail consumers. */
  tail_consumers?: WranglerTailConsumer[];

  /** Override rate limiting bindings. */
  ratelimits?: WranglerRateLimitBinding[];

  /** Override Secrets Store secret bindings. */
  secrets_store_secrets?: WranglerSecretsStoreSecretBinding[];

  /** Override dispatch namespace bindings. */
  dispatch_namespaces?: WranglerDispatchNamespaceBinding[];

  /** Override email sending bindings. */
  send_email?: WranglerSendEmailBinding[];
}

// ---------------------------------------------------------------------------
// Top-Level Wrangler Config
// ---------------------------------------------------------------------------

/**
 * The complete wrangler.jsonc configuration type.
 *
 * Represents every field that can appear in a wrangler.jsonc file.
 * Levi generates instances of this type for each Worker in the app graph.
 *
 * This interface is intentionally comprehensive so that it serves as
 * both the generation target and a documentation/validation tool.
 *
 * @see https://developers.cloudflare.com/workers/wrangler/configuration/
 *
 * @example
 * ```jsonc
 * // Generated by Levi — do not edit manually
 * {
 *   "name": "api",
 *   "main": "./src/index.ts",
 *   "compatibility_date": "2026-04-01",
 *   "d1_databases": [
 *     { "binding": "DB", "database_name": "main-db", "database_id": "..." }
 *   ]
 * }
 * ```
 */
export interface WranglerConfig {
  // ── Identity ──────────────────────────────────────────────────

  /**
   * The Worker name. Used as the service name on Cloudflare.
   *
   * @example "api"
   * @example "web-frontend"
   */
  name?: string;

  /**
   * Path to the Worker's main entrypoint module.
   *
   * @example "./src/index.ts"
   * @example "./dist/worker.js"
   */
  main?: string;

  /**
   * Cloudflare Account ID.
   *
   * Optional in wrangler.jsonc — can be set via environment variable
   * `CLOUDFLARE_ACCOUNT_ID`.
   */
  account_id?: string;

  // ── Compatibility ─────────────────────────────────────────────

  /**
   * Compatibility date for the Workers runtime.
   *
   * Controls which runtime behavior changes are applied. Use the latest
   * date for new projects.
   *
   * @see https://developers.cloudflare.com/workers/configuration/compatibility-dates/
   * @example "2026-04-01"
   */
  compatibility_date?: string;

  /**
   * Compatibility flags to opt into specific runtime behaviors.
   *
   * @see https://developers.cloudflare.com/workers/configuration/compatibility-flags/
   * @example ["nodejs_compat", "streams_enable_constructors"]
   */
  compatibility_flags?: string[];

  // ── Bindings ──────────────────────────────────────────────────

  /** D1 database bindings. */
  d1_databases?: WranglerD1Binding[];

  /** KV namespace bindings. */
  kv_namespaces?: WranglerKVBinding[];

  /** R2 bucket bindings. */
  r2_buckets?: WranglerR2Binding[];

  /** Queue producer and consumer configuration. */
  queues?: WranglerQueuesConfig;

  /**
   * Durable Object bindings and class declarations.
   */
  durable_objects?: WranglerDurableObjectsConfig;

  /**
   * Durable Object migrations.
   *
   * Required when adding, renaming, or deleting Durable Object classes.
   *
   * @see https://developers.cloudflare.com/durable-objects/reference/durable-objects-migrations/
   */
  migrations?: WranglerDurableObjectMigration[];

  /** Vectorize index bindings. */
  vectorize?: WranglerVectorizeBinding[];

  /** Hyperdrive configuration bindings. */
  hyperdrive?: WranglerHyperdriveBinding[];

  /** Workers AI binding. */
  ai?: WranglerAIBinding;

  /** Service bindings (Worker-to-Worker RPC). */
  services?: WranglerServiceBinding[];

  /** Analytics Engine dataset bindings. */
  analytics_engine_datasets?: WranglerAnalyticsEngineBinding[];

  /** mTLS certificate bindings. */
  mtls_certificates?: WranglerMTLSBinding[];

  /** Browser Rendering API binding. */
  browser?: WranglerBrowserBinding;

  /** Workflow bindings. */
  workflows?: WranglerWorkflowBinding[];

  /**
   * Workers rate limiting bindings.
   * Requires a recent wrangler version (the `ratelimits` key went GA in late 2025).
   */
  ratelimits?: WranglerRateLimitBinding[];

  /** Secrets Store secret bindings. */
  secrets_store_secrets?: WranglerSecretsStoreSecretBinding[];

  /** Workers for Platforms dispatch namespace bindings. */
  dispatch_namespaces?: WranglerDispatchNamespaceBinding[];

  /** Email sending bindings. */
  send_email?: WranglerSendEmailBinding[];

  // ── Variables & Secrets ───────────────────────────────────────

  /**
   * Plain-text environment variables.
   *
   * Available at runtime via `env.VAR_NAME`. These values are visible
   * in the generated wrangler.jsonc — do not put secrets here.
   */
  vars?: Record<string, string>;

  /**
   * Levi extension — not part of the official wrangler.jsonc schema.
   * Secrets are managed via `wrangler secret put`. This field is included
   * for documentation/tooling purposes.
   */
  secrets?: string[];

  // ── Routing ───────────────────────────────────────────────────

  /**
   * Route patterns that direct HTTP traffic to this Worker.
   *
   * @see https://developers.cloudflare.com/workers/configuration/routing/routes/
   * @example ["api.example.com/*"]
   */
  routes?: WranglerRoute[];

  /**
   * Cron trigger configuration.
   *
   * @see https://developers.cloudflare.com/workers/configuration/cron-triggers/
   */
  triggers?: WranglerCronTrigger;

  // ── Placement & Performance ───────────────────────────────────

  /**
   * Smart Placement configuration.
   *
   * @see https://developers.cloudflare.com/workers/configuration/smart-placement/
   */
  placement?: WranglerPlacement;

  /**
   * Resource limits per invocation.
   *
   * @see https://developers.cloudflare.com/workers/platform/limits/
   */
  limits?: WranglerLimits;

  // ── Observability ─────────────────────────────────────────────

  /**
   * Enable Logpush for this Worker.
   *
   * @see https://developers.cloudflare.com/workers/observability/logpush/
   */
  logpush?: boolean;

  /**
   * Observability configuration (tracing, sampling).
   *
   * @see https://developers.cloudflare.com/workers/observability/
   */
  observability?: WranglerObservability;

  // ── Build ─────────────────────────────────────────────────────

  /**
   * Custom build configuration.
   *
   * @see https://developers.cloudflare.com/workers/wrangler/custom-builds/
   */
  build?: WranglerBuild;

  /**
   * Disable Wrangler's automatic bundling.
   *
   * When `true`, the `main` entrypoint must be a pre-bundled JavaScript
   * file. Useful when you handle bundling externally.
   *
   * @default false
   */
  no_bundle?: boolean;

  /**
   * Enable Node.js compatibility mode.
   *
   * When `true`, the Worker can use Node.js built-in modules and APIs
   * that Cloudflare has polyfilled. Required by some frameworks
   * (e.g., vinext).
   *
   * @default false
   * @see https://developers.cloudflare.com/workers/runtime-apis/nodejs/
   */
  node_compat?: boolean;

  /**
   * Minify the Worker bundle.
   *
   * @default false
   */
  minify?: boolean;

  /**
   * Include source maps in the uploaded Worker.
   *
   * Useful for debugging in production — stack traces will reference
   * original source locations.
   *
   * @default false
   */
  upload_source_maps?: boolean;

  /**
   * Path to a custom tsconfig.json for the Worker.
   */
  tsconfig?: string;

  /**
   * Rules for including non-JS assets in the Worker bundle.
   *
   * @see https://developers.cloudflare.com/workers/wrangler/bundling/
   */
  rules?: Array<{
    /** Glob pattern for matching files. */
    type: "ESModule" | "CommonJS" | "CompiledWasm" | "Text" | "Data";

    /** Glob patterns to include. */
    globs: string[];

    /** Whether to fall through to the next rule on match. */
    fallthrough?: boolean;
  }>;

  // ── Assets ────────────────────────────────────────────────────

  /**
   * Static assets configuration.
   *
   * Used for Workers with static file serving (vinext, SPAs, static sites).
   *
   * @see https://developers.cloudflare.com/workers/static-assets/
   */
  assets?: WranglerAssets;

  /**
   * Legacy site configuration.
   *
   * @deprecated Use `assets` instead for new projects.
   * @see https://developers.cloudflare.com/workers/configuration/sites/
   */
  site?: {
    /** Path to the directory of static assets. */
    bucket: string;

    /** Glob patterns to include. */
    include?: string[];

    /** Glob patterns to exclude. */
    exclude?: string[];
  };

  // ── Tail Workers ──────────────────────────────────────────────

  /**
   * Tail consumers that receive log events from this Worker.
   *
   * @see https://developers.cloudflare.com/workers/observability/tail-workers/
   */
  tail_consumers?: WranglerTailConsumer[];

  /**
   * Tail producer bindings.
   */
  tail_producers?: WranglerTailProducer[];

  // ── Environments ──────────────────────────────────────────────

  /**
   * Per-environment configuration overrides.
   *
   * Each key is an environment name (e.g., "staging", "production").
   *
   * @see https://developers.cloudflare.com/workers/wrangler/environments/
   */
  env?: Record<string, WranglerEnvironment>;

  // ── Misc ──────────────────────────────────────────────────────

  /**
   * Send usage metrics to Cloudflare.
   *
   * @default true
   */
  send_metrics?: boolean;

  /**
   * When true, preserves existing environment variables during Worker upload
   * instead of removing those not specified in the config.
   */
  keep_vars?: boolean;

  /**
   * The usage model for the Worker.
   *
   * @deprecated Use `limits` instead for newer configurations.
   */
  usage_model?: "bundled" | "unbound" | "standard";

  /**
   * Define custom module rules for non-standard imports.
   *
   * @see https://developers.cloudflare.com/workers/wrangler/configuration/#define
   */
  define?: Record<string, string>;

  /** @beta Container definitions. */
  containers?: Array<{
    class_name: string;
    image: string;
    instance_type?: string | { vcpu: number; memory_mib: number; disk_mb: number };
    max_instances?: number;
    image_build_context?: string;
    image_vars?: Record<string, string>;
    name?: string;
  }>;

  /** @beta Pipeline stream bindings. */
  pipelines?: Array<{
    binding: string;
    pipeline: string;
  }>;

  /**
   * Catch-all for any wrangler.jsonc fields not yet typed by Levi.
   *
   * Allows forward compatibility with new Wrangler features.
   */
  [key: string]: unknown;
}
