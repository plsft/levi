import type {
  AppOptions,
  SecretRef,
  VarRef,
  D1Options,
  KVOptions,
  R2Options,
  QueueOptions,
  DurableObjectOptions,
  VectorizeOptions,
  HyperdriveOptions,
  WorkersAIOptions,
  AIGatewayOptions,
  DomainOptions,
  WorkerOptions,
  WorkflowOptions,
  ContainerOptions,
  PipelineOptions,
  BuildResult,
} from "./types/index.js";

import { AppGraph } from "./graph.js";

import { WorkerResource } from "./resources/worker.js";
import { D1Resource } from "./resources/d1.js";
import { KVResource } from "./resources/kv.js";
import { R2Resource } from "./resources/r2.js";
import { QueueResource } from "./resources/queue.js";
import { DurableObjectResource } from "./resources/durable-object.js";
import { VectorizeResource } from "./resources/vectorize.js";
import { HyperdriveResource } from "./resources/hyperdrive.js";
import { WorkersAIResource, AIGatewayResource } from "./resources/ai.js";
import { DomainResource } from "./resources/domain.js";
import { WorkflowResource } from "./resources/workflow.js";
import { TailWorkerResource } from "./resources/tail-worker.js";
import { MTLSResource } from "./resources/mtls.js";
import { ContainerResource } from "./resources/container.js";
import { PipelineResource } from "./resources/pipeline.js";

import type { TailWorkerOptions } from "./resources/tail-worker.js";
import type { MTLSOptions } from "./resources/mtls.js";

import { AnalyticsEngineResource } from "./resources/analytics-engine.js";
import { BrowserRenderingResource } from "./resources/browser-rendering.js";
import { RateLimitResource } from "./resources/rate-limit.js";
import { SecretsStoreSecretResource } from "./resources/secrets-store-secret.js";
import { DispatchNamespaceResource } from "./resources/dispatch-namespace.js";
import { EmailResource } from "./resources/email.js";
import { EdgeRuleResource } from "./resources/edge-rule.js";
import { SnippetResource } from "./resources/snippet.js";

import type { AnalyticsEngineOptions } from "./types/analytics-engine.js";
import type { BrowserRenderingOptions } from "./types/browser-rendering.js";
import type { RateLimitOptions } from "./types/rate-limit.js";
import type { SecretsStoreSecretOptions } from "./types/secrets-store.js";
import type { DispatchNamespaceOptions } from "./types/dispatch-namespace.js";
import type { EmailOptions } from "./types/email.js";
import type {
  RedirectRuleOptions,
  CacheRuleOptions,
  WAFRuleOptions,
  RateLimitRuleOptions,
  HeaderRuleOptions,
  SnippetOptions,
  EdgeRuleOptionsUnion,
  EdgeRuleKind,
} from "./types/edge-rules.js";

import { logger } from "./utils/logger.js";

/**
 * The main builder class for a Levi Cloudflare application.
 *
 * `FlareApp` is the entry point for declaring your entire
 * Cloudflare topology in a single TypeScript file (`levi.app.ts`).
 * It provides typed `add*()` methods for every Cloudflare primitive,
 * builds an in-memory dependency graph, validates it, and produces
 * a {@link BuildResult} that downstream generators consume.
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
 * const api = app.addWorker("api", {
 *   entrypoint: "./src/index.ts",
 *   bindings: { DB: db },
 * });
 *
 * export default app;
 * ```
 */
export class FlareApp {
  /** Logical name for the application (used as a prefix in generated configs). */
  readonly name: string;

  /** Merged application options. */
  readonly options: AppOptions;

  /** The in-memory resource dependency graph. */
  readonly graph: AppGraph;

  /** Accumulated secrets (name only — values are never stored). */
  private readonly _secrets: Map<string, SecretRef> = new Map();

  /** Accumulated plain-text vars. */
  private readonly _vars: Map<string, VarRef> = new Map();

  /** Monotonic declaration counter for edge rules and snippets (ordering contract). */
  private _edgeDeclarationCounter = 0;

  constructor(name: string, options?: Partial<AppOptions>) {
    this.name = name;
    this.options = {
      compatibility_date: options?.compatibility_date,
      compatibility_flags: options?.compatibility_flags,
      account: options?.account,
      environments: options?.environments,
      basePath: options?.basePath,
      outDir: options?.outDir ?? ".levi",
      defaultZone: options?.defaultZone,
    };
    this.graph = new AppGraph();
  }

