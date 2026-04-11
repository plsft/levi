import { describe, it, expect, beforeEach } from "vitest";
import { FlareApp } from "../src/app.js";
import { WranglerGenerator } from "../src/generators/wrangler.js";
import { D1Resource } from "../src/resources/d1.js";
import { KVResource } from "../src/resources/kv.js";
import { R2Resource } from "../src/resources/r2.js";
import { QueueResource } from "../src/resources/queue.js";
import { DurableObjectResource } from "../src/resources/durable-object.js";
import { VectorizeResource } from "../src/resources/vectorize.js";
import { HyperdriveResource } from "../src/resources/hyperdrive.js";
import { WorkersAIResource, AIGatewayResource } from "../src/resources/ai.js";
import { MTLSResource } from "../src/resources/mtls.js";
import { WorkflowResource } from "../src/resources/workflow.js";
import { WorkerResource } from "../src/resources/worker.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeApp(opts?: Partial<Parameters<typeof FlareApp.prototype.constructor>[1]>) {
  return new FlareApp("test-app", {
    compatibility_date: "2026-04-01",
    ...opts,
  } as any);
}

function generate(app: FlareApp, worker: WorkerResource) {
  return new WranglerGenerator(app).generateForWorker(worker);
}

// ---------------------------------------------------------------------------
// Basic config
// ---------------------------------------------------------------------------

describe("WranglerGenerator — basic config", () => {
  it("sets name to the worker name", () => {
    const app = makeApp();
    const w = app.addWorker("api", { entrypoint: "./src/index.ts" });
    const cfg = generate(app, w);
    expect(cfg.name).toBe("api");
  });

  it("prefixes main with ../../../", () => {
    const app = makeApp();
    const w = app.addWorker("api", { entrypoint: "./src/index.ts" });
    const cfg = generate(app, w);
    expect(cfg.main).toBe("../../../src/index.ts");
  });

  it("strips ./ from entrypoint before prefixing", () => {
    const app = makeApp();
    const w = app.addWorker("api", { entrypoint: "src/index.ts" });
    const cfg = generate(app, w);
    expect(cfg.main).toBe("../../../src/index.ts");
  });

  it("uses compatibility_date from app options", () => {
    const app = makeApp({ compatibility_date: "2026-04-01" });
    const w = app.addWorker("api", { entrypoint: "./src/index.ts" });
    const cfg = generate(app, w);
    expect(cfg.compatibility_date).toBe("2026-04-01");
  });

  it("uses compatibility_flags from app options", () => {
    const app = makeApp({ compatibility_flags: ["nodejs_compat"] });
    const w = app.addWorker("api", { entrypoint: "./src/index.ts" });
    const cfg = generate(app, w);
    expect(cfg.compatibility_flags).toEqual(["nodejs_compat"]);
  });

  it("worker compatibility overrides app compatibility", () => {
    const app = makeApp({
      compatibility_date: "2026-01-01",
      compatibility_flags: ["old_flag"],
    });
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      compatibilityDate: "2026-06-01",
      compatibilityFlags: ["new_flag"],
    });
    const cfg = generate(app, w);
    expect(cfg.compatibility_date).toBe("2026-06-01");
    expect(cfg.compatibility_flags).toEqual(["new_flag"]);
  });

  it("includes account_id when set on app", () => {
    const app = makeApp({ account: "abc123" });
    const w = app.addWorker("api", { entrypoint: "./src/index.ts" });
    const cfg = generate(app, w);
    expect(cfg.account_id).toBe("abc123");
  });

  it("omits account_id when not set", () => {
    const app = makeApp();
    const w = app.addWorker("api", { entrypoint: "./src/index.ts" });
    const cfg = generate(app, w);
    expect(cfg.account_id).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// D1 binding
// ---------------------------------------------------------------------------

describe("WranglerGenerator — D1 binding", () => {
  it("produces d1_databases array with correct fields", () => {
    const app = makeApp();
    const db = app.addD1("main-db");
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { DB: db },
    });
    const cfg = generate(app, w);

    expect(cfg.d1_databases).toBeDefined();
    expect(cfg.d1_databases).toHaveLength(1);
    expect(cfg.d1_databases![0].binding).toBe("DB");
    expect(cfg.d1_databases![0].database_name).toBe("main-db");
  });

  it("database_id is undefined when not set", () => {
    const app = makeApp();
    const db = app.addD1("main-db");
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { DB: db },
    });
    const cfg = generate(app, w);
    expect(cfg.d1_databases![0].database_id).toBeUndefined();
  });

  it("database_id is populated when set", () => {
    const app = makeApp();
    const db = app.addD1("main-db", { databaseId: "uuid-123" });
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { DB: db },
    });
    const cfg = generate(app, w);
    expect(cfg.d1_databases![0].database_id).toBe("uuid-123");
  });

  it("migrations_dir uses ../../../ prefix", () => {
    const app = makeApp();
    const db = app.addD1("main-db", { migrations: "./migrations" });
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { DB: db },
    });
    const cfg = generate(app, w);
    expect(cfg.d1_databases![0].migrations_dir).toBe("../../../migrations");
  });

  it("multiple D1 bindings produce multiple entries", () => {
    const app = makeApp();
    const db1 = app.addD1("db-one");
    const db2 = app.addD1("db-two");
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { DB1: db1, DB2: db2 },
    });
    const cfg = generate(app, w);
    expect(cfg.d1_databases).toHaveLength(2);
    const names = cfg.d1_databases!.map((d) => d.binding);
    expect(names).toContain("DB1");
    expect(names).toContain("DB2");
  });
});

