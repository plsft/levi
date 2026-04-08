import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { createJiti } from "jiti";
import { CloudflareApp } from "./app.js";
import { logger } from "./utils/logger.js";

/** Default file names searched (in priority order) when no path is given. */
const DEFAULT_FILE_NAMES = [
  "levi.app.ts",
  "levi.app.mts",
  "levi.app.js",
  "levi.app.mjs",
] as const;

/**
 * Load and evaluate the user's Levi app file.
 *
 * The app file (`levi.app.ts` by default) is a TypeScript/JavaScript module
 * whose default export is a {@link CloudflareApp} instance. This function
 * uses [jiti](https://github.com/unjs/jiti) to transpile and evaluate the
 * file at runtime so that it works regardless of whether the host project
 * has a build step configured.
 *
 * @param path - Optional explicit path to the app file. When omitted, the
 *   current working directory is searched for the default file names.
 * @returns The evaluated {@link CloudflareApp} instance.
 *
 * @throws {Error} If no app file is found, or it does not default-export
 *   a `CloudflareApp` instance.
 *
 * @example
 * ```ts
 * const app = await loadAppFile();
 * const result = app.build();
 * ```
 */
export async function loadAppFile(path?: string): Promise<CloudflareApp> {
  const resolvedPath = path ? resolve(path) : findAppFile(process.cwd());

  if (!resolvedPath) {
    const searched = DEFAULT_FILE_NAMES.join(", ");
    throw new Error(
      `Could not find a Levi app file. Searched for: ${searched}\n` +
        `Create a levi.app.ts file in your project root, or pass an explicit path.`,
    );
  }

  if (!existsSync(resolvedPath)) {
    throw new Error(
      `App file not found at: ${resolvedPath}\n` +
        `Make sure the path is correct and the file exists.`,
    );
  }

  logger.info(`Loading app file: ${resolvedPath}`);

  // Create a jiti instance configured for ESM + TypeScript
  const jiti = createJiti(resolvedPath, {
    interopDefault: true,
  });

  let mod: unknown;
  try {
    mod = await jiti.import(resolvedPath);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to load app file at ${resolvedPath}:\n${message}\n\n` +
        `Make sure the file is valid TypeScript/JavaScript and imports resolve correctly.`,
    );
  }

  // Extract the default export
  const app = extractDefaultExport(mod);

  if (!(app instanceof CloudflareApp)) {
    throw new Error(
      `The app file at ${resolvedPath} does not default-export a CloudflareApp instance.\n` +
        `Expected: export default new CloudflareApp("my-app", { ... });\n` +
        `Got: ${typeof app}${app === null ? " (null)" : app === undefined ? " (undefined)" : ""}`,
    );
  }

  logger.success(`Loaded app "${app.name}" with ${app.graph.size} resources.`);

  return app;
}

/**
 * Alias for {@link loadAppFile} used by CLI commands.
 */
export const loadApp = loadAppFile;

// ─── Internal Helpers ────────────────────────────────────────────

/**
 * Search for the first matching app file in the given directory.
 */
function findAppFile(dir: string): string | null {
  for (const name of DEFAULT_FILE_NAMES) {
    const candidate = resolve(dir, name);
    if (existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

/**
 * Extract the default export from a module, handling the common
 * interop patterns (CJS default, ESM default, double-wrapped).
 */
function extractDefaultExport(mod: unknown): unknown {
  if (mod === null || mod === undefined) return mod;

  // Direct CloudflareApp instance (interopDefault worked)
  if (mod instanceof CloudflareApp) return mod;

  // ESM module with a `default` property
  if (typeof mod === "object" && "default" in mod) {
    const defaultExport = (mod as Record<string, unknown>).default;

    // Handle double-wrapped { default: { default: app } }
    if (
      typeof defaultExport === "object" &&
      defaultExport !== null &&
      "default" in defaultExport
    ) {
      return (defaultExport as Record<string, unknown>).default;
    }

    return defaultExport;
  }

  return mod;
}
