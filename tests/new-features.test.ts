import { describe, it, expect, vi, beforeEach } from "vitest";
import { resolve, dirname } from "node:path";
import { mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { FlareApp } from "../src/app.js";
import { WranglerGenerator } from "../src/generators/wrangler.js";
import { WorkerResource } from "../src/resources/worker.js";
import { D1Resource } from "../src/resources/d1.js";
import { KVResource } from "../src/resources/kv.js";
import { VectorizeResource } from "../src/resources/vectorize.js";
import { WorkersAIResource } from "../src/resources/ai.js";
import { DomainResource } from "../src/resources/domain.js";

// ---------------------------------------------------------------------------
// lineDiff — extracted from diff.ts for unit testing
// ---------------------------------------------------------------------------

function lineDiff(existing: string, generated: string): {
  added: string[];
  removed: string[];
  changed: Array<{ old: string; new: string }>;
} {
  if (existing === generated) return { added: [], removed: [], changed: [] };

  const existingLines = existing.split("\n");
  const generatedLines = generated.split("\n");

  const removed: string[] = [];
  const added: string[] = [];
  const changed: Array<{ old: string; new: string }> = [];

  const existingSet = new Set(existingLines);
  const generatedSet = new Set(generatedLines);

  for (const line of generatedLines) {
    if (!existingSet.has(line)) {
      added.push(line);
    }
  }

  for (const line of existingLines) {
    if (!generatedSet.has(line)) {
      removed.push(line);
    }
  }

  const removedTrimmed = new Map<string, number>();
  for (let idx = 0; idx < removed.length; idx++) {
    const trimmed = removed[idx].trim();
    if (!removedTrimmed.has(trimmed)) {
      removedTrimmed.set(trimmed, idx);
    }
  }

  const pairedRemoved: number[] = [];
  const pairedAdded: number[] = [];
  for (let ai = 0; ai < added.length; ai++) {
    const trimmed = added[ai].trim();
    const ri = removedTrimmed.get(trimmed);
    if (ri !== undefined && !pairedRemoved.includes(ri)) {
      pairedRemoved.push(ri);
      pairedAdded.push(ai);
      changed.push({ old: removed[ri], new: added[ai] });
    }
  }

  if (changed.length === 0 && removed.length === 1 && added.length === 1) {
    const oldTrimmed = removed[0].trim();
    const newTrimmed = added[0].trim();
    if (oldTrimmed.length === newTrimmed.length && oldTrimmed.length > 5) {
      let commonPrefixLen = 0;
      const maxPrefix = Math.min(oldTrimmed.length, newTrimmed.length);
      while (commonPrefixLen < maxPrefix && oldTrimmed[commonPrefixLen] === newTrimmed[commonPrefixLen]) {
        commonPrefixLen++;
      }
      if (commonPrefixLen >= 8) {
        changed.push({ old: removed[0], new: added[0] });
        return { added: [], removed: [], changed };
      }
    }
  }

  for (let i = pairedRemoved.length - 1; i >= 0; i--) {
    removed.splice(pairedRemoved[i], 1);
  }
  for (let i = pairedAdded.length - 1; i >= 0; i--) {
    added.splice(pairedAdded[i], 1);
  }

  return { added, removed, changed };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeApp() {
  return new FlareApp("test-app", {
    compatibility_date: "2026-04-01",
  } as any);
}

let tmpDir: string;
beforeEach(() => {
  tmpDir = resolve(process.cwd(), `.test-tmp-${Date.now()}-${Math.random()}`);
  mkdirSync(tmpDir, { recursive: true });
});

// ---------------------------------------------------------------------------
// lineDiff
// ---------------------------------------------------------------------------

describe("lineDiff", () => {
  it("returns empty arrays when configs are identical", () => {
    const config = '{\n  "name": "api"\n}';
    const result = lineDiff(config, config);
    expect(result.added).toHaveLength(0);
    expect(result.removed).toHaveLength(0);
    expect(result.changed).toHaveLength(0);
  });

  it("detects added lines", () => {
    const existing = '{\n  "name": "api"\n}';
    const generated = '{\n  "name": "api",\n  "main": "./src/index.ts"\n}';
    const result = lineDiff(existing, generated);
    expect(result.added).toContain('  "main": "./src/index.ts"');
    expect(result.changed).toHaveLength(0);
  });

  it("detects removed lines", () => {
    const existing = '{\n  "name": "api",\n  "main": "./src/index.ts"\n}';
    const generated = '{\n  "name": "api"\n}';
    const result = lineDiff(existing, generated);
    expect(result.removed).toContain('  "main": "./src/index.ts"');
  });

  it("detects changed lines", () => {
    const existing = '  "name": "api"';
    const generated = '  "name": "web"';
    const result = lineDiff(existing, generated);
    expect(result.changed).toHaveLength(1);
    expect(result.changed[0].old).toBe('  "name": "api"');
    expect(result.changed[0].new).toBe('  "name": "web"');
  });

  it("handles empty strings", () => {
    const result = lineDiff("", "");
    expect(result.added).toHaveLength(0);
    expect(result.removed).toHaveLength(0);
  });

  it("handles completely different content", () => {
    const existing = "line1\nline2\nline3";
    const generated = "a\nb\nc";
    const result = lineDiff(existing, generated);
    expect(result.removed).toContain("line1");
    expect(result.removed).toContain("line2");
    expect(result.removed).toContain("line3");
    expect(result.added).toContain("a");
    expect(result.added).toContain("b");
    expect(result.added).toContain("c");
  });
});

// ---------------------------------------------------------------------------
// WranglerGenerator — workers with env flag produces correct outDir path
// ---------------------------------------------------------------------------

describe("WranglerGenerator — env-aware output", () => {
  it("generates configs for a worker with multiple bindings", () => {
    const app = makeApp();
    const db = app.addD1("main-db", { databaseId: "test-uuid" });
    const kv = app.addKV("cache", { namespaceId: "kv-uuid" });
    const worker = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { DB: db, CACHE: kv },
    });

    const gen = new WranglerGenerator(app);
    const cfg = gen.generateForWorker(worker);

    expect(cfg.name).toBe("api");
    expect(cfg.d1_databases).toHaveLength(1);
    expect(cfg.d1_databases![0].binding).toBe("DB");
    expect(cfg.d1_databases![0].database_id).toBe("test-uuid");
    expect(cfg.kv_namespaces).toHaveLength(1);
    expect(cfg.kv_namespaces![0].binding).toBe("CACHE");
    expect(cfg.kv_namespaces![0].id).toBe("kv-uuid");
  });

  it("Vectorize uses indexId from options when set", () => {
    const app = makeApp();
    const vec = app.addVectorize("search", {
      dimensions: 768,
      metric: "cosine",
      indexId: "my-real-index-id",
    });
    const worker = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { SEARCH: vec },
    });

    const gen = new WranglerGenerator(app);
    const cfg = gen.generateForWorker(worker);

    expect(cfg.vectorize).toHaveLength(1);
    expect(cfg.vectorize![0].index_name).toBe("my-real-index-id");
  });

  it("falls back to resource name when indexId not set", () => {
    const app = makeApp();
    const vec = app.addVectorize("embeddings", {
      dimensions: 1536,
      metric: "cosine",
    });
    const worker = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { EMBEDDINGS: vec },
    });

    const gen = new WranglerGenerator(app);
    const cfg = gen.generateForWorker(worker);

    expect(cfg.vectorize![0].index_name).toBe("embeddings");
  });
});