// ---------------------------------------------------------------------------
// KV binding
// ---------------------------------------------------------------------------

describe("WranglerGenerator — KV binding", () => {
  it("produces kv_namespaces array with correct fields", () => {
    const app = makeApp();
    const kv = app.addKV("sessions");
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { CACHE: kv },
    });
    const cfg = generate(app, w);

    expect(cfg.kv_namespaces).toBeDefined();
    expect(cfg.kv_namespaces).toHaveLength(1);
    expect(cfg.kv_namespaces![0].binding).toBe("CACHE");
  });

  it("id is undefined when namespaceId not provided", () => {
    const app = makeApp();
    const kv = app.addKV("sessions");
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { CACHE: kv },
    });
    const cfg = generate(app, w);
    expect(cfg.kv_namespaces![0].id).toBeUndefined();
  });

  it("id is populated when namespaceId is provided", () => {
    const app = makeApp();
    const kv = app.addKV("sessions", { namespaceId: "ns-id-123" });
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { CACHE: kv },
    });
    const cfg = generate(app, w);
    expect(cfg.kv_namespaces![0].id).toBe("ns-id-123");
  });
});

// ---------------------------------------------------------------------------
// R2 binding
// ---------------------------------------------------------------------------

describe("WranglerGenerator — R2 binding", () => {
  it("produces r2_buckets array with correct fields", () => {
    const app = makeApp();
    const bucket = app.addR2("uploads");
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { UPLOADS: bucket },
    });
    const cfg = generate(app, w);

    expect(cfg.r2_buckets).toBeDefined();
    expect(cfg.r2_buckets).toHaveLength(1);
    expect(cfg.r2_buckets![0].binding).toBe("UPLOADS");
  });

  it("bucket_name defaults to resource name", () => {
    const app = makeApp();
    const bucket = app.addR2("uploads");
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { UPLOADS: bucket },
    });
    const cfg = generate(app, w);
    expect(cfg.r2_buckets![0].bucket_name).toBe("uploads");
  });

  it("bucket_name uses explicit bucketName when provided", () => {
    const app = makeApp();
    const bucket = app.addR2("uploads", { bucketName: "my-custom-bucket" });
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { UPLOADS: bucket },
    });
    const cfg = generate(app, w);
    expect(cfg.r2_buckets![0].bucket_name).toBe("my-custom-bucket");
  });

  it("jurisdiction included when set", () => {
    const app = makeApp();
    const bucket = app.addR2("uploads", { jurisdiction: "eu" });
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { UPLOADS: bucket },
    });
    const cfg = generate(app, w);
    expect(cfg.r2_buckets![0].jurisdiction).toBe("eu");
  });

  it("jurisdiction omitted when not set", () => {
    const app = makeApp();
    const bucket = app.addR2("uploads");
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { UPLOADS: bucket },
    });
    const cfg = generate(app, w);
    expect(cfg.r2_buckets![0].jurisdiction).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Queue producer binding
// ---------------------------------------------------------------------------

describe("WranglerGenerator — Queue producer binding", () => {
  it("produces queues.producers array with correct fields", () => {
    const app = makeApp();
    const q = app.addQueue("background-jobs");
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { JOBS: q },
    });
    const cfg = generate(app, w);

    expect(cfg.queues).toBeDefined();
    expect(cfg.queues!.producers).toBeDefined();
    expect(cfg.queues!.producers).toHaveLength(1);
    expect(cfg.queues!.producers![0].binding).toBe("JOBS");
    expect(cfg.queues!.producers![0].queue).toBe("background-jobs");
  });
});

