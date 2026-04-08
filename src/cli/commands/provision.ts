import { defineCommand } from "citty";
import consola from "consola";
import { execSync } from "node:child_process";
import { loadApp } from "../../loader.js";
import { DomainResource } from "../../resources/domain.js";
import { resolveAuth, provisionDomain } from "../../cloudflare/index.js";

/** Resource types that can be provisioned via wrangler. */
const PROVISIONABLE_TYPES = new Set([
  "d1",
  "kv",
  "r2",
  "queue",
  "vectorize",
  "hyperdrive",
]);

/** Map resource types to wrangler subcommands for creation. */
const WRANGLER_CREATE_COMMANDS: Record<string, string> = {
  d1: "d1 database create",
  kv: "kv:namespace create",
};

export default defineCommand({
  meta: {
    name: "provision",
    description:
      "Show and optionally create Cloudflare resources (D1, KV, R2, domains, etc.)",
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

    // ── Identify provisionable resources ───────────────────────
    const provisionable = graph.nodes.filter((n) =>
      PROVISIONABLE_TYPES.has(n.type),
    );
    const domains = graph.nodes.filter(
      (n): n is DomainResource => n.type === "domain",
    );

    if (provisionable.length === 0 && domains.length === 0) {
      consola.info("No provisionable resources found in the app graph.");
      return;
    }

    // ── Group infra resources by type ──────────────────────────
    const grouped = new Map<string, Array<{ name: string; type: string }>>();
    for (const resource of provisionable) {
      const list = grouped.get(resource.type) || [];
      list.push(resource);
      grouped.set(resource.type, list);
    }

    consola.info("Resources to provision:\n");

    for (const [type, resources] of grouped) {
      const label = type.toUpperCase();
      console.log(`  ${label}:`);
      for (const r of resources) {
        console.log(`    - ${r.name}`);
      }
      console.log("");
    }

    if (domains.length > 0) {
      console.log("  DOMAINS (via Cloudflare API):");
      for (const d of domains) {
        const opts = d.options;
        const details = [
          opts.ssl ? `ssl: ${opts.ssl}` : null,
          opts.redirectWww ? "www redirect" : null,
        ]
          .filter(Boolean)
          .join(", ");
        console.log(`    - ${d.name}${details ? ` (${details})` : ""}`);
      }
      console.log("");
    }

    // ── Dry run ────────────────────────────────────────────────
    if (args["dry-run"]) {
      consola.info("Dry run complete. No resources were created.");
      return;
    }

    // ── Create D1 and KV via wrangler ──────────────────────────
    const creatableResources = provisionable.filter(
      (r) => r.type in WRANGLER_CREATE_COMMANDS,
    );
    const nonCreatable = provisionable.filter(
      (r) => !(r.type in WRANGLER_CREATE_COMMANDS),
    );

    if (creatableResources.length > 0) {
      consola.start("Provisioning resources via wrangler...\n");

      for (const resource of creatableResources) {
        const subcommand = WRANGLER_CREATE_COMMANDS[resource.type];
        const cmd = `npx wrangler ${subcommand} "${resource.name}"`;

        consola.start(`Creating ${resource.type}: ${resource.name}`);

        try {
          const output = execSync(cmd, {
            cwd: process.cwd(),
            encoding: "utf-8",
            stdio: "pipe",
          });
          if (output) {
            const lines = output.trimEnd().split("\n");
            for (const line of lines) {
              consola.log(`  ${line}`);
            }
          }
          consola.success(`Created ${resource.type}: ${resource.name}`);
        } catch (error) {
          const msg =
            error instanceof Error ? error.message : String(error);
          if (
            msg.includes("already exists") ||
            msg.includes("already_exists")
          ) {
            consola.info(
              `${resource.type}: ${resource.name} already exists, skipping`,
            );
          } else {
            consola.error(
              `Failed to create ${resource.type}: ${resource.name}`,
              msg,
            );
          }
        }
      }
    }

    // ── Provision domains via Cloudflare API ───────────────────
    if (domains.length > 0) {
      consola.start("Provisioning domains via Cloudflare API...\n");

      let auth;
      try {
        auth = resolveAuth();
      } catch {
        consola.warn(
          "No Cloudflare API token found. Set CLOUDFLARE_API_TOKEN to provision domains.",
        );
        consola.info(
          "Domain DNS records must be created manually in the Cloudflare dashboard.",
        );
        domains.length = 0; // Skip domain provisioning
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

            for (const result of results) {
              if (result.action === "created") {
                consola.success(
                  `Created DNS record: ${result.record.type} ${result.domain} → ${result.record.content}`,
                );
              } else if (result.action === "updated") {
                consola.success(
                  `Updated DNS record: ${result.record.type} ${result.domain} → ${result.record.content}`,
                );
              } else {
                consola.info(
                  `DNS record unchanged: ${result.record.type} ${result.domain} → ${result.record.content}`,
                );
              }
            }

            if (domain.options.ssl) {
              consola.success(
                `SSL mode set to "${domain.options.ssl}" for zone`,
              );
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

    // ── Phase 2 notice for remaining types ─────────────────────
    if (nonCreatable.length > 0) {
      console.log("");
      consola.info(
        "The following resource types require manual creation or will be supported in a future release:\n",
      );
      for (const r of nonCreatable) {
        console.log(`    - ${r.type}: ${r.name}`);
      }
      console.log("");
    }
  },
});
