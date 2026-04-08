/**
 * Levi type definitions — the intellisense surface for the Cloudflare AppHost framework.
 *
 * This barrel module re-exports all types from the Levi type system.
 * Import from `@flarefound/levi/types` or individual submodules.
 *
 * @module
 * @example
 * ```ts
 * import type { WorkerOptions, D1Options, WranglerConfig } from "@flarefound/levi/types";
 * ```
 */

// ── Common ──────────────────────────────────────────────────────
export type {
  ResourceType,
  Framework,
  SecretRef,
  VarRef,
  CronConfig,
  Resource,
  QueueResource,
  ConsumerConfig,
  BindingMap,
  EnvironmentConfig,
  AppOptions,
} from "./common.js";

// ── Worker ──────────────────────────────────────────────────────
export type {
  DurableObjectClassConfig,
  PlacementConfig,
  WorkerLimits,
  ObservabilityConfig,
  BuildConfig,
  WorkerOptions,
  VinextAssetsConfig,
  VinextServerConfig,
  VinextWorkerOptions,
} from "./worker.js";

// ── D1 ──────────────────────────────────────────────────────────
export type { D1Options } from "./d1.js";

// ── KV ──────────────────────────────────────────────────────────
export type { KVOptions } from "./kv.js";

// ── R2 ──────────────────────────────────────────────────────────
export type { R2LifecycleRule, R2Options } from "./r2.js";

// ── Queue ───────────────────────────────────────────────────────
export type { QueueOptions } from "./queue.js";

// ── Durable Object ──────────────────────────────────────────────
export type { DurableObjectOptions } from "./durable-object.js";

// ── Vectorize ───────────────────────────────────────────────────
export type { VectorizeMetric, VectorizeOptions } from "./vectorize.js";

// ── Hyperdrive ──────────────────────────────────────────────────
export type {
  HyperdriveCachingConfig,
  HyperdriveOptions,
} from "./hyperdrive.js";

// ── AI ──────────────────────────────────────────────────────────
export type {
  WorkersAIOptions,
  AIGatewayRateLimitConfig,
  AIGatewayCachingConfig,
  AIGatewayLogCollectionConfig,
  AIGatewayOptions,
} from "./ai.js";

// ── Domain ──────────────────────────────────────────────────────
export type { SSLMode, DomainOptions } from "./domain.js";

// ── Workflow ────────────────────────────────────────────────────
export type { WorkflowOptions } from "./workflow.js";

// ── Supplementary ──────────────────────────────────────────────
export type { WorkerFramework, BuildResult } from "./resources.js";

// ── Wrangler Config ─────────────────────────────────────────────
export type {
  WranglerD1Binding,
  WranglerKVBinding,
  WranglerR2Binding,
  WranglerQueueProducer,
  WranglerQueueConsumer,
  WranglerQueuesConfig,
  WranglerDurableObjectBinding,
  WranglerDurableObjectMigration,
  WranglerDurableObjectsConfig,
  WranglerVectorizeBinding,
  WranglerHyperdriveBinding,
  WranglerServiceBinding,
  WranglerAnalyticsEngineBinding,
  WranglerMTLSBinding,
  WranglerAIBinding,
  WranglerBrowserBinding,
  WranglerWorkflowBinding,
  WranglerRoute,
  WranglerCronTrigger,
  WranglerTailConsumer,
  WranglerTailProducer,
  WranglerPlacement,
  WranglerLimits,
  WranglerObservability,
  WranglerBuild,
  WranglerAssets,
  WranglerEnvironment,
  WranglerConfig,
} from "./wrangler.js";
