/**
 * Levi type definitions — the intellisense surface for the AppHost framework for Cloudflare.
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
  QueueResourceShape,
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

// ── Container (beta) ───────────────────────────────────────────
export type { ContainerInstanceType, ContainerOptions } from "./container.js";

// ── Pipeline (beta) ────────────────────────────────────────────
export type { PipelineOptions } from "./pipeline.js";

// ── Analytics Engine ───────────────────────────────────────────
export type { AnalyticsEngineOptions } from "./analytics-engine.js";

// ── Browser Rendering ──────────────────────────────────────────
export type { BrowserRenderingOptions } from "./browser-rendering.js";

// ── Rate Limiting ──────────────────────────────────────────────
export type { RateLimitOptions } from "./rate-limit.js";

// ── Secrets Store ──────────────────────────────────────────────
export type { SecretsStoreSecretOptions } from "./secrets-store.js";

// ── Dispatch Namespace (Workers for Platforms) ─────────────────
export type {
  DispatchNamespaceOutbound,
  DispatchNamespaceOptions,
} from "./dispatch-namespace.js";

// ── Email ──────────────────────────────────────────────────────
export type { EmailOptions } from "./email.js";

// ── Edge Rules & Snippets ──────────────────────────────────────
export type {
  EdgeRuleKind,
  RulesetPhase,
  EdgeRuleBaseOptions,
  MatchSugar,
  RedirectRuleOptions,
  CacheTtl,
  CacheRuleOptions,
  WAFRuleOptions,
  RateLimitRuleOptions,
  HeaderOp,
  HeaderRuleOptions,
  EdgeRuleOptionsUnion,
  SnippetOptions,
  ManifestRule,
  ManifestSnippet,
  ZoneRulesManifest,
} from "./edge-rules.js";

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
  WranglerRateLimitBinding,
  WranglerSecretsStoreSecretBinding,
  WranglerDispatchNamespaceBinding,
  WranglerSendEmailBinding,
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