// ---------------------------------------------------------------------------
// Queue consumer
// ---------------------------------------------------------------------------

describe("WranglerGenerator — Queue consumer", () => {
  it("produces queues.consumers array with correct fields", () => {
    const app = makeApp();
    const q = app.addQueue("background-jobs");
    const w = app.addWorker("worker", {
      entrypoint: "./src/worker.ts",
      consumers: [
        {
          queue: q,
          maxBatchSize: 10,
          maxRetries: 3,
          maxWaitMs: 5000,
        },
      ],
    });
    const cfg = generate(app, w);

    expect(cfg.queues).toBeDefined();
    expect(cfg.queues!.consumers).toBeDefined();
    expect(cfg.queues!.consumers).toHaveLength(1);

    const consumer = cfg.queues!.consumers![0];
    expect(consumer.queue).toBe("background-jobs");
    expect(consumer.max_batch_size).toBe(10);
    expect(consumer.max_retries).toBe(3);
    expect(consumer.max_batch_timeout).toBe(5000);
  });

  it("includes dead_letter_queue name", () => {
    const app = makeApp();
    const dlq = app.addQueue("dlq");
    const q = app.addQueue("jobs");
    const w = app.addWorker("worker", {
      entrypoint: "./src/worker.ts",
      consumers: [
        {
          queue: q,
          deadLetterQueue: dlq,
        },
      ],
    });
    const cfg = generate(app, w);
    expect(cfg.queues!.consumers![0].dead_letter_queue).toBe("dlq");
  });
});

// ---------------------------------------------------------------------------
// Durable Object binding
// ---------------------------------------------------------------------------

describe("WranglerGenerator — Durable Object binding", () => {
  it("produces durable_objects.bindings array with correct fields", () => {
    const app = makeApp();
    const doRes = app.addDurableObject("counter", {
      className: "CounterDO",
    });
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { COUNTER: doRes },
    });
    const cfg = generate(app, w);

    expect(cfg.durable_objects).toBeDefined();
    expect(cfg.durable_objects!.bindings).toHaveLength(1);
    expect(cfg.durable_objects!.bindings[0].name).toBe("COUNTER");
    expect(cfg.durable_objects!.bindings[0].class_name).toBe("CounterDO");
  });

  it("includes script_name for external DOs", () => {
    const app = makeApp();
    const doRes = app.addDurableObject("counter", {
      className: "CounterDO",
      scriptName: "other-worker",
    });
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { COUNTER: doRes },
    });
    const cfg = generate(app, w);
    expect(cfg.durable_objects!.bindings[0].script_name).toBe("other-worker");
  });

  it("generates migrations with new_sqlite_classes when sqlite: true", () => {
    const app = makeApp();
    const doRes = app.addDurableObject("session", {
      className: "SessionDO",
      sqlite: true,
    });
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { SESSION: doRes },
    });
    const cfg = generate(app, w);

    expect(cfg.migrations).toBeDefined();
    expect(cfg.migrations).toHaveLength(1);
    expect(cfg.migrations![0].new_sqlite_classes).toEqual(["SessionDO"]);
    expect(cfg.migrations![0].new_classes).toBeUndefined();
    expect(cfg.migrations![0].tag).toBe("v1-SessionDO");
  });

  it("generates migrations with new_classes when sqlite is false/undefined", () => {
    const app = makeApp();
    const doRes = app.addDurableObject("counter", {
      className: "CounterDO",
    });
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { COUNTER: doRes },
    });
    const cfg = generate(app, w);

    expect(cfg.migrations).toBeDefined();
    expect(cfg.migrations).toHaveLength(1);
    expect(cfg.migrations![0].new_classes).toEqual(["CounterDO"]);
    expect(cfg.migrations![0].new_sqlite_classes).toBeUndefined();
  });

  it("does not generate migrations for external DOs (scriptName set)", () => {
    const app = makeApp();
    const doRes = app.addDurableObject("counter", {
      className: "CounterDO",
      scriptName: "external-worker",
    });
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { COUNTER: doRes },
    });
    const cfg = generate(app, w);
    expect(cfg.migrations).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Vectorize binding
// ---------------------------------------------------------------------------

