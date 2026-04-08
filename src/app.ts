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

  constructor(name: string, options?: Partial<AppOptions>) {
    this.name = name;
    this.options = {
      compatibility_date: options?.compatibility_date,
      compatibility_flags: options?.compatibility_flags,
      account: options?.account,
      environments: options?.environments,
      basePath: options?.basePath,
      outDir: options?.outDir ?? ".levi",
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
