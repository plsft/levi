import type { WranglerConfig, WorkerOptions } from "../types/index.js";
import type { FlareApp } from "../app.js";
import { ServiceBindingRef } from "../resources/base.js";
import { WorkerResource } from "../resources/worker.js";
import { D1Resource } from "../resources/d1.js";
import { KVResource } from "../resources/kv.js";
import { R2Resource } from "../resources/r2.js";
import { QueueResource } from "../resources/queue.js";
import { DurableObjectResource } from "../resources/durable-object.js";
import { VectorizeResource } from "../resources/vectorize.js";
import { HyperdriveResource } from "../resources/hyperdrive.js";
import { WorkersAIResource, AIGatewayResource } from "../resources/ai.js";
import { MTLSResource } from "../resources/mtls.js";
import { WorkflowResource } from "../resources/workflow.js";
import { ContainerResource } from "../resources/container.js";
import { PipelineResource } from "../resources/pipeline.js";

/**
 * Generates valid `wrangler.jsonc` content from the Levi app graph.
 *
 * Each worker in the graph gets its own fully resolved wrangler config.
 * The generator inspects every binding attached to the worker and emits
 * the correct wrangler binding section (d1_databases, kv_namespaces,
 * services, etc.).
 *
 * @example
 * ```ts
 * const gen = new WranglerGenerator(app);
 * const configs = gen.generateAll();
 *
 * for (const [name, config] of configs) {
 *   const content = WranglerGenerator.serialize(config);
 *   await writeOutput(`.levi/workers/${name}/wrangler.jsonc`, content);
 * }
 * ```
 */
export class WranglerGenerator {
  /** Tracks the current worker being generated (for path resolution). */
  private currentWorkerName = "";

  constructor(private app: FlareApp) {}

  // ─── Path Resolution ────────────────────────────────────────

  /**
   * Resolve a project-relative path to be relative to the wrangler
   * config file location.
   *
   * Config files live at `<outDir>/workers/<name>/wrangler.jsonc`.
   * Wrangler resolves paths like `main` and `migrations_dir` relative
   * to the config file. So we need to prepend `../../../` (or more
   * `../` segments depending on outDir depth) to get back to the
   * project root.
   *
   * Handles: `./src/index.ts`, `src/index.ts`, `../shared/lib.ts`,
   * and absolute paths (returned as-is).
   */
  private resolvePathForConfig(
    projectRelativePath: string,
    workerName: string,
  ): string {
    // Normalize separators to forward slashes
    let p = projectRelativePath.replace(/\\/g, "/");

    // Absolute paths are returned as-is
    if (p.startsWith("/") || /^[A-Za-z]:/.test(p)) {
      return p;
    }

    // Strip leading ./ if present
    if (p.startsWith("./")) {
      p = p.slice(2);
    }

    // Compute the depth of the config file relative to project root.
    // Config lives at: <outDir>/workers/<workerName>/wrangler.jsonc
    // We need to go up: <outDir depth> + 2 (for "workers/<name>")
    const outDir = (this.app.options.outDir ?? ".levi").replace(/\\/g, "/");
    const outDirParts = outDir.split("/").filter((s) => s && s !== ".");
    const depth = outDirParts.length + 2; // +2 for workers/<name>
    const prefix = "../".repeat(depth);

    return `${prefix}${p}`;
  }

  // ─── Public API ──────────────────────────────────────────────