describe("WranglerGenerator — Vectorize binding", () => {
  it("produces vectorize array with correct fields", () => {
    const app = makeApp();
    const idx = app.addVectorize("embeddings", {
      dimensions: 1536,
      metric: "cosine",
    });
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { EMBEDDINGS: idx },
    });
    const cfg = generate(app, w);

    expect(cfg.vectorize).toBeDefined();
    expect(cfg.vectorize).toHaveLength(1);
    expect(cfg.vectorize![0].binding).toBe("EMBEDDINGS");
    expect(cfg.vectorize![0].index_name).toBe("embeddings");
  });

  it("uses indexId from options when provided", () => {
    const app = makeApp();
    const idx = app.addVectorize("embeddings", {
      dimensions: 1536,
      metric: "cosine",
      indexId: "my-custom-index-id",
    });
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { EMBEDDINGS: idx },
    });
    const cfg = generate(app, w);

    expect(cfg.vectorize).toBeDefined();
    expect(cfg.vectorize![0].index_name).toBe("my-custom-index-id");
  });

  it("falls back to resource name when indexId is not provided", () => {
    const app = makeApp();
    const idx = app.addVectorize("my-index", {
      dimensions: 768,
      metric: "euclidean",
    });
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { VEC: idx },
    });
    const cfg = generate(app, w);

    expect(cfg.vectorize![0].index_name).toBe("my-index");
  });
});

// ---------------------------------------------------------------------------
// Hyperdrive binding
// ---------------------------------------------------------------------------

describe("WranglerGenerator — Hyperdrive binding", () => {
  it("produces hyperdrive array with correct fields", () => {
    const app = makeApp();
    const hd = app.addHyperdrive("pg", {
      connectionString: "postgres://localhost:5432/mydb",
      configId: "hd-config-id",
    });
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { PG: hd },
    });
    const cfg = generate(app, w);

    expect(cfg.hyperdrive).toBeDefined();
    expect(cfg.hyperdrive).toHaveLength(1);
    expect(cfg.hyperdrive![0].binding).toBe("PG");
    expect(cfg.hyperdrive![0].id).toBe("hd-config-id");
  });

  it("falls back to resource name when configId not set", () => {
    const app = makeApp();
    const hd = app.addHyperdrive("my-hyperdrive", {
      connectionString: "postgres://localhost:5432/mydb",
    });
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { HD: hd },
    });
    const cfg = generate(app, w);
    expect(cfg.hyperdrive![0].id).toBe("my-hyperdrive");
  });
});

// ---------------------------------------------------------------------------
// Workers AI binding
// ---------------------------------------------------------------------------

describe("WranglerGenerator — Workers AI binding", () => {
  it("produces ai object with binding", () => {
    const app = makeApp();
    const ai = app.addWorkersAI();
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { AI: ai },
    });
    const cfg = generate(app, w);

    expect(cfg.ai).toBeDefined();
    expect(cfg.ai!.binding).toBe("AI");
    expect(cfg.ai!.gateway).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// AI Gateway binding
// ---------------------------------------------------------------------------

describe("WranglerGenerator — AI Gateway binding", () => {
  it("produces ai object with binding and gateway.id", () => {
    const app = makeApp();
    const gw = app.addAIGateway("my-gw", { id: "my-gateway-id" });
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { AI: gw },
    });
    const cfg = generate(app, w);

    expect(cfg.ai).toBeDefined();
    expect(cfg.ai!.binding).toBe("AI");
    expect(cfg.ai!.gateway).toBeDefined();
    expect(cfg.ai!.gateway!.id).toBe("my-gateway-id");
  });
});

// ---------------------------------------------------------------------------
// Service binding
// ---------------------------------------------------------------------------

describe("WranglerGenerator — Service binding", () => {
  it("produces services array via .asService()", () => {
    const app = makeApp();
    const auth = app.addWorker("auth", { entrypoint: "./src/auth.ts" });
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { AUTH: auth.asService() },
    });
    const cfg = generate(app, w);

    expect(cfg.services).toBeDefined();
    expect(cfg.services).toHaveLength(1);
    expect(cfg.services![0].binding).toBe("AUTH");
    expect(cfg.services![0].service).toBe("auth");
  });

  it("produces services array when WorkerResource passed directly as binding", () => {
    const app = makeApp();
    const auth = app.addWorker("auth", { entrypoint: "./src/auth.ts" });
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { AUTH: auth },
    });
    const cfg = generate(app, w);

    expect(cfg.services).toBeDefined();
    expect(cfg.services).toHaveLength(1);
    expect(cfg.services![0].binding).toBe("AUTH");
    expect(cfg.services![0].service).toBe("auth");
  });
});

// ---------------------------------------------------------------------------
// mTLS binding
// ---------------------------------------------------------------------------

