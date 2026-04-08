import { defineCommand } from "citty";
import consola from "consola";
import { loadApp } from "../../loader.js";

/** Friendly labels for resource types. */
const TYPE_LABELS: Record<string, string> = {
  worker: "Workers",
  d1: "D1 Databases",
  kv: "KV Namespaces",
  r2: "R2 Buckets",
  queue: "Queues",
  "durable-object": "Durable Objects",
  vectorize: "Vectorize Indexes",
  hyperdrive: "Hyperdrive",
  "workers-ai": "Workers AI",
  "ai-gateway": "AI Gateway",
  domain: "Domains",
  workflow: "Workflows",
  "tail-worker": "Tail Workers",
  mtls: "mTLS Certificates",
  secret: "Secrets",
  var: "Variables",
};

/** Icons for resource types (using simple ASCII). */
const TYPE_ICONS: Record<string, string> = {
  worker: ">>",
  d1: "DB",
  kv: "KV",
  r2: "S3",
  queue: "MQ",
  "durable-object": "DO",
  vectorize: "VZ",
  hyperdrive: "HD",
  "workers-ai": "AI",
  "ai-gateway": "GW",
  domain: "@@",
  workflow: "WF",
  "tail-worker": "TW",
  mtls: "TL",
  secret: "**",
  var: "$$",
};

export default defineCommand({
  meta: {
    name: "graph",
    description: "Print the application dependency graph",
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

    // ── Load and build ─────────────────────────────────────────
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

    if (graph.nodes.length === 0) {
      consola.info("No resources found in the app graph.");
      return;
    }

    // ── Group resources by type ────────────────────────────────
    const graphNodes = graph.nodes.map((n) => n.toGraphNode());
    const grouped = new Map<string, Array<{ name: string; type: string; dependencies: string[] }>>();
    for (const node of graphNodes) {
      const list = grouped.get(node.type) || [];
      list.push(node);
      grouped.set(node.type, list);
    }

    // Build a reverse lookup: name -> type
    const nodeTypeMap = new Map<string, string>();
    for (const node of graphNodes) {
      nodeTypeMap.set(node.name, node.type);
    }

    // ── Print header ───────────────────────────────────────────
    console.log("");
    console.log(
      `  \x1b[1m${app.name}\x1b[0m — Application Dependency Graph`,
    );
    console.log(
      `  ${graphNodes.length} resources, ${[...graph.edges.values()].reduce((sum, deps) => sum + deps.size, 0)} connections`,
    );
    console.log("");

    // ── Print resources grouped by type ────────────────────────
    const typeOrder = [
      "worker",
      "d1",
      "kv",
      "r2",
      "queue",
      "durable-object",
      "vectorize",
      "hyperdrive",
      "workers-ai",
      "ai-gateway",
      "workflow",
      "tail-worker",
      "domain",
      "mtls",
      "secret",
      "var",
    ];

    const sortedTypes = [...grouped.keys()].sort((a, b) => {
      const ai = typeOrder.indexOf(a);
      const bi = typeOrder.indexOf(b);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });

    for (let ti = 0; ti < sortedTypes.length; ti++) {
      const type = sortedTypes[ti];
      const resources = grouped.get(type)!;
      const label = TYPE_LABELS[type] || type;
      const icon = TYPE_ICONS[type] || "  ";
      const isLastType = ti === sortedTypes.length - 1;

      console.log(
        `  ${isLastType ? "\u2514" : "\u251c"}\u2500\u2500 [${icon}] \x1b[1m${label}\x1b[0m`,
      );

      for (let ri = 0; ri < resources.length; ri++) {
        const resource = resources[ri];
        const isLastResource = ri === resources.length - 1;
        const typePrefix = isLastType ? "    " : "  \u2502 ";
        const resourceConnector = isLastResource ? "\u2514" : "\u251c";

        console.log(
          `${typePrefix}  ${resourceConnector}\u2500\u2500 ${resource.name}`,
        );

        // Show dependencies (bindings) for this resource
        if (resource.dependencies.length > 0) {
          const depPrefix =
            typePrefix + (isLastResource ? "    " : "  \u2502 ");
          for (let di = 0; di < resource.dependencies.length; di++) {
            const dep = resource.dependencies[di];
            const depType = nodeTypeMap.get(dep) || "?";
            const depIcon = TYPE_ICONS[depType] || "  ";
            const isLastDep = di === resource.dependencies.length - 1;
            const depConnector = isLastDep ? "\u2514" : "\u251c";

            console.log(
              `${depPrefix}  ${depConnector}\u2500 [${depIcon}] ${dep}`,
            );
          }
        }
      }
    }

    console.log("");
  },
});