  /**
   * Generate a complete wrangler config for a single worker.
   */
  generateForWorker(worker: WorkerResource): WranglerConfig {
    const opts = worker.options;
    const appOpts = this.app.options;
    this.currentWorkerName = worker.name;

    // Start with the base config
    const config: WranglerConfig = {
      name: worker.name,
    };

    // Entry point — resolved relative to the config file location
    if (opts.entrypoint) {
      config.main = this.resolvePathForConfig(opts.entrypoint, worker.name);
    }

    // Account ID
    if (appOpts.account) {
      config.account_id = appOpts.account;
    }

    // Compatibility — worker overrides app-level
    config.compatibility_date =
      opts.compatibilityDate ?? appOpts.compatibility_date;
    if (opts.compatibilityFlags ?? appOpts.compatibility_flags) {
      config.compatibility_flags =
        opts.compatibilityFlags ?? appOpts.compatibility_flags;
    }

    // Process bindings
    this.processBindings(config, opts);

    // Queue consumers (separate from bindings — attached to worker)
    this.processConsumers(config, opts);

    // Routes
    if (opts.routes && opts.routes.length > 0) {
      config.routes = opts.routes;
    }

    // Cron triggers
    if (opts.crons && opts.crons.length > 0) {
      config.triggers = {
        crons: opts.crons.map((c) => c.pattern),
      };
    }

    // Placement
    if (opts.placement) {
      config.placement = opts.placement;
    }

    // Limits
    if (opts.limits) {
      config.limits = {};
      if (opts.limits.cpuMs !== undefined) {
        config.limits.cpu_ms = opts.limits.cpuMs;
      }
      if (opts.limits.memoryMb !== undefined) {
        config.limits.memory_mb = opts.limits.memoryMb;
      }
    }

    // Logpush
    if (opts.logpush !== undefined) {
      config.logpush = opts.logpush;
    }

    // Observability
    if (opts.observability) {
      config.observability = {
        enabled: opts.observability.enabled,
      };
      if (opts.observability.headSamplingRate !== undefined) {
        config.observability.head_sampling_rate =
          opts.observability.headSamplingRate;
      }
    }

    // Build
    if (opts.build) {
      config.build = {};
      if (opts.build.command) config.build.command = opts.build.command;
      if (opts.build.cwd) config.build.cwd = opts.build.cwd;
      if (opts.build.watchDir) config.build.watch_dir = opts.build.watchDir;
    }

    // App-level vars
    this.processAppVars(config);

    // Worker-level vars (override app-level)
    if (opts.vars) {
      if (!config.vars) config.vars = {};
      for (const [name, value] of Object.entries(opts.vars)) {
        config.vars[name] = value;
      }
    }

    // App-level secrets
    this.processAppSecrets(config);

    // Worker-level durableObjects (DO classes hosted by this worker)
    if (opts.durableObjects) {
      if (!config.durable_objects) config.durable_objects = { bindings: [] };
      for (const [bindingName, doConfig] of Object.entries(opts.durableObjects)) {
        config.durable_objects.bindings.push({
          name: bindingName,
          class_name: doConfig.className,
          script_name: doConfig.scriptName,
        });
      }
    }

    // vinext framework detection
    if (worker.isVinext()) {
      this.applyVinextDefaults(config, opts);
    }

    // Escape hatch: merge raw wrangler overrides last so they win
    if (opts.wrangler) {
      this.mergeEscapeHatch(config, opts.wrangler);
    }

    return config;
  }

  /**
   * Generate wrangler configs for every worker in the app graph.
   *
   * @returns A map of worker name -> generated config.
   */
  generateAll(): Map<string, WranglerConfig> {
    const configs = new Map<string, WranglerConfig>();
    const workers = this.app.graph.getWorkers();

    for (const worker of workers) {
      configs.set(worker.name, this.generateForWorker(worker));
    }

    return configs;
  }

  /**
   * Serialize a wrangler config to a JSONC string.
   *
   * Adds a header comment identifying the file as generated by Levi,
   * then pretty-prints the JSON with 2-space indentation.
   */
  static serialize(config: WranglerConfig): string {
    const header = [
      "// ─────────────────────────────────────────────────────────",
      "// Generated by Levi — DO NOT EDIT MANUALLY",
      "// Re-generate with: levi build",
      "// ─────────────────────────────────────────────────────────",
    ].join("\n");

    return `${header}\n${JSON.stringify(config, null, 2)}\n`;
  }

  // ─── Private Helpers ─────────────────────────────────────────