describe("WranglerGenerator — mTLS binding", () => {
  it("produces mtls_certificates array with correct fields", () => {
    const app = makeApp();
    const cert = app.addMTLS("origin-cert", { certificateId: "cert-uuid-123" });
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { CERT: cert },
    });
    const cfg = generate(app, w);

    expect(cfg.mtls_certificates).toBeDefined();
    expect(cfg.mtls_certificates).toHaveLength(1);
    expect(cfg.mtls_certificates![0].binding).toBe("CERT");
    expect(cfg.mtls_certificates![0].certificate_id).toBe("cert-uuid-123");
  });
});

// ---------------------------------------------------------------------------
// Workflow binding
// ---------------------------------------------------------------------------

describe("WranglerGenerator — Workflow binding", () => {
  it("produces workflows array with correct fields", () => {
    const app = makeApp();
    const wf = app.addWorkflow("order-flow", { className: "OrderWorkflow" });
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { ORDER_FLOW: wf },
    });
    const cfg = generate(app, w);

    expect(cfg.workflows).toBeDefined();
    expect(cfg.workflows).toHaveLength(1);
    expect(cfg.workflows![0].binding).toBe("ORDER_FLOW");
    expect(cfg.workflows![0].class_name).toBe("OrderWorkflow");
  });
});

// ---------------------------------------------------------------------------
// Routes and crons
// ---------------------------------------------------------------------------

describe("WranglerGenerator — Routes and crons", () => {
  it("produces routes array when routes set on worker", () => {
    const app = makeApp();
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      routes: ["api.example.com/*"],
    });
    const cfg = generate(app, w);
    expect(cfg.routes).toEqual(["api.example.com/*"]);
  });

  it("produces triggers.crons array when crons set", () => {
    const app = makeApp();
    const w = app.addWorker("cron-worker", {
      entrypoint: "./src/cron.ts",
      crons: [{ pattern: "0 */6 * * *" }, { pattern: "30 8 * * 1-5" }],
    });
    const cfg = generate(app, w);

    expect(cfg.triggers).toBeDefined();
    expect(cfg.triggers!.crons).toEqual(["0 */6 * * *", "30 8 * * 1-5"]);
  });

  it("extracts cron patterns correctly (ignores handler metadata)", () => {
    const app = makeApp();
    const w = app.addWorker("cron-worker", {
      entrypoint: "./src/cron.ts",
      crons: [{ pattern: "*/5 * * * *", handler: "cleanupHandler" }],
    });
    const cfg = generate(app, w);
    expect(cfg.triggers!.crons).toEqual(["*/5 * * * *"]);
  });
});

// ---------------------------------------------------------------------------
// Worker options
// ---------------------------------------------------------------------------

describe("WranglerGenerator — Worker options", () => {
  it("emits placement with mode", () => {
    const app = makeApp();
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      placement: { mode: "smart" },
    });
    const cfg = generate(app, w);
    expect(cfg.placement).toEqual({ mode: "smart" });
  });

  it("emits limits with cpu_ms and memory_mb (snake_case)", () => {
    const app = makeApp();
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      limits: { cpuMs: 50, memoryMb: 256 },
    });
    const cfg = generate(app, w);
    expect(cfg.limits).toEqual({ cpu_ms: 50, memory_mb: 256 });
  });

  it("emits logpush boolean", () => {
    const app = makeApp();
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      logpush: true,
    });
    const cfg = generate(app, w);
    expect(cfg.logpush).toBe(true);
  });

  it("emits observability with enabled and head_sampling_rate", () => {
    const app = makeApp();
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      observability: { enabled: true, headSamplingRate: 0.5 },
    });
    const cfg = generate(app, w);
    expect(cfg.observability).toEqual({
      enabled: true,
      head_sampling_rate: 0.5,
    });
  });

  it("emits build with command, cwd, watch_dir", () => {
    const app = makeApp();
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      build: {
        command: "npm run build",
        cwd: "./packages/api",
        watchDir: "./packages/api/src",
      },
    });
    const cfg = generate(app, w);
    expect(cfg.build).toEqual({
      command: "npm run build",
      cwd: "./packages/api",
      watch_dir: "./packages/api/src",
    });
  });

  it("emits worker-level vars in config", () => {
    const app = makeApp();
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      vars: { ENV: "production", LOG_LEVEL: "info" },
    });
    const cfg = generate(app, w);
    expect(cfg.vars).toBeDefined();
    expect(cfg.vars!.ENV).toBe("production");
    expect(cfg.vars!.LOG_LEVEL).toBe("info");
  });

  it("worker-level vars override app-level vars", () => {
    const app = makeApp();
    app.var("ENV", "staging");
    app.var("APP_NAME", "test");
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      vars: { ENV: "production" },
    });
    const cfg = generate(app, w);
    expect(cfg.vars!.ENV).toBe("production");
    expect(cfg.vars!.APP_NAME).toBe("test");
  });

  it("app-level vars included in all workers", () => {
    const app = makeApp();
    app.var("SHARED_VAR", "shared-value");
    const w1 = app.addWorker("api", { entrypoint: "./src/index.ts" });
    const w2 = app.addWorker("worker", { entrypoint: "./src/worker.ts" });

    const gen = new WranglerGenerator(app);
    const cfg1 = gen.generateForWorker(w1);
    const cfg2 = gen.generateForWorker(w2);

    expect(cfg1.vars!.SHARED_VAR).toBe("shared-value");
    expect(cfg2.vars!.SHARED_VAR).toBe("shared-value");
  });

  it("inline durableObjects emitted as durable_objects.bindings", () => {
    const app = makeApp();
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      durableObjects: {
        SESSIONS: { className: "SessionDO", sqlite: true },
        COUNTERS: { className: "CounterDO" },
      },
    });
    const cfg = generate(app, w);

    expect(cfg.durable_objects).toBeDefined();
    expect(cfg.durable_objects!.bindings.length).toBeGreaterThanOrEqual(2);

    const sessionBinding = cfg.durable_objects!.bindings.find(
      (b) => b.name === "SESSIONS",
    );
    expect(sessionBinding).toBeDefined();
    expect(sessionBinding!.class_name).toBe("SessionDO");

    const counterBinding = cfg.durable_objects!.bindings.find(
      (b) => b.name === "COUNTERS",
    );
    expect(counterBinding).toBeDefined();
    expect(counterBinding!.class_name).toBe("CounterDO");
  });
});

