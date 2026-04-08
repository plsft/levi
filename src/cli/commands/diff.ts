import { defineCommand } from "citty";
import consola from "consola";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadApp } from "../../loader.js";
import { WranglerGenerator } from "../../generators/wrangler.js";

export default defineCommand({
  meta: {
    name: "diff",
    description:
      "Show what configs would be generated and how they differ from existing",
  },
  args: {
    app: {
      type: "string",
      description: "Path to app file (default: levi.app.ts)",
      alias: "a",
    },
    env: {
      type: "string",
      description: "Cloudflare environment",
      alias: "e",
    },
  },
  async run({ args }) {
    const appPath = args.app || "levi.app.ts";

    // ── Load and build ─────────────────────────────────────────
    consola.start("Loading Levi app...");

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
      consola.info("No workers found in the app graph.");
      return;
    }

    // ── Generate configs (in memory) ───────────────────────────
    const generator = new WranglerGenerator(app);
    const configs = generator.generateAll();
    const outDir = resolve(process.cwd(), app.options.outDir || ".levi");

    console.log("");
    consola.info(
      `Diff for ${workers.length} worker(s), ${graph.nodes.length} total resource(s):\n`,
    );

    for (const [workerName, config] of configs) {
      const newConfig = WranglerGenerator.serialize(config);
      const configPath = resolve(
        outDir,
        "workers",
        workerName,
        "wrangler.jsonc",
      );

      if (!existsSync(configPath)) {
        console.log(`  \x1b[32m+ ${workerName}/wrangler.jsonc (new)\x1b[0m`);
        // Show a preview of the config
        const lines = newConfig.split("\n");
        const preview = lines.slice(0, Math.min(lines.length, 15));
        for (const line of preview) {
          console.log(`    \x1b[32m+ ${line}\x1b[0m`);
        }
        if (lines.length > 15) {
          console.log(
            `    \x1b[2m... and ${lines.length - 15} more lines\x1b[0m`,
          );
        }
        console.log("");
        continue;
      }

      const existingConfig = readFileSync(configPath, "utf-8");

      if (existingConfig === newConfig) {
        console.log(`  \x1b[2m= ${workerName}/wrangler.jsonc (unchanged)\x1b[0m`);
        console.log("");
        continue;
      }

      // Show a simple line-by-line diff
      console.log(
        `  \x1b[33m~ ${workerName}/wrangler.jsonc (modified)\x1b[0m`,
      );

      const existingLines = existingConfig.split("\n");
      const newLines = newConfig.split("\n");
      const maxLines = Math.max(existingLines.length, newLines.length);
      let changesShown = 0;

      for (let i = 0; i < maxLines && changesShown < 20; i++) {
        const oldLine = existingLines[i];
        const newLine = newLines[i];

        if (oldLine === newLine) continue;

        if (oldLine !== undefined && newLine !== undefined) {
          console.log(`    \x1b[31m- ${oldLine}\x1b[0m`);
          console.log(`    \x1b[32m+ ${newLine}\x1b[0m`);
          changesShown += 2;
        } else if (oldLine !== undefined) {
          console.log(`    \x1b[31m- ${oldLine}\x1b[0m`);
          changesShown++;
        } else if (newLine !== undefined) {
          console.log(`    \x1b[32m+ ${newLine}\x1b[0m`);
          changesShown++;
        }
      }

      if (changesShown >= 20) {
        console.log(`    \x1b[2m... more changes not shown\x1b[0m`);
      }
      console.log("");
    }

    // ── Phase 2 notice ─────────────────────────────────────────
    console.log("");
    consola.info(
      "Remote diff (comparing generated configs vs. deployed state) is coming in Phase 2.",
    );
    consola.info(
      "For now, this shows the diff between the current levi.app.ts output and existing generated configs.",
    );
  },
});
