import { describe, it, expect } from "vitest";
import { FlareApp } from "../src/app.js";
import { D1Resource } from "../src/resources/d1.js";
import { KVResource } from "../src/resources/kv.js";
import { R2Resource } from "../src/resources/r2.js";
import { QueueResource } from "../src/resources/queue.js";
import { VectorizeResource } from "../src/resources/vectorize.js";
import { HyperdriveResource } from "../src/resources/hyperdrive.js";
import { WorkerResource } from "../src/resources/worker.js";
import { DurableObjectResource } from "../src/resources/durable-object.js";
import { WorkersAIResource, AIGatewayResource } from "../src/resources/ai.js";
import { DomainResource } from "../src/resources/domain.js";
import { MTLSResource } from "../src/resources/mtls.js";
import { WorkflowResource } from "../src/resources/workflow.js";
import { TailWorkerResource } from "../src/resources/tail-worker.js";

// ---------------------------------------------------------------------------
// Construction
// ---------------------------------------------------------------------------

describe("FlareApp — construction", () => {
  it("creates an app with the given name", () => {
    const app = new FlareApp("test");
    expect(app.name).toBe("test");
  });

  it("sets default options when none are provided", () => {
    const app = new FlareApp("test");
    expect(app.options.outDir).toBe(".levi");
    expect(app.options.compatibility_date).toBeUndefined();
    expect(app.options.account).toBeUndefined();
    expect(app.options.environments).toBeUndefined();
    expect(app.options.basePath).toBeUndefined();
    expect(app.options.compatibility_flags).toBeUndefined();
  });

  it("accepts a compatibility_date option", () => {
    const app = new FlareApp("test", { compatibility_date: "2026-04-01" });
    expect(app.options.compatibility_date).toBe("2026-04-01");
  });

  it("accepts an account option", () => {
    const app = new FlareApp("test", { account: "abc123" });
    expect(app.options.account).toBe("abc123");
  });

  it("accepts environments option", () => {
    const envs = {
      staging: { domain: "staging.example.com" },
      production: { domain: "example.com" },
    };
    const app = new FlareApp("test", { environments: envs });
    expect(app.options.environments).toEqual(envs);
  });

  it("accepts a custom outDir", () => {
    const app = new FlareApp("test", { outDir: "output" });
    expect(app.options.outDir).toBe("output");
  });

  it("accepts compatibility_flags", () => {
    const flags = ["nodejs_compat", "streams_enable_constructors"];
    const app = new FlareApp("test", { compatibility_flags: flags });
    expect(app.options.compatibility_flags).toEqual(flags);
  });

  it("accepts a basePath option", () => {
    const app = new FlareApp("test", { basePath: "/my/project" });
    expect(app.options.basePath).toBe("/my/project");
  });

  it("initializes an empty graph", () => {
    const app = new FlareApp("test");
    expect(app.graph.size).toBe(0);
    expect(app.graph.nodes).toEqual([]);
  });

  it("getGraph() returns the same graph instance", () => {
    const app = new FlareApp("test");
    expect(app.getGraph()).toBe(app.graph);
  });
});

// ---------------------------------------------------------------------------
// addD1
// ---------------------------------------------------------------------------

describe("FlareApp — addD1()", () => {
  it("returns a D1Resource", () => {
    const app = new FlareApp("test");
    const db = app.addD1("my-db");
    expect(db).toBeInstanceOf(D1Resource);
  });

  it("sets the resource name", () => {
    const app = new FlareApp("test");
    const db = app.addD1("my-db");
    expect(db.name).toBe("my-db");
  });

  it("has type 'd1'", () => {
    const app = new FlareApp("test");
    const db = app.addD1("my-db");
    expect(db.type).toBe("d1");
  });

  it("adds the resource to the graph", () => {
    const app = new FlareApp("test");
    app.addD1("my-db");
    expect(app.graph.size).toBe(1);
    expect(app.graph.get("my-db")).toBeDefined();
  });

  it("passes options through", () => {
    const app = new FlareApp("test");
    const db = app.addD1("my-db", { databaseId: "abc" });
    expect((db.options as any).databaseId).toBe("abc");
  });
});

