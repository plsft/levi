/**
 * Levi Starter Template — Raw Worker (minimal)
 *
 * This template demonstrates the simplest possible Levi setup:
 * - A raw Worker with no framework (exports a fetch handler directly)
 * - A KV namespace for key-value storage
 *
 * Raw Workers are ideal for lightweight APIs, webhooks, edge logic,
 * or any use case where a full framework is unnecessary.
 *
 * Usage:
 *   levi init --template raw
 *   levi dev
 *   levi deploy
 */

import { CloudflareApp } from "@flarefound/levi";

// ---------------------------------------------------------------------------
// Application
// ---------------------------------------------------------------------------

const app = new CloudflareApp("my-worker", {
  compatibility_date: "2026-04-01",
});

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------

// KV namespace — global, low-latency key-value storage
const cache = app.addKV("cache");

// ---------------------------------------------------------------------------
// Worker
// ---------------------------------------------------------------------------

// Raw Worker — your entrypoint must export a default fetch handler:
//
//   export default {
//     async fetch(request: Request, env: Env, ctx: ExecutionContext) {
//       const value = await env.CACHE.get("key");
//       return new Response(value ?? "Hello from Levi!");
//     },
//   };
//
const worker = app.addWorker("api", {
  entrypoint: "./src/index.ts",
  bindings: {
    CACHE: cache,
  },
});

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export default app;
