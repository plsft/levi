import { defineCommand } from "citty";
import consola from "consola";
import { loadApp } from "../../loader.js";
import type { FlareApp } from "../../app.js";
import { Resource } from "../../resources/base.js";
import { WorkerResource } from "../../resources/worker.js";
import { D1Resource } from "../../resources/d1.js";
import { KVResource } from "../../resources/kv.js";
import { R2Resource } from "../../resources/r2.js";
import { QueueResource } from "../../resources/queue.js";
import { VectorizeResource } from "../../resources/vectorize.js";
import { HyperdriveResource } from "../../resources/hyperdrive.js";
import { WorkersAIResource } from "../../resources/ai.js";
import { DomainResource } from "../../resources/domain.js";
import { WorkflowResource } from "../../resources/workflow.js";
import { DurableObjectResource } from "../../resources/durable-object.js";
import { TailWorkerResource } from "../../resources/tail-worker.js";

const TYPE_META: Record<string, { label: string; color: string; icon: string }> = {
  worker: { label: "Worker", color: "\x1b[38;5;75m", icon: ">>" },
  d1: { label: "D1", color: "\x1b[38;5;222m", icon: "DB" },
  kv: { label: "KV", color: "\x1b[38;5;228m", icon: "KV" },
  r2: { label: "R2", color: "\x1b[38;5;141m", icon: "S3" },
  queue: { label: "Queue", color: "\x1b[38;5;117m", icon: "MQ" },
  "durable-object": { label: "DO", color: "\x1b[38;5;212m", icon: "DO" },
  vectorize: { label: "Vectorize", color: "\x1b[38;5;183m", icon: "VZ" },
  hyperdrive: { label: "Hyperdrive", color: "\x1b[38;5;216m", icon: "HD" },
  "workers-ai": { label: "Workers AI", color: "\x1b[38;5;105m", icon: "AI" },
  "ai-gateway": { label: "AI Gateway", color: "\x1b[38;5;72m", icon: "GW" },
  domain: { label: "Domain", color: "\x1b[38;5;81m", icon: "@@" },
  workflow: { label: "Workflow", color: "\x1b[38;5;219m", icon: "WF" },
  "tail-worker": { label: "Tail Worker", color: "\x1b[38;5;203m", icon: "TW" },
  mtls: { label: "mTLS", color: "\x1b[38;5;174m", icon: "MT" },
};

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const PANEL_BORDER = "\x1b[38;5;240m";
const HEADER_COLOR = "\x1b[38;5;39m";

function boxTop(width: number, title: string): string {
  const pad = title ? ` ${title} ` : "";
  const available = width - 4 - pad.length;
  const leftPad = Math.floor(available / 2);
  const rightPad = available - leftPad;
  return (
    `${PANEL_BORDER}\u250c${"\u2500".repeat(2 + leftPad)}${RESET}${BOLD}${HEADER_COLOR}${pad}${RESET}${PANEL_BORDER}${"\u2500".repeat(2 + rightPad)}\u2510${RESET}`
  );
}

function boxMid(width: number): string {
  return `${PANEL_BORDER}\u251c${"\u2500".repeat(width)}\u2524${RESET}`;
}

function boxBot(width: number): string {
  return `${PANEL_BORDER}\u2514${"\u2500".repeat(width)}\u2518${RESET}`;
}

function boxSingle(width: number): string {
  return `${PANEL_BORDER}\u2500`.repeat(width) + `${PANEL_BORDER}\u2500${RESET}`;
}