// ---------------------------------------------------------------------------
// vinext framework
// ---------------------------------------------------------------------------

describe("WranglerGenerator — vinext framework", () => {
  it("worker with framework: vinext gets assets config", () => {
    const app = makeApp();
    const w = app.addWorker("web", {
      framework: "vinext",
      entrypoint: "./packages/web",
    });
    const cfg = generate(app, w);

    expect(cfg.assets).toBeDefined();
    expect(cfg.assets!.directory).toBe("../../../packages/web/dist/client");
    expect(cfg.assets!.binding).toBe("ASSETS");
  });

  it("assets directory uses ../../../ prefix", () => {
    const app = makeApp();
    const w = app.addWorker("web", {
      framework: "vinext",
      entrypoint: "apps/web",
    });
    const cfg = generate(app, w);
    expect(cfg.assets!.directory).toBe("../../../apps/web/dist/client");
  });

  it("compatibility_flags includes nodejs_compat", () => {
    const app = makeApp();
    const w = app.addWorker("web", {
      framework: "vinext",
      entrypoint: "./packages/web",
    });
    const cfg = generate(app, w);
    expect(cfg.compatibility_flags).toContain("nodejs_compat");
  });

  it("main entry set to dist/server/index.js for directory entrypoints", () => {
    const app = makeApp();
    const w = app.addWorker("web", {
      framework: "vinext",
      entrypoint: "./packages/web",
    });
    const cfg = generate(app, w);
    expect(cfg.main).toBe("../../../packages/web/dist/server/index.js");
  });

  it("does not override main when entrypoint is a .ts file", () => {
    const app = makeApp();
    const w = app.addWorker("web", {
      framework: "vinext",
      entrypoint: "./packages/web/index.ts",
    });
    const cfg = generate(app, w);
    // main stays as the file path, not the dist/server path
    expect(cfg.main).toBe("../../../packages/web/index.ts");
  });

  it("does not duplicate nodejs_compat if already present in flags", () => {
    const app = makeApp({ compatibility_flags: ["nodejs_compat"] });
    const w = app.addWorker("web", {
      framework: "vinext",
      entrypoint: "./packages/web",
    });
    const cfg = generate(app, w);
    const count = cfg.compatibility_flags!.filter(
      (f) => f === "nodejs_compat",
    ).length;
    expect(count).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Escape hatch
// ---------------------------------------------------------------------------

describe("WranglerGenerator — Escape hatch", () => {
  it("custom fields appear in output", () => {
    const app = makeApp();
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      wrangler: { custom_field: "value" },
    });
    const cfg = generate(app, w);
    expect((cfg as any).custom_field).toBe("value");
  });

  it("escape hatch overrides typed config for primitives", () => {
    const app = makeApp();
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      logpush: false,
      wrangler: { logpush: true },
    });
    const cfg = generate(app, w);
    expect(cfg.logpush).toBe(true);
  });

  it("escape hatch merges (not replaces) for objects", () => {
    const app = makeApp();
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      observability: { enabled: true, headSamplingRate: 0.5 },
      wrangler: {
        observability: { custom_prop: "extra" },
      },
    });
    const cfg = generate(app, w);
    expect(cfg.observability!.enabled).toBe(true);
    expect(cfg.observability!.head_sampling_rate).toBe(0.5);
    expect((cfg.observability as any).custom_prop).toBe("extra");
  });
});

