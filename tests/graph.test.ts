import { describe, it, expect, beforeEach } from "vitest";
import { AppGraph } from "../src/graph.js";
import {
  Resource,
  ServiceBindingRef,
  WorkerResource,
  D1Resource,
  KVResource,
  R2Resource,
  QueueResource,
} from "../src/resources/index.js";

// ─── Helpers ───────────────────────────────────────────────────────

function makeD1(name: string): D1Resource {
  return new D1Resource(name, {});
}

function makeKV(name: string): KVResource {
  return new KVResource(name, {});
}

function makeR2(name: string): R2Resource {
  return new R2Resource(name, {});
}

function makeQueue(name: string): QueueResource {
  return new QueueResource(name, {});
}

function makeWorker(
  name: string,
  bindings?: Record<string, Resource | ServiceBindingRef>,
): WorkerResource {
  return new WorkerResource(name, {
    entrypoint: `./src/${name}/index.ts`,
    bindings,
  });
}

// ─── Tests ─────────────────────────────────────────────────────────

describe("AppGraph", () => {
  let graph: AppGraph;

  beforeEach(() => {
    graph = new AppGraph();
  });

  // ── Basic operations ──────────────────────────────────────────

  describe("basic operations", () => {
    it("adds a resource and retrieves it by name", () => {
      const db = makeD1("main-db");
      graph.add(db);

      expect(graph.get("main-db")).toBe(db);
    });

    it("reports correct size after adding multiple resources", () => {
      graph.add(makeD1("db-1"));
      graph.add(makeKV("cache"));
      graph.add(makeR2("uploads"));

      expect(graph.size).toBe(3);
    });

    it("returns all resources via nodes getter", () => {
      const db = makeD1("db");
      const kv = makeKV("kv");
      graph.add(db);
      graph.add(kv);

      const nodes = graph.nodes;
      expect(nodes).toHaveLength(2);
      expect(nodes).toContain(db);
      expect(nodes).toContain(kv);
    });

    it("returns all resources via all()", () => {
      const db = makeD1("db");
      graph.add(db);

      const all = graph.all();
      expect(all).toHaveLength(1);
      expect(all[0]).toBe(db);
    });

    it("returns undefined when getting a nonexistent resource", () => {
      expect(graph.get("does-not-exist")).toBeUndefined();
    });

    it("throws on duplicate resource name", () => {
      graph.add(makeD1("shared-name"));

      expect(() => graph.add(makeKV("shared-name"))).toThrowError(
        /Duplicate resource name "shared-name"/,
      );
    });

    it("size is 0 for an empty graph", () => {
      expect(graph.size).toBe(0);
    });

    it("nodes returns empty array for an empty graph", () => {
      expect(graph.nodes).toEqual([]);
    });
  });

  // ── Edges and dependencies ────────────────────────────────────

  describe("edges and dependencies", () => {
    it("creates an edge when a worker binds to a D1 resource", () => {
      const db = makeD1("my-db");
      const worker = makeWorker("api", { DB: db });

      graph.add(db);
      graph.add(worker);

      const edges = graph.edges;
      expect(edges.get("api")!.has("my-db")).toBe(true);
    });

    it("creates edges when a worker binds to multiple resources", () => {
      const db = makeD1("db");
      const kv = makeKV("cache");
      const r2 = makeR2("uploads");
      const worker = makeWorker("api", { DB: db, CACHE: kv, UPLOADS: r2 });

      graph.add(db);
      graph.add(kv);
      graph.add(r2);
      graph.add(worker);

      const workerEdges = graph.edges.get("api")!;
      expect(workerEdges.has("db")).toBe(true);
      expect(workerEdges.has("cache")).toBe(true);
      expect(workerEdges.has("uploads")).toBe(true);
      expect(workerEdges.size).toBe(3);
    });

    it("creates an edge when a worker uses a service binding", () => {
      const target = makeWorker("auth-worker");
      const consumer = makeWorker("api", { AUTH: target.asService() });

      graph.add(target);
      graph.add(consumer);

      expect(graph.edges.get("api")!.has("auth-worker")).toBe(true);
    });

    it("getDependencies returns correct resources", () => {
      const db = makeD1("db");
      const kv = makeKV("cache");
      const worker = makeWorker("api", { DB: db, CACHE: kv });

      graph.add(db);
      graph.add(kv);
      graph.add(worker);

      const deps = graph.getDependencies("api");
      expect(deps).toHaveLength(2);
      expect(deps).toContain(db);
      expect(deps).toContain(kv);
    });

    it("getDependencies returns empty array for resource with no deps", () => {
      graph.add(makeD1("standalone"));

      expect(graph.getDependencies("standalone")).toEqual([]);
    });

    it("getDependencies returns empty array for unknown resource", () => {
      expect(graph.getDependencies("nonexistent")).toEqual([]);
    });

    it("resource with no bindings has an empty edge set", () => {
      const db = makeD1("db");
      graph.add(db);

      expect(graph.edges.get("db")!.size).toBe(0);
    });

    it("addEdge can manually add an edge between resources", () => {
      const db = makeD1("db");
      const kv = makeKV("cache");
      graph.add(db);
      graph.add(kv);

      graph.addEdge("cache", "db");

      expect(graph.edges.get("cache")!.has("db")).toBe(true);
    });
  });

  // ── Topological sort ──────────────────────────────────────────

  describe("topologicalSort", () => {
    it("returns a single resource when the graph has one node", () => {
      const db = makeD1("db");
      graph.add(db);

      const sorted = graph.topologicalSort();
      expect(sorted).toEqual([db]);
    });

    it("returns all independent resources (any order)", () => {
      const db = makeD1("db");
      const kv = makeKV("cache");
      const r2 = makeR2("uploads");

      graph.add(db);
      graph.add(kv);
      graph.add(r2);

      const sorted = graph.topologicalSort();
      expect(sorted).toHaveLength(3);
      expect(sorted).toContain(db);
      expect(sorted).toContain(kv);
      expect(sorted).toContain(r2);
    });

    it("places D1 before the worker that depends on it", () => {
      const db = makeD1("db");
      const worker = makeWorker("api", { DB: db });

      graph.add(db);
      graph.add(worker);

      const sorted = graph.topologicalSort();
      const dbIdx = sorted.indexOf(db);
      const workerIdx = sorted.indexOf(worker);

      expect(dbIdx).toBeLessThan(workerIdx);
    });

    it("respects a chain: D1 → Worker A → Worker B (via service binding)", () => {
      const db = makeD1("db");
      const workerA = makeWorker("worker-a", { DB: db });
      const workerB = makeWorker("worker-b", { SERVICE_A: workerA.asService() });

      graph.add(db);
      graph.add(workerA);
      graph.add(workerB);

      const sorted = graph.topologicalSort();
      const names = sorted.map((r) => r.name);

      expect(names.indexOf("db")).toBeLessThan(names.indexOf("worker-a"));
      expect(names.indexOf("worker-a")).toBeLessThan(names.indexOf("worker-b"));
    });

    it("handles a diamond dependency graph correctly", () => {
      // D1 is used by Worker A and Worker B.
      // Worker C depends on both Worker A and Worker B.
      // Expected: D1 first, then A and B (either order), then C.
      const db = makeD1("db");
      const workerA = makeWorker("worker-a", { DB: db });
      const workerB = makeWorker("worker-b", { DB: db });
      const workerC = makeWorker("worker-c", {
        SVC_A: workerA.asService(),
        SVC_B: workerB.asService(),
      });

      graph.add(db);
      graph.add(workerA);
      graph.add(workerB);
      graph.add(workerC);

      const sorted = graph.topologicalSort();
      const names = sorted.map((r) => r.name);

      // D1 must come before everything
      expect(names.indexOf("db")).toBe(0);

      // Worker A and B must come before Worker C
      expect(names.indexOf("worker-a")).toBeLessThan(names.indexOf("worker-c"));
      expect(names.indexOf("worker-b")).toBeLessThan(names.indexOf("worker-c"));

      // Worker C must be last
      expect(names.indexOf("worker-c")).toBe(3);
    });

    it("returns independent workers in a consistent order", () => {
      const w1 = makeWorker("alpha");
      const w2 = makeWorker("bravo");
      const w3 = makeWorker("charlie");

      graph.add(w1);
      graph.add(w2);
      graph.add(w3);

      const sorted1 = graph.topologicalSort().map((r) => r.name);
      const sorted2 = graph.topologicalSort().map((r) => r.name);

      // Same graph should produce the same order on repeated calls
      expect(sorted1).toEqual(sorted2);
    });

    it("handles a complex graph with mixed resource types", () => {
      const db = makeD1("db");
      const kv = makeKV("cache");
      const r2 = makeR2("uploads");
      const worker1 = makeWorker("api", { DB: db, CACHE: kv });
      const worker2 = makeWorker("uploader", { UPLOADS: r2 });
      const gateway = makeWorker("gateway", {
        API: worker1.asService(),
        UPLOADER: worker2.asService(),
      });

      graph.add(db);
      graph.add(kv);
      graph.add(r2);
      graph.add(worker1);
      graph.add(worker2);
      graph.add(gateway);

      const sorted = graph.topologicalSort();
      const names = sorted.map((r) => r.name);

      // Primitives before workers that use them
      expect(names.indexOf("db")).toBeLessThan(names.indexOf("api"));
      expect(names.indexOf("cache")).toBeLessThan(names.indexOf("api"));
      expect(names.indexOf("uploads")).toBeLessThan(names.indexOf("uploader"));

      // Workers before the gateway that depends on them
      expect(names.indexOf("api")).toBeLessThan(names.indexOf("gateway"));
      expect(names.indexOf("uploader")).toBeLessThan(names.indexOf("gateway"));
    });

    it("returns an empty array for an empty graph", () => {
      expect(graph.topologicalSort()).toEqual([]);
    });
  });

  // ── Cycle detection / validation ──────────────────────────────

  describe("validate and cycle detection", () => {
    it("validates a correct graph without throwing", () => {
      const db = makeD1("db");
      const worker = makeWorker("api", { DB: db });

      graph.add(db);
      graph.add(worker);

      expect(() => graph.validate()).not.toThrow();
    });

    it("throws on a 2-node cycle (A depends on B, B depends on A)", () => {
      const workerA = makeWorker("a");
      const workerB = makeWorker("b");

      graph.add(workerA);
      graph.add(workerB);

      // Manually create a cycle since constructors can't create circular deps
      graph.addEdge("a", "b");
      graph.addEdge("b", "a");

      expect(() => graph.validate()).toThrowError(/Circular dependency/);
    });

    it("throws on a 3-node cycle (A → B → C → A)", () => {
      const a = makeWorker("a");
      const b = makeWorker("b");
      const c = makeWorker("c");

      graph.add(a);
      graph.add(b);
      graph.add(c);

      graph.addEdge("a", "b");
      graph.addEdge("b", "c");
      graph.addEdge("c", "a");

      expect(() => graph.validate()).toThrowError(/Circular dependency/);
    });

    it("throws on a self-dependency", () => {
      const worker = makeWorker("self-ref");
      graph.add(worker);

      graph.addEdge("self-ref", "self-ref");

      expect(() => graph.validate()).toThrowError(/Circular dependency/);
    });

    it("includes the involved resource names in cycle error message", () => {
      const a = makeWorker("alpha");
      const b = makeWorker("bravo");

      graph.add(a);
      graph.add(b);

      graph.addEdge("alpha", "bravo");
      graph.addEdge("bravo", "alpha");

      expect(() => graph.validate()).toThrowError(/alpha/);
      expect(() => graph.validate()).toThrowError(/bravo/);
    });

    it("throws on dangling dependency (edge to nonexistent resource)", () => {
      const worker = makeWorker("api");
      graph.add(worker);

      graph.addEdge("api", "missing-db");

      expect(() => graph.validate()).toThrowError(/missing-db/);
      expect(() => graph.validate()).toThrowError(/not in the graph/);
    });

    it("validate passes on an empty graph", () => {
      expect(() => graph.validate()).not.toThrow();
    });
  });

  // ── Filtering ─────────────────────────────────────────────────

  describe("filtering", () => {
    it("getByType('d1') returns only D1 resources", () => {
      const db1 = makeD1("db-1");
      const db2 = makeD1("db-2");
      const kv = makeKV("cache");
      const worker = makeWorker("api");

      graph.add(db1);
      graph.add(db2);
      graph.add(kv);
      graph.add(worker);

      const d1s = graph.getByType("d1");
      expect(d1s).toHaveLength(2);
      expect(d1s).toContain(db1);
      expect(d1s).toContain(db2);
    });

    it("getByType('worker') returns only worker resources", () => {
      const db = makeD1("db");
      const w1 = makeWorker("api");
      const w2 = makeWorker("web");

      graph.add(db);
      graph.add(w1);
      graph.add(w2);

      const workers = graph.getByType("worker");
      expect(workers).toHaveLength(2);
      expect(workers).toContain(w1);
      expect(workers).toContain(w2);
    });

    it("getByType returns empty array when no resources match", () => {
      graph.add(makeD1("db"));

      expect(graph.getByType("kv")).toEqual([]);
    });

    it("getWorkers() returns only WorkerResource instances", () => {
      const db = makeD1("db");
      const kv = makeKV("cache");
      const w1 = makeWorker("api");
      const w2 = makeWorker("web");

      graph.add(db);
      graph.add(kv);
      graph.add(w1);
      graph.add(w2);

      const workers = graph.getWorkers();
      expect(workers).toHaveLength(2);
      expect(workers[0]).toBeInstanceOf(WorkerResource);
      expect(workers[1]).toBeInstanceOf(WorkerResource);
      expect(workers).toContain(w1);
      expect(workers).toContain(w2);
    });

    it("getWorkers() returns empty array when there are no workers", () => {
      graph.add(makeD1("db"));
      graph.add(makeKV("cache"));

      expect(graph.getWorkers()).toEqual([]);
    });
  });

  // ── Serialization ─────────────────────────────────────────────

  describe("serialize", () => {
    it("returns an object with version, resources, and edges", () => {
      const db = makeD1("db");
      graph.add(db);

      const serialized = graph.serialize() as any;

      expect(serialized).toHaveProperty("version", 1);
      expect(serialized).toHaveProperty("resources");
      expect(serialized).toHaveProperty("edges");
    });

    it("resources array contains type, name, and dependencies for each node", () => {
      const db = makeD1("db");
      const worker = makeWorker("api", { DB: db });

      graph.add(db);
      graph.add(worker);

      const serialized = graph.serialize() as any;
      const dbNode = serialized.resources.find((r: any) => r.name === "db");
      const workerNode = serialized.resources.find((r: any) => r.name === "api");

      expect(dbNode).toEqual({
        type: "d1",
        name: "db",
        dependencies: [],
      });

      expect(workerNode).toEqual({
        type: "worker",
        name: "api",
        dependencies: ["db"],
      });
    });

    it("edges object maps resource names to arrays of dependency names", () => {
      const db = makeD1("db");
      const kv = makeKV("cache");
      const worker = makeWorker("api", { DB: db, CACHE: kv });

      graph.add(db);
      graph.add(kv);
      graph.add(worker);

      const serialized = graph.serialize() as any;

      expect(serialized.edges["db"]).toEqual([]);
      expect(serialized.edges["cache"]).toEqual([]);
      expect(serialized.edges["api"]).toEqual(
        expect.arrayContaining(["db", "cache"]),
      );
      expect(serialized.edges["api"]).toHaveLength(2);
    });

    it("serializes an empty graph correctly", () => {
      const serialized = graph.serialize() as any;

      expect(serialized).toEqual({
        version: 1,
        resources: [],
        edges: {},
      });
    });

    it("serialize output is JSON-serializable (round-trips through JSON)", () => {
      const db = makeD1("db");
      const worker = makeWorker("api", { DB: db });

      graph.add(db);
      graph.add(worker);

      const serialized = graph.serialize();
      const json = JSON.stringify(serialized);
      const parsed = JSON.parse(json);

      expect(parsed.version).toBe(1);
      expect(parsed.resources).toHaveLength(2);
      expect(parsed.edges.api).toContain("db");
    });

    it("includes service binding edges in serialized output", () => {
      const target = makeWorker("auth");
      const consumer = makeWorker("api", { AUTH: target.asService() });

      graph.add(target);
      graph.add(consumer);

      const serialized = graph.serialize() as any;

      expect(serialized.edges["api"]).toContain("auth");
      expect(serialized.resources.find((r: any) => r.name === "api").dependencies).toContain("auth");
    });
  });
});
