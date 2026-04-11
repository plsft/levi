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
    env: {
      type: "string",
      description: "Target environment (e.g., production, staging). Controls output path.",
      alias: "e",
    },
    filter: {
      type: "string",
      description: "Build only specific workers (comma-separated)",
      alias: "f",
    },
  },
  async run({ args }) {
    const appPath = args.app || "levi.app.ts";

    consola.start("Building Levi app...");

    let app;
    try {
      app = await loadApp(appPath);
    } catch (error) {
      consola.error(`Failed to load app file: ${appPath}`, error instanceof Error ? error.message : error);
      process.exit(1);
    }

    try {
      app.build();
    } catch (error) {
      consola.error("App graph validation failed:", error instanceof Error ? error.message : error);
      process.exit(1);
    }

    const graph = app.getGraph();
    let workers = graph.nodes.filter((n) => n.type === "worker");

    if (args.filter) {
      const filterNames = args.filter.split(",").map((n) => n.trim());
      workers = workers.filter((w) => filterNames.includes(w.name));
      if (workers.length === 0) {
        consola.error(`No workers matched filter: ${args.filter}. Available: ${graph.nodes.filter((n) => n.type === "worker").map((n) => n.name).join(", ")}`);
        process.exit(1);
      }
    }

    if (workers.length === 0) {
      consola.warn("No workers found in the app graph. Nothing to generate.");
      return;
    }

    // Determine output directory: .levi/<env>/workers/ if --env is set, else .levi/workers/
    const baseOutDir = app.options.outDir || ".levi";
    const outDir = args.env ? resolve(baseOutDir, args.env) : baseOutDir;

    const generator = new WranglerGenerator(app);
    const configs = generator.generateAll();

    for (const [workerName, config] of configs) {
      const workerDir = resolve(outDir, "workers", workerName);
      mkdirSync(workerDir, { recursive: true });
      const configPath = resolve(workerDir, "wrangler.jsonc");
      writeFileSync(configPath, WranglerGenerator.serialize(config));
      consola.success(`Generated ${args.env ? `${args.env}/` : ""}${workerName}/wrangler.jsonc`);
    }

    const graphPath = resolve(outDir, "graph.json");
    mkdirSync(dirname(graphPath), { recursive: true });
    writeFileSync(graphPath, JSON.stringify(graph.serialize(), null, 2));
    consola.success("Generated graph.json");

    const envNote = args.env ? ` [env: ${args.env}]` : "";
    consola.info(`Build complete${envNote}: ${workers.length} worker(s), ${graph.nodes.length} total resource(s)`);
  },
});
