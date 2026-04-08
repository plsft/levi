/**
 * Levi Starter Template — Full-Stack Application
 *
 * This comprehensive template demonstrates a production-ready architecture:
 * - vinext frontend with service binding to API
 * - Hono API backend with all resource bindings
 * - D1 database, KV cache, R2 storage
 * - Queue + dedicated consumer worker for background jobs
 * - Durable Object for real-time/stateful coordination
 * - Workers AI for inference
 * - Multiple custom domains
 *
 * This mirrors the architecture described in the Levi PRD and is suitable
 * for SaaS applications, content platforms, and complex web services.
 *
 * Usage:
 *   levi init --template fullstack
 *   levi dev
 *   levi deploy --env production
 */

import { CloudflareApp } from "@flarefound/levi";

// ---------------------------------------------------------------------------
// Application
// ---------------------------------------------------------------------------

const app = new CloudflareApp("acme-saas", {
  account: process.env.CF_ACCOUNT_ID,
  compatibility_date: "2026-04-01",
  environments: {
    staging: {
      domain: "staging.acme.com",
      vars: { LOG_LEVEL: "debug" },
    },
    production: {
      domain: "acme.com",
      vars: { LOG_LEVEL: "warn" },
    },
  },
});

// ---------------------------------------------------------------------------
// Storage & Data
// ---------------------------------------------------------------------------

// Primary database — D1 (serverless SQLite)
const mainDb = app.addD1("main-db", {
  migrations: "./packages/db/migrations",
});

// Session and response cache — KV (global key-value store)
const sessionCache = app.addKV("sessions", {
  ttl: 3600,
});

// File uploads and media — R2 (S3-compatible, zero egress)
const uploads = app.addR2("user-uploads", {
  allowedOrigins: ["https://acme.com"],
});

// ---------------------------------------------------------------------------
// Background Jobs
// ---------------------------------------------------------------------------

// Job queue — reliable async message passing between Workers
const jobQueue = app.addQueue("background-jobs", {
  deliveryDelay: 0,
  retries: 3,
});

// ---------------------------------------------------------------------------
// Durable Objects
// ---------------------------------------------------------------------------

// Real-time session coordination — Durable Objects provide strongly
// consistent, single-threaded compute with co-located SQLite storage.
// Ideal for WebSocket rooms, collaborative editing, rate limiting, etc.
const realtimeSessions = app.addDurableObject("RealtimeSession", {
  className: "RealtimeSession",
  sqlite: true,
});

// ---------------------------------------------------------------------------
// AI & Intelligence
// ---------------------------------------------------------------------------

// Workers AI — serverless GPU inference for open-source models.
// Access embedding models, LLMs, image generation, and more.
const ai = app.addWorkersAI();

// ---------------------------------------------------------------------------
// API Worker (Hono)
// ---------------------------------------------------------------------------

// Hono API — the backend service handling all API requests.
// All resource bindings are wired here and accessible via c.env.*
const api = app.addWorker("api", {
  framework: "hono",
  entrypoint: "./packages/api/src/index.ts",
  bindings: {
    DB: mainDb,
    SESSIONS: sessionCache,
    UPLOADS: uploads,
    JOBS: jobQueue,
    REALTIME: realtimeSessions,
    AI: ai,
  },
  routes: ["api.acme.com/*"],
  crons: [
    { pattern: "0 */6 * * *", handler: "cleanup" },   // cleanup every 6h
    { pattern: "30 8 * * 1-5", handler: "reports" },   // weekday reports
  ],
});

// ---------------------------------------------------------------------------
// Queue Consumer Worker
// ---------------------------------------------------------------------------

// Dedicated worker for processing background jobs. Runs separately from
// the API so long-running tasks don't affect request latency.
const jobRunner = app.addWorker("job-runner", {
  entrypoint: "./packages/jobs/src/index.ts",
  bindings: {
    DB: mainDb,
    UPLOADS: uploads,
    AI: ai,
  },
  consumers: [
    {
      queue: jobQueue,
      maxBatchSize: 10,
      maxRetries: 3,
      maxWaitMs: 5000,
    },
  ],
});

// ---------------------------------------------------------------------------
// Web Application (vinext)
// ---------------------------------------------------------------------------

// vinext frontend — Vite-based, with first-class Cloudflare Workers support.
// Uses a service binding to communicate with the API worker directly
// (no network hop, zero-latency RPC within the same Cloudflare colo).
const web = app.addWorker("web", {
  framework: "vinext",
  entrypoint: "./packages/web",
  bindings: {
    API: api.asService(),       // service binding — direct worker-to-worker RPC
    SESSIONS: sessionCache,
  },
  routes: ["acme.com/*", "www.acme.com/*"],
});

// ---------------------------------------------------------------------------
// Domains & SSL
// ---------------------------------------------------------------------------

// Primary domain — strict SSL with www redirect
app.addDomain("acme.com", {
  ssl: "full_strict",
  redirectWww: true,
});

// API subdomain — strict SSL
app.addDomain("api.acme.com", {
  ssl: "full_strict",
});

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export default app;
