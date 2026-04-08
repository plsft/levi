/**
 * vinext-specific utilities for Levi.
 *
 * vinext is the preferred frontend framework for Levi. It is Cloudflare's
 * Vite-based framework providing server-side rendering, static asset
 * serving, and first-class Cloudflare Workers integration.
 *
 * This module provides helpers for:
 * - Generating vinext-specific wrangler configuration
 * - Detecting vinext projects on disk
 * - Configuring assets, SSR, and Node.js compatibility
 *
 * @module
 */

import { existsSync } from "node:fs";
import { resolve, join } from "node:path";

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

/**
 * Configuration options for vinext-specific wrangler overrides.
 */
export interface VinextOptions {
  /**
   * Directory containing built client assets.
   *
   * Relative to the vinext project root. vinext produces static assets
   * (JS, CSS, images) in this directory during build.
   *
   * @default "dist/client"
   */
  assetsDir?: string;

  /**
   * Binding name for the assets in the Worker environment.
   *
   * This binding provides access to the static asset manifest from
   * within the Worker code (e.g., for custom response headers).
   *
   * @default "ASSETS"
   */
  assetsBinding?: string;

  /**
   * Enable server-side rendering.
   *
   * When `true` (default), vinext renders pages on the server and
   * hydrates on the client. When `false`, vinext operates in SPA
   * mode — the Worker only serves the static shell and API routes.
   *
   * @default true
   */
  ssr?: boolean;

  /**
   * Base URL path for the application.
   *
   * @default "/"
   * @example "/app/"
   */
  baseURL?: string;

  /**
   * HTML handling mode for asset requests.
   *
   * Controls how Cloudflare resolves HTML pages for URL paths:
   * - `"auto-trailing-slash"` — normalize trailing slashes automatically
   * - `"force-trailing-slash"` — always add trailing slash
   * - `"drop-trailing-slash"` — always remove trailing slash
   * - `"none"` — no special HTML handling
   *
   * @default "auto-trailing-slash"
   */
  htmlHandling?:
    | "auto-trailing-slash"
    | "force-trailing-slash"
    | "drop-trailing-slash"
    | "none";

  /**
   * Behavior when no matching asset is found.
   *
   * - `"single-page-application"` — serve index.html for all unmatched paths
   * - `"404-page"` — serve a custom 404.html page
   * - `"none"` — return a 404 response with no body
   *
   * @default "none" (vinext handles routing server-side when SSR is enabled)
   */
  notFoundHandling?: "single-page-application" | "404-page" | "none";

  /**
   * Whether the Worker script should run for all requests, including
   * those matching a static asset. Useful for injecting custom headers
   * or transforming static responses.
   *
   * @default false
   */
  runWorkerFirst?: boolean;
}

// ---------------------------------------------------------------------------
// Config Generator
// ---------------------------------------------------------------------------

/**
 * Generate vinext-specific wrangler configuration overrides.
 *
 * This produces the configuration block that Levi merges into the
 * generated `wrangler.jsonc` for vinext Workers. It includes:
 * - `main` pointing to the SSR server entry
 * - `assets` configuration for static file serving
 * - `node_compat: true` for Node.js built-in module support
 *
 * @param options - Optional vinext configuration overrides
 * @returns A record of wrangler.jsonc properties to merge
 *
 * @example
 * ```ts
 * import { getVinextConfig } from "@flarefound/levi/frameworks/vinext";
 *
 * const config = getVinextConfig({ ssr: true, assetsDir: "dist/client" });
 * // {
 * //   main: "./dist/server/index.js",
 * //   assets: { directory: "./dist/client", binding: "ASSETS", ... },
 * //   node_compat: true,
 * // }
 * ```
 */
export function getVinextConfig(
  options?: VinextOptions,
): Record<string, unknown> {
  const assetsDir = options?.assetsDir ?? "dist/client";
  const assetsBinding = options?.assetsBinding ?? "ASSETS";
  const ssr = options?.ssr ?? true;
  const htmlHandling = options?.htmlHandling ?? "auto-trailing-slash";
  const notFoundHandling = options?.notFoundHandling ?? "none";
  const runWorkerFirst = options?.runWorkerFirst ?? false;

  const config: Record<string, unknown> = {
    // vinext SSR server entry — produced by the vinext build
    main: ssr ? "./dist/server/index.js" : undefined,

    // Static asset serving configuration
    assets: {
      directory: `./${assetsDir}`,
      binding: assetsBinding,
      html_handling: htmlHandling,
      not_found_handling: notFoundHandling,
      run_worker_first: runWorkerFirst,
    },

    // vinext relies on Node.js built-in modules (Buffer, crypto, etc.)
    node_compat: true,
  };

  // When SSR is disabled, remove the main entry — Cloudflare serves
  // static assets directly without invoking a Worker script
  if (!ssr) {
    delete config.main;
  }

  return config;
}

// ---------------------------------------------------------------------------
// Project Detection
// ---------------------------------------------------------------------------

/**
 * Markers that indicate a directory contains a vinext project.
 *
 * We check for common vinext configuration files and dependencies.
 */
const VINEXT_MARKERS = [
  // vinext config files
  "vinext.config.ts",
  "vinext.config.js",
  "vinext.config.mjs",
  "vinext.config.mts",
  // vinext app directory convention
  "app.vue",
  "app/app.vue",
] as const;

/**
 * Detect if a directory contains a vinext project.
 *
 * Checks for the presence of vinext configuration files or the
 * conventional app directory structure. This is used by `levi init`
 * to auto-detect the framework when scanning an existing project.
 *
 * @param dir - Absolute or relative path to the directory to check
 * @returns `true` if the directory appears to contain a vinext project
 *
 * @example
 * ```ts
 * import { isVinextProject } from "@flarefound/levi/frameworks/vinext";
 *
 * if (isVinextProject("./packages/web")) {
 *   console.log("Detected vinext project");
 * }
 * ```
 */
export function isVinextProject(dir: string): boolean {
  const resolved = resolve(dir);

  // Check for vinext-specific config files and conventions
  for (const marker of VINEXT_MARKERS) {
    if (existsSync(join(resolved, marker))) {
      return true;
    }
  }

  // Check package.json for vinext dependency
  const pkgPath = join(resolved, "package.json");
  if (existsSync(pkgPath)) {
    try {
      // Use a synchronous read since this is a fast detection check
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pkg = JSON.parse(
        require("node:fs").readFileSync(pkgPath, "utf-8"),
      );
      const allDeps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
      };
      if (allDeps["vinext"] || allDeps["@cloudflare/vinext"]) {
        return true;
      }
    } catch {
      // Ignore parse errors — not a valid package.json
    }
  }

  return false;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Get the default vinext build output paths.
 *
 * @param projectDir - The vinext project root directory
 * @returns Paths to the server entry and client assets directory
 */
export function getVinextBuildPaths(projectDir: string): {
  serverEntry: string;
  clientAssets: string;
} {
  const resolved = resolve(projectDir);
  return {
    serverEntry: join(resolved, "dist", "server", "index.js"),
    clientAssets: join(resolved, "dist", "client"),
  };
}

/**
 * Get the compatibility flags required by vinext.
 *
 * vinext Workers need `nodejs_compat` to access Node.js built-in modules
 * that Vite and its plugin ecosystem depend on.
 *
 * @returns Array of compatibility flag strings
 */
export function getVinextCompatibilityFlags(): string[] {
  return ["nodejs_compat"];
}
