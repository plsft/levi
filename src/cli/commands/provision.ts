import { defineCommand } from "citty";
import consola from "consola";
import { execSync } from "node:child_process";
import { resolve } from "node:path";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { parse as parseJsonc } from "jsonc-parser";
import { loadApp } from "../../loader.js";
import { WranglerGenerator } from "../../generators/wrangler.js";
import { DomainResource } from "../../resources/domain.js";
import { resolveAuth, provisionDomain, findZone } from "../../cloudflare/index.js";
import { provisionEmail } from "../../cloudflare/email.js";
import { syncZoneRules } from "../../cloudflare/rulesets.js";
import { syncSnippets } from "../../cloudflare/snippets.js";
import { generateZoneManifests } from "../../generators/edge-rules.js";
import type { FlareApp } from "../../app.js";
import { D1Resource } from "../../resources/d1.js";
import { KVResource } from "../../resources/kv.js";
import { R2Resource } from "../../resources/r2.js";
import { VectorizeResource } from "../../resources/vectorize.js";
import { WorkerResource } from "../../resources/worker.js";
import { SecretsStoreSecretResource } from "../../resources/secrets-store-secret.js";
import { DispatchNamespaceResource } from "../../resources/dispatch-namespace.js";
import { EmailResource } from "../../resources/email.js";

export const PROVISIONABLE_TYPES: Set<
  "d1" | "kv" | "r2" | "queue" | "vectorize" | "dispatch-namespace"
> = new Set(["d1", "kv", "r2", "queue", "vectorize", "dispatch-namespace"] as const);
type ProvisionableType =
  | "d1"
  | "kv"
  | "r2"
  | "queue"
  | "vectorize"
  | "dispatch-namespace";

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
  resource?:
    | D1Resource
    | KVResource
    | R2Resource
    | VectorizeResource
    | DispatchNamespaceResource,
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
      "dispatch-namespace": ["dispatch-namespace", "create", name],
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
    case "dispatch-namespace": {
      return name; // Dispatch namespaces use the name as the identifier
    }
    default:
      return null;
  }
}

/** Extract the store ID from `wrangler secrets-store store create` output. */
export function extractSecretsStoreId(output: string): string | null {
  const m = output.match(/ID:\s*([0-9a-f]{32})/i);
  return m ? m[1] : null;
}

