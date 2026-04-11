import { defineCommand } from "citty";
import consola from "consola";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execSync } from "node:child_process";
import { loadApp } from "../../loader.js";
import { WranglerGenerator } from "../../generators/wrangler.js";

interface WranglerDeployment {
  id: string;
  created_on: string;
  modified_on: string;
  env?: string;
  annotations?: Record<string, string>;
}

function parseJsonOutput(cmd: string): unknown {
  try {
    const out = execSync(cmd, {
      cwd: process.cwd(),
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return JSON.parse(out.trim());
  } catch {
    return null;
  }
}

function fetchRemoteConfig(workerName: string, env?: string): { content: string | null; deploymentId: string | null; createdOn: string | null } {
  const envFlag = env ? ` --env ${env}` : "";
  const deployments = parseJsonOutput(
    `npx wrangler deployments list --config ".levi/workers/${workerName}/wrangler.jsonc"${envFlag} --json 2>/dev/null`,
  ) as WranglerDeployment[] | null;

  if (!deployments || !Array.isArray(deployments) || deployments.length === 0) {
    return { content: null, deploymentId: null, createdOn: null };
  }

  const latest = deployments[0];
  const details = parseJsonOutput(
    `npx wrangler deployments view ${latest.id} --config ".levi/workers/${workerName}/wrangler.jsonc"${envFlag} --json 2>/dev/null`,
  ) as { worker_env_meta?: { tail_triggers?: unknown[] }; resources?: Record<string, unknown> } | null;

  if (!details || typeof details !== "object") {
    return { content: null, deploymentId: latest.id, createdOn: latest.created_on };
  }

  const resources = details.resources;
  if (!resources) return { content: null, deploymentId: latest.id, createdOn: latest.created_on };

  const slimmed: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(resources)) {
    if (key === "kv_namespaces") {
      const namespaces = val as Array<{ binding: string; id: string }>;
      slimmed[key] = namespaces ? namespaces.map((n) => ({ binding: n.binding, id: "[deployed_id]" })) : val;
    } else if (key === "d1_databases") {
      const dbs = val as Array<{ binding: string; database_name: string; database_id: string }>;
      slimmed[key] = dbs ? dbs.map((d) => ({ binding: d.binding, database_name: d.database_name, database_id: "[deployed_id]" })) : val;
    } else if (key === "r2_buckets") {
      const buckets = val as Array<{ binding: string; bucket_name: string }>;
      slimmed[key] = buckets ? buckets.map((b) => ({ binding: b.binding, bucket_name: "[deployed_bucket]" })) : val;
    } else {
      slimmed[key] = val;
    }
  }

  return {
    content: JSON.stringify(slimmed, null, 2),
    deploymentId: latest.id,
    createdOn: latest.created_on,
  };
}

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
      const matchInExisting = existingLines.findIndex(
        (l) => l.trim() === line.trim(),
      );
      if (matchInExisting >= 0 && existingLines[matchInExisting] !== line) {
        changed.push({ old: existingLines[matchInExisting], new: line });
      } else {
        added.push(line);
      }
    }
  }

  for (const line of existingLines) {
    if (!generatedSet.has(line)) {
      const hadChange = changed.find((c) => c.old === line);
      if (!hadChange) {
        removed.push(line);
      }
    }
  }

  return { added, removed, changed };
}

function formatLines(label: string, lines: string[], color: string): void {
  if (lines.length === 0) return;
  console.log(`  ${label}:`);
  for (const line of lines.slice(0, 20)) {
    console.log(`    ${color}${line}\x1b[0m`);
  }
  if (lines.length > 20) {
    console.log(`    \x1b[2m... and ${lines.length - 20} more lines\x1b[0m`);
  }
}

