import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { resolve, dirname } from "node:path";
import { mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";
import { FlareApp } from "../src/app.js";
import { WranglerGenerator } from "../src/generators/wrangler.js";
import {
  extractD1DatabaseId,
  extractKvNamespaceId,
  extractR2BucketName,
  extractQueueName,
  updateD1BindingInConfig,
  updateKvBindingInConfig,
  updateR2BindingInConfig,
  updateVectorizeBindingInConfig,
  buildVectorizeArgs,
  applyMigrations,
  PROVISIONABLE_TYPES,
} from "../src/cli/commands/provision.js";
import { VectorizeResource } from "../src/resources/vectorize.js";

vi.mock("node:child_process", () => ({
  execSync: vi.fn(),
}));

function makeApp() {
  return new FlareApp("test-app", {
    compatibility_date: "2026-04-01",
  } as any);
}

let tmpDir: string;
beforeEach(() => {
  tmpDir = resolve(process.cwd(), `.test-tmp-${Date.now()}`);
  mkdirSync(tmpDir, { recursive: true });
  vi.clearAllMocks();
});
afterEach(() => {
  try {
    rmSync(tmpDir, { recursive: true, force: true });
  } catch {}
});

function writeConfig(workerName: string, content: object) {
  const configPath = resolve(tmpDir, "workers", workerName, "wrangler.jsonc");
  mkdirSync(dirname(configPath), { recursive: true });
  writeFileSync(configPath, JSON.stringify(content, null, 2), "utf-8");
  return configPath;
}

describe("extractD1DatabaseId", () => {
  it("extracts database_id from wrangler JSON output", () => {
    const output = `{"d1_databases":[{"binding":"DB","database_name":"my-db","database_id":"fa9ee4c0-7586-4d11-94d6-0bd4f54a158d"}]}`;
    expect(extractD1DatabaseId(output)).toBe("fa9ee4c0-7586-4d11-94d6-0bd4f54a158d");
  });

  it("returns null when database_id not found", () => {
    expect(extractD1DatabaseId("no id here")).toBeNull();
    expect(extractD1DatabaseId("")).toBeNull();
  });
});

describe("extractKvNamespaceId", () => {
  it("extracts id from kv wrangler JSON output", () => {
    const output = `{"kv_namespaces":[{"binding":"CACHE","id":"7ff98c11f8d1444f95972e496939caf9"}]}`;
    expect(extractKvNamespaceId(output)).toBe("7ff98c11f8d1444f95972e496939caf9");
  });

  it("returns null when id not found", () => {
    expect(extractKvNamespaceId("no id here")).toBeNull();
  });
});

describe("extractR2BucketName", () => {
  it("extracts bucket_name from wrangler JSON output", () => {
    const output = `{"r2_buckets":[{"bucket_name":"my-uploads","binding":"UPLOADS"}]}`;
    expect(extractR2BucketName(output)).toBe("my-uploads");
  });
});

describe("extractQueueName", () => {
  it("extracts queue name from Created message", () => {
    const output = "Creating queue 'background-jobs'...\n✅ Created queue 'background-jobs'";
    expect(extractQueueName(output)).toBe("background-jobs");
  });

  it("returns null when queue name not found", () => {
    expect(extractQueueName("no queue here")).toBeNull();
  });

  it("handles queue names with dots", () => {
    const output = "Created queue 'my.queue.prod'";
    expect(extractQueueName(output)).toBe("my.queue.prod");
  });
});

describe("WranglerGenerator — ID injection", () => {
  it("uses explicit databaseId for D1 binding", () => {
    const app = makeApp();
    const db = app.addD1("main-db", { databaseId: "explicit-db-uuid" });
    const w = app.addWorker("api", { entrypoint: "./src/index.ts", bindings: { DB: db } });
    const cfg = new WranglerGenerator(app).generateForWorker(w);
    expect(cfg.d1_databases![0].database_id).toBe("explicit-db-uuid");
  });

  it("uses explicit namespaceId for KV binding", () => {
    const app = makeApp();
    const kv = app.addKV("cache", { namespaceId: "explicit-ns-id" });
    const w = app.addWorker("api", { entrypoint: "./src/index.ts", bindings: { CACHE: kv } });
    const cfg = new WranglerGenerator(app).generateForWorker(w);
    expect(cfg.kv_namespaces![0].id).toBe("explicit-ns-id");
  });

  it("uses explicit bucketName for R2 binding", () => {
    const app = makeApp();
    const bucket = app.addR2("uploads", { bucketName: "my-bucket-name" });
    const w = app.addWorker("api", { entrypoint: "./src/index.ts", bindings: { UPLOADS: bucket } });
    const cfg = new WranglerGenerator(app).generateForWorker(w);
    expect(cfg.r2_buckets![0].bucket_name).toBe("my-bucket-name");
  });

  it("uses explicit indexId for Vectorize binding", () => {
    const app = makeApp();
    const vec = app.addVectorize("search", { dimensions: 768, metric: "cosine", indexId: "explicit-index-id" });
    const w = app.addWorker("api", { entrypoint: "./src/index.ts", bindings: { SEARCH: vec } });
    const cfg = new WranglerGenerator(app).generateForWorker(w);
    expect(cfg.vectorize![0].index_name).toBe("explicit-index-id");
  });

  it("falls back to resource name for Vectorize when indexId not set", () => {
    const app = makeApp();
    const vec = app.addVectorize("my-index", { dimensions: 512, metric: "euclidean" });
    const w = app.addWorker("api", { entrypoint: "./src/index.ts", bindings: { VEC: vec } });
    const cfg = new WranglerGenerator(app).generateForWorker(w);
    expect(cfg.vectorize![0].index_name).toBe("my-index");
  });
});

describe("updateD1BindingInConfig", () => {
  it("updates database_id in the matching D1 binding", () => {
    const path = writeConfig("api", { name: "api", d1_databases: [{ binding: "DB", database_name: "main-db", database_id: "" }] });
    updateD1BindingInConfig(path, "DB", "new-uuid-12345");
    const updated = JSON.parse(readFileSync(path, "utf-8"));
    expect(updated.d1_databases[0].database_id).toBe("new-uuid-12345");
  });

  it("only updates the binding with matching name", () => {
    const path = writeConfig("api", {
      name: "api",
      d1_databases: [
        { binding: "DB", database_name: "main-db", database_id: "" },
        { binding: "ANALYTICS", database_name: "analytics-db", database_id: "" },
      ],
    });
    updateD1BindingInConfig(path, "DB", "only-this-one");
    const updated = JSON.parse(readFileSync(path, "utf-8"));
    expect(updated.d1_databases[0].database_id).toBe("only-this-one");
    expect(updated.d1_databases[1].database_id).toBe("");
  });

  it("no-ops when no d1_databases array", () => {
    const path = writeConfig("api", { name: "api" });
    const before = readFileSync(path, "utf-8");
    updateD1BindingInConfig(path, "DB", "should-not-appear");
    const after = readFileSync(path, "utf-8");
    expect(after).toBe(before);
  });
});

describe("updateKvBindingInConfig", () => {
  it("updates id in the matching KV binding", () => {
    const path = writeConfig("api", { name: "api", kv_namespaces: [{ binding: "CACHE", id: "" }] });
    updateKvBindingInConfig(path, "CACHE", "kv-namespace-uuid");
    const updated = JSON.parse(readFileSync(path, "utf-8"));
    expect(updated.kv_namespaces[0].id).toBe("kv-namespace-uuid");
  });
});

describe("updateR2BindingInConfig", () => {
  it("updates bucket_name in the matching R2 binding", () => {
    const path = writeConfig("api", { name: "api", r2_buckets: [{ binding: "UPLOADS", bucket_name: "" }] });
    updateR2BindingInConfig(path, "UPLOADS", "my-real-bucket");
    const updated = JSON.parse(readFileSync(path, "utf-8"));
    expect(updated.r2_buckets[0].bucket_name).toBe("my-real-bucket");
  });
});

describe("updateVectorizeBindingInConfig", () => {
  it("updates index_name in the matching Vectorize binding", () => {
    const path = writeConfig("api", { name: "api", vectorize: [{ binding: "SEARCH", index_name: "temp-name" }] });
    updateVectorizeBindingInConfig(path, "SEARCH", "real-index-name");
    const updated = JSON.parse(readFileSync(path, "utf-8"));
    expect(updated.vectorize[0].index_name).toBe("real-index-name");
  });
});

describe("buildVectorizeArgs", () => {
  it("uses configured dimensions and metric", () => {
    const vec = new VectorizeResource("search", { dimensions: 1536, metric: "cosine" });
    const args = buildVectorizeArgs("search", vec);
    expect(args).toContain("--dimensions");
    expect(args).toContain("1536");
    expect(args).toContain("--metric");
    expect(args).toContain("cosine");
  });

  it("sets resource name first after 'create'", () => {
    const vec = new VectorizeResource("my-index", { dimensions: 512, metric: "dot-product" });
    const args = buildVectorizeArgs("my-index", vec);
    const createIdx = args.indexOf("create");
    expect(args[createIdx + 1]).toBe("my-index");
  });
});

describe("applyMigrations", () => {
  it("skips when migrationsDir is undefined", () => {
    applyMigrations(undefined, "my-db");
    expect(execSync).not.toHaveBeenCalled();
  });

  it("skips when migrationsDir is empty string", () => {
    applyMigrations("", "my-db");
    expect(execSync).not.toHaveBeenCalled();
  });
});

describe("PROVISIONABLE_TYPES", () => {
  it("contains d1, kv, r2, queue, vectorize", () => {
    expect(PROVISIONABLE_TYPES.has("d1")).toBe(true);
    expect(PROVISIONABLE_TYPES.has("kv")).toBe(true);
    expect(PROVISIONABLE_TYPES.has("r2")).toBe(true);
    expect(PROVISIONABLE_TYPES.has("queue")).toBe(true);
    expect(PROVISIONABLE_TYPES.has("vectorize")).toBe(true);
  });

  it("does not contain hyperdrive", () => {
    expect(PROVISIONABLE_TYPES.has("hyperdrive")).toBe(false);
  });

  it("does not contain domain", () => {
    expect(PROVISIONABLE_TYPES.has("domain")).toBe(false);
  });

  it("contains dispatch-namespace", () => {
    expect(PROVISIONABLE_TYPES.has("dispatch-namespace")).toBe(true);
  });

  it("has exactly 6 types", () => {
    expect(PROVISIONABLE_TYPES.size).toBe(6);
  });
});
