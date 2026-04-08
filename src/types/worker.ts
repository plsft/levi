/**
 * Type definitions for Cloudflare Workers in Levi.
 *
 * Workers are the primary compute primitive on Cloudflare. Levi supports
 * three framework modes: Hono, vinext (first-class), and raw Workers.
 *
 * @module
 */

import type {
  BindingMap,
  ConsumerConfig,
  CronConfig,
  Framework,
} from "./common.js";

// ---------------------------------------------------------------------------
// Durable Object Class Config
// ---------------------------------------------------------------------------

/**
 * Configuration for a Durable Object class hosted within a Worker.
 *
 * When a Worker declares `durableObjects`, Levi generates the
 * `durable_objects.bindings` section in the worker's wrangler.jsonc.
 */
export interface DurableObjectClassConfig {
  /**
   * The exported class name in the Worker's source code that implements
   * the Durable Object.
   *
   * @example "RealtimeSession"
   */
  className: string;

  /**
   * Enable SQLite-backed storage for this Durable Object class.
   *
   * When `true`, the DO uses the new SQLite storage API instead of the
   * key-value storage API. Requires `compatibility_date >= 2024-10-01`.
   *
   * @default false
   * @see https://developers.cloudflare.com/durable-objects/api/sql-storage/
   */
  sqlite?: boolean;

  /**
   * Reference an external Durable Object hosted in a different Worker script.
   *
   * When set, this binding points to a DO class defined in the named
   * script rather than the current Worker.
   */
  scriptName?: string;

  /**
   * Environment of the external script containing the Durable Object class.
   * Only meaningful when `scriptName` is set.
   */
  environment?: string;
}

// ---------------------------------------------------------------------------
// Placement
// ---------------------------------------------------------------------------

/**
 * Worker placement configuration.
 *
 * Controls where the Worker runs within Cloudflare's network.
 *
 * @see https://developers.cloudflare.com/workers/configuration/smart-placement/
 */
export interface PlacementConfig {
  /**
   * Placement mode.
   *
   * - `"smart"` — Cloudflare automatically places the Worker close to
   *   the resources it accesses most (e.g., D1, Hyperdrive origins).
   * - `"off"` — Worker runs at the edge closest to the client.
   *
   * @default "off"
   */
  mode: "smart" | "off";
}

// ---------------------------------------------------------------------------
// Limits
// ---------------------------------------------------------------------------

/**
 * Resource limits for a Worker invocation.
 *
 * @see https://developers.cloudflare.com/workers/platform/limits/
 */
export interface WorkerLimits {
  /**
   * Maximum CPU time in milliseconds per invocation.
   *
   * This is wall-clock CPU time, not calendar time. Async I/O (fetch,
   * cache, KV, D1) does not count against this limit.
   *
   * Bundled plan default: 50ms. Unbound plan default: 30000ms.
   */
  cpuMs?: number;

  /**
   * Memory limit in megabytes.
   *
   * Workers have a default memory limit of 128 MB. This can be increased
   * on the Workers Paid plan.
   */
  memoryMb?: number;
}

// ---------------------------------------------------------------------------
// Observability
// ---------------------------------------------------------------------------

/**
 * Worker observability and tracing configuration.
 *
 * @see https://developers.cloudflare.com/workers/observability/
 */
export interface ObservabilityConfig {
  /**
   * Enable Workers observability (tracing, logs, metrics) for this Worker.
   */
  enabled: boolean;

  /**
   * Percentage of requests to sample for head-based tracing.
   *
   * Value between 0 and 1 (inclusive). `1` means all requests are traced.
   *
   * @default 1
   * @minimum 0
   * @maximum 1
   */
  headSamplingRate?: number;
}

// ---------------------------------------------------------------------------
// Build Config
// ---------------------------------------------------------------------------

/**
 * Custom build configuration for a Worker.
 *
 * Use this when the Worker requires a build step before Wrangler
 * bundles it (e.g., code generation, asset compilation).
 *
 * @see https://developers.cloudflare.com/workers/wrangler/custom-builds/
 */
