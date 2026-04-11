import { defineCommand } from "citty";
import consola from "consola";
import { execSync } from "node:child_process";
import { resolve } from "node:path";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { parse as parseJsonc } from "jsonc-parser";
import { loadApp } from "../../loader.js";
import { WranglerGenerator } from "../../generators/wrangler.js";
import { DomainResource } from "../../resources/domain.js";
import { resolveAuth, provisionDomain } from "../../cloudflare/index.js";
import type { FlareApp } from "../../app.js";
import { D1Resource } from "../../resources/d1.js";
import { KVResource } from "../../resources/kv.js";
import { R2Resource } from "../../resources/r2.js";
import { VectorizeResource } from "../../resources/vectorize.js";
import { WorkerResource } from "../../resources/worker.js";

export const PROVISIONABLE_TYPES: Set<"d1" | "kv" | "r2" | "queue" | "vectorize"> = new Set(
  ["d1", "kv", "r2", "queue", "vectorize"] as const,
);
type ProvisionableType = "d1" | "kv" | "r2" | "queue" | "vectorize";

export function buildVectorizeArgs(name: string, resource: VectorizeResource): string[] {
  const opts = resource.options;
  return [
    "vectorize", "create", name,
    "--dimensions", String(opts.dimensions ?? 1536),
    "--metric", opts.metric ?? "cosine",
  ];
}

function runWranglerCreate(
  type: ProvisionableType,
  name: string,
  resource?: D1Resource | KVResource | R2Resource | VectorizeResource,
): { success: boolean; alreadyExists: boolean; output: string } {
  let args: string[];
  if (type === "vectorize" && resource instanceof VectorizeResource) {
    args = buildVectorizeArgs(name, resource);
  } else {
    const base: Record<ProvisionableType, string[]> = {
      d1: ["d1", "create", name],
      kv: ["kv", "namespace", "create", name],
      r2: ["r2", "bucket", "create", name],
      queue: ["queues", "create", name],
      vectorize: ["vectorize", "create", name],
    };
    args = base[type];
  }

  const cmd = `npx wrangler ${args.join(" ")}`;

  try {
    const output = execSync(cmd, {
      cwd: process.cwd(),
      encoding: "utf-8",
      stdio: "pipe",
    });
    return { success: true, alreadyExists: false, output: String(output) };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (
      msg.includes("already exists") ||
      msg.includes("already_exists") ||
      msg.includes("That title already exists")
    ) {
      return { success: true, alreadyExists: true, output: "" };
    }
    return { success: false, alreadyExists: false, output: msg };
  }
}

export function extractD1DatabaseId(output: string): string | null {
  const m = output.match(/"database_id":\s*"([^"]+)"/);
  return m ? m[1] : null;
}

export function extractKvNamespaceId(output: string): string | null {
  const m = output.match(/"id":\s*"([^"]+)"/);
  return m ? m[1] : null;
}

export function extractR2BucketName(output: string): string | null {
  const m = output.match(/"bucket_name":\s*"([^"]+)"/);
  return m ? m[1] : null;
}

export function extractQueueName(output: string): string | null {
  const m = output.match(/Created queue '([^']+)'/);
  return m ? m[1] : null;
}

function extractId(type: ProvisionableType, output: string, name: string): string | null {
  switch (type) {
    case "d1": {
      const m = output.match(/"database_id":\s*"([^"]+)"/);
      return m ? m[1] : null;
    }
    case "kv": {
      const m = output.match(/"id":\s*"([^"]+)"/);
      return m ? m[1] : null;
    }
    case "r2": {
      const m = output.match(/"bucket_name":\s*"([^"]+)"/);
      return m ? m[1] : null;
    }
    case "queue": {
      const m = output.match(new RegExp(`Created queue '(${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}')`));
      return m ? m[1] : null;
    }
    case "vectorize": {
      return name; // Vectorize uses name as the identifier
    }
    default:
      return null;
  }
}