  /**
   * Inspect every entry in the worker's binding map and emit the
   * appropriate wrangler config section.
   */
  private processBindings(config: WranglerConfig, opts: WorkerOptions): void {
    if (!opts.bindings) return;

    for (const [bindingName, value] of Object.entries(opts.bindings)) {
      if (value instanceof ServiceBindingRef) {
        this.addServiceBinding(config, bindingName, value);
      } else if (value instanceof D1Resource) {
        this.addD1Binding(config, bindingName, value);
      } else if (value instanceof KVResource) {
        this.addKVBinding(config, bindingName, value);
      } else if (value instanceof R2Resource) {
        this.addR2Binding(config, bindingName, value);
      } else if (value instanceof QueueResource) {
        this.addQueueProducerBinding(config, bindingName, value);
      } else if (value instanceof DurableObjectResource) {
        this.addDurableObjectBinding(config, bindingName, value);
      } else if (value instanceof VectorizeResource) {
        this.addVectorizeBinding(config, bindingName, value);
      } else if (value instanceof HyperdriveResource) {
        this.addHyperdriveBinding(config, bindingName, value);
      } else if (value instanceof WorkersAIResource) {
        this.addWorkersAIBinding(config, bindingName, value);
      } else if (value instanceof AIGatewayResource) {
        this.addAIGatewayBinding(config, bindingName, value);
      } else if (value instanceof MTLSResource) {
        this.addMTLSBinding(config, bindingName, value);
      } else if (value instanceof WorkflowResource) {
        this.addWorkflowBinding(config, bindingName, value);
      } else if (value instanceof ContainerResource) {
        this.addContainerBinding(config, bindingName, value);
      } else if (value instanceof PipelineResource) {
        this.addPipelineBinding(config, bindingName, value);
      } else if (value instanceof WorkerResource) {
        // A WorkerResource used directly as a binding is treated as a
        // service binding (equivalent to calling .asService()).
        this.addServiceBinding(
          config,
          bindingName,
          new ServiceBindingRef(value.name),
        );
      }
      // Unknown binding types are silently skipped — the escape hatch
      // can be used to add them manually.
    }
  }

  // ── D1 ───────────────────────────────────────────────────────

  private addD1Binding(
    config: WranglerConfig,
    binding: string,
    resource: D1Resource,
  ): void {
    if (!config.d1_databases) config.d1_databases = [];

    config.d1_databases.push({
      binding,
      database_name: resource.name,
      database_id: resource.options.databaseId,
      migrations_dir: resource.options.migrations
        ? this.resolvePathForConfig(resource.options.migrations, this.currentWorkerName)
        : undefined,
    });
  }

  // ── KV ───────────────────────────────────────────────────────

  private addKVBinding(
    config: WranglerConfig,
    binding: string,
    resource: KVResource,
  ): void {
    if (!config.kv_namespaces) config.kv_namespaces = [];

    config.kv_namespaces.push({
      binding,
      id: resource.options.namespaceId,
      preview_id: resource.options.previewId,
    });
  }

  // ── R2 ───────────────────────────────────────────────────────

  private addR2Binding(
    config: WranglerConfig,
    binding: string,
    resource: R2Resource,
  ): void {
    if (!config.r2_buckets) config.r2_buckets = [];

    const entry: { binding: string; bucket_name: string; jurisdiction?: string } = {
      binding,
      bucket_name: resource.options.bucketName ?? resource.name,
    };

    if (resource.options.jurisdiction) {
      entry.jurisdiction = resource.options.jurisdiction;
    }

    config.r2_buckets.push(entry);
  }

  // ── Queue (producer) ─────────────────────────────────────────

  private addQueueProducerBinding(
    config: WranglerConfig,
    binding: string,
    resource: QueueResource,
  ): void {
    if (!config.queues) config.queues = {};
    if (!config.queues.producers) config.queues.producers = [];

    config.queues.producers.push({
      binding,
      queue: resource.name,
    });
  }

  // ── Durable Object ───────────────────────────────────────────

  private addDurableObjectBinding(
    config: WranglerConfig,
    binding: string,
    resource: DurableObjectResource,
  ): void {
    if (!config.durable_objects) config.durable_objects = { bindings: [] };

    const entry: {
      name: string;
      class_name: string;
      script_name?: string;
    } = {
      name: binding,
      class_name: resource.options.className,
    };

    if (resource.options.scriptName) {
      entry.script_name = resource.options.scriptName;
    }

    config.durable_objects.bindings.push(entry);

    // Wrangler requires a migrations section for DOs — generate it
    // automatically when the DO is locally defined (no scriptName).
    if (!resource.options.scriptName) {
      if (!config.migrations) config.migrations = [];

      if (resource.options.sqlite) {
        config.migrations.push({
          tag: `v1-${resource.options.className}`,
          new_sqlite_classes: [resource.options.className],
        });
      } else {
        config.migrations.push({
          tag: `v1-${resource.options.className}`,
          new_classes: [resource.options.className],
        });
      }
    }
  }

