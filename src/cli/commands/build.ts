import { defineCommand } from "citty";
import consola from "consola";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { loadApp } from "../../loader.js";
import { WranglerGenerator } from "../../generators/wrangler.js";

export default defineCommand({
  meta: {
    name: "build",
    description: "Generate wrangler configs from levi.app.ts",
  },
  args: {
    app: {
      type: "string",
      description: "Path to app file (default: levi.app.ts)",
      alias: "a",
    },
  },
  async run({ args }) {
    const appPath = args.app || "levi.app.ts";

    consola.start("Building Levi app...");

    // ── Load the app ───────────────────────────────────────────
    let app;
    try {
      app = await loadApp(appPath);
    } catch (error) {
      consola.error(
        `Failed to load app file: ${appPath}`,
        error instanceof Error ? error.message : error,
      );
      process.exit(1);
    }

    // ── Validate the graph ─────────────────────────────────────
    try {
      app.build();
    } catch (error) {
      consola.error(
        "App graph validation failed:",
        error instanceof Error ? error.message : error,
      );
      process.exit(1);
    }

    const graph = app.getGraph();
    const workers = graph.nodes.filter((n) => n.type === "worker");

    if (workers.length === 0) {
      consola.warn("No workers found in the app graph. Nothing to generate.");
      return;
    }

    // ── Generate wrangler configs ──────────────────────────────
    const generator = new WranglerGenerator(app);
    const configs = generator.generateAll();

    const outDir = resolve(process.cwd(), app.options.outDir || ".levi");

    // Write worker configs
    for (const [workerName, config] of configs) {
      const configPath = resolve(outDir, "workers", workerName, "wrangler.jsonc");
      mkdirSync(dirname(configPath), { recursive: true });
      writeFileSync(configPath, WranglerGenerator.serialize(config));
      consola.success(`Generated ${workerName}/wrangler.jsonc`);
    }

    // Write graph.json
    const graphPath = resolve(outDir, "graph.json");
    mkdirSync(dirname(graphPath), { recursive: true });
    writeFileSync(graphPath, JSON.stringify(graph.serialize(), null, 2));
    consola.success("Generated graph.json");

    // ── Summary ────────────────────────────────────────────────
    consola.info(
      `Build complete: ${workers.length} worker(s), ${graph.nodes.length} total resource(s)`,
    );
  },
});
