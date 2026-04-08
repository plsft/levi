/**
 * Levi Starter Template — vinext (recommended)
 *
 * This template demonstrates a vinext web application with:
 * - A vinext Worker (Vite-based, first-class Cloudflare Workers support)
 * - A D1 database for persistent data
 * - A KV namespace for session storage
 * - Custom domain configuration with SSL
 *
 * vinext is the recommended framework for Levi projects. It provides
 * server-side rendering, static asset serving, and full Cloudflare
 * Workers integration out of the box via Vite.
 *
 * Usage:
 *   levi init --template vinext
 *   levi dev
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
// Place your SQL migration files in ./migrations (e.g., 0001_init.sql)
const db = app.addD1("main-db", {
  migrations: "./migrations",
});

// Session cache — KV provides low-latency global key-value storage
// Ideal for session tokens, feature flags, and transient data
const sessions = app.addKV("sessions");

// ---------------------------------------------------------------------------
// Web Application (vinext)
// ---------------------------------------------------------------------------

// vinext Worker — Vite-based framework with first-class Cloudflare support.
// The entrypoint points to the vinext project directory. Levi auto-resolves
// the server entry and configures asset serving, SSR, and node_compat.
const web = app.addWorker("web", {
  framework: "vinext",
  entrypoint: "./src",
  bindings: {
    // These become available as env.DB and env.SESSIONS in your Worker
    DB: db,
    SESSIONS: sessions,
  },
  routes: ["example.com/*"],
});

// ---------------------------------------------------------------------------
// Domain & SSL
// ---------------------------------------------------------------------------

// Custom domain with strict SSL — Cloudflare provisions DNS and TLS
// automatically. Use "full_strict" for end-to-end encryption with
// certificate validation.
app.addDomain("example.com", {
  ssl: "full_strict",
});

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

// The default export is required — Levi reads this to build the app graph.
export default app;