  /**
   * Get the application's dependency graph.
   *
   * Convenience method used by CLI commands. Equivalent to accessing
   * the `graph` property directly.
   */
  getGraph(): AppGraph {
    return this.graph;
  }

  // ─── Storage & Data ──────────────────────────────────────────

  /**
   * Add a D1 SQL database to the application.
   */
  addD1(name: string, options?: D1Options): D1Resource {
    const resource = new D1Resource(name, options ?? {});
    this.graph.add(resource);
    return resource;
  }

  /**
   * Add a KV namespace to the application.
   */
  addKV(name: string, options?: KVOptions): KVResource {
    const resource = new KVResource(name, options ?? {});
    this.graph.add(resource);
    return resource;
  }

  /**
   * Add an R2 object storage bucket to the application.
   */
  addR2(name: string, options?: R2Options): R2Resource {
    const resource = new R2Resource(name, options ?? {});
    this.graph.add(resource);
    return resource;
  }

  /**
   * Add a Queue to the application.
   */
  addQueue(name: string, options?: QueueOptions): QueueResource {
    const resource = new QueueResource(name, options ?? {});
    this.graph.add(resource);
    return resource;
  }

  /**
   * Add a Hyperdrive configuration to the application.
   */
  addHyperdrive(name: string, options: HyperdriveOptions): HyperdriveResource {
    const resource = new HyperdriveResource(name, options);
    this.graph.add(resource);
    return resource;
  }

  /**
   * Add a Vectorize index to the application.
   */
  addVectorize(name: string, options: VectorizeOptions): VectorizeResource {
    const resource = new VectorizeResource(name, options);
    this.graph.add(resource);
    return resource;
  }

  // ─── Compute ─────────────────────────────────────────────────

  /**
   * Add a Worker to the application.
   *
   * This is the most common resource type. The worker's `bindings` map
   * is scanned to automatically discover dependencies on other resources
   * and add edges to the graph.
   */
  addWorker(name: string, options: WorkerOptions): WorkerResource {
    const resource = new WorkerResource(name, options);
    this.graph.add(resource);
    return resource;
  }

  /**
   * Add a Durable Object class to the application.
   */
  addDurableObject(name: string, options: DurableObjectOptions): DurableObjectResource {
    const resource = new DurableObjectResource(name, options);
    this.graph.add(resource);
    return resource;
  }

  /**
   * Add a Workflow to the application.
   */
  addWorkflow(name: string, options: WorkflowOptions): WorkflowResource {
    const resource = new WorkflowResource(name, options);
    this.graph.add(resource);
    return resource;
  }

  /**
   * Add a Tail Worker for observability/logging.
   */
  addTailWorker(name: string, options: TailWorkerOptions): TailWorkerResource {
    const resource = new TailWorkerResource(name, options);
    this.graph.add(resource);
    return resource;
  }

  // ─── AI ──────────────────────────────────────────────────────

  /**
   * Add a Workers AI binding to the application.
   *
   * Only one Workers AI binding is typically needed per app. The
   * returned resource can be passed to any worker's bindings map.
   */
  addWorkersAI(options?: WorkersAIOptions): WorkersAIResource {
    const name = options?.binding ?? "workers-ai";
    const resource = new WorkersAIResource(name, options ?? {});
    this.graph.add(resource);
    return resource;
  }

  /**
   * Add an AI Gateway to the application.
   */
  addAIGateway(name: string, options: AIGatewayOptions): AIGatewayResource {
    const resource = new AIGatewayResource(name, options);
    this.graph.add(resource);
    return resource;
  }

  // ─── Network ─────────────────────────────────────────────────

  /**
   * Add a custom domain to the application.
   */
  addDomain(name: string, options?: DomainOptions): DomainResource {
    const resource = new DomainResource(name, options ?? {});
    this.graph.add(resource);
    return resource;
  }

  /**
   * Add an mTLS certificate binding to the application.
   */
  addMTLS(name: string, options: MTLSOptions): MTLSResource {
    const resource = new MTLSResource(name, options);
    this.graph.add(resource);
    return resource;
  }

  // ─── Beta ───────────────────────────────────────────────────

  /**
   * Add a Container to the application.
   * Containers run Docker images alongside Workers via Durable Objects.
   * @beta — Cloudflare Containers is in open beta.
   */
  addContainer(name: string, options: ContainerOptions): ContainerResource {
    const resource = new ContainerResource(name, options);
    this.graph.add(resource);
    return resource;
  }