// ---------------------------------------------------------------------------
// addKV
// ---------------------------------------------------------------------------

describe("FlareApp — addKV()", () => {
  it("returns a KVResource", () => {
    const app = new FlareApp("test");
    const kv = app.addKV("cache");
    expect(kv).toBeInstanceOf(KVResource);
  });

  it("sets the resource name", () => {
    const app = new FlareApp("test");
    const kv = app.addKV("cache");
    expect(kv.name).toBe("cache");
  });

  it("has type 'kv'", () => {
    const app = new FlareApp("test");
    const kv = app.addKV("cache");
    expect(kv.type).toBe("kv");
  });

  it("adds the resource to the graph", () => {
    const app = new FlareApp("test");
    app.addKV("cache");
    expect(app.graph.size).toBe(1);
    expect(app.graph.get("cache")).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// addR2
// ---------------------------------------------------------------------------

describe("FlareApp — addR2()", () => {
  it("returns an R2Resource", () => {
    const app = new FlareApp("test");
    const bucket = app.addR2("uploads");
    expect(bucket).toBeInstanceOf(R2Resource);
  });

  it("sets the resource name", () => {
    const app = new FlareApp("test");
    const bucket = app.addR2("uploads");
    expect(bucket.name).toBe("uploads");
  });

  it("has type 'r2'", () => {
    const app = new FlareApp("test");
    const bucket = app.addR2("uploads");
    expect(bucket.type).toBe("r2");
  });

  it("adds the resource to the graph", () => {
    const app = new FlareApp("test");
    app.addR2("uploads");
    expect(app.graph.size).toBe(1);
    expect(app.graph.get("uploads")).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// addQueue
// ---------------------------------------------------------------------------

describe("FlareApp — addQueue()", () => {
  it("returns a QueueResource", () => {
    const app = new FlareApp("test");
    const q = app.addQueue("tasks");
    expect(q).toBeInstanceOf(QueueResource);
  });

  it("sets the resource name", () => {
    const app = new FlareApp("test");
    const q = app.addQueue("tasks");
    expect(q.name).toBe("tasks");
  });

  it("has type 'queue'", () => {
    const app = new FlareApp("test");
    const q = app.addQueue("tasks");
    expect(q.type).toBe("queue");
  });

  it("adds the resource to the graph", () => {
    const app = new FlareApp("test");
    app.addQueue("tasks");
    expect(app.graph.size).toBe(1);
    expect(app.graph.get("tasks")).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// addVectorize
// ---------------------------------------------------------------------------

describe("FlareApp — addVectorize()", () => {
  it("returns a VectorizeResource", () => {
    const app = new FlareApp("test");
    const vec = app.addVectorize("embeddings", { dimensions: 1536, metric: "cosine" });
    expect(vec).toBeInstanceOf(VectorizeResource);
  });

  it("sets the resource name", () => {
    const app = new FlareApp("test");
    const vec = app.addVectorize("embeddings", { dimensions: 1536, metric: "cosine" });
    expect(vec.name).toBe("embeddings");
  });

  it("has type 'vectorize'", () => {
    const app = new FlareApp("test");
    const vec = app.addVectorize("embeddings", { dimensions: 1536, metric: "cosine" });
    expect(vec.type).toBe("vectorize");
  });

  it("stores the required dimensions option", () => {
    const app = new FlareApp("test");
    const vec = app.addVectorize("embeddings", { dimensions: 768, metric: "euclidean" });
    expect(vec.options.dimensions).toBe(768);
  });

  it("stores the required metric option", () => {
    const app = new FlareApp("test");
    const vec = app.addVectorize("embeddings", { dimensions: 768, metric: "dot-product" });
    expect(vec.options.metric).toBe("dot-product");
  });

  it("adds the resource to the graph", () => {
    const app = new FlareApp("test");
    app.addVectorize("embeddings", { dimensions: 1536, metric: "cosine" });
    expect(app.graph.size).toBe(1);
    expect(app.graph.get("embeddings")).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// addHyperdrive
// ---------------------------------------------------------------------------

describe("FlareApp — addHyperdrive()", () => {
  it("returns a HyperdriveResource", () => {
    const app = new FlareApp("test");
    const hd = app.addHyperdrive("pg", { connectionString: "postgres://localhost/db" });
    expect(hd).toBeInstanceOf(HyperdriveResource);
  });

  it("sets the resource name", () => {
    const app = new FlareApp("test");
    const hd = app.addHyperdrive("pg", { connectionString: "postgres://localhost/db" });
    expect(hd.name).toBe("pg");
  });

  it("has type 'hyperdrive'", () => {
    const app = new FlareApp("test");
    const hd = app.addHyperdrive("pg", { connectionString: "postgres://localhost/db" });
    expect(hd.type).toBe("hyperdrive");
  });

  it("stores the required connectionString option", () => {
    const app = new FlareApp("test");
    const hd = app.addHyperdrive("pg", { connectionString: "postgres://localhost/db" });
    expect(hd.options.connectionString).toBe("postgres://localhost/db");
  });

  it("accepts a SecretRef as connectionString", () => {
    const app = new FlareApp("test");
    const secret = app.secret("DB_URL");
    const hd = app.addHyperdrive("pg", { connectionString: secret });
    expect(hd.options.connectionString).toEqual({ __type: "secret", name: "DB_URL" });
  });

  it("adds the resource to the graph", () => {
    const app = new FlareApp("test");
    app.addHyperdrive("pg", { connectionString: "postgres://localhost/db" });
    expect(app.graph.size).toBe(1);
    expect(app.graph.get("pg")).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// addWorker
// ---------------------------------------------------------------------------

describe("FlareApp — addWorker()", () => {
  it("returns a WorkerResource", () => {
    const app = new FlareApp("test");
    const w = app.addWorker("api", { entrypoint: "./src/index.ts" });
    expect(w).toBeInstanceOf(WorkerResource);
  });

  it("sets the resource name", () => {
    const app = new FlareApp("test");
    const w = app.addWorker("api", { entrypoint: "./src/index.ts" });
    expect(w.name).toBe("api");
  });

  it("has type 'worker'", () => {
    const app = new FlareApp("test");
    const w = app.addWorker("api", { entrypoint: "./src/index.ts" });
    expect(w.type).toBe("worker");
  });

  it("adds the resource to the graph", () => {
    const app = new FlareApp("test");
    app.addWorker("api", { entrypoint: "./src/index.ts" });
    expect(app.graph.size).toBe(1);
    expect(app.graph.get("api")).toBeDefined();
  });

  it("stores the entrypoint in options", () => {
    const app = new FlareApp("test");
    const w = app.addWorker("api", { entrypoint: "./src/index.ts" });
    expect(w.options.entrypoint).toBe("./src/index.ts");
  });
});

// ---------------------------------------------------------------------------
// addDurableObject
// ---------------------------------------------------------------------------

describe("FlareApp — addDurableObject()", () => {
  it("returns a DurableObjectResource", () => {
    const app = new FlareApp("test");
    const doRes = app.addDurableObject("sessions", { className: "SessionDO" });
    expect(doRes).toBeInstanceOf(DurableObjectResource);
  });

  it("has type 'durable-object'", () => {
    const app = new FlareApp("test");
    const doRes = app.addDurableObject("sessions", { className: "SessionDO" });
    expect(doRes.type).toBe("durable-object");
  });

  it("adds the resource to the graph", () => {
    const app = new FlareApp("test");
    app.addDurableObject("sessions", { className: "SessionDO" });
    expect(app.graph.size).toBe(1);
    expect(app.graph.get("sessions")).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// addWorkersAI
// ---------------------------------------------------------------------------

describe("FlareApp — addWorkersAI()", () => {
  it("returns a WorkersAIResource", () => {
    const app = new FlareApp("test");
    const ai = app.addWorkersAI();
    expect(ai).toBeInstanceOf(WorkersAIResource);
  });

  it("has type 'workers-ai'", () => {
    const app = new FlareApp("test");
    const ai = app.addWorkersAI();
    expect(ai.type).toBe("workers-ai");
  });

  it("uses default name 'workers-ai' when no binding is provided", () => {
    const app = new FlareApp("test");
    const ai = app.addWorkersAI();
    expect(ai.name).toBe("workers-ai");
  });

  it("uses the binding option as the name when provided", () => {
    const app = new FlareApp("test");
    const ai = app.addWorkersAI({ binding: "MODELS" });
    expect(ai.name).toBe("MODELS");
  });

  it("adds the resource to the graph", () => {
    const app = new FlareApp("test");
    app.addWorkersAI();
    expect(app.graph.size).toBe(1);
    expect(app.graph.get("workers-ai")).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// addAIGateway
// ---------------------------------------------------------------------------

describe("FlareApp — addAIGateway()", () => {
  it("returns an AIGatewayResource", () => {
    const app = new FlareApp("test");
    const gw = app.addAIGateway("gw", { id: "my-gw" });
    expect(gw).toBeInstanceOf(AIGatewayResource);
  });

  it("has type 'ai-gateway'", () => {
    const app = new FlareApp("test");
    const gw = app.addAIGateway("gw", { id: "my-gw" });
    expect(gw.type).toBe("ai-gateway");
  });

  it("adds the resource to the graph", () => {
    const app = new FlareApp("test");
    app.addAIGateway("gw", { id: "my-gw" });
    expect(app.graph.size).toBe(1);
    expect(app.graph.get("gw")).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// addDomain
// ---------------------------------------------------------------------------

describe("FlareApp — addDomain()", () => {
  it("returns a DomainResource", () => {
    const app = new FlareApp("test");
    const domain = app.addDomain("example.com");
    expect(domain).toBeInstanceOf(DomainResource);
  });

  it("has type 'domain'", () => {
    const app = new FlareApp("test");
    const domain = app.addDomain("example.com");
    expect(domain.type).toBe("domain");
  });

  it("adds the resource to the graph", () => {
    const app = new FlareApp("test");
    app.addDomain("example.com");
    expect(app.graph.size).toBe(1);
    expect(app.graph.get("example.com")).toBeDefined();
  });

  it("passes options through", () => {
    const app = new FlareApp("test");
    const domain = app.addDomain("example.com", { ssl: "full_strict", redirectWww: true });
    expect(domain.options.ssl).toBe("full_strict");
    expect(domain.options.redirectWww).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// addMTLS
// ---------------------------------------------------------------------------

describe("FlareApp — addMTLS()", () => {
  it("returns an MTLSResource", () => {
    const app = new FlareApp("test");
    const mtls = app.addMTLS("cert", { certificateId: "cert-123" });
    expect(mtls).toBeInstanceOf(MTLSResource);
  });

  it("has type 'mtls'", () => {
    const app = new FlareApp("test");
    const mtls = app.addMTLS("cert", { certificateId: "cert-123" });
    expect(mtls.type).toBe("mtls");
  });

  it("adds the resource to the graph", () => {
    const app = new FlareApp("test");
    app.addMTLS("cert", { certificateId: "cert-123" });
    expect(app.graph.size).toBe(1);
    expect(app.graph.get("cert")).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// addWorkflow
// ---------------------------------------------------------------------------

describe("FlareApp — addWorkflow()", () => {
  it("returns a WorkflowResource", () => {
    const app = new FlareApp("test");
    const wf = app.addWorkflow("order-flow", { className: "OrderWorkflow" });
    expect(wf).toBeInstanceOf(WorkflowResource);
  });

  it("has type 'workflow'", () => {
    const app = new FlareApp("test");
    const wf = app.addWorkflow("order-flow", { className: "OrderWorkflow" });
    expect(wf.type).toBe("workflow");
  });

  it("adds the resource to the graph", () => {
    const app = new FlareApp("test");
    app.addWorkflow("order-flow", { className: "OrderWorkflow" });
    expect(app.graph.size).toBe(1);
    expect(app.graph.get("order-flow")).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// addTailWorker
// ---------------------------------------------------------------------------

describe("FlareApp — addTailWorker()", () => {
  it("returns a TailWorkerResource", () => {
    const app = new FlareApp("test");
    const tw = app.addTailWorker("logger", { entrypoint: "./src/tail.ts" });
    expect(tw).toBeInstanceOf(TailWorkerResource);
  });

  it("has type 'tail-worker'", () => {
    const app = new FlareApp("test");
    const tw = app.addTailWorker("logger", { entrypoint: "./src/tail.ts" });
    expect(tw.type).toBe("tail-worker");
  });

  it("adds the resource to the graph", () => {
    const app = new FlareApp("test");
    app.addTailWorker("logger", { entrypoint: "./src/tail.ts" });
    expect(app.graph.size).toBe(1);
    expect(app.graph.get("logger")).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// secret()
// ---------------------------------------------------------------------------

describe("FlareApp — secret()", () => {
  it("returns a SecretRef with __type 'secret'", () => {
    const app = new FlareApp("test");
    const ref = app.secret("API_KEY");
    expect(ref.__type).toBe("secret");
  });

  it("returns a SecretRef with the given name", () => {
    const app = new FlareApp("test");
    const ref = app.secret("API_KEY");
    expect(ref.name).toBe("API_KEY");
  });

  it("registers the secret in the secrets map", () => {
    const app = new FlareApp("test");
    app.secret("API_KEY");
    expect(app.secrets.has("API_KEY")).toBe(true);
    expect(app.secrets.get("API_KEY")).toEqual({ __type: "secret", name: "API_KEY" });
  });

  it("returns the same ref object that is stored in the map", () => {
    const app = new FlareApp("test");
    const ref = app.secret("TOKEN");
    expect(app.secrets.get("TOKEN")).toBe(ref);
  });

  it("supports multiple secrets", () => {
    const app = new FlareApp("test");
    app.secret("A");
    app.secret("B");
    app.secret("C");
    expect(app.secrets.size).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// var()
// ---------------------------------------------------------------------------

describe("FlareApp — var()", () => {
  it("returns a VarRef with __type 'var'", () => {
    const app = new FlareApp("test");
    const ref = app.var("ENV", "production");
    expect(ref.__type).toBe("var");
  });

  it("returns a VarRef with the given name and value", () => {
    const app = new FlareApp("test");
    const ref = app.var("ENV", "production");
    expect(ref.name).toBe("ENV");
    expect(ref.value).toBe("production");
  });

  it("registers the var in the vars map", () => {
    const app = new FlareApp("test");
    app.var("ENV", "production");
    expect(app.vars.has("ENV")).toBe(true);
    expect(app.vars.get("ENV")).toEqual({ __type: "var", name: "ENV", value: "production" });
  });

  it("returns the same ref object that is stored in the map", () => {
    const app = new FlareApp("test");
    const ref = app.var("KEY", "val");
    expect(app.vars.get("KEY")).toBe(ref);
  });

  it("supports multiple vars", () => {
    const app = new FlareApp("test");
    app.var("A", "1");
    app.var("B", "2");
    expect(app.vars.size).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// Duplicate names
// ---------------------------------------------------------------------------

describe("FlareApp — duplicate names", () => {
  it("throws when adding two resources with the same name", () => {
    const app = new FlareApp("test");
    app.addD1("shared-name");
    expect(() => app.addKV("shared-name")).toThrow(/Duplicate resource name/);
  });

  it("throws when adding two workers with the same name", () => {
    const app = new FlareApp("test");
    app.addWorker("api", { entrypoint: "./a.ts" });
    expect(() => app.addWorker("api", { entrypoint: "./b.ts" })).toThrow(
      /Duplicate resource name/,
    );
  });

  it("throws for duplicate names across different resource types", () => {
    const app = new FlareApp("test");
    app.addR2("data");
    expect(() => app.addQueue("data")).toThrow(/Duplicate resource name/);
  });
});

// ---------------------------------------------------------------------------
// build()
// ---------------------------------------------------------------------------

describe("FlareApp — build()", () => {
  it("returns a BuildResult with success: true", () => {
    const app = new FlareApp("test", { compatibility_date: "2026-04-01" });
    app.addWorker("api", { entrypoint: "./src/index.ts" });
    const result = app.build();
    expect(result.success).toBe(true);
  });

  it("returns a graph object", () => {
    const app = new FlareApp("test", { compatibility_date: "2026-04-01" });
    app.addD1("db");
    app.addWorker("api", { entrypoint: "./src/index.ts" });
    const result = app.build();
    expect(result.graph).toBeDefined();
    expect(typeof result.graph).toBe("object");
  });

  it("returns deployOrder as an array of resource names", () => {
    const app = new FlareApp("test", { compatibility_date: "2026-04-01" });
    app.addD1("db");
    app.addWorker("api", { entrypoint: "./src/index.ts", bindings: { DB: app.graph.get("db")! } });
    const result = app.build();
    expect(Array.isArray(result.deployOrder)).toBe(true);
    expect(result.deployOrder).toContain("db");
    expect(result.deployOrder).toContain("api");
  });

  it("returns warnings as an array", () => {
    const app = new FlareApp("test", { compatibility_date: "2026-04-01" });
    app.addWorker("api", { entrypoint: "./src/index.ts" });
    const result = app.build();
    expect(Array.isArray(result.warnings)).toBe(true);
  });

  it("returns a warning about no compute resources when no workers exist", () => {
    const app = new FlareApp("test", { compatibility_date: "2026-04-01" });
    app.addD1("db");
    const result = app.build();
    expect(result.warnings.some((w) => w.includes("No workers declared"))).toBe(true);
  });

  it("returns a warning when no compatibility_date is set", () => {
    const app = new FlareApp("test");
    app.addWorker("api", { entrypoint: "./src/index.ts" });
    const result = app.build();
    expect(result.warnings.some((w) => w.includes("compatibility_date"))).toBe(true);
  });

  it("returns no compatibility_date warning when one is set", () => {
    const app = new FlareApp("test", { compatibility_date: "2026-04-01" });
    app.addWorker("api", { entrypoint: "./src/index.ts" });
    const result = app.build();
    expect(result.warnings.some((w) => w.includes("compatibility_date"))).toBe(false);
  });

  it("returns no worker warning when a worker exists", () => {
    const app = new FlareApp("test", { compatibility_date: "2026-04-01" });
    app.addWorker("api", { entrypoint: "./src/index.ts" });
    const result = app.build();
    expect(result.warnings.some((w) => w.includes("No workers declared"))).toBe(false);
  });

  it("places dependencies before dependents in deployOrder", () => {
    const app = new FlareApp("test", { compatibility_date: "2026-04-01" });
    const db = app.addD1("db");
    const kv = app.addKV("cache");
    app.addWorker("api", { entrypoint: "./src/index.ts", bindings: { DB: db, CACHE: kv } });
    const result = app.build();
    const dbIndex = result.deployOrder.indexOf("db");
    const kvIndex = result.deployOrder.indexOf("cache");
    const apiIndex = result.deployOrder.indexOf("api");
    expect(dbIndex).toBeLessThan(apiIndex);
    expect(kvIndex).toBeLessThan(apiIndex);
  });

  it("builds successfully with an empty graph", () => {
    const app = new FlareApp("test", { compatibility_date: "2026-04-01" });
    const result = app.build();
    expect(result.success).toBe(true);
    expect(result.deployOrder).toEqual([]);
  });

  it("serialized graph includes resources and edges", () => {
    const app = new FlareApp("test", { compatibility_date: "2026-04-01" });
    const db = app.addD1("db");
    app.addWorker("api", { entrypoint: "./src/index.ts", bindings: { DB: db } });
    const result = app.build();
    const graph = result.graph as any;
    expect(graph.version).toBe(1);
    expect(graph.resources).toBeDefined();
    expect(graph.edges).toBeDefined();
    expect(graph.resources.length).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// Worker bindings auto-register dependencies
// ---------------------------------------------------------------------------

describe("FlareApp — worker binding dependency tracking", () => {
  it("worker with D1 binding depends on the D1 resource", () => {
    const app = new FlareApp("test", { compatibility_date: "2026-04-01" });
    const db = app.addD1("db");
    const worker = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { DB: db },
    });
    expect(worker.dependencies.has(db)).toBe(true);
  });

  it("worker with multiple bindings has multiple dependencies", () => {
    const app = new FlareApp("test", { compatibility_date: "2026-04-01" });
    const db = app.addD1("db");
    const kv = app.addKV("cache");
    const r2 = app.addR2("uploads");
    const worker = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { DB: db, CACHE: kv, FILES: r2 },
    });
    expect(worker.dependencies.size).toBe(3);
    expect(worker.dependencies.has(db)).toBe(true);
    expect(worker.dependencies.has(kv)).toBe(true);
    expect(worker.dependencies.has(r2)).toBe(true);
  });

  it("graph edges are created for binding dependencies", () => {
    const app = new FlareApp("test", { compatibility_date: "2026-04-01" });
    const db = app.addD1("db");
    app.addWorker("api", { entrypoint: "./src/index.ts", bindings: { DB: db } });
    const edges = app.graph.edges.get("api");
    expect(edges).toBeDefined();
    expect(edges!.has("db")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Service binding dependency tracking
// ---------------------------------------------------------------------------

describe("FlareApp — service binding dependency tracking", () => {
  it("worker with a service binding depends on the target worker", () => {
    const app = new FlareApp("test", { compatibility_date: "2026-04-01" });
    const apiWorker = app.addWorker("api", { entrypoint: "./api/index.ts" });
    const webWorker = app.addWorker("web", {
      entrypoint: "./web/index.ts",
      bindings: { API: apiWorker.asService() },
    });
    expect(webWorker.dependencies.has(apiWorker)).toBe(true);
  });

  it("graph edges are created for service binding dependencies", () => {
    const app = new FlareApp("test", { compatibility_date: "2026-04-01" });
    const apiWorker = app.addWorker("api", { entrypoint: "./api/index.ts" });
    app.addWorker("web", {
      entrypoint: "./web/index.ts",
      bindings: { API: apiWorker.asService() },
    });
    const edges = app.graph.edges.get("web");
    expect(edges).toBeDefined();
    expect(edges!.has("api")).toBe(true);
  });

  it("build places the service target before the consumer in deployOrder", () => {
    const app = new FlareApp("test", { compatibility_date: "2026-04-01" });
    const apiWorker = app.addWorker("api", { entrypoint: "./api/index.ts" });
    app.addWorker("web", {
      entrypoint: "./web/index.ts",
      bindings: { API: apiWorker.asService() },
    });
    const result = app.build();
    const apiIdx = result.deployOrder.indexOf("api");
    const webIdx = result.deployOrder.indexOf("web");
    expect(apiIdx).toBeLessThan(webIdx);
  });
});

// ---------------------------------------------------------------------------
// Consumer queue dependency tracking
// ---------------------------------------------------------------------------

describe("FlareApp — consumer queue dependency tracking", () => {
  it("worker with a queue consumer depends on the queue", () => {
    const app = new FlareApp("test", { compatibility_date: "2026-04-01" });
    const q = app.addQueue("tasks");
    const worker = app.addWorker("processor", {
      entrypoint: "./src/processor.ts",
      consumers: [{ queue: q }],
    });
    expect(worker.dependencies.has(q)).toBe(true);
  });

  it("graph edges are created for consumer queue dependencies", () => {
    const app = new FlareApp("test", { compatibility_date: "2026-04-01" });
    const q = app.addQueue("tasks");
    app.addWorker("processor", {
      entrypoint: "./src/processor.ts",
      consumers: [{ queue: q }],
    });
    const edges = app.graph.edges.get("processor");
    expect(edges).toBeDefined();
    expect(edges!.has("tasks")).toBe(true);
  });

  it("worker with a dead letter queue consumer depends on both queues", () => {
    const app = new FlareApp("test", { compatibility_date: "2026-04-01" });
    const q = app.addQueue("tasks");
    const dlq = app.addQueue("dead-letters");
    const worker = app.addWorker("processor", {
      entrypoint: "./src/processor.ts",
      consumers: [{ queue: q, deadLetterQueue: dlq }],
    });
    expect(worker.dependencies.has(q)).toBe(true);
    expect(worker.dependencies.has(dlq)).toBe(true);
  });

  it("build places the queue before the consumer worker in deployOrder", () => {
    const app = new FlareApp("test", { compatibility_date: "2026-04-01" });
    const q = app.addQueue("tasks");
    app.addWorker("processor", {
      entrypoint: "./src/processor.ts",
      consumers: [{ queue: q }],
    });
    const result = app.build();
    const qIdx = result.deployOrder.indexOf("tasks");
    const wIdx = result.deployOrder.indexOf("processor");
    expect(qIdx).toBeLessThan(wIdx);
  });
});
