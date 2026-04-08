/**
 * Levi Starter Template — Hono API
 *
 * This template demonstrates an API-first project with:
 * - A Hono API worker for handling HTTP requests
 * - A D1 database for persistent data
 * - An R2 bucket for file/object storage
 * - A Queue for background job processing
 * - A dedicated queue consumer worker
 *
 * Hono is a lightweight, fast web framework that runs natively on
 * Cloudflare Workers. It provides routing, middleware, and helpers
 * with excellent TypeScript support.
 *
 * Usage:
 *   levi init --template hono
 *   levi dev
 *   levi deploy
 */

import { CloudflareApp } from "@flarefound/levi";

// ---------------------------------------------------------------------------
// Application
// ---------------------------------------------------------------------------

const app = new CloudflareApp("my-api", {
  compatibility_date: "2026-04-01",
});

// ---------------------------------------------------------------------------
// Storage & Data
// ---------------------------------------------------------------------------

// Primary database — D1 (serverless SQLite)
const db = app.addD1("main-db", {
  migrations: "./migrations",
});

// File storage — R2 (S3-compatible object storage, zero egress fees)
// Use for user uploads, generated files, or any blob data.
const storage = app.addR2("uploads", {
  allowedOrigins: ["https://example.com"],
});

// ---------------------------------------------------------------------------
// Background Jobs
// ---------------------------------------------------------------------------

// Job queue — Queues provide reliable at-least-once message delivery
// between Workers. Use for email sending, image processing, webhooks, etc.
const jobQueue = app.addQueue("background-jobs", {
  retries: 3,
});

// ---------------------------------------------------------------------------
// API Worker (Hono)
// ---------------------------------------------------------------------------

// Hono API worker — handles all HTTP requests. Bindings are available
// via the Hono context: c.env.DB, c.env.STORAGE, c.env.JOBS
const api = app.addWorker("api", {
  framework: "hono",
  entrypoint: "./src/index.ts",
  bindings: {
    DB: db,
    STORAGE: storage,
    JOBS: jobQueue,
  },
  routes: ["api.example.com/*"],
  // Optional: scheduled tasks via Cron Triggers
  crons: [
    { pattern: "0 */6 * * *", handler: "cleanup" }, // every 6 hours
  ],
});

// ---------------------------------------------------------------------------
// Queue Consumer Worker
// ---------------------------------------------------------------------------

// Dedicated worker for processing background jobs from the queue.
// Keeping the consumer separate from the API allows independent scaling
// and prevents long-running jobs from affecting API latency.
const consumer = app.addWorker("job-runner", {
  entrypoint: "./src/jobs/index.ts",
  bindings: {
    DB: db,
    STORAGE: storage,
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
// Domain & SSL
// ---------------------------------------------------------------------------

app.addDomain("api.example.com", {
  ssl: "full_strict",
});

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export default app;