function updateConfigId(
  configPath: string,
  type: ProvisionableType,
  bindingName: string,
  id: string,
): void {
  if (!existsSync(configPath)) return;
  const content = readFileSync(configPath, "utf-8");
  const parsed = parseJsonc(content);

  switch (type) {
    case "d1": {
      const arr = parsed["d1_databases"] as Array<Record<string, unknown>> | undefined;
      if (arr) {
        for (const entry of arr) {
          if (entry["binding"] === bindingName) {
            entry["database_id"] = id;
          }
        }
      }
      break;
    }
    case "kv": {
      const arr = parsed["kv_namespaces"] as Array<Record<string, unknown>> | undefined;
      if (arr) {
        for (const entry of arr) {
          if (entry["binding"] === bindingName) {
            entry["id"] = id;
          }
        }
      }
      break;
    }
    case "r2": {
      const arr = parsed["r2_buckets"] as Array<Record<string, unknown>> | undefined;
      if (arr) {
        for (const entry of arr) {
          if (entry["binding"] === bindingName) {
            entry["bucket_name"] = id;
          }
        }
      }
      break;
    }
    case "vectorize": {
      const arr = parsed["vectorize"] as Array<Record<string, unknown>> | undefined;
      if (arr) {
        for (const entry of arr) {
          if (entry["binding"] === bindingName) {
            entry["index_name"] = id;
          }
        }
      }
      break;
    }
    case "queue": {
      break;
    }
  }

  writeFileSync(configPath, JSON.stringify(parsed, null, 2), "utf-8");
}

export function updateD1BindingInConfig(configPath: string, bindingName: string, id: string): void {
  if (!existsSync(configPath)) return;
  const content = readFileSync(configPath, "utf-8");
  const parsed = parseJsonc(content);
  const arr = parsed["d1_databases"] as Array<Record<string, unknown>> | undefined;
  if (!arr) return;
  let changed = false;
  for (const entry of arr) {
    if (entry["binding"] === bindingName) {
      entry["database_id"] = id;
      changed = true;
    }
  }
  if (changed) {
    writeFileSync(configPath, JSON.stringify(parsed, null, 2), "utf-8");
  }
}

export function updateKvBindingInConfig(configPath: string, bindingName: string, id: string): void {
  if (!existsSync(configPath)) return;
  const content = readFileSync(configPath, "utf-8");
  const parsed = parseJsonc(content);
  const arr = parsed["kv_namespaces"] as Array<Record<string, unknown>> | undefined;
  if (!arr) return;
  let changed = false;
  for (const entry of arr) {
    if (entry["binding"] === bindingName) {
      entry["id"] = id;
      changed = true;
    }
  }
  if (changed) {
    writeFileSync(configPath, JSON.stringify(parsed, null, 2), "utf-8");
  }
}

export function updateR2BindingInConfig(configPath: string, bindingName: string, id: string): void {
  if (!existsSync(configPath)) return;
  const content = readFileSync(configPath, "utf-8");
  const parsed = parseJsonc(content);
  const arr = parsed["r2_buckets"] as Array<Record<string, unknown>> | undefined;
  if (!arr) return;
  let changed = false;
  for (const entry of arr) {
    if (entry["binding"] === bindingName) {
      entry["bucket_name"] = id;
      changed = true;
    }
  }
  if (changed) {
    writeFileSync(configPath, JSON.stringify(parsed, null, 2), "utf-8");
  }
}

export function updateVectorizeBindingInConfig(configPath: string, bindingName: string, id: string): void {
  if (!existsSync(configPath)) return;
  const content = readFileSync(configPath, "utf-8");
  const parsed = parseJsonc(content);
  const arr = parsed["vectorize"] as Array<Record<string, unknown>> | undefined;
  if (!arr) return;
  let changed = false;
  for (const entry of arr) {
    if (entry["binding"] === bindingName) {
      entry["index_name"] = id;
      changed = true;
    }
  }
  if (changed) {
    writeFileSync(configPath, JSON.stringify(parsed, null, 2), "utf-8");
  }
}