export interface BuildConfig {
  /**
   * Shell command to run before Wrangler bundles the Worker.
   *
   * @example "npm run build:api"
   */
  command?: string;

  /**
   * Working directory for the build command.
   * Relative to the project root.
   *
   * @example "./packages/api"
   */
  cwd?: string;

  /**
   * Directory or directories to watch for changes during `levi dev`.
   * When files change in these directories, the build command is re-run.
   *
   * @example "./packages/api/src"
   * @example ["./packages/api/src", "./packages/shared/src"]
   */
  watchDir?: string | string[];
}

// ---------------------------------------------------------------------------
// Worker Options
// ---------------------------------------------------------------------------

/**
 * Configuration options for a Cloudflare Worker.
 *
 * This is the primary configuration interface passed to `app.addWorker()`.
 * It covers all standard Worker settings including bindings, routes,
 * triggers, framework selection, and build configuration.
 *
 * @example
 * ```ts
 * app.addWorker("api", {
 *   framework: "hono",
 *   entrypoint: "./packages/api/src/index.ts",
 *   bindings: { DB: mainDb, CACHE: sessionCache },
 *   routes: ["api.acme.com/*"],
 *   crons: [{ pattern: "0 *\/6 * * *" }],
 * });
 * ```
 */
export interface WorkerOptions {
  /**
   * Application framework used by this Worker.
   *
   * - `"hono"` — Hono web framework.
   * - `"vinext"` — Cloudflare's Vite-based framework (first-class in Levi).
   * - `"raw"` — No framework; entrypoint exports handlers directly.
   *
   * Levi uses this to apply framework-specific defaults and configuration.
   *
   * @default "raw"
   */
  framework?: Framework;

  /**
   * Path to the Worker's entrypoint file.
   *
   * For `"hono"` and `"raw"` frameworks, this should be a TypeScript or
   * JavaScript file that exports a `fetch` handler.
   *
   * For `"vinext"`, this should be the project directory containing the
   * vinext app (Levi auto-resolves the entry).
   *
   * @example "./packages/api/src/index.ts"
   */
  entrypoint: string;

  /**
   * Resource bindings available to this Worker at runtime via `env`.
   *
   * Keys become the binding names (e.g., `env.DB`), values are resource
   * references returned by `app.addD1()`, `app.addKV()`, etc.
   *
   * Service bindings to other Workers are created via `worker.asService()`.
   *
   * @example
   * ```ts
   * bindings: {
   *   DB: mainDb,
   *   CACHE: sessionCache,
   *   API: apiWorker.asService(),
   * }
   * ```
   */
  bindings?: BindingMap;

  /**
   * URL route patterns that direct HTTP traffic to this Worker.
   *
   * Patterns follow Cloudflare's route matching syntax. A route must
   * include a zone (domain) that is active in your Cloudflare account.
   *
   * @see https://developers.cloudflare.com/workers/configuration/routing/routes/
   * @example ["api.acme.com/*", "acme.com/api/*"]
   */
  routes?: string[];

  /**
   * Custom domain names assigned to this Worker.
   *
   * Unlike routes, custom domains are managed entirely by Cloudflare
   * (DNS + SSL provisioned automatically).
   *
   * @see https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
   * @example ["api.acme.com"]
   */
  customDomains?: string[];

  /**
   * Cron Triggers that invoke this Worker on a schedule.
   *
   * Each cron trigger calls the Worker's `scheduled` event handler.
   *
   * @see https://developers.cloudflare.com/workers/configuration/cron-triggers/
   */
  crons?: CronConfig[];

  /**
   * Queue consumers attached to this Worker.
   *
   * Each consumer pulls messages from a Cloudflare Queue and delivers
   * them to the Worker's `queue` event handler.
   */
  consumers?: ConsumerConfig[];

  /**
   * Durable Object classes hosted within this Worker.
   *
   * Keys are the binding names, values configure the DO class.
   *
   * @example
   * ```ts
   * durableObjects: {
   *   SESSIONS: { className: "SessionDO", sqlite: true },
   * }
   * ```
   */
  durableObjects?: Record<string, DurableObjectClassConfig>;