  // ── Vectorize ────────────────────────────────────────────────

  private addVectorizeBinding(
    config: WranglerConfig,
    binding: string,
    resource: VectorizeResource,
  ): void {
    if (!config.vectorize) config.vectorize = [];

    config.vectorize.push({
      binding,
      index_name: resource.name,
    });
  }

  // ── Hyperdrive ───────────────────────────────────────────────

  private addHyperdriveBinding(
    config: WranglerConfig,
    binding: string,
    resource: HyperdriveResource,
  ): void {
    if (!config.hyperdrive) config.hyperdrive = [];

    config.hyperdrive.push({
      binding,
      id: resource.options.configId ?? resource.name,
    });
  }

  // ── Workers AI ───────────────────────────────────────────────

  private addWorkersAIBinding(
    config: WranglerConfig,
    binding: string,
    _resource: WorkersAIResource,
  ): void {
    config.ai = { binding };
  }

  // ── AI Gateway ───────────────────────────────────────────────

  private addAIGatewayBinding(
    config: WranglerConfig,
    binding: string,
    resource: AIGatewayResource,
  ): void {
    config.ai = {
      binding,
      gateway: { id: resource.options.id },
    };
  }

  // ── Service Binding ──────────────────────────────────────────

  private addServiceBinding(
    config: WranglerConfig,
    binding: string,
    ref: ServiceBindingRef,
  ): void {
    if (!config.services) config.services = [];

    config.services.push({
      binding,
      service: ref.workerName,
    });
  }

  // ── mTLS ─────────────────────────────────────────────────────

  private addMTLSBinding(
    config: WranglerConfig,
    binding: string,
    resource: MTLSResource,
  ): void {
    if (!config.mtls_certificates) config.mtls_certificates = [];

    config.mtls_certificates.push({
      binding,
      certificate_id: resource.options.certificateId,
    });
  }

  // ── Workflow ──────────────────────────────────────────────────

  private addWorkflowBinding(
    config: WranglerConfig,
    binding: string,
    resource: WorkflowResource,
  ): void {
    if (!config.workflows) config.workflows = [];

    config.workflows.push({
      name: binding,
      binding,
      class_name: resource.options.className,
      script_name: resource.options.scriptName,
    });
  }

  // ── Container (beta) ─────────────────────────────────────────

  private addContainerBinding(config: WranglerConfig, binding: string, resource: ContainerResource): void {
    // Container definition
    if (!config.containers) config.containers = [];

    // Resolve local paths (Dockerfile, build context) relative to config location.
    // Remote image refs (containing ':' like docker.io/httpd:1) are left as-is.
    const isLocalImage = !resource.options.image.includes(":");
    const imagePath = isLocalImage
      ? this.resolvePathForConfig(resource.options.image, this.currentWorkerName)
      : resource.options.image;

    const container: Record<string, unknown> = {
      class_name: resource.options.className,
      image: imagePath,
    };
    if (resource.options.instanceType) container.instance_type = resource.options.instanceType;
    if (resource.options.maxInstances) container.max_instances = resource.options.maxInstances;
    if (resource.options.buildContext) {
      container.image_build_context = this.resolvePathForConfig(
        resource.options.buildContext, this.currentWorkerName,
      );
    }
    if (resource.options.buildArgs) container.image_vars = resource.options.buildArgs;

    config.containers.push(container as typeof config.containers[number]);

    // Durable Object binding (containers are backed by DOs)
    if (!config.durable_objects) config.durable_objects = { bindings: [] };
    config.durable_objects.bindings.push({
      name: binding,
      class_name: resource.options.className,
    });

    // Migration entry for the DO
    if (!config.migrations) config.migrations = [];
    config.migrations.push({
      tag: `v1-${resource.options.className}`,
      new_sqlite_classes: [resource.options.className],
    });
  }

  // ── Pipeline (beta) ─────────────────────────────────────────

  private addPipelineBinding(config: WranglerConfig, binding: string, resource: PipelineResource): void {
    if (!config.pipelines) config.pipelines = [];
    config.pipelines.push({
      binding,
      pipeline: resource.options.streamId,
    });
  }

