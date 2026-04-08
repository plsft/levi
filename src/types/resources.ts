/**
 * Supplementary types that are used by the Levi core (app, graph,
 * generators) but don't belong to a single Cloudflare primitive.
 *
 * Resource-specific option types live in their own modules
 * (e.g., `./d1.ts`, `./worker.ts`) and are re-exported from the
 * barrel `./index.ts`.
 *
 * @module
 */

import type { Framework } from "./common.js";

// ---------------------------------------------------------------------------
// WorkerFramework alias
// ---------------------------------------------------------------------------

/**
 * Alias kept for backward compatibility with parts of the codebase
 * that import `WorkerFramework` rather than {@link Framework}.
 */
export type WorkerFramework = Framework;

// ---------------------------------------------------------------------------
// Build Result
// ---------------------------------------------------------------------------

/** Result returned by `FlareApp.build()`. */
export interface BuildResult {
  /** Whether the build (validation) succeeded. */
  success: boolean;

  /** The validated application graph, serialized to a JSON-safe object. */
  graph: object;

  /** Resource names in dependency order (topological sort). */
  deployOrder: string[];

  /** Any warnings collected during validation. */
  warnings: string[];
}

// The comprehensive WranglerConfig type now lives in ./wrangler.ts
// and is re-exported from the barrel ./index.ts.
