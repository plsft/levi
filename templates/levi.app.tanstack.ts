/**
 * Levi Starter Template — TanStack SPA
 *
 * This template demonstrates a TanStack SPA frontend with:
 * - A TanStack Query + TanStack Router frontend (pure SPA)
 * - A Hono API worker with D1 database
 * - Service binding from frontend to API
 *
 * TanStack SPA is a pure client-side application. No SSR.
 * Data fetching is handled by TanStack Query with service bindings
 * to API workers.
 *
 * Usage:
 *   levi init --framework tanstack
 *   cd src/web && npm install && npm run build
 *   levi deploy
 */

import { FlareApp } from "@flarefound/levi";

// ---------------------------------------------------------------------------
// Application
// ---------------------------------------------------------------------------

const app = new FlareApp("my-app", {
  compatibility_date: "2026-04-01",
});

// ---------------------------------------------------------------------------
// Storage & Data
// ---------------------------------------------------------------------------

// Primary database — D1 (serverless SQLite)
const db = app.addD1("main-db", {
  migrations: "./migrations",
});

// ---------------------------------------------------------------------------
// API Worker (Hono)
// ---------------------------------------------------------------------------

const api = app.addWorker("api", {
  framework: "hono",
  entrypoint: "./src/api/index.ts",
  bindings: {
    DB: db,
  },
});

// ---------------------------------------------------------------------------
// Web Application (TanStack SPA)
// ---------------------------------------------------------------------------

// TanStack SPA — Vite + React + TanStack Query + TanStack Router.
// The frontend is a pure SPA deployed as a Cloudflare Worker with static
// assets. API calls go to the bound API worker via service binding.
const web = app.addWorker("web", {
  framework: "tanstack",
  entrypoint: "./src/web",
  bindings: {
    API: api.asService(),
  },
  routes: ["example.com/*"],
});

// ---------------------------------------------------------------------------
// Domain & SSL
// ---------------------------------------------------------------------------

app.addDomain("example.com", {
  ssl: "full_strict",
});

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export default app;
