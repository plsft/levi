/**
 * Framework presets for Levi.
 *
 * Each preset provides sensible defaults for a given application framework,
 * including entrypoint patterns, wrangler config overrides, asset
 * configuration, and the corresponding starter template.
 *
 * vinext is the recommended (default) framework for new Levi projects.
 *
 * @module
 */

// ---------------------------------------------------------------------------
// Framework Preset Interface
// ---------------------------------------------------------------------------

/**
 * A framework preset defines the defaults and configuration overrides
 * that Levi applies when a Worker declares `framework: "vinext"`,
 * `framework: "hono"`, or `framework: "raw"`.
 *
 * Presets are used by:
 * - `levi init` to select the correct starter template
 * - `levi build` to merge framework-specific wrangler config
 * - `levi dev` to configure the local development server
 */
export interface FrameworkPreset {
  /** Internal framework identifier (matches the `Framework` union type). */
  name: string;

  /** Human-friendly name shown in `levi init` prompts and documentation. */
  displayName: string;

  /** One-line description of the framework for CLI help and init prompts. */
  description: string;

  /**
   * Default entrypoint pattern for Workers using this framework.
   *
   * For file-based frameworks (Hono, raw), this is a file path.
   * For directory-based frameworks (vinext), this is a directory path.
   */
  defaultEntrypoint: string;

  /**
   * Additional wrangler.jsonc configuration to merge into the generated
   * config for Workers using this framework.
   *
   * These overrides are applied with lower priority than explicit
   * Worker options — user config always wins.
   */
  wranglerOverrides: Record<string, unknown>;

  /**
   * Asset serving configuration (vinext-specific).
   *
   * When present, Levi generates the `assets` block in wrangler.jsonc
   * for static file serving.
   */
  assets?: {
    /** Directory containing built static assets. */
    directory: string;
    /** Binding name for the assets KV namespace in the Worker env. */
    binding?: string;
  };

  /**
   * Whether this framework requires Node.js compatibility mode.
   *
   * When `true`, Levi adds `"nodejs_compat"` to `compatibility_flags`
   * in the generated wrangler.jsonc.
   */
  nodeCompat?: boolean;

  /** Starter template file name (in the `templates/` directory). */
  templateFile: string;
}

// ---------------------------------------------------------------------------
// Preset: vinext (RECOMMENDED / DEFAULT)
// ---------------------------------------------------------------------------

/**
 * vinext — Cloudflare's Vite-based framework.
 *
 * vinext is the recommended framework for Levi projects. It provides:
 * - Server-side rendering on Cloudflare Workers
 * - Static asset serving via Workers assets
 * - Full Vite plugin ecosystem
 * - First-class Cloudflare bindings integration
 *
 * When `framework: "vinext"` is set, Levi generates:
 * - `assets` config for static file serving
 * - `nodejs_compat` compatibility flag
 * - Appropriate `main` entrypoint for the SSR server
 */
export const vinextPreset: FrameworkPreset = {
  name: "vinext",
  displayName: "vinext (recommended)",
  description:
    "Vite-based framework with first-class Cloudflare Workers support",
  defaultEntrypoint: "./src",
  nodeCompat: true,
  assets: {
    directory: "./dist/client",
    binding: "ASSETS",
  },
  templateFile: "levi.app.vinext.ts",
  wranglerOverrides: {
    // vinext builds produce a server entry at dist/server/index.js
    main: "./dist/server/index.js",
    // Assets config for serving built client files
    assets: {
      directory: "./dist/client",
      binding: "ASSETS",
    },
    // vinext requires node_compat for Node.js built-in modules
    node_compat: true,
  },
};

// ---------------------------------------------------------------------------
// Preset: Hono
// ---------------------------------------------------------------------------

/**
 * Hono — lightweight web framework for Cloudflare Workers.
 *
 * Hono is a fast, small web framework with excellent TypeScript support.
 * It provides routing, middleware, and context helpers optimized for
 * edge environments. No special asset or SSR configuration is needed.
 */
export const honoPreset: FrameworkPreset = {
  name: "hono",
  displayName: "Hono",
  description: "Lightweight web framework for Cloudflare Workers",
  defaultEntrypoint: "./src/index.ts",
  templateFile: "levi.app.hono.ts",
  wranglerOverrides: {
    // Hono workers use their entrypoint directly — no special overrides
  },
};

// ---------------------------------------------------------------------------
// Preset: Raw Worker
// ---------------------------------------------------------------------------

/**
 * Raw Worker — plain Cloudflare Worker with no framework.
 *
 * The entrypoint must export a `fetch` handler (and optionally
 * `scheduled`, `queue`, etc.) directly. No framework-specific
 * configuration is applied.
 */
export const rawPreset: FrameworkPreset = {
  name: "raw",
  displayName: "Raw Worker",
  description: "Plain Cloudflare Worker with no framework",
  defaultEntrypoint: "./src/index.ts",
  templateFile: "levi.app.raw.ts",
  wranglerOverrides: {
    // Raw workers have no framework-specific overrides
  },
};

// ---------------------------------------------------------------------------
// Preset Registry
// ---------------------------------------------------------------------------

/**
 * All available framework presets, keyed by framework name.
 *
 * @example
 * ```ts
 * import { frameworkPresets } from "@flarefound/levi/frameworks";
 *
 * const preset = frameworkPresets["vinext"];
 * console.log(preset.displayName); // "vinext (recommended)"
 * ```
 */
export const frameworkPresets: Record<string, FrameworkPreset> = {
  vinext: vinextPreset,
  hono: honoPreset,
  raw: rawPreset,
};

/**
 * Ordered list of framework presets for CLI prompts.
 *
 * vinext is listed first as the recommended default.
 */
export const frameworkChoices: FrameworkPreset[] = [
  vinextPreset,
  honoPreset,
  rawPreset,
];

/**
 * The default framework preset used when no framework is specified.
 */
export const defaultFrameworkPreset: FrameworkPreset = vinextPreset;

/**
 * Look up a framework preset by name.
 *
 * @param name - Framework identifier ("vinext", "hono", or "raw")
 * @returns The matching preset, or `undefined` if not found
 */
export function getFrameworkPreset(name: string): FrameworkPreset | undefined {
  return frameworkPresets[name];
}
