import { defineCommand } from "citty";
import consola from "consola";
import { execSync } from "node:child_process";
import { loadApp } from "../../loader.js";

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
  kv: "kv namespace create",
};

export default defineCommand({
  meta: {
    name: "provision",
    description:
      "Show and optionally create Cloudflare resources (D1, KV, R2, etc.)",
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

    if (provisionable.length === 0) {
      consola.info("No provisionable resources found in the app graph.");
      return;
    }

    // ── Group by type ──────────────────────────────────────────
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
        const cmd = `npx wrangler ${subcommand} ${resource.name}`;

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
          // Wrangler may error if the resource already exists — that's OK
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

    // ── Phase 2 notice ─────────────────────────────────────────
    if (nonCreatable.length > 0) {
      console.log("");
      consola.info(
        "The following resource types require manual creation or will be supported in Phase 2:\n",
      );
      for (const r of nonCreatable) {
        console.log(`    - ${r.type}: ${r.name}`);
      }
      console.log("");
      consola.info(
        "Full automated provisioning via the Cloudflare API is coming in Phase 2.",
      );
      consola.info(
        "For now, create these resources manually or use the wrangler CLI directly.",
      );
    }
  },
});