export function applyMigrations(migrationsDir: string | undefined, dbName: string): void {
  if (!migrationsDir) return;

  const cmd = `npx wrangler d1 migrations apply "${dbName}" --remote --file "${migrationsDir}"`;
  try {
    const output = execSync(cmd, { cwd: process.cwd(), encoding: "utf-8", stdio: "pipe" });
    consola.log(`    Migrations applied: ${String(output).trim()}`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (!msg.includes("No migrations")) {
      consola.warn(`    Migration apply failed: ${msg.trim()}`);
    }
  }
}

export interface ProvisionResult {
  provisionable: Array<{ type: ProvisionableType; name: string; id: string | null }>;
  failed: Array<{ type: ProvisionableType; name: string; error: string }>;
}

export async function runProvision(app: FlareApp): Promise<ProvisionResult> {
  const graph = app.getGraph();

  const provisionable = graph.nodes.filter(
    (n): n is D1Resource | KVResource | R2Resource | VectorizeResource =>
      PROVISIONABLE_TYPES.has(n.type as ProvisionableType),
  );
  const domains = graph.nodes.filter(
    (n): n is DomainResource => n.type === "domain",
  );

  const result: ProvisionResult = { provisionable: [], failed: [] };

  if (provisionable.length === 0 && domains.length === 0) {
    consola.info("No resources to provision.");
    return result;
  }

  consola.info("Resources to provision:\n");
  const grouped = new Map<ProvisionableType, typeof provisionable>();
  for (const resource of provisionable) {
    const list = grouped.get(resource.type as ProvisionableType) || [];
    list.push(resource);
    grouped.set(resource.type as ProvisionableType, list);
  }

  for (const [type, resources] of grouped) {
    console.log(`  ${type.toUpperCase()}:`);
    for (const r of resources) {
      console.log(`    - ${r.name}`);
    }
    console.log("");
  }

  if (domains.length > 0) {
    console.log("  DOMAINS (via Cloudflare API):");
    for (const d of domains) {
      console.log(`    - ${d.name}`);
    }
    console.log("");
  }

  for (const [type, resources] of grouped) {
    for (const resource of resources) {
      consola.start(`Creating ${type}: ${resource.name}`);

      const res = runWranglerCreate(type as ProvisionableType, resource.name, resource);

      if (!res.success) {
        consola.error(`Failed to create ${type}: ${resource.name}`);
        result.failed.push({ type: type as ProvisionableType, name: resource.name, error: res.output });
        continue;
      }

      if (res.alreadyExists) {
        consola.success(`${type}: ${resource.name} already exists`);
        result.provisionable.push({ type: type as ProvisionableType, name: resource.name, id: null });
        continue;
      }

      const lines = res.output.trimEnd().split("\n");
      for (const line of lines) {
        consola.log(`  ${line}`);
      }

      const id = extractId(type as ProvisionableType, res.output, resource.name);

      if (id) {
        consola.success(`Created ${type}: ${resource.name} (${id.substring(0, 8)}...)`);
      } else {
        consola.success(`Created ${type}: ${resource.name}`);
      }

      result.provisionable.push({ type: type as ProvisionableType, name: resource.name, id });

      if (type === "d1") {
        const d1 = resource as D1Resource;
        if (d1.options.migrations) {
          consola.start("Applying D1 migrations...");
          applyMigrations(d1.options.migrations, resource.name);
        }
      }

      if (id) {
        const outDir = resolve(process.cwd(), app.options.outDir || ".levi");
        const workers = graph.nodes.filter((n): n is WorkerResource => n.type === "worker");

        for (const worker of workers) {
          const bindings = worker.options.bindings || {};
          const configPath = resolve(outDir, "workers", worker.name, "wrangler.jsonc");

          for (const [bindName, bindValue] of Object.entries(bindings)) {
            const isTarget =
              (bindValue instanceof D1Resource && bindValue.name === resource.name) ||
              (bindValue instanceof KVResource && bindValue.name === resource.name) ||
              (bindValue instanceof R2Resource && bindValue.name === resource.name) ||
              (bindValue instanceof VectorizeResource && bindValue.name === resource.name);

            if (isTarget) {
              updateConfigId(configPath, type as ProvisionableType, bindName, id);
              consola.log(`    Updated ${worker.name}/wrangler.jsonc: ${type} binding "${bindName}"`);
            }
          }
        }
      }
    }
  }

  if (domains.length > 0) {
    consola.start("Provisioning domains via Cloudflare API...\n");

    let auth;
    try {
      auth = resolveAuth();
    } catch {
      consola.warn("No Cloudflare API token found. Set CLOUDFLARE_API_TOKEN to provision domains.");
      consola.info("Domain DNS records must be created manually in the Cloudflare dashboard.");
    }

    if (auth) {
      for (const domain of domains) {
        consola.start(`Provisioning domain: ${domain.name}`);
        try {
          const results = await provisionDomain(domain.name, auth, {
            ssl: domain.options.ssl,
            redirectWww: domain.options.redirectWww,
            comment: `Managed by Levi — ${app.name}`,
          });

          for (const res of results) {
            if (res.action === "created") {
              consola.success(`DNS record: ${res.record.type} ${res.domain} → ${res.record.content}`);
            } else if (res.action === "updated") {
              consola.success(`DNS updated: ${res.record.type} ${res.domain} → ${res.record.content}`);
            } else {
              consola.info(`DNS unchanged: ${res.record.type} ${res.domain}`);
            }
          }

          if (domain.options.ssl) {
            consola.success(`SSL mode set to "${domain.options.ssl}" for zone`);
          }
        } catch (error) {
          consola.error(
            `Failed to provision domain: ${domain.name}`,
            error instanceof Error ? error.message : String(error),
          );
        }
      }
    }
  }

  return result;
}

export default defineCommand({
  meta: {
    name: "provision",
    description: "Create or update Cloudflare resources (D1, KV, R2, Queues, Vectorize, domains)",
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
    "dry-run": {
      type: "boolean",
      description: "Only show what would be created (no changes)",
      default: false,
    },
  },
  async run({ args }) {
    const appPath = args.app || "levi.app.ts";

    consola.start("Loading Levi app...");

    let app: FlareApp;
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

    if (args["dry-run"]) {
      consola.info("Dry run — listing resources only.\n");
      const graph = app.getGraph();
      const provisionable = graph.nodes.filter((n) =>
        PROVISIONABLE_TYPES.has(n.type as ProvisionableType),
      );
      const domains = graph.nodes.filter(
        (n): n is DomainResource => n.type === "domain",
      );

      if (provisionable.length === 0 && domains.length === 0) {
        consola.info("No provisionable resources found in the app graph.");
        return;
      }

      const grouped = new Map<ProvisionableType, typeof provisionable>();
      for (const resource of provisionable) {
        const list = grouped.get(resource.type as ProvisionableType) || [];
        list.push(resource);
        grouped.set(resource.type as ProvisionableType, list);
      }

      for (const [type, resources] of grouped) {
        console.log(`  ${type.toUpperCase()}:`);
        for (const r of resources) {
          console.log(`    - ${r.name}`);
        }
        console.log("");
      }

      if (domains.length > 0) {
        console.log("  DOMAINS:");
        for (const d of domains) {
          console.log(`    - ${d.name}`);
        }
        console.log("");
      }

      consola.info("Dry run complete. No resources were created.");
      return;
    }

    const { failed } = await runProvision(app);

    if (failed.length > 0) {
      console.log("");
      consola.error(`Provisioning completed with ${failed.length} error(s):\n`);
      for (const f of failed) {
        consola.error(`  ${f.type}: ${f.name} — ${f.error}`);
      }
      process.exit(1);
    }

    consola.success("Provisioning complete.");
  },
});