// ---------------------------------------------------------------------------
// build/dev env-aware outDir
// ---------------------------------------------------------------------------

describe("env-aware output directory", () => {
  it("build output uses env subdirectory when --env is set", () => {
    const app = makeApp();
    app.addWorker("api", { entrypoint: "./src/index.ts" });

    const gen = new WranglerGenerator(app);
    const configs = gen.generateAll();

    // Simulate what build.ts does with --env
    const baseOutDir = ".levi";
    const env = "staging";
    const outDir = resolve(process.cwd(), baseOutDir, env);

    for (const [workerName, config] of configs) {
      const workerDir = resolve(outDir, "workers", workerName);
      mkdirSync(workerDir, { recursive: true });
      const configPath = resolve(workerDir, "wrangler.jsonc");
      writeFileSync(configPath, WranglerGenerator.serialize(config));
    }

    const expectedPath = resolve(process.cwd(), ".levi", "staging", "workers", "api", "wrangler.jsonc");
    expect(
      readFileSync(expectedPath, "utf-8").includes('"name": "api"'),
    ).toBe(true);

    rmSync(resolve(process.cwd(), ".levi"), { recursive: true, force: true });
  });

  it("build output uses base .levi directory when no env", () => {
    const app = makeApp();
    app.addWorker("api", { entrypoint: "./src/index.ts" });

    const gen = new WranglerGenerator(app);
    const configs = gen.generateAll();

    const baseOutDir = ".levi";
    const outDir = resolve(process.cwd(), baseOutDir);

    for (const [workerName, config] of configs) {
      const workerDir = resolve(outDir, "workers", workerName);
      mkdirSync(workerDir, { recursive: true });
      const configPath = resolve(workerDir, "wrangler.jsonc");
      writeFileSync(configPath, WranglerGenerator.serialize(config));
    }

    const expectedPath = resolve(process.cwd(), ".levi", "workers", "api", "wrangler.jsonc");
    expect(
      readFileSync(expectedPath, "utf-8").includes('"name": "api"'),
    ).toBe(true);

    rmSync(resolve(process.cwd(), ".levi"), { recursive: true, force: true });
  });
});

// ---------------------------------------------------------------------------
// Dashboard helpers
// ---------------------------------------------------------------------------

