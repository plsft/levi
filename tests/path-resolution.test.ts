import { describe, it, expect } from "vitest";
import { FlareApp } from "../src/app.js";
import { WranglerGenerator } from "../src/generators/wrangler.js";

/**
 * Path resolution is critical — wrangler resolves paths in wrangler.jsonc
 * relative to the config file, not the project root. Levi generates configs
 * at `<outDir>/workers/<name>/wrangler.jsonc`, so all paths must be adjusted
 * to traverse back up to the project root.
 */
describe("Path Resolution", () => {
  // ── Helper ─────────────────────────────────────────────────────

  function generateConfig(
    entrypoint: string,
    opts?: { outDir?: string; framework?: "vinext" | "hono" | "raw" },
  ) {
    const app = new FlareApp("test", {
      compatibility_date: "2026-04-01",
      outDir: opts?.outDir,
    });
    const worker = app.addWorker("api", {
      entrypoint,
      framework: opts?.framework,
    });
    const gen = new WranglerGenerator(app);
    return gen.generateForWorker(worker);
  }

  function generateD1Config(migrations: string, outDir?: string) {
    const app = new FlareApp("test", {
      compatibility_date: "2026-04-01",
      outDir,
    });
    const db = app.addD1("my-db", { migrations });
    const worker = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { DB: db },
    });
    const gen = new WranglerGenerator(app);
    return gen.generateForWorker(worker);
  }

  // ── main (entrypoint) resolution ───────────────────────────────

  describe("main entrypoint with default outDir (.levi)", () => {
    it("resolves ./src/index.ts → ../../../src/index.ts", () => {
      const config = generateConfig("./src/index.ts");
      expect(config.main).toBe("../../../src/index.ts");
    });

    it("resolves src/index.ts (no ./) → ../../../src/index.ts", () => {
      const config = generateConfig("src/index.ts");
      expect(config.main).toBe("../../../src/index.ts");
    });

    it("resolves ./packages/api/src/index.ts → ../../../packages/api/src/index.ts", () => {
      const config = generateConfig("./packages/api/src/index.ts");
      expect(config.main).toBe("../../../packages/api/src/index.ts");
    });

    it("resolves deeply nested path", () => {
      const config = generateConfig("./apps/services/api/src/worker.ts");
      expect(config.main).toBe("../../../apps/services/api/src/worker.ts");
    });

    it("resolves path with ../ parent reference", () => {
      const config = generateConfig("../shared/worker.ts");
      expect(config.main).toBe("../../../../shared/worker.ts");
    });

    it("resolves bare filename", () => {
      const config = generateConfig("index.ts");
      expect(config.main).toBe("../../../index.ts");
    });
  });

  describe("main entrypoint with custom outDir", () => {
    it("single-level outDir: 'build' → ../../../ (depth 3: build/workers/name)", () => {
      const config = generateConfig("./src/index.ts", { outDir: "build" });
      expect(config.main).toBe("../../../src/index.ts");
    });

    it("two-level outDir: 'build/output' → ../../../../ (depth 4)", () => {
      const config = generateConfig("./src/index.ts", { outDir: "build/output" });
      expect(config.main).toBe("../../../../src/index.ts");
    });

    it("three-level outDir: 'build/levi/output' → ../../../../../ (depth 5)", () => {
      const config = generateConfig("./src/index.ts", { outDir: "build/levi/output" });
      expect(config.main).toBe("../../../../../src/index.ts");
    });

    it("outDir with ./ prefix: './dist' → ../../../ (same as 'dist')", () => {
      const config = generateConfig("./src/index.ts", { outDir: "./dist" });
      expect(config.main).toBe("../../../src/index.ts");
    });

    it("outDir '.levi' (default) → ../../../", () => {
      const config = generateConfig("./src/index.ts", { outDir: ".levi" });
      expect(config.main).toBe("../../../src/index.ts");
    });
  });

  describe("Windows-style paths", () => {
    it("normalizes backslashes: .\\src\\index.ts → ../../../src/index.ts", () => {
      const config = generateConfig(".\\src\\index.ts");
      expect(config.main).toBe("../../../src/index.ts");
    });

    it("normalizes mixed separators: ./src\\api\\index.ts", () => {
      const config = generateConfig("./src\\api\\index.ts");
      expect(config.main).toBe("../../../src/api/index.ts");
    });
  });

  describe("absolute paths", () => {
    it("unix absolute path returned as-is", () => {
      const config = generateConfig("/usr/local/src/index.ts");
      expect(config.main).toBe("/usr/local/src/index.ts");
    });

    it("windows absolute path detected and separators normalized", () => {
      const config = generateConfig("C:\\Work\\project\\src\\index.ts");
      // Backslashes normalized to forward slashes, but path not prefixed
      expect(config.main).toBe("C:/Work/project/src/index.ts");
    });

    it("windows drive letter path returned as-is", () => {
      const config = generateConfig("D:/projects/worker.ts");
      expect(config.main).toBe("D:/projects/worker.ts");
    });
  });

  // ── D1 migrations_dir resolution ───────────────────────────────

  describe("D1 migrations_dir", () => {
    it("resolves ./migrations → ../../../migrations", () => {
      const config = generateD1Config("./migrations");
      expect(config.d1_databases![0].migrations_dir).toBe(
        "../../../migrations",
      );
    });

    it("resolves ./packages/db/migrations → ../../../packages/db/migrations", () => {
      const config = generateD1Config("./packages/db/migrations");
      expect(config.d1_databases![0].migrations_dir).toBe(
        "../../../packages/db/migrations",
      );
    });

    it("resolves with custom outDir", () => {
      const config = generateD1Config("./migrations", "build/output");
      expect(config.d1_databases![0].migrations_dir).toBe(
        "../../../../migrations",
      );
    });

    it("resolves path without ./ prefix", () => {
      const config = generateD1Config("drizzle/migrations");
      expect(config.d1_databases![0].migrations_dir).toBe(
        "../../../drizzle/migrations",
      );
    });
  });

  // ── vinext path resolution ─────────────────────────────────────

  describe("vinext framework paths", () => {
    it("assets.directory resolves from entrypoint dir", () => {
      const config = generateConfig("./packages/web", {
        framework: "vinext",
      });
      expect(config.assets?.directory).toBe(
        "../../../packages/web/dist/client",
      );
    });

    it("main resolves to dist/server/index.js for directory entrypoint", () => {
      const config = generateConfig("./packages/web", {
        framework: "vinext",
      });
      expect(config.main).toBe("../../../packages/web/dist/server/index.js");
    });

    it("vinext with custom outDir", () => {
      const config = generateConfig("./packages/web", {
        framework: "vinext",
        outDir: "build/output",
      });
      expect(config.main).toBe(
        "../../../../packages/web/dist/server/index.js",
      );
      expect(config.assets?.directory).toBe(
        "../../../../packages/web/dist/client",
      );
    });

    it("vinext with bare directory name (no ./)", () => {
      const config = generateConfig("web", { framework: "vinext" });
      expect(config.main).toBe("../../../web/dist/server/index.js");
      expect(config.assets?.directory).toBe("../../../web/dist/client");
    });

    it("vinext does NOT override main for .ts entrypoint", () => {
      const config = generateConfig("./src/server.ts", {
        framework: "vinext",
      });
      // The .ts file entrypoint is used directly, not the dist/ path
      expect(config.main).toBe("../../../src/server.ts");
    });

    it("vinext with Windows backslashes", () => {
      const config = generateConfig(".\\packages\\web", {
        framework: "vinext",
      });
      expect(config.main).toBe("../../../packages/web/dist/server/index.js");
      expect(config.assets?.directory).toBe(
        "../../../packages/web/dist/client",
      );
    });
  });

  // ── Consistency checks ─────────────────────────────────────────

  describe("consistency", () => {
    it("all paths in a multi-resource config are consistently resolved", () => {
      const app = new FlareApp("test", {
        compatibility_date: "2026-04-01",
      });
      const db = app.addD1("db", { migrations: "./packages/db/migrations" });
      const worker = app.addWorker("api", {
        entrypoint: "./packages/api/src/index.ts",
        bindings: { DB: db },
      });
      const gen = new WranglerGenerator(app);
      const config = gen.generateForWorker(worker);

      // Both paths should use the same prefix depth
      expect(config.main).toBe("../../../packages/api/src/index.ts");
      expect(config.d1_databases![0].migrations_dir).toBe(
        "../../../packages/db/migrations",
      );

      // Both start with the same prefix
      const mainPrefix = config.main!.match(/^(\.\.\/)+/)![0];
      const migPrefix = config.d1_databases![0].migrations_dir!.match(
        /^(\.\.\/)+/,
      )![0];
      expect(mainPrefix).toBe(migPrefix);
    });

    it("generateAll() uses consistent paths across workers", () => {
      const app = new FlareApp("test", {
        compatibility_date: "2026-04-01",
      });
      const db = app.addD1("db");
      app.addWorker("api", {
        entrypoint: "./api/index.ts",
        bindings: { DB: db },
      });
      app.addWorker("web", {
        entrypoint: "./web/index.ts",
        bindings: { DB: db },
      });
      const gen = new WranglerGenerator(app);
      const configs = gen.generateAll();

      const apiConfig = configs.get("api")!;
      const webConfig = configs.get("web")!;

      expect(apiConfig.main).toBe("../../../api/index.ts");
      expect(webConfig.main).toBe("../../../web/index.ts");
    });

    it("no double-slash in resolved paths", () => {
      const config = generateConfig("./src/index.ts");
      expect(config.main).not.toContain("//");
    });

    it("no backslash in resolved paths (always forward slash)", () => {
      const config = generateConfig(".\\src\\index.ts");
      expect(config.main).not.toContain("\\");
    });
  });
});