  /**
   * Add a Pipeline stream binding to the application.
   * Pipelines ingest, transform, and deliver data to R2.
   * @beta — Cloudflare Pipelines is in open beta.
   */
  addPipeline(name: string, options: PipelineOptions): PipelineResource {
    const resource = new PipelineResource(name, options);
    this.graph.add(resource);
    return resource;
  }

  // ─── Observability & Platform ────────────────────────────────

  /**
   * Add a Workers Analytics Engine dataset to the application.
   *
   * Datasets are created automatically on first write — nothing is
   * provisioned. The binding exposes `writeDataPoint()` in the worker.
   */
  addAnalyticsEngine(
    name: string,
    options?: AnalyticsEngineOptions,
  ): AnalyticsEngineResource {
    const resource = new AnalyticsEngineResource(name, options ?? {});
    this.graph.add(resource);
    return resource;
  }

  /**
   * Add a Browser Rendering binding to the application.
   *
   * Like Workers AI, only one Browser Rendering binding is typically
   * needed per app; pass the returned resource to any worker's bindings.
   */
  addBrowserRendering(options?: BrowserRenderingOptions): BrowserRenderingResource {
    const name = "browser-rendering";
    const resource = new BrowserRenderingResource(name, options ?? {});
    this.graph.add(resource);
    return resource;
  }

  /**
   * Add a Workers rate limiting binding to the application.
   *
   * Provides a fast per-colo counter with a `limit({ key })` API.
   * Workers sharing the same namespace ID share counters.
   */
  addRateLimit(name: string, options: RateLimitOptions): RateLimitResource {
    const resource = new RateLimitResource(name, options);
    this.graph.add(resource);
    return resource;
  }

  /**
   * Add a Secrets Store secret binding to the application.
   *
   * `levi provision` creates the store (if needed) and patches its ID
   * into the generated config. Secret values are set separately via
   * `wrangler secrets-store secret create`.
   */
  addSecretsStoreSecret(
    name: string,
    options?: SecretsStoreSecretOptions,
  ): SecretsStoreSecretResource {
    const resource = new SecretsStoreSecretResource(name, options ?? {});
    this.graph.add(resource);
    return resource;
  }

  /**
   * Add a Workers for Platforms dispatch namespace to the application.
   *
   * Requires a Workers for Platforms subscription. The dispatch worker
   * binds to the namespace and routes requests to tenant workers via
   * `env.BINDING.get(scriptName)`.
   */
  addDispatchNamespace(
    name: string,
    options?: DispatchNamespaceOptions,
  ): DispatchNamespaceResource {
    const resource = new DispatchNamespaceResource(name, options ?? {});
    this.graph.add(resource);
    return resource;
  }

  /**
   * Add an Email sending binding (`send_email`) to the application.
   *
   * `levi provision` can enable Email Routing on the zone and register
   * the destination addresses for verification.
   */
  addEmail(name: string, options?: EmailOptions): EmailResource {
    const resource = new EmailResource(name, options ?? {});
    this.graph.add(resource);
    return resource;
  }

  // ─── Edge Rules ──────────────────────────────────────────────

  /** Internal: create and register an edge rule resource. */
  private addEdgeRule(
    name: string,
    kind: EdgeRuleKind,
    options: EdgeRuleOptionsUnion,
  ): EdgeRuleResource {
    const resource = new EdgeRuleResource(
      name,
      kind,
      options,
      this._edgeDeclarationCounter++,
    );
    this.graph.add(resource);
    return resource;
  }

  /**
   * Add a URL redirect rule at the zone edge.
   *
   * Compiled into the zone's `http_request_dynamic_redirect` phase and
   * synced by `levi provision`. Supports wildcard captures:
   *
   * @example
   * ```ts
   * app.addRedirect("www-to-apex", {
   *   from: "https://www.example.com/*",
   *   to: "https://example.com/${1}",
   *   status: 301,
   * });
   * ```
   */
  addRedirect(name: string, options: RedirectRuleOptions): EdgeRuleResource {
    return this.addEdgeRule(name, "redirect", options);
  }

  /**
   * Add a cache rule at the zone edge (`http_request_cache_settings`).
   *
   * @example
   * ```ts
   * app.addCacheRule("static-assets", {
   *   match: { pathStartsWith: "/assets/" },
   *   cache: true,
   *   edgeTtl: 86400,
   * });
   * ```
   */
  addCacheRule(name: string, options: CacheRuleOptions): EdgeRuleResource {
    return this.addEdgeRule(name, "cache", options);
  }