function padRight(str: string, len: number): string {
  const visible = str.replace(/\x1b\[[0-9;]*m/g, "");
  const padding = len - visible.length;
  return str + (padding > 0 ? " ".repeat(padding) : "");
}

function truncate(str: string, len: number): string {
  const visible = str.replace(/\x1b\[[0-9;]*m/g, "");
  if (visible.length <= len) return str;
  return str.slice(0, len - 2) + "\x1b[2m..\x1b[0m";
}

interface NodeInfo {
  name: string;
  type: string;
  deps: string[];
  bindingNames: Map<string, string>;
  isWorker: boolean;
  workerMeta?: {
    entrypoint: string;
    bindings: string[];
    hasTailWorker: boolean;
  };
}

function getResourceMeta(r: Resource): NodeInfo["workerMeta"] | undefined {
  if (r.type !== "worker") return undefined;
  const w = r as WorkerResource;
  const tailConsumers = (w.options as any).tailConsumers;
  return {
    entrypoint: w.options.entrypoint,
    bindings: Object.keys(w.options.bindings || {}),
    hasTailWorker: !!(tailConsumers && tailConsumers.length > 0),
  };
}

function getResourceDeps(r: Resource): string[] {
  return Array.from(r.dependencies).map((d) => d.name);
}

function getBindingNames(r: Resource): Map<string, string> {
  const result = new Map<string, string>();
  if (r.type !== "worker") return result;
  const w = r as WorkerResource;
  for (const [bindName, bindVal] of Object.entries(w.options.bindings || {})) {
    if (bindVal instanceof Resource) {
      result.set(bindName, bindVal.name);
    } else if (typeof bindVal === "object" && "workerName" in bindVal) {
      result.set(bindName, (bindVal as any).workerName);
    }
  }
  return result;
}

function computeLayout(
  graphNodes: Array<{ name: string; type: string; deps: string[]; meta?: NodeInfo["workerMeta"]; bindingNames: Map<string, string>; isWorker: boolean }>,
  width: number,
): Array<{ y: number; text: string }> {
  const lines: Array<{ y: number; text: string }> = [];
  const nodeByName = new Map(graphNodes.map((n) => [n.name, n]));

  const workers = graphNodes.filter((n) => n.isWorker);
  const infra = graphNodes.filter((n) => !n.isWorker);

  const panelW = width - 4;

  // ── Workers column ──────────────────────────────────────────────────
  if (workers.length > 0) {
    const colHeader = ` ${BOLD}${HEADER_COLOR}WORKERS${RESET} `;
    lines.push({ y: 0, text: `${PANEL_BORDER}\u2502${RESET}${colHeader}${" ".repeat(Math.max(0, panelW - colHeader.length - 3))}${PANEL_BORDER}\u2502${RESET}` });

    workers.forEach((w, i) => {
      const meta = TYPE_META[w.type] || { label: w.type, color: "", icon: "?" };
      const tail = w.meta?.hasTailWorker ? ` ${DIM}[tail worker]${RESET}` : "";
      const entry = w.meta?.entrypoint ? ` ${DIM}${truncate(w.meta.entrypoint, 30)}${RESET}` : "";
      const row = ` ${meta.color}${meta.icon}${RESET} ${BOLD}${w.name}${RESET}${tail}${entry}`;
      lines.push({ y: i + 1, text: `${PANEL_BORDER}\u2502${RESET}${padRight(row, panelW - 2)}${PANEL_BORDER}\u2502${RESET}` });
    });
  }

  // ── Infra column ───────────────────────────────────────────────────
  const infraOffset = workers.length + 3;
  if (infra.length > 0) {
    const colHeader = ` ${BOLD}${HEADER_COLOR}INFRASTRUCTURE${RESET} `;
    lines.push({ y: infraOffset - 1, text: `${PANEL_BORDER}\u2502${RESET}${colHeader}${" ".repeat(Math.max(0, panelW - colHeader.length - 3))}${PANEL_BORDER}\u2502${RESET}` });

    const typeGroups = new Map<string, typeof infra>();
    for (const r of infra) {
      const list = typeGroups.get(r.type) || [];
      list.push(r);
      typeGroups.set(r.type, list);
    }

    let y = infraOffset;
    const sortedTypes = [...typeGroups.keys()].sort();
    for (const type of sortedTypes) {
      const resources = typeGroups.get(type)!;
      const meta = TYPE_META[type] || { label: type, color: "", icon: "?" };
      lines.push({ y, text: `${PANEL_BORDER}\u2502${RESET}${DIM}  ${meta.color}${meta.icon}${RESET} ${BOLD}${meta.label}s${RESET}` + " ".repeat(Math.max(0, panelW - type.length - 8)) + `${PANEL_BORDER}\u2502${RESET}` });
      y++;
      for (const r of resources) {
        const opts = getInfraOptions(r);
        const optsStr = opts ? ` ${DIM}${opts}${RESET}` : "";
        const row = `    ${BOLD}${r.name}${RESET}${optsStr}`;
        lines.push({ y, text: `${PANEL_BORDER}\u2502${RESET}${padRight(row, panelW - 2)}${PANEL_BORDER}\u2502${RESET}` });
        y++;
      }
    }
  }

  // ── Bindings panel ─────────────────────────────────────────────────
  const bindingsOffset = Math.max(infraOffset + (infra.length > 0 ? infra.length + 1 : 0), workers.length + 2) + 2;

  const allBindings: Array<{ from: string; to: string; via: string; type: string }> = [];
  for (const w of workers) {
    for (const [bindName, targetName] of w.bindingNames) {
      const target = nodeByName.get(targetName);
      allBindings.push({ from: w.name, to: targetName, via: bindName, type: target?.type || "unknown" });
    }
  }

  if (allBindings.length > 0) {
    const colHeader = ` ${BOLD}${HEADER_COLOR}BINDINGS${RESET} `;
    lines.push({ y: bindingsOffset - 1, text: `${PANEL_BORDER}\u2502${RESET}${colHeader}${" ".repeat(Math.max(0, panelW - colHeader.length - 3))}${PANEL_BORDER}\u2502${RESET}` });

    allBindings.forEach((b, i) => {
      const meta = TYPE_META[b.type] || { label: b.type, color: "", icon: "?" };
      const row = `  ${BOLD}${b.from}${RESET}.${meta.color}${b.via}${RESET} \u2192 ${meta.color}${meta.icon}${RESET} ${BOLD}${b.to}${RESET}`;
      lines.push({ y: bindingsOffset + i, text: `${PANEL_BORDER}\u2502${RESET}${padRight(row, panelW - 2)}${PANEL_BORDER}\u2502${RESET}` });
    });
  }

  return lines;
}

function getInfraOptions(r: { name: string; type: string; meta?: NodeInfo["workerMeta"] }): string | null {
  switch (r.type) {
    case "d1": return null;
    case "kv": return null;
    case "r2": return null;
    case "queue": return null;
    case "vectorize": {
      const v = r as unknown as VectorizeResource;
      return `${v.options.dimensions}d ${v.options.metric}`;
    }
    case "hyperdrive": {
      const h = r as unknown as HyperdriveResource;
      return h.options.connectionString ? "postgres" : null;
    }
    case "workers-ai": {
      const ai = r as unknown as WorkersAIResource;
      return ai.options.binding || null;
    }
    case "domain": {
      const d = r as unknown as DomainResource;
      return d.options.ssl || null;
    }
    case "workflow": {
      const wf = r as unknown as WorkflowResource;
      return wf.options.scriptName || null;
    }
    case "durable-object": {
      const dObj = r as unknown as DurableObjectResource;
      return dObj.options.className || null;
    }
    default: return null;
  }
}

function getDimensions() {
  try {
    const { columns, rows } = (process.stdout as any).getWindowSize?.() ?? { columns: 120, rows: 40 };
    return { width: Math.min(columns || 120, 160), height: rows || 40 };
  } catch {
    return { width: 120, height: 40 };
  }
}

export default defineCommand({
  meta: {
    name: "dashboard",
    description: "Interactive ASCII dashboard showing your application topology",
  },
  args: {
    app: {
      type: "string",
      description: "Path to app file (default: levi.app.ts)",
      alias: "a",
    },
    watch: {
      type: "boolean",
      description: "Watch for file changes and refresh",
      default: false,
    },
  },
  async run({ args }) {
    const appPath = args.app || "levi.app.ts";

    let app: FlareApp;
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
    const resources = graph.nodes;

    if (resources.length === 0) {
      consola.info("No resources found in the app graph.");
      return;
    }

    const workers = resources.filter((n): n is WorkerResource => n.type === "worker");
    const infra = resources.filter((n) => n.type !== "worker");

    const graphNodes = resources.map((r) => ({
      name: r.name,
      type: r.type,
      deps: getResourceDeps(r),
      meta: getResourceMeta(r),
      bindingNames: getBindingNames(r),
      isWorker: r.type === "worker",
    }));

    const { width, height } = getDimensions();
    const totalResources = resources.length;
    const totalEdges = graph.edges.size;
    const workerCount = workers.length;
    const infraCount = infra.length;

    const lines = computeLayout(graphNodes, width);

    // ── Render ────────────────────────────────────────────────────────
    console.log("");
    console.log(`${BOLD}${HEADER_COLOR} Levi Dashboard \u2014 ${app.name}${RESET}`);
    console.log(`${DIM}${"\u2500".repeat(width - 30)}${RESET}`);

    // Summary bar
    const summary = `  ${workerCount} worker${workerCount !== 1 ? "s" : ""}  \u00b7  ${infraCount} resource${infraCount !== 1 ? "s" : ""}  \u00b7  ${totalEdges} binding${totalEdges !== 1 ? "s" : ""}`;
    console.log(`${BOLD}${summary}${RESET}`);
    console.log("");

    // Two-column layout: graph | info
    const graphColW = Math.floor(width * 0.55);
    const infoColW = width - graphColW - 1;

    // Panel 1: Topology
    console.log(`${PANEL_BORDER}\u250c${"\u2500".repeat(graphColW)}\u2510${RESET}`);

    const maxRows = height - 12;
    const sortedWorkers = [...workers].sort((a, b) => a.name.localeCompare(b.name));
    const sortedInfra = [...infra].sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name));

    let y = 0;

    // Workers section
    console.log(`${PANEL_BORDER}\u2502${RESET}  ${BOLD}${HEADER_COLOR}WORKERS${RESET}`.padEnd(graphColW - 2) + `${PANEL_BORDER}\u2502${RESET}`);
    y++;

    const maxWorkerNameLen = Math.max(...sortedWorkers.map((w) => w.name.length), 10);
    for (let i = 0; i < sortedWorkers.length && y < maxRows; i++) {
      const w = sortedWorkers[i];
      const tail = (w as any).options?.tailWorker ? `${DIM}[TW]${RESET}` : "    ";
      const entry = truncate((w as any).options?.entrypoint || "", 25);
      const bindings = Object.keys((w as any).options?.bindings || {});
      const bindStr = bindings.length > 0 ? ` ${DIM}${bindings.length} binding${bindings.length !== 1 ? "s" : ""}${RESET}` : "";
      const line = `  ${padRight(w.name, maxWorkerNameLen)} ${DIM}${entry}${RESET}${tail}${bindStr}`;
      console.log(`${PANEL_BORDER}\u2502${RESET}${padRight(line, graphColW - 2)}${PANEL_BORDER}\u2502${RESET}`);
      y++;
    }

    console.log(`${PANEL_BORDER}\u2502${RESET}${" ".repeat(graphColW - 2)}${PANEL_BORDER}\u2502${RESET}`);
    y++;

    // Infrastructure section
    console.log(`${PANEL_BORDER}\u2502${RESET}  ${BOLD}${HEADER_COLOR}INFRASTRUCTURE${RESET}`.padEnd(graphColW - 2) + `${PANEL_BORDER}\u2502${RESET}`);
    y++;

    const typeGroups = new Map<string, Resource[]>();
    for (const r of sortedInfra) {
      const list = typeGroups.get(r.type) || [];
      list.push(r);
      typeGroups.set(r.type, list);
    }

    for (const [type, resList] of typeGroups) {
      const meta = TYPE_META[type] || { label: type, icon: "?", color: "" };
      if (y >= maxRows) break;
      console.log(`${PANEL_BORDER}\u2502${RESET}  ${DIM}${meta.icon} ${meta.label}s${RESET}`.padEnd(graphColW - 2) + `${PANEL_BORDER}\u2502${RESET}`);
      y++;
      for (const r of resList) {
        if (y >= maxRows) break;
        const opts = getInfraOptions(r);
        const optsStr = opts ? ` ${DIM}(${opts})${RESET}` : "";
        console.log(`${PANEL_BORDER}\u2502${RESET}    ${BOLD}${r.name}${RESET}${optsStr}`.padEnd(graphColW - 2) + `${PANEL_BORDER}\u2502${RESET}`);
        y++;
      }
    }

    // Bottom of panel
    const rem = height - y - 5;
    for (let i = 0; i < rem; i++) {
      console.log(`${PANEL_BORDER}\u2502${RESET}${" ".repeat(graphColW - 2)}${PANEL_BORDER}\u2502${RESET}`);
    }
    console.log(`${PANEL_BORDER}\u2514${"\u2500".repeat(graphColW)}\u2518${RESET}`);

    // Panel 2: Bindings (right side)
    const infoLines: string[] = [];
    infoLines.push(`${BOLD}${HEADER_COLOR}BINDINGS${RESET}`);
    infoLines.push(`${DIM}${"\u2500".repeat(infoColW - 2)}${RESET}`);

    for (const w of sortedWorkers) {
      const bindings = (w as any).options?.bindings || {};
      for (const [bindName, bindVal] of Object.entries(bindings)) {
        const targetName = bindVal instanceof Resource ? bindVal.name : "unknown";
        const targetType = bindVal instanceof Resource ? bindVal.type : "unknown";
        const meta = TYPE_META[targetType] || { label: targetType, icon: "?", color: "" };
        infoLines.push(`${BOLD}${w.name}${RESET}.${meta.color}${bindName}${RESET}`);
        infoLines.push(`  ${DIM}\u2192 ${meta.icon} ${targetName}${RESET}`);
      }
    }

    if (sortedWorkers.length === 0 || Object.keys((sortedWorkers[0] as any)?.options?.bindings || {}).length === 0) {
      infoLines.push(`${DIM}No bindings${RESET}`);
    }

    // Service bindings (workers -> workers)
    const serviceBindings = sortedWorkers.filter((w) => (w as any).options?.serviceBindings?.length > 0);
    if (serviceBindings.length > 0) {
      infoLines.push("");
      infoLines.push(`${BOLD}SERVICE BINDINGS${RESET}`);
      infoLines.push(`${DIM}${"\u2500".repeat(infoColW - 2)}${RESET}`);
      for (const w of serviceBindings) {
        for (const sb of (w as any).options.serviceBindings) {
          infoLines.push(`${BOLD}${w.name}${RESET}.${DIM}${sb.binding}${RESET}`);
          infoLines.push(`  ${DIM}\u2192 ${sb.workerName}${RESET}`);
        }
      }
    }

    // Resource details
    infoLines.push("");
    infoLines.push(`${BOLD}RESOURCES${RESET}`);
    infoLines.push(`${DIM}${"\u2500".repeat(infoColW - 2)}${RESET}`);
    for (const r of resources) {
      const meta = TYPE_META[r.type] || { label: r.type, icon: "?", color: "" };
      const depCount = r.dependencies.size;
      const depStr = depCount > 0 ? ` ${DIM}${depCount} dep${depCount !== 1 ? "s" : ""}${RESET}` : "";
      infoLines.push(`${meta.color}${meta.icon}${RESET} ${BOLD}${r.name}${RESET}${depStr}`);
    }

    // Print right panel
    const rightTop = `${PANEL_BORDER}\u250c${"\u2500".repeat(infoColW)}\u2510${RESET}`;
    const rightBot = `${PANEL_BORDER}\u2514${"\u2500".repeat(infoColW)}\u2518${RESET}`;
    const rightMid = `${PANEL_BORDER}\u251c${"\u2500".repeat(infoColW)}\u2524${RESET}`;

    console.log(`${rightTop}`);
    for (let i = 0; i < infoLines.length; i++) {
      const line = infoLines[i];
      const padded = padRight(line, infoColW);
      const isSep = line.includes("\u2500");
      console.log(`${PANEL_BORDER}\u2502${RESET}${padded}${PANEL_BORDER}\u2502${RESET}`);
    }
    const extraLines = Math.max(0, height - infoLines.length - 2);
    for (let i = 0; i < extraLines; i++) {
      console.log(`${PANEL_BORDER}\u2502${RESET}${" ".repeat(infoColW)}${PANEL_BORDER}\u2502${RESET}`);
    }
    console.log(`${rightBot}`);

    // Status bar
    console.log("");
    console.log(`${DIM}  \u25bc Ctrl+C to exit \u00b7 levi graph for text mode \u00b7 ${appPath}${RESET}`);
    console.log("");
  },
});
