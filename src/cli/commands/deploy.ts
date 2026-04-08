import { defineCommand } from "citty";
import consola from "consola";
import { execSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { loadApp } from "../../loader.js";
import { WranglerGenerator } from "../../generators/wrangler.js";

/**
 * Topological sort of worker nodes by their dependencies.
 * Workers with no dependencies come first, then those that depend on them, etc.
 */
function topologicalSort(
  workers: Array<{ name: string; dependencies: string[] }>,
): Array<{ name: string; dependencies: string[] }> {
  const workerNames = new Set(workers.map((w) => w.name));
  const inDegree = new Map<string, number>();
  const adjList = new Map<string, string[]>();

  for (const w of workers) {
    inDegree.set(w.name, 0);
    adjList.set(w.name, []);
  }

  // Build edges: if worker A depends on worker B, B -> A
  for (const w of workers) {
    for (const dep of w.dependencies) {
      if (workerNames.has(dep)) {
        adjList.get(dep)!.push(w.name);
        inDegree.set(w.name, (inDegree.get(w.name) || 0) + 1);
      }
    }
  }

  const queue: string[] = [];
  for (const [name, degree] of inDegree) {
    if (degree === 0) queue.push(name);
  }

  const sorted: string[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    sorted.push(current);

    for (const neighbor of adjList.get(current) || []) {
      const newDegree = (inDegree.get(neighbor) || 1) - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) queue.push(neighbor);
    }
  }

  if (sorted.length !== workers.length) {
    consola.warn(
      "Circular dependency detected among workers. Deploying in original order.",
    );
    return workers;
  }

  const workerMap = new Map(workers.map((w) => [w.name, w]));
  return sorted.map((name) => workerMap.get(name)!);
}

export default defineCommand({
  meta: {
    name: "deploy",
    description: "Build and deploy all workers via wrangler",
  },
  args: {
    app: {
      type: "string",
      description: "Path to app file (default: levi.app.ts)",
      alias: "a",
    },
    env: {
      type: "string",
      description: "Cloudflare environment to deploy to",
      alias: "e",
    },
    filter: {
      type: "string",
      description: "Deploy only specific workers (comma-separated names)",
      alias: "f",
    },
    detach: {
      type: "boolean",
      description: "Do not wait for deployment to finish",
      default: false,
    },
  },
  async run({ args }) {
    const appPath = args.app || "levi.app.ts";

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

    const graph = app.getGraph();
    let workers = graph.nodes.filter((n) => n.type === "worker");

    // ── Apply filter ───────────────────────────────────────────
    if (args.filter) {
      const filterNames = args.filter.split(",").map((n) => n.trim());
      workers = workers.filter((w) => filterNames.includes(w.name));
      if (workers.length === 0) {
        consola.error(
          `No workers matched filter: ${args.filter}. Available: ${graph.nodes
            .filter((n) => n.type === "worker")
            .map((n) => n.name)
            .join(", ")}`,
        );
        process.exit(1);
      }
    }

    // ── Generate configs ───────────────────────────────────────
    const generator = new WranglerGenerator(app);
    const configs = generator.generateAll();
    const outDir = resolve(process.cwd(), app.options.outDir || ".levi");

    for (const [workerName, config] of configs) {
      const configPath = resolve(outDir, "workers", workerName, "wrangler.jsonc");
      mkdirSync(dirname(configPath), { recursive: true });
      writeFileSync(configPath, WranglerGenerator.serialize(config));
    }

    // Write graph.json
    const graphPath = resolve(outDir, "graph.json");
    mkdirSync(dirname(graphPath), { recursive: true });
    writeFileSync(graphPath, JSON.stringify(graph, null, 2));

    consola.success(`Built ${workers.length} worker config(s)`);

    // ── Topological sort ───────────────────────────────────────
    const sorted = topologicalSort(workers.map((w) => w.toGraphNode()));

    consola.info(
      `Deploy order: ${sorted.map((w) => w.name).join(" -> ")}`,
    );

    // ── Deploy each worker ─────────────────────────────────────
    let deployed = 0;
    let failed = 0;

    for (const worker of sorted) {
      const configPath = resolve(
        outDir,
        "workers",
        worker.name,
        "wrangler.jsonc",
      );

      if (!existsSync(configPath)) {
        consola.warn(`Config not found for ${worker.name}, skipping`);
        failed++;
        continue;
      }

      const envFlag = args.env ? ` --env ${args.env}` : "";
      const cmd = `npx wrangler deploy --config "${configPath}"${envFlag}`;

      consola.start(`Deploying ${worker.name}...`);

      try {
        if (args.detach) {
          execSync(cmd, {
            cwd: process.cwd(),
            stdio: "ignore",
          });
        } else {
          const output = execSync(cmd, {
            cwd: process.cwd(),
            stdio: "pipe",
            encoding: "utf-8",
          });
          if (output) {
            const lines = output.trimEnd().split("\n");
            for (const line of lines) {
              consola.log(`  ${line}`);
            }
          }
        }
        consola.success(`Deployed ${worker.name}`);
        deployed++;
      } catch (error) {
        consola.error(
          `Failed to deploy ${worker.name}:`,
          error instanceof Error ? error.message : error,
        );
        failed++;
      }
    }

    // ── Summary ────────────────────────────────────────────────
    console.log("");
    if (failed === 0) {
      consola.success(
        `Deployment complete: ${deployed}/${sorted.length} worker(s) deployed successfully`,
      );
    } else {
      consola.warn(
        `Deployment finished with errors: ${deployed} succeeded, ${failed} failed out of ${sorted.length} worker(s)`,
      );
      process.exit(1);
    }
  },
});