function truncateForTest(str: string, len: number): string {
  const visible = str.replace(/\x1b\[[0-9;]*m/g, "");
  if (visible.length <= len) return str;
  return str.slice(0, len - 2) + "\x1b[2m..\x1b[0m";
}

function padRightForTest(str: string, len: number): string {
  const visible = str.replace(/\x1b\[[0-9;]*m/g, "");
  const padding = len - visible.length;
  return str + (padding > 0 ? " ".repeat(padding) : "");
}

describe("dashboard string helpers", () => {
  describe("truncate", () => {
    it("returns original string when under limit", () => {
      const result = truncateForTest("hello", 10);
      expect(result).toBe("hello");
    });

    it("truncates and appends .. when over limit", () => {
      const result = truncateForTest("hello world", 8);
      expect(result).toBe("hello \x1b[2m..\x1b[0m");
    });

    it("handles exact length", () => {
      const result = truncateForTest("hello", 5);
      expect(result).toBe("hello");
    });
  });

  describe("padRight", () => {
    it("pads shorter strings with spaces", () => {
      const result = padRightForTest("hi", 5);
      expect(result).toHaveLength(5);
      expect(result.endsWith("   ")).toBe(true);
    });

    it("does not truncate longer strings", () => {
      const result = padRightForTest("hello world", 5);
      expect(result).toBe("hello world");
    });

    it("handles exact length", () => {
      const result = padRightForTest("hello", 5);
      expect(result).toBe("hello");
    });
  });
});

describe("extractQueueName", () => {
  function extractQueueName(output: string): string | null {
    const m = output.match(/Created queue '([^']+)'/);
    return m ? m[1] : null;
  }

  it("extracts queue name from Created message", () => {
    const output = "Creating queue 'background-jobs'...\n✅ Created queue 'background-jobs'";
    expect(extractQueueName(output)).toBe("background-jobs");
  });

  it("returns null when no match", () => {
    expect(extractQueueName("no queue here")).toBeNull();
  });

  it("handles hyphens in queue name", () => {
    const output = "Created queue 'my-queue-v2'";
    expect(extractQueueName(output)).toBe("my-queue-v2");
  });

  it("handles underscores in queue name", () => {
    const output = "Created queue 'background_tasks_queue'";
    expect(extractQueueName(output)).toBe("background_tasks_queue");
  });
});

// ---------------------------------------------------------------------------
// WranglerGenerator — generateAll returns Map with correct keys
// ---------------------------------------------------------------------------

describe("WranglerGenerator.generateAll", () => {
  it("returns a Map with worker name as key", () => {
    const app = makeApp();
    app.addWorker("api", { entrypoint: "./src/index.ts" });
    app.addWorker("web", { entrypoint: "./src/web/entry.tsx" });

    const gen = new WranglerGenerator(app);
    const configs = gen.generateAll();

    expect(configs instanceof Map).toBe(true);
    expect(configs.has("api")).toBe(true);
    expect(configs.has("web")).toBe(true);
    expect(configs.size).toBe(2);
  });

  it("each config has correct worker name", () => {
    const app = makeApp();
    app.addWorker("background-worker", { entrypoint: "./src/worker.ts" });

    const gen = new WranglerGenerator(app);
    const configs = gen.generateAll();

    expect(configs.get("background-worker")!.name).toBe("background-worker");
  });
});

// ---------------------------------------------------------------------------
// graph.serialize produces correct structure
// ---------------------------------------------------------------------------

describe("AppGraph.serialize", () => {
  it("includes all resource nodes", () => {
    const app = makeApp();
    const db = app.addD1("main-db");
    const worker = app.addWorker("api", { entrypoint: "./src/index.ts", bindings: { DB: db } });

    app.build();
    const graph = app.getGraph();
    const serialized = graph.serialize() as any;

    expect(serialized.version).toBe(1);
    expect(serialized.resources).toHaveLength(2);

    const names = serialized.resources.map((r: any) => r.name);
    expect(names).toContain("main-db");
    expect(names).toContain("api");
  });

  it("marks correct type for each resource", () => {
    const app = makeApp();
    app.addD1("db");
    app.addKV("cache");
    app.addR2("uploads");
    app.addWorker("api", { entrypoint: "./src/index.ts" });

    app.build();
    const graph = app.getGraph();
    const serialized = graph.serialize() as any;

    const byType = (type: string) =>
      serialized.resources.filter((r: any) => r.type === type);

    expect(byType("d1")).toHaveLength(1);
    expect(byType("kv")).toHaveLength(1);
    expect(byType("r2")).toHaveLength(1);
    expect(byType("worker")).toHaveLength(1);
  });

  it("records dependencies in edges", () => {
    const app = makeApp();
    const db = app.addD1("main-db");
    const worker = app.addWorker("api", { entrypoint: "./src/index.ts", bindings: { DB: db } });

    app.build();
    const graph = app.getGraph();
    const serialized = graph.serialize() as any;

    expect(serialized.edges).toBeDefined();
    expect(serialized.edges["api"]).toContain("main-db");
  });
});