  /**
   * Add a WAF custom rule at the zone edge (`http_request_firewall_custom`).
   *
   * Security predicates are written explicitly in the Rules language —
   * there is deliberately no expression sugar here.
   */
  addWAFRule(name: string, options: WAFRuleOptions): EdgeRuleResource {
    return this.addEdgeRule(name, "waf", options);
  }

  /**
   * Add an HTTP rate limiting rule at the zone edge (`http_ratelimit`).
   *
   * Blocks abusive traffic before it reaches your workers — distinct
   * from the Workers rate limiting *binding* (`addRateLimit`).
   */
  addRateLimitRule(name: string, options: RateLimitRuleOptions): EdgeRuleResource {
    return this.addEdgeRule(name, "rate-limit", options);
  }

  /**
   * Add a header transform rule at the zone edge.
   *
   * `direction: "request"` modifies headers sent to the origin;
   * `direction: "response"` modifies headers returned to visitors.
   */
  addHeaderRule(name: string, options: HeaderRuleOptions): EdgeRuleResource {
    const kind: EdgeRuleKind =
      options.direction === "request" ? "request-header" : "response-header";
    return this.addEdgeRule(name, kind, options);
  }

  /**
   * Add a Cloudflare Snippet — a lightweight JS module that runs at the
   * zone edge before Workers, with a rule controlling when it executes.
   */
  addSnippet(name: string, options: SnippetOptions): SnippetResource {
    const resource = new SnippetResource(
      name,
      options,
      this._edgeDeclarationCounter++,
    );
    this.graph.add(resource);
    return resource;
  }

  // ─── Config ──────────────────────────────────────────────────

  /**
   * Create a reference to a secret.
   *
   * Secret values are never written into generated configs. The name
   * is recorded so that `levi provision` can prompt for or set the
   * value via `wrangler secret put`.
   *
   * @param name - The secret name as it appears in Cloudflare.
   */
  secret(name: string): SecretRef {
    const ref: SecretRef = { __type: "secret", name };
    this._secrets.set(name, ref);
    return ref;
  }

  /**
   * Create a reference to a plain-text environment variable.
   *
   * The value is written into the generated `wrangler.jsonc` `vars` block.
   *
   * @param name - The variable name (binding key).
   * @param value - The variable value.
   */
  var(name: string, value: string): VarRef {
    const ref: VarRef = { __type: "var", name, value };
    this._vars.set(name, ref);
    return ref;
  }

  /** All registered secrets (name -> SecretRef). */
  get secrets(): ReadonlyMap<string, SecretRef> {
    return this._secrets;
  }

  /** All registered vars (name -> VarRef). */
  get vars(): ReadonlyMap<string, VarRef> {
    return this._vars;
  }

  // ─── Environment ─────────────────────────────────────────────

  /**
   * The current environment name, derived from `LEVI_ENV` or
   * `CLOUDFLARE_ENV` environment variables. Returns `undefined`
   * when no environment is specified (default/production context).
   */
  get env(): string | undefined {
    return process.env.LEVI_ENV ?? process.env.CLOUDFLARE_ENV ?? undefined;
  }

  // ─── Build ───────────────────────────────────────────────────

  /**
   * Validate the application graph and return a {@link BuildResult}.
   *
   * This method:
   * 1. Validates that all dependency edges point to existing resources.
   * 2. Checks for circular dependencies.
   * 3. Computes a topological sort (deployment order).
   * 4. Returns a result object containing the serialized graph and
   *    any warnings.
   *
   * @throws {Error} If validation fails (circular deps, missing resources).
   */
  build(): BuildResult {
    const warnings: string[] = [];

    // Warn if no workers are declared (the app won't do anything)
    const workers = this.graph.getWorkers();
    if (workers.length === 0) {
      warnings.push(
        "No workers declared. The application graph has no compute resources.",
      );
    }

    // Warn if compatibility_date is not set
    if (!this.options.compatibility_date) {
      warnings.push(
        "No compatibility_date set on the app. " +
          "Each worker will need its own compatibilityDate or Wrangler will use its default.",
      );
    }

    // Validate the graph (throws on cycles or dangling deps)
    this.graph.validate();

    // Compute deployment order
    const sorted = this.graph.topologicalSort();
    const deployOrder = sorted.map((r) => r.name);

    // Log warnings
    for (const warning of warnings) {
      logger.warn(warning);
    }

    logger.success(
      `Build complete: ${this.graph.size} resources, ${workers.length} workers.`,
    );

    return {
      success: true,
      graph: this.graph.serialize(),
      deployOrder,
      warnings,
    };
  }
}
