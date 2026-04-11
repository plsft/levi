import { defineCommand } from "citty";
import consola from "consola";
import { spawn } from "node:child_process";
import type { ChildProcess } from "node:child_process";
import { resolve, dirname } from "node:path";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { loadApp } from "../../loader.js";
import { WranglerGenerator } from "../../generators/wrangler.js";

// ANSI color codes for worker prefixes
const COLORS = [
  "\x1b[36m", // cyan
  "\x1b[33m", // yellow
  "\x1b[35m", // magenta
  "\x1b[32m", // green
  "\x1b[34m", // blue
  "\x1b[91m", // bright red
  "\x1b[96m", // bright cyan
  "\x1b[93m", // bright yellow
];
const RESET = "\x1b[0m";

export default defineCommand({
  meta: {
    name: "dev",
    description: "Start local development (builds, then runs wrangler dev for each worker)",
  },
  args: {
    app: {
      type: "string",
      description: "Path to app file (default: levi.app.ts)",
      alias: "a",
    },
    env: {
      type: "string",
      description: "Target environment (e.g., staging, production)",
      alias: "e",
    },
    filter: {
      type: "string",
      description: "Run only specific workers (comma-separated names)",
      alias: "f",
    },
    port: {
      type: "string",
      description: "Base port for the first worker",
      alias: "p",
    },
  },
  async run({ args }) {
    const appPath = (args.app as string) || "levi.app.ts";
    const env = args.env as string | undefined;
    const filter = args.filter as string | undefined;
    const portArg = args.port as string | undefined;
    const port = portArg ? parseInt(portArg, 10) : undefined;

    // ── Build first ────────────────────────────────────────────
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

    // ── Apply filter ───────────────────────────────────────────
    if (filter) {
      const filterNames = filter.split(",").map((n: string) => n.trim());
      workers = workers.filter((w) => filterNames.includes(w.name));
      if (workers.length === 0) {
        consola.error(`No workers matched filter: ${filter}. Available: ${graph.nodes.filter((n) => n.type === "worker").map((n) => n.name).join(", ")}`);
        process.exit(1);
      }
    }

    // ── Generate configs ───────────────────────────────────────
    const generator = new WranglerGenerator(app);
    const configs = generator.generateAll();
    const baseOutDir = app.options.outDir || ".levi";
    const outDir = env ? resolve(baseOutDir, env) : baseOutDir;

    for (const [workerName, config] of configs) {
      const configPath = resolve(outDir, "workers", workerName, "wrangler.jsonc");
      mkdirSync(dirname(configPath), { recursive: true });
      writeFileSync(configPath, WranglerGenerator.serialize(config));
    }

    // Write graph.json
    const graphPath = resolve(outDir, "graph.json");
    mkdirSync(dirname(graphPath), { recursive: true });
    writeFileSync(graphPath, JSON.stringify(graph.serialize(), null, 2));

    consola.success(`Built ${workers.length} worker config(s) to ${env ? `${env}/` : ""}.levi/`);

    // ── Spawn wrangler dev for each worker ─────────────────────
    const children: ChildProcess[] = [];
    const maxNameLen = Math.max(...workers.map((w) => w.name.length));
    const basePort = port || 8787;

    for (let i = 0; i < workers.length; i++) {
      const worker = workers[i];
      const color = COLORS[i % COLORS.length];
      const configPath = resolve(outDir, "workers", worker.name, "wrangler.jsonc");

      if (!existsSync(configPath)) {
        consola.warn(`Config not found for ${worker.name}, skipping`);
        continue;
      }

      const workerPort = basePort + i;
      const prefix = `${color}[${worker.name.padEnd(maxNameLen)}]${RESET}`;

      consola.info(`${prefix} Starting wrangler dev on port ${workerPort}...`);

      const child = spawn("npx", ["wrangler", "dev", "--config", configPath, "--port", String(workerPort)], {
        stdio: ["ignore", "pipe", "pipe"],
        shell: true,
        cwd: process.cwd(),
      });

      child.stdout?.on("data", (data: Buffer) => {
        const lines = data.toString().trimEnd().split("\n");
        for (const line of lines) {
          console.log(`${prefix} ${line}`);
        }
      });

      child.stderr?.on("data", (data: Buffer) => {
        const lines = data.toString().trimEnd().split("\n");
        for (const line of lines) {
          console.error(`${prefix} ${line}`);
        }
      });

      child.on("exit", (code) => {
        if (code !== null && code !== 0) {
          consola.warn(`${prefix} exited with code ${code}`);
        }
      });

      children.push(child);
    }

    if (children.length === 0) {
      consola.warn("No workers to run.");
      return;
    }

    consola.info(
      `\nRunning ${children.length} worker(s) in dev mode. Press Ctrl+C to stop.\n`,
    );

    // ── Graceful shutdown ──────────────────────────────────────
    const shutdown = () => {
      consola.info("\nShutting down all workers...");
      for (const child of children) {
        if (!child.killed) {
          child.kill("SIGTERM");
        }
      }
      // Force kill after 5 seconds
      setTimeout(() => {
        for (const child of children) {
          if (!child.killed) {
            child.kill("SIGKILL");
          }
        }
        process.exit(0);
      }, 5000);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    // Keep the process alive until all children exit
    await Promise.all(
      children.map(
        (child) =>
          new Promise<void>((resolve) => {
            child.on("exit", () => resolve());
          }),
      ),
    );
  },
});