  // ── Queue Consumers ──────────────────────────────────────────

  private processConsumers(
    config: WranglerConfig,
    opts: WorkerOptions,
  ): void {
    if (!opts.consumers || opts.consumers.length === 0) return;

    if (!config.queues) config.queues = {};
    if (!config.queues.consumers) config.queues.consumers = [];

    for (const consumer of opts.consumers) {
      const entry: {
        queue: string;
        max_batch_size?: number;
        max_retries?: number;
        max_batch_timeout?: number;
        dead_letter_queue?: string;
        max_concurrency?: number;
        retry_delay?: number;
      } = {
        queue: consumer.queue.name,
      };

      if (consumer.maxBatchSize !== undefined) {
        entry.max_batch_size = consumer.maxBatchSize;
      }
      if (consumer.maxRetries !== undefined) {
        entry.max_retries = consumer.maxRetries;
      }
      if (consumer.maxWaitMs !== undefined) {
        entry.max_batch_timeout = consumer.maxWaitMs;
      }
      if (consumer.deadLetterQueue) {
        entry.dead_letter_queue = consumer.deadLetterQueue.name;
      }
      if (consumer.maxConcurrency !== undefined) {
        entry.max_concurrency = consumer.maxConcurrency;
      }
      if (consumer.retryDelay !== undefined) {
        entry.retry_delay = consumer.retryDelay;
      }

      config.queues.consumers.push(entry);
    }
  }

  // ── App-level vars ───────────────────────────────────────────

  private processAppVars(config: WranglerConfig): void {
    if (this.app.vars.size === 0) return;

    if (!config.vars) config.vars = {};

    for (const [name, ref] of this.app.vars) {
      config.vars[name] = ref.value;
    }
  }

  // ── App-level secrets ────────────────────────────────────────

  private processAppSecrets(_config: WranglerConfig): void {
    // Secrets are managed via `wrangler secret put`, not in wrangler.jsonc.
    // No config output needed — the secret names are tracked in the app
    // graph for `levi provision` and `levi graph` commands.
  }

  // ── vinext framework defaults ────────────────────────────────

  private applyVinextDefaults(
    config: WranglerConfig,
    opts: WorkerOptions,
  ): void {
    // vinext deploys as a Worker with static assets served from the
    // build output directory. Set the assets config and node_compat.
    // Strip ./ prefix for path construction
    const entryDir = opts.entrypoint.replace(/\\/g, "/").replace(/^\.\//, "");

    if (!config.assets) {
      config.assets = {
        directory: this.resolvePathForConfig(`${entryDir}/dist/client`, this.currentWorkerName),
        binding: "ASSETS",
      };
    }

    // vinext requires nodejs_compat for Node.js built-in modules
    if (!config.compatibility_flags) {
      config.compatibility_flags = [];
    }
    if (!config.compatibility_flags.includes("nodejs_compat")) {
      config.compatibility_flags.push("nodejs_compat");
    }

    // If the entrypoint is a directory (not a .ts/.js file), use the
    // vinext server entry point produced by `vinext build`
    if (!opts.entrypoint.endsWith(".ts") && !opts.entrypoint.endsWith(".js")) {
      config.main = this.resolvePathForConfig(`${entryDir}/dist/server/index.js`, this.currentWorkerName);
    }
  }

  // ── Escape hatch merge ───────────────────────────────────────

  /**
   * Shallow-merge the escape hatch object into the config.
   *
   * For object values, we do a one-level deep merge to allow extending
   * (e.g., adding extra fields to `observability`). For arrays and
   * primitives, the escape hatch value wins.
   */
  private mergeEscapeHatch(
    config: WranglerConfig,
    overrides: Record<string, unknown>,
  ): void {
    for (const [key, value] of Object.entries(overrides)) {
      const existing = config[key];

      if (
        existing !== null &&
        existing !== undefined &&
        typeof existing === "object" &&
        !Array.isArray(existing) &&
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        // One-level deep merge for objects
        config[key] = { ...(existing as Record<string, unknown>), ...(value as Record<string, unknown>) };
      } else {
        config[key] = value;
      }
    }
  }
}