/** Patch `secrets_store_secrets[].store_id` for a binding in a generated config. */
export function updateSecretsStoreBindingInConfig(
  configPath: string,
  bindingName: string,
  storeId: string,
): void {
  if (!existsSync(configPath)) return;
  const content = readFileSync(configPath, "utf-8");
  const parsed = parseJsonc(content);
  const arr = parsed["secrets_store_secrets"] as
    | Array<Record<string, unknown>>
    | undefined;
  if (!arr) return;
  let changed = false;
  for (const entry of arr) {
    if (entry["binding"] === bindingName) {
      entry["store_id"] = storeId;
      changed = true;
    }
  }
  if (changed) {
    writeFileSync(configPath, JSON.stringify(parsed, null, 2), "utf-8");
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
    case "dispatch-namespace": {
      break; // namespace name is already in the config
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
    (
      n,
    ): n is
      | D1Resource
      | KVResource
      | R2Resource
      | VectorizeResource
      | DispatchNamespaceResource =>
      PROVISIONABLE_TYPES.has(n.type as ProvisionableType),
  );
  const domains = graph.nodes.filter(
    (n): n is DomainResource => n.type === "domain",
  );
  const secretsStoreSecrets = graph.nodes.filter(
    (n): n is SecretsStoreSecretResource => n.type === "secrets-store-secret",
  );
  const emails = graph.nodes.filter(
    (n): n is EmailResource => n.type === "email",
  );

  const edgeCount = graph.nodes.filter(
    (n) => n.type === "edge-rule" || n.type === "snippet",
  ).length;

  const result: ProvisionResult = { provisionable: [], failed: [] };

  if (
    provisionable.length === 0 &&
    domains.length === 0 &&
    secretsStoreSecrets.length === 0 &&
    emails.length === 0 &&
    edgeCount === 0
  ) {
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

  if (secretsStoreSecrets.length > 0) {
    console.log("  SECRETS STORE:");
    for (const s of secretsStoreSecrets) {
      console.log(`    - ${s.options.secretName ?? s.name} (store: ${s.options.storeName ?? "default"})`);
    }
    console.log("");
  }

  if (emails.length > 0) {
    console.log("  EMAIL ROUTING (via Cloudflare API):");
    for (const e of emails) {
      const dest =
        e.options.destinationAddress ??
        e.options.allowedDestinationAddresses?.join(", ") ??
        "(unrestricted)";
      console.log(`    - ${e.name} -> ${dest}`);
    }
    console.log("");
  }

  if (edgeCount > 0) {
    console.log("  EDGE RULES & SNIPPETS (via Cloudflare API):");
    for (const n of graph.nodes) {
      if (n.type === "edge-rule" || n.type === "snippet") {
        console.log(`    - ${n.type === "snippet" ? "snippet" : (n as { kind?: string }).kind}: ${n.name}`);
      }
    }
    console.log("");
  }

  for (const [type, resources] of grouped) {
    for (const resource of resources) {
      // Dispatch namespaces may override their Cloudflare-side name
      const cfName =
        resource instanceof DispatchNamespaceResource
          ? resource.namespaceName
          : resource.name;
      consola.start(`Creating ${type}: ${cfName}`);

      const res = runWranglerCreate(type as ProvisionableType, cfName, resource);

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

      const id = extractId(type as ProvisionableType, res.output, cfName);

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

  // ── Secrets Store ──────────────────────────────────────────────
  if (secretsStoreSecrets.length > 0) {
    consola.start("Provisioning Secrets Store...\n");

    // One store-create per distinct store name (beta: one store per account)
    const storeNames = new Set(
      secretsStoreSecrets.map((s) => s.options.storeName ?? "default"),
    );
    if (storeNames.size > 1) {
      consola.warn(
        `Multiple Secrets Store names declared (${[...storeNames].join(", ")}); ` +
          `the Secrets Store beta allows one store per account.`,
      );
    }

    const storeIds = new Map<string, string>();
    for (const storeName of storeNames) {
      try {
        const output = execSync(
          `npx wrangler secrets-store store create ${storeName} --remote`,
          { cwd: process.cwd(), encoding: "utf-8", stdio: "pipe" },
        );
        const storeId = extractSecretsStoreId(String(output));
        if (storeId) {
          storeIds.set(storeName, storeId);
          consola.success(`Secrets Store "${storeName}" ready (${storeId.substring(0, 8)}...)`);
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        if (msg.includes("already exists") || msg.includes("already_exists")) {
          // Existing store — try to recover the ID from the create error or store list
          const existingId =
            extractSecretsStoreId(msg) ??
            (() => {
              try {
                const listOut = execSync(`npx wrangler secrets-store store list`, {
                  cwd: process.cwd(),
                  encoding: "utf-8",
                  stdio: "pipe",
                });
                return extractSecretsStoreId(String(listOut));
              } catch {
                return null;
              }
            })();
          if (existingId) {
            storeIds.set(storeName, existingId);
            consola.success(`Secrets Store "${storeName}" already exists (${existingId.substring(0, 8)}...)`);
          } else {
            consola.warn(
              `Secrets Store "${storeName}" already exists but its ID could not be determined. ` +
                `Set \`storeId\` explicitly (find it via \`wrangler secrets-store store list\`).`,
            );
          }
        } else {
          consola.error(`Failed to create Secrets Store "${storeName}": ${msg.trim()}`);
        }
      }
    }

    // Patch store IDs into generated configs and resource options
    const outDir = resolve(process.cwd(), app.options.outDir || ".levi");
    const workers = graph.nodes.filter((n): n is WorkerResource => n.type === "worker");
    for (const secret of secretsStoreSecrets) {
      const storeId = storeIds.get(secret.options.storeName ?? "default");
      if (!storeId) continue;
      secret.options.storeId = storeId;

      for (const worker of workers) {
        const bindings = worker.options.bindings || {};
        const configPath = resolve(outDir, "workers", worker.name, "wrangler.jsonc");
        for (const [bindName, bindValue] of Object.entries(bindings)) {
          if (bindValue === secret) {
            updateSecretsStoreBindingInConfig(configPath, bindName, storeId);
            consola.log(`    Updated ${worker.name}/wrangler.jsonc: secrets store binding "${bindName}"`);
          }
        }
      }
    }

    // Secret values cannot be set non-interactively without exposing them
    const hint = [...storeIds.values()][0] ?? "<store-id>";
    consola.info(
      `Set secret values with: npx wrangler secrets-store secret create ${hint} ` +
        `--name <secret-name> --scopes workers --remote`,
    );
  }

  // ── Edge rules & snippets (zone-level, via Rulesets API) ──────
  const zoneManifests = generateZoneManifests(app);
  if (zoneManifests.size > 0) {
    consola.start("Syncing edge rules via Cloudflare API...\n");

    let auth;
    try {
      auth = resolveAuth();
    } catch {
      consola.warn("No Cloudflare API token found. Set CLOUDFLARE_API_TOKEN to sync edge rules.");
    }

    if (auth) {
      for (const [zoneName, manifest] of zoneManifests) {
        try {
          const zoneId =
            manifest.zoneId ?? (await findZone(zoneName, auth))?.id;
          if (!zoneId) {
            consola.warn(`Zone not found for "${zoneName}" — skipping edge rules.`);
            continue;
          }

          const results = await syncZoneRules(zoneId, manifest, auth);
          for (const { phase, plan, result: r } of results) {
            const summary = r
              ? `+${r.created} ~${r.updated} -${r.deleted} =${r.unchanged}` +
                (r.reordered ? " (reordered)" : "")
              : `planned +${plan.creates.length} ~${plan.updates.length} -${plan.deletes.length}`;
            const foreign =
              plan.foreignCount > 0
                ? ` (${plan.foreignCount} unmanaged rule(s) untouched)`
                : "";
            consola.success(`${zoneName} ${phase}: ${summary}${foreign}`);
          }

          if (manifest.snippets.length > 0) {
            const basePath = app.options.basePath ?? process.cwd();
            const snip = await syncSnippets(
              zoneId,
              app.name,
              manifest.snippets,
              basePath,
              auth,
            );
            consola.success(
              `${zoneName} snippets: ${snip.uploaded.length} uploaded` +
                (snip.deleted.length ? `, ${snip.deleted.length} deleted` : "") +
                (snip.foreignRules > 0
                  ? ` (${snip.foreignRules} unmanaged snippet rule(s) preserved)`
                  : ""),
            );
          }
        } catch (error) {
          consola.error(
            `Failed to sync edge rules for zone ${zoneName}:`,
            error instanceof Error ? error.message : String(error),
          );
        }
      }
    }
  }

  // ── Email Routing ──────────────────────────────────────────────
  if (emails.length > 0) {
    consola.start("Provisioning Email Routing via Cloudflare API...\n");

    let auth;
    try {
      auth = resolveAuth();
    } catch {
      consola.warn("No Cloudflare API token found. Set CLOUDFLARE_API_TOKEN to provision Email Routing.");
    }

    const accountId = app.options.account ?? process.env.CLOUDFLARE_ACCOUNT_ID;
    if (auth && !accountId) {
      consola.warn(
        "Email Routing provisioning needs an account ID — set `account` in your app options " +
          "or the CLOUDFLARE_ACCOUNT_ID environment variable.",
      );
    }

    if (auth && accountId) {
      // Collect every destination address across all email bindings
      const addresses = new Set<string>();
      const zones = new Set<string>();
      for (const email of emails) {
        if (email.options.destinationAddress) addresses.add(email.options.destinationAddress);
        for (const a of email.options.allowedDestinationAddresses ?? []) addresses.add(a);
        const zone = email.options.zone ?? app.options.defaultZone;
        if (zone) zones.add(zone);
      }

      try {
        // Enable routing on each referenced zone
        let firstZoneId: string | undefined;
        for (const zoneName of zones) {
          const zone = await findZone(zoneName, auth);
          if (!zone) {
            consola.warn(`Zone not found for "${zoneName}" — skipping Email Routing enable.`);
            continue;
          }
          if (!firstZoneId) firstZoneId = zone.id;
          const res = await provisionEmail([], zone.id, accountId, auth);
          if (res.routingEnabled === true) {
            consola.success(`Email Routing enabled on ${zoneName}`);
          } else if (res.routingEnabled === false) {
            consola.info(`Email Routing already enabled on ${zoneName}`);
          }
        }

        // Register destination addresses (account-level)
        const res = await provisionEmail([...addresses], undefined, accountId, auth);
        for (const a of res.addresses) {
          if (a.action === "created") {
            consola.success(`Destination address registered: ${a.email} — verification email sent`);
          } else if (!a.verified) {
            consola.warn(`Destination address ${a.email} is pending verification — check the inbox`);
          } else {
            consola.info(`Destination address verified: ${a.email}`);
          }
        }
      } catch (error) {
        consola.error(
          "Email Routing provisioning failed:",
          error instanceof Error ? error.message : String(error),
        );
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
      const extras = graph.nodes.filter(
        (n) =>
          n.type === "edge-rule" ||
          n.type === "snippet" ||
          n.type === "secrets-store-secret" ||
          n.type === "email",
      );

      if (provisionable.length === 0 && domains.length === 0 && extras.length === 0) {
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

      if (extras.length > 0) {
        console.log("  ZONE & ACCOUNT RESOURCES (via Cloudflare API):");
        for (const r of extras) {
          const detail =
            r.type === "edge-rule" ? ` (${(r as { kind?: string }).kind})` : "";
          console.log(`    - ${r.type}${detail}: ${r.name}`);
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