  /**
   * Plain-text environment variables for this Worker.
   *
   * These are written into the generated wrangler.jsonc `vars` block
   * and available at runtime via `env.VAR_NAME`.
   *
   * For sensitive values, use `secrets` instead.
   */
  vars?: Record<string, string>;

  /**
   * Names of secrets required by this Worker.
   *
   * Secret values are never written to config files. They are provisioned
   * separately via `wrangler secret put` or the Cloudflare API.
   *
   * @example ["DATABASE_URL", "API_KEY", "JWT_SECRET"]
   */
  secrets?: string[];

  /**
   * Compatibility date for this Worker, overriding the app-level default.
   *
   * @see https://developers.cloudflare.com/workers/configuration/compatibility-dates/
   * @example "2026-04-01"
   */
  compatibilityDate?: string;

  /**
   * Compatibility flags for this Worker, overriding the app-level defaults.
   *
   * @see https://developers.cloudflare.com/workers/configuration/compatibility-flags/
   * @example ["nodejs_compat", "streams_enable_constructors"]
   */
  compatibilityFlags?: string[];

  /**
   * Smart Placement configuration.
   *
   * When enabled, Cloudflare automatically runs the Worker near the
   * back-end services it accesses, reducing latency to databases and
   * other origins.
   *
   * @see https://developers.cloudflare.com/workers/configuration/smart-placement/
   */
  placement?: PlacementConfig;

  /**
   * Resource limits for each Worker invocation.
   */
  limits?: WorkerLimits;

  /**
   * Enable Logpush for this Worker.
   *
   * When enabled, Worker logs are pushed to a configured Logpush
   * destination (e.g., R2, S3, Datadog).
   *
   * @default false
   * @see https://developers.cloudflare.com/workers/observability/logpush/
   */
  logpush?: boolean;

  /**
   * Observability and tracing settings for this Worker.
   *
   * @see https://developers.cloudflare.com/workers/observability/
   */
  observability?: ObservabilityConfig;

  /**
   * Custom build configuration.
   *
   * Use this when the Worker requires a pre-build step before Wrangler
   * bundles it (e.g., code generation, asset pipeline).
   */
  build?: BuildConfig;

  /**
   * Tail Workers that receive log events from this Worker.
   *
   * Specify the names of tail Worker services that should consume
   * this Worker's log output.
   *
   * @see https://developers.cloudflare.com/workers/observability/tail-workers/
   */
  tailConsumers?: string[];

  /**
   * Enable the Workers Browser Rendering API binding.
   *
   * When `true`, the Worker gets access to the Browser binding for
   * headless browser automation.
   *
   * @see https://developers.cloudflare.com/browser-rendering/
   */
  browser?: boolean;

  /**
   * Analytics Engine datasets bound to this Worker.
   *
   * Keys are binding names, values are dataset names.
   *
   * @see https://developers.cloudflare.com/analytics/analytics-engine/
   * @example { ANALYTICS: "my-dataset" }
   */
  analyticsEngineDatasets?: Record<string, string>;

  /**
   * mTLS certificate bindings for this Worker.
   *
   * Keys are binding names, values are certificate IDs.
   *
   * @see https://developers.cloudflare.com/workers/runtime-apis/bindings/mtls/
   */
  mtlsCertificates?: Record<string, string>;

  /**
   * Service bindings to other Workers.
   *
   * This is an alternative to declaring service bindings in the
   * `bindings` map. Keys are binding names, values are Worker names.
   *
   * @example { AUTH_SERVICE: "auth-worker" }
   */
  serviceBindings?: Record<string, string>;