// ---------------------------------------------------------------------------
// Serialization
// ---------------------------------------------------------------------------

describe("WranglerGenerator — Serialization", () => {
  it("serialize() produces valid JSONC", () => {
    const app = makeApp();
    const w = app.addWorker("api", { entrypoint: "./src/index.ts" });
    const cfg = generate(app, w);
    const output = WranglerGenerator.serialize(cfg);
    expect(typeof output).toBe("string");
    expect(output.length).toBeGreaterThan(0);
  });

  it("output starts with comment header", () => {
    const app = makeApp();
    const w = app.addWorker("api", { entrypoint: "./src/index.ts" });
    const cfg = generate(app, w);
    const output = WranglerGenerator.serialize(cfg);
    expect(output.startsWith("//")).toBe(true);
    expect(output).toContain("Generated by Levi");
    expect(output).toContain("DO NOT EDIT MANUALLY");
  });

  it("output is valid JSON (ignoring comments)", () => {
    const app = makeApp();
    const db = app.addD1("main-db");
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { DB: db },
    });
    const cfg = generate(app, w);
    const output = WranglerGenerator.serialize(cfg);

    // Strip comment lines and parse as JSON
    const jsonStr = output
      .split("\n")
      .filter((line) => !line.trimStart().startsWith("//"))
      .join("\n");
    const parsed = JSON.parse(jsonStr);
    expect(parsed.name).toBe("api");
    expect(parsed.d1_databases).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// generateAll()
// ---------------------------------------------------------------------------

describe("WranglerGenerator — generateAll()", () => {
  it("returns a Map, not a plain object", () => {
    const app = makeApp();
    app.addWorker("api", { entrypoint: "./src/index.ts" });
    const gen = new WranglerGenerator(app);
    const result = gen.generateAll();
    expect(result).toBeInstanceOf(Map);
  });

  it("map has entry for each worker", () => {
    const app = makeApp();
    app.addWorker("api", { entrypoint: "./src/api.ts" });
    app.addWorker("worker", { entrypoint: "./src/worker.ts" });
    const gen = new WranglerGenerator(app);
    const result = gen.generateAll();
    expect(result.size).toBe(2);
    expect(result.has("api")).toBe(true);
    expect(result.has("worker")).toBe(true);
  });

  it("non-worker resources are not in the map", () => {
    const app = makeApp();
    app.addD1("main-db");
    app.addKV("cache");
    app.addWorker("api", { entrypoint: "./src/index.ts" });
    const gen = new WranglerGenerator(app);
    const result = gen.generateAll();
    expect(result.size).toBe(1);
    expect(result.has("main-db")).toBe(false);
    expect(result.has("cache")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// No _levi_secrets field
// ---------------------------------------------------------------------------

describe("WranglerGenerator — No _levi_secrets field", () => {
  it("generated config does NOT contain _levi_secrets", () => {
    const app = makeApp();
    app.secret("MY_SECRET");
    const w = app.addWorker("api", { entrypoint: "./src/index.ts" });
    const cfg = generate(app, w);
    expect((cfg as any)._levi_secrets).toBeUndefined();
  });

  it("no unexpected top-level fields that wrangler would warn about", () => {
    const app = makeApp();
    const w = app.addWorker("api", { entrypoint: "./src/index.ts" });
    const cfg = generate(app, w);

    // Known valid wrangler.jsonc top-level keys
    const validKeys = new Set([
      "name",
      "main",
      "account_id",
      "compatibility_date",
      "compatibility_flags",
      "d1_databases",
      "kv_namespaces",
      "r2_buckets",
      "queues",
      "durable_objects",
      "migrations",
      "vectorize",
      "hyperdrive",
      "ai",
      "services",
      "analytics_engine_datasets",
      "mtls_certificates",
      "browser",
      "workflows",
      "vars",
      "secrets",
      "routes",
      "triggers",
      "placement",
      "limits",
      "logpush",
      "observability",
      "build",
      "no_bundle",
      "node_compat",
      "minify",
      "upload_source_maps",
      "tsconfig",
      "rules",
      "assets",
      "site",
      "tail_consumers",
      "tail_producers",
      "env",
      "send_metrics",
      "keep_vars",
      "usage_model",
      "define",
      "containers",
    ]);

    for (const key of Object.keys(cfg)) {
      expect(validKeys.has(key)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// All snake_case field verification
// ---------------------------------------------------------------------------

describe("WranglerGenerator — snake_case field names", () => {
  it("all generated field names use snake_case per wrangler schema", () => {
    const app = makeApp({ account: "acct-123" });
    const db = app.addD1("db", { migrations: "./migrations", databaseId: "db-id" });
    const kv = app.addKV("kv", { namespaceId: "kv-id" });
    const r2 = app.addR2("bucket", { jurisdiction: "eu" });
    const q = app.addQueue("jobs");
    const dlq = app.addQueue("dlq");
    const doRes = app.addDurableObject("do", { className: "MyDO", sqlite: true });
    const vec = app.addVectorize("vec", { dimensions: 768, metric: "cosine" });
    const hd = app.addHyperdrive("hd", {
      connectionString: "postgres://localhost/db",
      configId: "hd-id",
    });
    const ai = app.addWorkersAI();
    const gw = app.addAIGateway("gw", { id: "gw-id" });
    const mtls = app.addMTLS("cert", { certificateId: "cert-id" });
    const wf = app.addWorkflow("flow", { className: "FlowClass" });
    const auth = app.addWorker("auth", { entrypoint: "./src/auth.ts" });

    const w = app.addWorker("main", {
      entrypoint: "./src/index.ts",
      bindings: {
        DB: db,
        KV: kv,
        R2: r2,
        JOBS: q,
        DO: doRes,
        VEC: vec,
        HD: hd,
        AI: ai,
        GW: gw,
        MTLS: mtls,
        FLOW: wf,
        AUTH: auth.asService(),
      },
      consumers: [{ queue: q, maxBatchSize: 10, maxRetries: 3, maxWaitMs: 5000, deadLetterQueue: dlq }],
      crons: [{ pattern: "0 * * * *" }],
      limits: { cpuMs: 100, memoryMb: 128 },
      observability: { enabled: true, headSamplingRate: 0.5 },
      build: { command: "make", cwd: ".", watchDir: "./src" },
      placement: { mode: "smart" },
      logpush: true,
    });

    const cfg = generate(app, w);

    // Verify no camelCase keys leaked into the top level
    const camelCasePattern = /[a-z][A-Z]/;
    function checkKeys(obj: any, path: string) {
      if (obj === null || obj === undefined || typeof obj !== "object") return;
      if (Array.isArray(obj)) {
        obj.forEach((item, i) => checkKeys(item, `${path}[${i}]`));
        return;
      }
      for (const key of Object.keys(obj)) {
        // Allow known non-snake_case keys that are actually valid in wrangler
        // (none expected, but just in case)
        expect({
          key,
          path: `${path}.${key}`,
          isCamelCase: camelCasePattern.test(key),
        }).toEqual(
          expect.objectContaining({ isCamelCase: false }),
        );
        checkKeys(obj[key], `${path}.${key}`);
      }
    }

    checkKeys(cfg, "config");
  });
});

// ---------------------------------------------------------------------------
// Complex scenario: multiple binding types on one worker
// ---------------------------------------------------------------------------

describe("WranglerGenerator — complex multi-binding worker", () => {
  it("generates config with all binding types simultaneously", () => {
    const app = makeApp({ account: "acct-123" });
    const db = app.addD1("main-db", { databaseId: "db-uuid" });
    const kv = app.addKV("sessions");
    const r2 = app.addR2("uploads");
    const q = app.addQueue("tasks");
    const doRes = app.addDurableObject("counter", { className: "CounterDO" });
    const vec = app.addVectorize("emb", { dimensions: 1536, metric: "cosine" });
    const hd = app.addHyperdrive("pg", {
      connectionString: "postgres://localhost/db",
    });

    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: {
        DB: db,
        CACHE: kv,
        UPLOADS: r2,
        TASKS: q,
        COUNTER: doRes,
        EMB: vec,
        PG: hd,
      },
    });

    const cfg = generate(app, w);

    // Every binding type should have its own section
    expect(cfg.d1_databases).toHaveLength(1);
    expect(cfg.kv_namespaces).toHaveLength(1);
    expect(cfg.r2_buckets).toHaveLength(1);
    expect(cfg.queues!.producers).toHaveLength(1);
    expect(cfg.durable_objects!.bindings).toHaveLength(1);
    expect(cfg.vectorize).toHaveLength(1);
    expect(cfg.hyperdrive).toHaveLength(1);

    // And migrations for the DO
    expect(cfg.migrations).toHaveLength(1);
  });
});