export default defineCommand({
  meta: {
    name: "diff",
    description: "Compare generated configs against deployed remote state",
  },
  args: {
    app: {
      type: "string",
      description: "Path to app file (default: levi.app.ts)",
      alias: "a",
    },
    env: {
      type: "string",
      description: "Cloudflare environment (production, staging, etc.)",
      alias: "e",
    },
    worker: {
      type: "string",
      description: "Diff a specific worker only",
      alias: "w",
    },
    local: {
      type: "boolean",
      description: "Compare against locally generated configs only (skip remote)",
      default: false,
    },
    json: {
      type: "boolean",
      description: "Output diff as machine-readable JSON",
      default: false,
    },
  },
  async run({ args }) {
    const appPath = args.app || "levi.app.ts";

    consola.start("Loading Levi app...");

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

    if (args.worker) {
      workers = workers.filter((w) => w.name === args.worker);
      if (workers.length === 0) {
        consola.error(`Worker "${args.worker}" not found. Available: ${graph.nodes.filter((n) => n.type === "worker").map((n) => n.name).join(", ")}`);
        process.exit(1);
      }
    }

    if (workers.length === 0) {
      consola.info("No workers found in the app graph.");
      return;
    }

    const generator = new WranglerGenerator(app);
    const configs = generator.generateAll();
    const outDir = resolve(process.cwd(), app.options.outDir || ".levi");

    const envSuffix = args.env ? ` (env: ${args.env})` : "";

    console.log("");
    console.log(`  \x1b[1mLevi Diff${envSuffix}\x1b[0m \u2014 ${workers.length} worker(s), ${graph.nodes.length} total resource(s)\n`);

    let hasChanges = false;
    const jsonOut: Array<{
      worker: string;
      changed: boolean;
      hasLocalDiff: boolean;
      hasRemoteDiff: boolean;
      localAdded?: string[];
      localRemoved?: string[];
      remoteAdded?: string[];
      remoteRemoved?: string[];
      deploymentId?: string | null;
      deployedAt?: string | null;
    }> = [];

    for (const worker of workers) {
      const workerName = worker.name;
      const newConfig = WranglerGenerator.serialize(configs.get(workerName)!);
      const configPath = resolve(outDir, "workers", workerName, "wrangler.jsonc");

      const localResult = {
        added: [] as string[],
        removed: [] as string[],
        changed: [] as Array<{ old: string; new: string }>,
        hasLocalDiff: false,
      };

      const remoteResult = {
        content: null as string | null,
        deploymentId: null as string | null,
        createdOn: null as string | null,
        hasRemoteDiff: false,
      };

      if (existsSync(configPath)) {
        const existingConfig = readFileSync(configPath, "utf-8");
        const { added, removed, changed } = lineDiff(existingConfig, newConfig);
        localResult.added = added;
        localResult.removed = removed;
        localResult.changed = changed;
        localResult.hasLocalDiff = added.length > 0 || removed.length > 0 || changed.length > 0;
      } else {
        localResult.added = newConfig.split("\n");
        localResult.hasLocalDiff = true;
      }

      if (!args.local) {
        remoteResult.content = null;
        remoteResult.deploymentId = null;
        remoteResult.createdOn = null;

        try {
          const remote = fetchRemoteConfig(workerName, args.env);
          if (remote.content && remote.deploymentId) {
            remoteResult.content = remote.content;
            remoteResult.deploymentId = remote.deploymentId;
            remoteResult.createdOn = remote.createdOn;

            const localSlim = newConfig;
            const { added, removed, changed } = lineDiff(remote.content, localSlim);
            remoteResult.hasRemoteDiff = added.length > 0 || removed.length > 0 || changed.length > 0;
          }
        } catch {
          // remote unavailable
        }
      }

      hasChanges = hasChanges || localResult.hasLocalDiff || remoteResult.hasRemoteDiff;

      if (args.json) {
        jsonOut.push({
          worker: workerName,
          changed: localResult.hasLocalDiff || remoteResult.hasRemoteDiff,
          hasLocalDiff: localResult.hasLocalDiff,
          hasRemoteDiff: remoteResult.hasRemoteDiff,
          localAdded: localResult.added,
          localRemoved: localResult.removed,
          deploymentId: remoteResult.deploymentId,
          deployedAt: remoteResult.createdOn,
        });
        return;
      }

      // Print per-worker output
      const statusIcon = localResult.hasLocalDiff ? "\x1b[33m~\x1b[0m" : remoteResult.hasRemoteDiff ? "\x1b[33m~\x1b[0m" : "\x1b[32m=\x1b[0m";
      const statusText = localResult.hasLocalDiff ? "local diff" : remoteResult.hasRemoteDiff ? "remote diff" : "unchanged";
      console.log(`  ${statusIcon} \x1b[1m${workerName}/wrangler.jsonc\x1b[0m \x1b[2m(${statusText})\x1b[0m`);

      if (remoteResult.deploymentId) {
        const depTime = remoteResult.createdOn
          ? new Date(remoteResult.createdOn).toLocaleString()
          : "unknown";
        console.log(`    \x1b[2mdeployed: ${depTime} \x1b[2mid: ${remoteResult.deploymentId}\x1b[0m`);
      }

      if (localResult.hasLocalDiff) {
        formatLines("\x1b[31mremoved\x1b[0m", localResult.removed, "\x1b[31m");
        formatLines("\x1b[32madded\x1b[0m", localResult.added, "\x1b[32m");
        for (const ch of localResult.changed.slice(0, 10)) {
          console.log(`    \x1b[31m- ${ch.old}\x1b[0m`);
          console.log(`    \x1b[32m+ ${ch.new}\x1b[0m`);
        }
      }

      if (remoteResult.hasRemoteDiff) {
        console.log(`    \x1b[2m(differs from deployed version)\x1b[0m`);
      }

      if (!localResult.hasLocalDiff && !remoteResult.hasRemoteDiff) {
        console.log(`    \x1b[2mno changes\x1b[0m`);
      }

      console.log("");
    }

    if (args.json) {
      console.log(JSON.stringify({ env: args.env || null, diffs: jsonOut }, null, 2));
      return;
    }

    if (!hasChanges) {
      consola.success("No changes detected.");
    } else {
      consola.info(
        `Run \x1b[1mlevi build\x1b[0m to regenerate configs, then \x1b[1mlevi deploy\x1b[0m to apply.`,
      );
    }
  },
});
