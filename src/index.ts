/**
 * @flarefound/levi — The AppHost Framework for Cloudflare
 *
 * Declare your entire Cloudflare application topology in a single
 * typed TypeScript file. Levi generates wrangler.jsonc configs,
 * provisions resources, and orchestrates deployment.
 *
 * @example
 * ```ts
 * import { FlareApp } from "@flarefound/levi";
 *
 * const app = new FlareApp("my-app", {
 *   compatibility_date: "2026-04-01",
 * });
 *
 * const db = app.addD1("main-db");
 * const web = app.addWorker("web", {
 *   framework: "vinext",
 *   entrypoint: "./src",
 *   bindings: { DB: db },
 * });
 *
 * export default app;
 * ```
 *
 * @module
 */

// ── Core ───────────────────────────────────────────────────────
export { FlareApp } from "./app.js";
export { AppGraph } from "./graph.js";
export { WranglerGenerator } from "./generators/wrangler.js";
export { loadAppFile, loadApp } from "./loader.js";

// ── Resources ──────────────────────────────────────────────────
export { Resource, ServiceBindingRef } from "./resources/base.js";
export { WorkerResource } from "./resources/worker.js";
export { D1Resource } from "./resources/d1.js";
export { KVResource } from "./resources/kv.js";
export { R2Resource } from "./resources/r2.js";
export { QueueResource } from "./resources/queue.js";
export { DurableObjectResource } from "./resources/durable-object.js";
export { VectorizeResource } from "./resources/vectorize.js";
export { HyperdriveResource } from "./resources/hyperdrive.js";
export { WorkersAIResource, AIGatewayResource } from "./resources/ai.js";
export { DomainResource } from "./resources/domain.js";
export { WorkflowResource } from "./resources/workflow.js";
export { TailWorkerResource } from "./resources/tail-worker.js";
export { MTLSResource } from "./resources/mtls.js";
export { SecretResource } from "./resources/secret.js";
export { ContainerResource } from "./resources/container.js";
export { PipelineResource } from "./resources/pipeline.js";

// ── Frameworks ─────────────────────────────────────────────────
export {
  frameworkPresets,
  frameworkChoices,
  defaultFrameworkPreset,
  getFrameworkPreset,
} from "./frameworks/index.js";
export { getVinextConfig, isVinextProject } from "./frameworks/vinext.js";

// ── Cloudflare API (DNS provisioning) ──────────────────────────
export {
  resolveAuth,
  findZone,
  listDnsRecords,
  createDnsRecord,
  updateDnsRecord,
  deleteDnsRecord,
  provisionDomain,
  teardownDomain,
  getSslMode,
  setSslMode,
} from "./cloudflare/index.js";
export type {
  CloudflareAuth,
  DnsRecord,
  DnsRecordType,
  CreateDnsRecordInput,
  ZoneInfo,
  SslMode,
  DnsProvisionResult,
} from "./cloudflare/index.js";

// ── Types (re-export for convenience) ──────────────────────────
export type {
  // Common
  ResourceType,
  Framework,
  SecretRef,
  VarRef,
  CronConfig,
  ConsumerConfig,
  BindingMap,
  EnvironmentConfig,
  AppOptions,

  // Worker
  WorkerOptions,
  VinextWorkerOptions,
  VinextAssetsConfig,
  VinextServerConfig,
  DurableObjectClassConfig,
  PlacementConfig,
  WorkerLimits,
  ObservabilityConfig,
  BuildConfig,

  // Storage & Data
  D1Options,
  KVOptions,
  R2Options,
  R2LifecycleRule,
  QueueOptions,
  DurableObjectOptions,
  VectorizeOptions,
  VectorizeMetric,
  HyperdriveOptions,
  HyperdriveCachingConfig,

  // AI
  WorkersAIOptions,
  AIGatewayOptions,
  AIGatewayRateLimitConfig,
  AIGatewayCachingConfig,
  AIGatewayLogCollectionConfig,

  // Network
  DomainOptions,
  SSLMode,
  WorkflowOptions,

  // Beta
  ContainerOptions,
  ContainerInstanceType,
  PipelineOptions,

  // Build & Config
  BuildResult,
  WorkerFramework,
  WranglerConfig,
} from "./types/index.js";

// ── Resource option types (defined locally in resources) ────────
export type { TailWorkerOptions } from "./resources/tail-worker.js";
export type { MTLSOptions } from "./resources/mtls.js";
export type { SecretOptions } from "./resources/secret.js";

// ── Framework preset type ──────────────────────────────────────
export type { FrameworkPreset } from "./frameworks/index.js";
export type { VinextOptions } from "./frameworks/vinext.js";
