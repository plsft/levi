import { defineCommand } from "citty";
import consola from "consola";
import {
  existsSync,
  readFileSync,
  writeFileSync,
  copyFileSync,
  mkdirSync,
} from "node:fs";
import { resolve, dirname } from "node:path";
import { loadApp } from "../../loader.js";
import { WranglerGenerator } from "../../generators/wrangler.js";

export default defineCommand({
  meta: {
    name: "eject",
    description:
      "Copy generated wrangler configs to the project root and remove Levi dependency",
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
    const cwd = process.cwd();

    // ── Warning ────────────────────────────────────────────────
    consola.warn(
      "Ejecting is a one-way operation. After ejecting:\n" +
        "  - Generated wrangler.jsonc files will be copied to your project root\n" +
        "  - .levi/ will be removed from .gitignore\n" +
        "  - You will manage wrangler configs directly (no more levi build)\n",
    );

    const confirmed = await consola.prompt(
      "Are you sure you want to eject?",
      { type: "confirm", initial: false },
    );

    if (!confirmed) {
      consola.info("Eject cancelled.");
      return;
    }

    // ── Build first ────────────────────────────────────────────
    consola.start("Building Levi app...");

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

    // ── Generate fresh configs ─────────────────────────────────
    const generator = new WranglerGenerator(app);
    const configs = generator.generateAll();
    const outDir = resolve(cwd, app.options.outDir || ".levi");

    // Write configs to .levi/ first
    for (const [workerName, config] of Object.entries(configs)) {
      const configPath = resolve(outDir, "workers", workerName, "wrangler.jsonc");
      mkdirSync(dirname(configPath), { recursive: true });
      writeFileSync(configPath, config);
    }

    const graph = app.getGraph();
    const workers = graph.nodes.filter((n) => n.type === "worker");

    // ── Copy configs to project root ───────────────────────────
    for (const worker of workers) {
      const sourcePath = resolve(
        outDir,
        "workers",
        worker.name,
        "wrangler.jsonc",
      );

      if (!existsSync(sourcePath)) {
        consola.warn(`Config not found for ${worker.name}, skipping`);
        continue;
      }

      // For single-worker projects, copy to root as wrangler.jsonc
      // For multi-worker projects, copy to <worker-name>/wrangler.jsonc
      let destPath: string;
      if (workers.length === 1) {
        destPath = resolve(cwd, "wrangler.jsonc");
      } else {
        destPath = resolve(cwd, worker.name, "wrangler.jsonc");
        mkdirSync(dirname(destPath), { recursive: true });
      }

      copyFileSync(sourcePath, destPath);
      consola.success(`Copied ${worker.name}/wrangler.jsonc`);
    }

    // ── Remove .levi/ from .gitignore ──────────────────────────
    const gitignorePath = resolve(cwd, ".gitignore");
    if (existsSync(gitignorePath)) {
      let content = readFileSync(gitignorePath, "utf-8");
      const originalContent = content;

      // Remove .levi/ related lines
      content = content
        .split("\n")
        .filter(
          (line) =>
            !line.trim().startsWith(".levi/") &&
            !line.trim().startsWith(".levi") &&
            line.trim() !== "# Levi generated files",
        )
        .join("\n");

      // Clean up double blank lines
      content = content.replace(/\n{3,}/g, "\n\n").trim() + "\n";

      if (content !== originalContent) {
        writeFileSync(gitignorePath, content);
        consola.success("Removed .levi/ from .gitignore");
      }
    }

    // ── Summary ────────────────────────────────────────────────
    console.log("");
    consola.success("Eject complete!\n");
    consola.info(
      "Your wrangler.jsonc files are now standalone configs in the project root.",
    );
    consola.info(
      "You can use wrangler directly:\n",
    );

    if (workers.length === 1) {
      consola.info("  npx wrangler dev");
      consola.info("  npx wrangler deploy\n");
    } else {
      for (const worker of workers) {
        consola.info(
          `  npx wrangler dev --config ${worker.name}/wrangler.jsonc`,
        );
      }
      console.log("");
      for (const worker of workers) {
        consola.info(
          `  npx wrangler deploy --config ${worker.name}/wrangler.jsonc`,
        );
      }
      console.log("");
    }

    consola.info(
      "You can safely remove levi.app.ts and @flarefound/levi from your dependencies.",
    );
  },
});
