import { defineCommand } from "citty";
import consola from "consola";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, basename } from "node:path";

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

function getAppTemplate(
  projectName: string,
  framework: "vinext" | "tanstack" | "hono" | "raw",
): string {
  const header = `import { FlareApp } from "@flarefound/levi";\n\nconst app = new FlareApp("${projectName}", {\n  compatibility_date: "${new Date().toISOString().slice(0, 10)}",\n});\n`;

  if (framework === "vinext") {
    return `${header}
// ── Storage ────────────────────────────────────────────────
const db = app.addD1("main-db");
const cache = app.addKV("cache");

// ── Web (vinext) ───────────────────────────────────────────
const web = app.addWorker("web", {
  framework: "vinext",
  entrypoint: "./src",
  bindings: {
    DB: db,
    CACHE: cache,
  },
});

export default app;
`;
  }

  if (framework === "tanstack") {
    return `${header}
// ── Storage ────────────────────────────────────────────────
const db = app.addD1("main-db");

// ── API (Hono) ─────────────────────────────────────────────
const api = app.addWorker("api", {
  framework: "hono",
  entrypoint: "./src/api/index.ts",
  bindings: {
    DB: db,
  },
});

// ── Web (TanStack SPA) ────────────────────────────────────
const web = app.addWorker("web", {
  framework: "tanstack",
  entrypoint: "./src/web",
  bindings: {
    API: api.asService(),
  },
});

export default app;
`;
  }

  if (framework === "hono") {
    return `${header}
// ── Storage ────────────────────────────────────────────────
const db = app.addD1("main-db");

// ── API (Hono) ─────────────────────────────────────────────
const api = app.addWorker("api", {
  framework: "hono",
  entrypoint: "./src/index.ts",
  bindings: {
    DB: db,
  },
});

export default app;
`;
  }

  // raw
  return `${header}
// ── Worker ─────────────────────────────────────────────────
const worker = app.addWorker("worker", {
  entrypoint: "./src/index.ts",
});

export default app;
`;
}

// ---------------------------------------------------------------------------
// Command
// ---------------------------------------------------------------------------

export default defineCommand({
  meta: {
    name: "init",
    description: "Scaffold a new Levi project",
  },
  args: {},
  async run() {
    consola.info("Welcome to Levi — the AppHost Framework for Cloudflare\n");

    const cwd = process.cwd();
    const defaultName = basename(cwd);

    // ── Project name ───────────────────────────────────────────
    const projectName =
      ((await consola.prompt("Project name:", {
        type: "text",
        default: defaultName,
        placeholder: defaultName,
      })) as string) || defaultName;

    // ── Framework selection ────────────────────────────────────
    const framework = (await consola.prompt("Framework:", {
      type: "select",
      options: [
        { label: "vinext (recommended)", value: "vinext" },
        { label: "TanStack SPA", value: "tanstack" },
        { label: "hono", value: "hono" },
        { label: "raw (no framework)", value: "raw" },
      ],
      initial: "vinext",
    })) as "vinext" | "tanstack" | "hono" | "raw";

    // ── Write levi.app.ts ──────────────────────────────────────
    const appFilePath = resolve(cwd, "levi.app.ts");

    if (existsSync(appFilePath)) {
      const overwrite = await consola.prompt(
        "levi.app.ts already exists. Overwrite?",
        { type: "confirm", initial: false },
      );
      if (!overwrite) {
        consola.info("Skipped levi.app.ts — keeping existing file.");
      } else {
        writeFileSync(appFilePath, getAppTemplate(projectName, framework));
        consola.success("Created levi.app.ts");
      }
    } else {
      writeFileSync(appFilePath, getAppTemplate(projectName, framework));
      consola.success("Created levi.app.ts");
    }

    // ── Create src directory if needed ─────────────────────────
    const srcDir = resolve(cwd, "src");
    if (!existsSync(srcDir)) {
      mkdirSync(srcDir, { recursive: true });
      consola.success("Created src/ directory");
    }

    // ── Create starter entrypoint for hono/raw ─────────────────
    if (framework === "hono") {
      const entrypoint = resolve(srcDir, "index.ts");
      if (!existsSync(entrypoint)) {
        writeFileSync(
          entrypoint,
          `import { Hono } from "hono";\n\nconst app = new Hono();\n\napp.get("/", (c) => c.text("Hello from Levi + Hono!"));\n\nexport default app;\n`,
        );
        consola.success("Created src/index.ts (Hono entrypoint)");
      }
    } else if (framework === "raw") {
      const entrypoint = resolve(srcDir, "index.ts");
      if (!existsSync(entrypoint)) {
        writeFileSync(
          entrypoint,
          `export default {\n  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {\n    return new Response("Hello from Levi!");\n  },\n};\n`,
        );
        consola.success("Created src/index.ts (Worker entrypoint)");
      }
    }

    // ── Add .levi/ to .gitignore ───────────────────────────────
    const gitignorePath = resolve(cwd, ".gitignore");
    if (existsSync(gitignorePath)) {
      const content = readFileSync(gitignorePath, "utf-8");
      if (!content.includes(".levi/") && !content.includes(".levi\n")) {
        writeFileSync(
          gitignorePath,
          content.trimEnd() + "\n\n# Levi generated files\n.levi/\n",
        );
        consola.success("Added .levi/ to .gitignore");
      }
    } else {
      writeFileSync(
        gitignorePath,
        "node_modules/\ndist/\n\n# Levi generated files\n.levi/\n",
      );
      consola.success("Created .gitignore with .levi/");
    }

    // ── Done ───────────────────────────────────────────────────
    consola.box(
      `Project "${projectName}" initialized!\n\nNext steps:\n  1. Edit levi.app.ts to define your Cloudflare resources\n  2. Run \`levi build\` to generate wrangler configs\n  3. Run \`levi dev\` to start local development`,
    );
  },
});