  /**
   * Escape hatch for raw wrangler.jsonc configuration.
   *
   * Any properties set here are merged verbatim into the generated
   * wrangler.jsonc, allowing access to new or niche Wrangler features
   * that Levi does not yet have typed support for.
   *
   * Properties set here take highest priority — they override typed Levi
   * config in case of conflicts. This is your escape hatch.
   *
   * @example
   * ```ts
   * wrangler: {
   *   upload_source_maps: true,
   *   no_bundle: true,
   * }
   * ```
   */
  wrangler?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Vinext Assets Config
// ---------------------------------------------------------------------------

/**
 * Asset serving configuration for vinext Workers.
 *
 * Controls how static assets are served by the vinext framework,
 * including caching, routing behavior, and the asset directory.
 *
 * @see https://developers.cloudflare.com/workers/frameworks/framework-guides/vinext/
 */
export interface VinextAssetsConfig {
  /**
   * Directory containing the built static assets.
   *
   * Relative to the vinext project root. Levi resolves this
   * automatically based on vinext conventions, but it can be
   * overridden here.
   *
   * @default "dist/client"
   */
  directory?: string;

  /**
   * Binding name for the assets in the Worker environment.
   *
   * @default "ASSETS"
   */
  binding?: string;

  /**
   * Enable HTML handling rules.
   *
   * When enabled, requests for `/page` will try `/page.html` and
   * `/page/index.html` before falling through to the Worker.
   *
   * @default true
   */
  htmlHandling?: "auto-trailing-slash" | "force-trailing-slash" | "drop-trailing-slash" | "none";

  /**
   * Behavior when no matching asset is found.
   *
   * - `"single-page-application"` — serve `index.html` for all unmatched paths.
   * - `"404-page"` — serve a `404.html` page.
   * - `"none"` — return a 404 response with no body.
   *
   * @default "none"
   */
  notFoundHandling?: "single-page-application" | "404-page" | "none";

  /**
   * Run the Worker script for all requests, even those matching a static
   * asset. Useful when you need to add headers or transform responses.
   *
   * @default false
   */
  runWorkerFirst?: boolean;
}

// ---------------------------------------------------------------------------
// Vinext Server Config
// ---------------------------------------------------------------------------

/**
 * Server-side rendering and runtime configuration specific to vinext.
 */
export interface VinextServerConfig {
  /**
   * Enable server-side rendering.
   *
   * When `false`, vinext operates in SPA mode — only static assets are
   * served and the Worker handles API routes only.
   *
   * @default true
   */
  ssr?: boolean;

  /**
   * Preset for the vinext build output.
   *
   * @default "cloudflare-workers"
   */
  preset?: string;

  /**
   * Base URL path for the application.
   *
   * @default "/"
   * @example "/app/"
   */
  baseURL?: string;

  /**
   * Custom Vite configuration overrides passed to the vinext build.
   *
   * This is a passthrough to vinext's underlying Vite config.
   */
  vite?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Vinext Worker Options
// ---------------------------------------------------------------------------

/**
 * Extended Worker options for vinext framework Workers.
 *
 * Vinext is Cloudflare's Vite-based framework and receives first-class
 * support in Levi. When `framework: "vinext"` is set, these additional
 * options become available for configuring asset serving and SSR behavior.
 *
 * @example
 * ```ts
 * app.addWorker("web", {
 *   framework: "vinext",
 *   entrypoint: "./packages/web",
 *   assets: {
 *     htmlHandling: "auto-trailing-slash",
 *     notFoundHandling: "single-page-application",
 *   },
 *   server: { ssr: true },
 *   bindings: { API: apiWorker.asService() },
 * });
 * ```
 */
export interface VinextWorkerOptions extends WorkerOptions {
  /**
   * Must be `"vinext"` for vinext Worker options.
   */
  framework: "vinext";

  /**
   * Static asset serving configuration.
   *
   * Controls how vinext serves built client assets (JS, CSS, images)
   * and handles HTML routing (SPA fallback, trailing slashes, etc.).
   */
  assets?: VinextAssetsConfig;

  /**
   * Server-side rendering and vinext runtime configuration.
   */
  server?: VinextServerConfig;

  /**
   * Enable automatic KV-based asset caching for vinext.
   *
   * When enabled, Levi provisions a KV namespace and configures vinext
   * to cache static assets there for improved performance.
   *
   * @default false
   */
  assetsCaching?: boolean;

  /**
   * Enable automatic R2-based asset storage for vinext.
   *
   * When enabled, Levi provisions an R2 bucket for large static assets
   * and configures vinext to serve them from there.
   *
   * @default false
   */
  assetsStorage?: boolean;
}
