import { describe, it, expect } from "vitest";
import { Resource, ServiceBindingRef } from "../src/resources/base.js";
import { WorkerResource } from "../src/resources/worker.js";
import { D1Resource } from "../src/resources/d1.js";
import { KVResource } from "../src/resources/kv.js";
import { R2Resource } from "../src/resources/r2.js";
import { QueueResource } from "../src/resources/queue.js";
import { DurableObjectResource } from "../src/resources/durable-object.js";
import { VectorizeResource } from "../src/resources/vectorize.js";
import { HyperdriveResource } from "../src/resources/hyperdrive.js";
import { WorkersAIResource, AIGatewayResource } from "../src/resources/ai.js";
import { DomainResource } from "../src/resources/domain.js";
import { WorkflowResource } from "../src/resources/workflow.js";
import { TailWorkerResource } from "../src/resources/tail-worker.js";
import { MTLSResource } from "../src/resources/mtls.js";
import { SecretResource } from "../src/resources/secret.js";

// ---------------------------------------------------------------------------
// Resource base class
// ---------------------------------------------------------------------------

describe("Resource base class", () => {
  // We use D1Resource as a concrete subclass to test the base behavior
  it("sets the name from the constructor", () => {
    const r = new D1Resource("my-db", {});
    expect(r.name).toBe("my-db");
  });

  it("sets the options from the constructor", () => {
    const opts = { databaseId: "abc" };
    const r = new D1Resource("my-db", opts as any);
    expect(r.options).toBe(opts);
  });

  it("initializes with an empty dependencies set", () => {
    const r = new D1Resource("my-db", {});
    expect(r.dependencies).toBeInstanceOf(Set);
    expect(r.dependencies.size).toBe(0);
  });

  it("dependsOn() adds a dependency and returns this for chaining", () => {
    const a = new D1Resource("a", {});
    const b = new KVResource("b", {});
    const result = a.dependsOn(b);
    expect(result).toBe(a);
    expect(a.dependencies.has(b)).toBe(true);
  });

  it("dependsOn() can add multiple dependencies", () => {
    const a = new D1Resource("a", {});
    const b = new KVResource("b", {});
    const c = new R2Resource("c", {});
    a.dependsOn(b).dependsOn(c);
    expect(a.dependencies.size).toBe(2);
    expect(a.dependencies.has(b)).toBe(true);
    expect(a.dependencies.has(c)).toBe(true);
  });

  it("dependsOn() does not duplicate when adding the same dependency twice", () => {
    const a = new D1Resource("a", {});
    const b = new KVResource("b", {});
    a.dependsOn(b).dependsOn(b);
    expect(a.dependencies.size).toBe(1);
  });

  it("toGraphNode() returns type, name, and dependencies array", () => {
    const a = new D1Resource("a", {});
    const node = a.toGraphNode();
    expect(node).toEqual({ type: "d1", name: "a", dependencies: [] });
  });

  it("toGraphNode() includes dependency names", () => {
    const a = new D1Resource("a", {});
    const b = new KVResource("b", {});
    const c = new R2Resource("c", {});
    a.dependsOn(b).dependsOn(c);
    const node = a.toGraphNode();
    expect(node.type).toBe("d1");
    expect(node.name).toBe("a");
    expect(node.dependencies).toContain("b");
    expect(node.dependencies).toContain("c");
    expect(node.dependencies.length).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// ServiceBindingRef
// ---------------------------------------------------------------------------

describe("ServiceBindingRef", () => {
  it("stores the workerName", () => {
    const ref = new ServiceBindingRef("my-worker");
    expect(ref.workerName).toBe("my-worker");
  });

  it("source is undefined when not provided", () => {
    const ref = new ServiceBindingRef("my-worker");
    expect(ref.source).toBeUndefined();
  });

  it("stores the source resource when provided", () => {
    const worker = new WorkerResource("api", { entrypoint: "./src/index.ts" });
    const ref = new ServiceBindingRef("api", worker);
    expect(ref.source).toBe(worker);
    expect(ref.workerName).toBe("api");
  });
});

// ---------------------------------------------------------------------------
// WorkerResource
// ---------------------------------------------------------------------------

describe("WorkerResource", () => {
  it("has type 'worker'", () => {
    const w = new WorkerResource("api", { entrypoint: "./src/index.ts" });
    expect(w.type).toBe("worker");
  });

  it("stores the name", () => {
    const w = new WorkerResource("api", { entrypoint: "./src/index.ts" });
    expect(w.name).toBe("api");
  });

  it("framework getter returns the configured framework", () => {
    const w = new WorkerResource("api", { entrypoint: "./src/index.ts", framework: "hono" });
    expect(w.framework).toBe("hono");
  });

  it("framework getter returns undefined when no framework is set", () => {
    const w = new WorkerResource("api", { entrypoint: "./src/index.ts" });
    expect(w.framework).toBeUndefined();
  });

  it("isVinext() returns true when framework is 'vinext'", () => {
    const w = new WorkerResource("web", { entrypoint: "./src/app", framework: "vinext" });
    expect(w.isVinext()).toBe(true);
  });

  it("isVinext() returns false for other frameworks", () => {
    const w = new WorkerResource("api", { entrypoint: "./src/index.ts", framework: "hono" });
    expect(w.isVinext()).toBe(false);
  });

  it("isVinext() returns false when framework is undefined", () => {
    const w = new WorkerResource("api", { entrypoint: "./src/index.ts" });
    expect(w.isVinext()).toBe(false);
  });

  it("asService() returns a ServiceBindingRef", () => {
    const w = new WorkerResource("api", { entrypoint: "./src/index.ts" });
    const ref = w.asService();
    expect(ref).toBeInstanceOf(ServiceBindingRef);
  });

  it("asService() ref has the worker's name", () => {
    const w = new WorkerResource("api", { entrypoint: "./src/index.ts" });
    const ref = w.asService();
    expect(ref.workerName).toBe("api");
  });

  it("asService() ref has the worker as source", () => {
    const w = new WorkerResource("api", { entrypoint: "./src/index.ts" });
    const ref = w.asService();
    expect(ref.source).toBe(w);
  });

  it("toGraphNode() returns correct worker node", () => {
    const w = new WorkerResource("api", { entrypoint: "./src/index.ts" });
    const node = w.toGraphNode();
    expect(node.type).toBe("worker");
    expect(node.name).toBe("api");
    expect(node.dependencies).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// D1Resource
// ---------------------------------------------------------------------------

describe("D1Resource", () => {
  it("has type 'd1'", () => {
    const r = new D1Resource("db", {});
    expect(r.type).toBe("d1");
  });

  it("stores the name", () => {
    const r = new D1Resource("main-db", {});
    expect(r.name).toBe("main-db");
  });
});

// ---------------------------------------------------------------------------
// KVResource
// ---------------------------------------------------------------------------

describe("KVResource", () => {
  it("has type 'kv'", () => {
    const r = new KVResource("cache", {});
    expect(r.type).toBe("kv");
  });

  it("stores the name", () => {
    const r = new KVResource("session-store", {});
    expect(r.name).toBe("session-store");
  });
});

// ---------------------------------------------------------------------------
// R2Resource
// ---------------------------------------------------------------------------

describe("R2Resource", () => {
  it("has type 'r2'", () => {
    const r = new R2Resource("uploads", {});
    expect(r.type).toBe("r2");
  });

  it("stores the name", () => {
    const r = new R2Resource("media-bucket", {});
    expect(r.name).toBe("media-bucket");
  });
});

// ---------------------------------------------------------------------------
// QueueResource
// ---------------------------------------------------------------------------

describe("QueueResource", () => {
  it("has type 'queue'", () => {
    const r = new QueueResource("tasks", {});
    expect(r.type).toBe("queue");
  });

  it("stores the name", () => {
    const r = new QueueResource("email-queue", {});
    expect(r.name).toBe("email-queue");
  });
});

// ---------------------------------------------------------------------------
// DurableObjectResource
// ---------------------------------------------------------------------------

describe("DurableObjectResource", () => {
  it("has type 'durable-object'", () => {
    const r = new DurableObjectResource("sessions", { className: "SessionDO" });
    expect(r.type).toBe("durable-object");
  });

  it("stores the name", () => {
    const r = new DurableObjectResource("rate-limiter", { className: "RateLimiter" });
    expect(r.name).toBe("rate-limiter");
  });

  it("stores className in options", () => {
    const r = new DurableObjectResource("sessions", { className: "SessionDO" });
    expect(r.options.className).toBe("SessionDO");
  });
});

// ---------------------------------------------------------------------------
// VectorizeResource
// ---------------------------------------------------------------------------

describe("VectorizeResource", () => {
  it("has type 'vectorize'", () => {
    const r = new VectorizeResource("embeddings", { dimensions: 1536, metric: "cosine" });
    expect(r.type).toBe("vectorize");
  });

  it("stores the name", () => {
    const r = new VectorizeResource("doc-search", { dimensions: 768, metric: "euclidean" });
    expect(r.name).toBe("doc-search");
  });

  it("stores dimensions and metric in options", () => {
    const r = new VectorizeResource("embeddings", { dimensions: 1536, metric: "dot-product" });
    expect(r.options.dimensions).toBe(1536);
    expect(r.options.metric).toBe("dot-product");
  });
});

// ---------------------------------------------------------------------------
// HyperdriveResource
// ---------------------------------------------------------------------------

describe("HyperdriveResource", () => {
  it("has type 'hyperdrive'", () => {
    const r = new HyperdriveResource("pg", { connectionString: "postgres://localhost/db" });
    expect(r.type).toBe("hyperdrive");
  });

  it("stores the name", () => {
    const r = new HyperdriveResource("legacy-db", { connectionString: "postgres://localhost/db" });
    expect(r.name).toBe("legacy-db");
  });

  it("stores connectionString in options", () => {
    const r = new HyperdriveResource("pg", { connectionString: "postgres://user:pass@host/db" });
    expect(r.options.connectionString).toBe("postgres://user:pass@host/db");
  });
});

// ---------------------------------------------------------------------------
// WorkersAIResource
// ---------------------------------------------------------------------------

describe("WorkersAIResource", () => {
  it("has type 'workers-ai'", () => {
    const r = new WorkersAIResource("ai", {});
    expect(r.type).toBe("workers-ai");
  });

  it("stores the name", () => {
    const r = new WorkersAIResource("models", {});
    expect(r.name).toBe("models");
  });
});

// ---------------------------------------------------------------------------
// AIGatewayResource
// ---------------------------------------------------------------------------

describe("AIGatewayResource", () => {
  it("has type 'ai-gateway'", () => {
    const r = new AIGatewayResource("gw", { id: "my-gw" });
    expect(r.type).toBe("ai-gateway");
  });

  it("stores the name", () => {
    const r = new AIGatewayResource("prod-gw", { id: "prod-gw" });
    expect(r.name).toBe("prod-gw");
  });

  it("stores id in options", () => {
    const r = new AIGatewayResource("gw", { id: "my-gateway" });
    expect(r.options.id).toBe("my-gateway");
  });
});

// ---------------------------------------------------------------------------
// DomainResource
// ---------------------------------------------------------------------------

describe("DomainResource", () => {
  it("has type 'domain'", () => {
    const r = new DomainResource("example.com", {});
    expect(r.type).toBe("domain");
  });

  it("stores the name", () => {
    const r = new DomainResource("api.example.com", {});
    expect(r.name).toBe("api.example.com");
  });
});

// ---------------------------------------------------------------------------
// WorkflowResource
// ---------------------------------------------------------------------------

describe("WorkflowResource", () => {
  it("has type 'workflow'", () => {
    const r = new WorkflowResource("order-flow", { className: "OrderWorkflow" });
    expect(r.type).toBe("workflow");
  });

  it("stores the name", () => {
    const r = new WorkflowResource("data-pipeline", { className: "PipelineWorkflow" });
    expect(r.name).toBe("data-pipeline");
  });

  it("stores className in options", () => {
    const r = new WorkflowResource("order-flow", { className: "OrderWorkflow" });
    expect(r.options.className).toBe("OrderWorkflow");
  });
});

// ---------------------------------------------------------------------------
// TailWorkerResource
// ---------------------------------------------------------------------------

describe("TailWorkerResource", () => {
  it("has type 'tail-worker'", () => {
    const r = new TailWorkerResource("logger", { entrypoint: "./tail.ts" });
    expect(r.type).toBe("tail-worker");
  });

  it("stores the name", () => {
    const r = new TailWorkerResource("observability", { entrypoint: "./obs.ts" });
    expect(r.name).toBe("observability");
  });

  it("collects binding dependencies from options", () => {
    const db = new D1Resource("db", {});
    const r = new TailWorkerResource("logger", {
      entrypoint: "./tail.ts",
      bindings: { DB: db },
    });
    expect(r.dependencies.has(db)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// MTLSResource
// ---------------------------------------------------------------------------

describe("MTLSResource", () => {
  it("has type 'mtls'", () => {
    const r = new MTLSResource("cert", { certificateId: "cert-123" });
    expect(r.type).toBe("mtls");
  });

  it("stores the name", () => {
    const r = new MTLSResource("origin-cert", { certificateId: "cert-456" });
    expect(r.name).toBe("origin-cert");
  });

  it("stores certificateId in options", () => {
    const r = new MTLSResource("cert", { certificateId: "cert-789" });
    expect(r.options.certificateId).toBe("cert-789");
  });
});

// ---------------------------------------------------------------------------
// SecretResource
// ---------------------------------------------------------------------------

describe("SecretResource", () => {
  it("has type 'secret'", () => {
    const r = new SecretResource("db-secret", { secretName: "DATABASE_URL" });
    expect(r.type).toBe("secret");
  });

  it("stores the name", () => {
    const r = new SecretResource("api-key", { secretName: "API_KEY" });
    expect(r.name).toBe("api-key");
  });

  it("exposes secretName via getter", () => {
    const r = new SecretResource("db-secret", { secretName: "DATABASE_URL" });
    expect(r.secretName).toBe("DATABASE_URL");
  });
});

// ---------------------------------------------------------------------------
// Worker dependency collection from bindings
// ---------------------------------------------------------------------------

describe("Worker dependency collection from bindings", () => {
  it("worker with D1 + KV in bindings has 2 dependencies", () => {
    const db = new D1Resource("db", {});
    const kv = new KVResource("cache", {});
    const worker = new WorkerResource("api", {
      entrypoint: "./src/index.ts",
      bindings: { DB: db, CACHE: kv },
    });
    expect(worker.dependencies.size).toBe(2);
    expect(worker.dependencies.has(db)).toBe(true);
    expect(worker.dependencies.has(kv)).toBe(true);
  });

  it("worker with R2 + Queue in bindings has 2 dependencies", () => {
    const bucket = new R2Resource("uploads", {});
    const queue = new QueueResource("tasks", {});
    const worker = new WorkerResource("processor", {
      entrypoint: "./src/index.ts",
      bindings: { FILES: bucket, TASKS: queue },
    });
    expect(worker.dependencies.size).toBe(2);
    expect(worker.dependencies.has(bucket)).toBe(true);
    expect(worker.dependencies.has(queue)).toBe(true);
  });

  it("worker without bindings has no dependencies", () => {
    const worker = new WorkerResource("api", { entrypoint: "./src/index.ts" });
    expect(worker.dependencies.size).toBe(0);
  });

  it("worker with empty bindings has no dependencies", () => {
    const worker = new WorkerResource("api", { entrypoint: "./src/index.ts", bindings: {} });
    expect(worker.dependencies.size).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Worker dependency collection from consumers
// ---------------------------------------------------------------------------

describe("Worker dependency collection from consumers", () => {
  it("worker with queue consumer has queue as dependency", () => {
    const queue = new QueueResource("tasks", {});
    const worker = new WorkerResource("processor", {
      entrypoint: "./src/processor.ts",
      consumers: [{ queue }],
    });
    expect(worker.dependencies.has(queue)).toBe(true);
  });

  it("worker with multiple consumers has all queues as dependencies", () => {
    const q1 = new QueueResource("tasks", {});
    const q2 = new QueueResource("events", {});
    const worker = new WorkerResource("processor", {
      entrypoint: "./src/processor.ts",
      consumers: [{ queue: q1 }, { queue: q2 }],
    });
    expect(worker.dependencies.has(q1)).toBe(true);
    expect(worker.dependencies.has(q2)).toBe(true);
    expect(worker.dependencies.size).toBe(2);
  });

  it("worker with consumer + dead letter queue has both as dependencies", () => {
    const q = new QueueResource("tasks", {});
    const dlq = new QueueResource("dead-letters", {});
    const worker = new WorkerResource("processor", {
      entrypoint: "./src/processor.ts",
      consumers: [{ queue: q, deadLetterQueue: dlq }],
    });
    expect(worker.dependencies.has(q)).toBe(true);
    expect(worker.dependencies.has(dlq)).toBe(true);
    expect(worker.dependencies.size).toBe(2);
  });

  it("worker without consumers has no consumer dependencies", () => {
    const worker = new WorkerResource("api", { entrypoint: "./src/index.ts" });
    expect(worker.dependencies.size).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Worker dependency collection from ServiceBindingRef
// ---------------------------------------------------------------------------

describe("Worker dependency collection from ServiceBindingRef", () => {
  it("worker with api.asService() has api as dependency", () => {
    const api = new WorkerResource("api", { entrypoint: "./api/index.ts" });
    const web = new WorkerResource("web", {
      entrypoint: "./web/index.ts",
      bindings: { API: api.asService() },
    });
    expect(web.dependencies.has(api)).toBe(true);
  });

  it("worker with multiple service bindings has all as dependencies", () => {
    const api = new WorkerResource("api", { entrypoint: "./api/index.ts" });
    const auth = new WorkerResource("auth", { entrypoint: "./auth/index.ts" });
    const web = new WorkerResource("web", {
      entrypoint: "./web/index.ts",
      bindings: { API: api.asService(), AUTH: auth.asService() },
    });
    expect(web.dependencies.has(api)).toBe(true);
    expect(web.dependencies.has(auth)).toBe(true);
    expect(web.dependencies.size).toBe(2);
  });

  it("worker with mixed resource and service bindings collects all", () => {
    const db = new D1Resource("db", {});
    const api = new WorkerResource("api", { entrypoint: "./api/index.ts" });
    const web = new WorkerResource("web", {
      entrypoint: "./web/index.ts",
      bindings: { DB: db, API: api.asService() },
    });
    expect(web.dependencies.has(db)).toBe(true);
    expect(web.dependencies.has(api)).toBe(true);
    expect(web.dependencies.size).toBe(2);
  });

  it("ServiceBindingRef without source does not add a dependency", () => {
    const ref = new ServiceBindingRef("external-worker");
    const web = new WorkerResource("web", {
      entrypoint: "./web/index.ts",
      bindings: { EXT: ref },
    });
    // No source on the ref, so no dependency should be added
    expect(web.dependencies.size).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// toGraphNode() comprehensive
// ---------------------------------------------------------------------------

describe("toGraphNode()", () => {
  it("returns correct structure for a resource with no dependencies", () => {
    const r = new D1Resource("db", {});
    expect(r.toGraphNode()).toEqual({
      type: "d1",
      name: "db",
      dependencies: [],
    });
  });

  it("returns correct structure for a resource with dependencies", () => {
    const db = new D1Resource("db", {});
    const kv = new KVResource("cache", {});
    const worker = new WorkerResource("api", {
      entrypoint: "./src/index.ts",
      bindings: { DB: db, CACHE: kv },
    });
    const node = worker.toGraphNode();
    expect(node.type).toBe("worker");
    expect(node.name).toBe("api");
    expect(node.dependencies.sort()).toEqual(["cache", "db"]);
  });

  it("returns dependency names as strings, not resource objects", () => {
    const db = new D1Resource("db", {});
    const worker = new WorkerResource("api", {
      entrypoint: "./src/index.ts",
      bindings: { DB: db },
    });
    const node = worker.toGraphNode();
    for (const dep of node.dependencies) {
      expect(typeof dep).toBe("string");
    }
  });

  it("each resource type returns its own type string", () => {
    const cases: [Resource, string][] = [
      [new D1Resource("a", {}), "d1"],
      [new KVResource("b", {}), "kv"],
      [new R2Resource("c", {}), "r2"],
      [new QueueResource("d", {}), "queue"],
      [new DurableObjectResource("e", { className: "E" }), "durable-object"],
      [new VectorizeResource("f", { dimensions: 1, metric: "cosine" }), "vectorize"],
      [new HyperdriveResource("g", { connectionString: "pg://x" }), "hyperdrive"],
      [new WorkersAIResource("h", {}), "workers-ai"],
      [new AIGatewayResource("i", { id: "i" }), "ai-gateway"],
      [new DomainResource("j", {}), "domain"],
      [new WorkflowResource("k", { className: "K" }), "workflow"],
      [new TailWorkerResource("l", { entrypoint: "./l.ts" }), "tail-worker"],
      [new MTLSResource("m", { certificateId: "m" }), "mtls"],
      [new SecretResource("n", { secretName: "N" }), "secret"],
      [new WorkerResource("o", { entrypoint: "./o.ts" }), "worker"],
    ];

    for (const [resource, expectedType] of cases) {
      const node = resource.toGraphNode();
      expect(node.type).toBe(expectedType);
      expect(node.name).toBe(resource.name);
    }
  });
});
