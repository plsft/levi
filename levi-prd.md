# Levi — The Cloudflare AppHost Framework

**Codename:** Levi (a nod to Wrangler — the one who wears the jeans)
**Author:** George Rios / FlareFound
**Status:** Architecture Sketch — v0.1
**Date:** April 2026

---

## Executive Summary

Levi is a lightweight TypeScript CLI and programmatic framework that serves as an **apphost** for Cloudflare applications. Inspired by .NET Aspire's `DistributedApplication.CreateBuilder()` pattern, Levi lets developers declare their entire Cloudflare application topology — Workers, D1 databases, KV namespaces, R2 buckets, Durable Objects, Queues, domains, SSL, Cron Triggers, Hyperdrive, Vectorize, AI bindings — in a single typed TypeScript file. On build, Levi generates all `wrangler.jsonc` configs, provisions resources via the Cloudflare API, wires bindings, and orchestrates deployment.

Levi does **not** replace Wrangler. It orchestrates it.

---

## Landscape & Positioning

### What Exists Today

| Tool | What It Does | What It Doesn't Do |
|---|---|---|
| **Wrangler / C3** | Scaffold single projects, dev server, deploy | No multi-service topology, no resource graph, no cross-worker bindings |
| **Terraform / Pulumi** | Provision CF resources as IaC | Disconnected from app code; no typed bindings, no dev experience |
| **Turborepo** | Monorepo build orchestration | Zero awareness of CF resources or bindings |
| **Clodo Framework** | Claims enterprise CF orchestration | Unclear adoption, SEO-heavy marketing, no visible community |

### Adjacent Movers

| Project | Relationship to Levi |
|---|---|
| **Void Cloud (VoidZero/Evan You)** | Vite-native deployment platform on CF. Abstracts away infrastructure — `void deploy` provisions DB, KV, storage, AI, crons, queues automatically. **Opinionated, framework-coupled, platform-as-a-service.** Evan has been explicit: "the lock-in is what makes the DX possible." |
| **vinext (Cloudflare)** | Next.js API surface reimplemented on Vite. `vinext deploy` handles single-app deployment to Workers. No multi-service orchestration. |
| **.NET Aspire** | The direct inspiration. Typed apphost declaring services, databases, caches, messaging. Dashboard showing topology. Local dev orchestration. |

### Where Levi Fits

**Void** is Vercel-for-Cloudflare — a managed platform that hides infrastructure.
**Levi** is Aspire-for-Cloudflare — a developer tool that **exposes** all infrastructure through a typed, composable API.

Void says: "Don't think about infrastructure."
Levi says: "Think about infrastructure once, in code, with full type safety."

This is a critical distinction. Levi targets developers and consultants (like FlareFound clients) who **need** to understand and control their CF topology — custom domains, specific D1 configurations, DO class routing, R2 lifecycle policies, Queue consumers, Hyperdrive connections to external Postgres. Void abstracts that away. Levi makes it elegant.

---

## Design Principles

1. **Wrangler is the engine. Levi is the driver.** Never reimplement what Wrangler does. Generate configs, shell out to Wrangler for dev/deploy. Ride CF's improvements for free.

2. **TypeScript-first, TOML-free.** The apphost file (`levi.app.ts`) is the single source of truth. All `wrangler.jsonc` files are generated artifacts — gitignored, reproducible.

3. **Expose everything.** Every CF primitive gets a typed builder. If Cloudflare adds a new binding type, Levi surfaces it. No magic, no hidden defaults (unless you opt in).

4. **Local dev is a first-class citizen.** `levi dev` spins up all workers via Miniflare with correct bindings, service-to-service communication, and a topology dashboard.

5. **Incremental adoption.** You can use Levi for a single worker or a 12-service monorepo. You can eject at any time — the generated `wrangler.jsonc` files are valid standalone configs.

---

## Architecture

### Core Concept: The App Graph

```
levi.app.ts  →  App Graph (in-memory DAG)  →  Generated Configs  →  Wrangler
                                            →  CF API (provisioning)
                                            →  Miniflare (local dev)
```

The App Graph is a directed acyclic graph where:
- **Nodes** are CF resources (Workers, D1, KV, R2, DO, Queues, Vectorize, etc.)
- **Edges** are bindings (Worker A binds to D1 B, Worker C has a service binding to Worker A)

The graph enables:
- Dependency-ordered provisioning (create D1 before deploying the Worker that binds to it)
- Binding validation at build time (catch misconfigurations before deploy)
- Topology visualization
- Parallel deployment where dependencies allow

### The AppHost File: `levi.app.ts`

```typescript
import { CloudflareApp } from "@flarefound/levi";

const app = new CloudflareApp("acme-saas", {
  account: process.env.CF_ACCOUNT_ID,
  compatibility_date: "2026-04-01",
});

// ── Storage & Data ──────────────────────────────────────────
const mainDb = app.addD1("main-db", {
  migrations: "./packages/db/migrations",
});

const sessionCache = app.addKV("sessions", {
  ttl: 3600,
});

const uploads = app.addR2("user-uploads", {
  allowedOrigins: ["https://acme.com"],
});

const jobQueue = app.addQueue("background-jobs", {
  deliveryDelay: 0,
  retries: 3,
});

// ── Durable Objects ─────────────────────────────────────────
const realtimeSessions = app.addDurableObject("RealtimeSession", {
  className: "RealtimeSession",
  sqlite: true, // DO with SQLite storage
});

// ── AI & Vector ─────────────────────────────────────────────
const embeddings = app.addVectorize("doc-embeddings", {
  dimensions: 1536,
  metric: "cosine",
});

const ai = app.addWorkersAI();

// ── Hyperdrive (external DB) ────────────────────────────────
const legacyDb = app.addHyperdrive("legacy-postgres", {
  connectionString: app.secret("LEGACY_PG_URL"),
});

// ── Workers ─────────────────────────────────────────────────
const api = app.addWorker("api", {
  framework: "hono",
  entrypoint: "./packages/api/src/index.ts",
  bindings: {
    DB: mainDb,
    SESSIONS: sessionCache,
    UPLOADS: uploads,
    JOBS: jobQueue,
    REALTIME: realtimeSessions,
    VECTORS: embeddings,
    AI: ai,
    LEGACY_DB: legacyDb,
  },
  routes: ["api.acme.com/*"],
  crons: [
    { pattern: "0 */6 * * *", handler: "scheduled" },
  ],
});

const queueConsumer = app.addWorker("job-runner", {
  entrypoint: "./packages/jobs/src/index.ts",
  bindings: {
    DB: mainDb,
    AI: ai,
  },
  consumers: [
    { queue: jobQueue, maxBatchSize: 10, maxRetries: 3 },
  ],
});

const web = app.addWorker("web", {
  framework: "vinext",
  entrypoint: "./packages/web",
  bindings: {
    API: api.asService(),        // service binding
    SESSIONS: sessionCache,
  },
  routes: ["acme.com/*", "www.acme.com/*"],
});

// ── Domains & SSL ───────────────────────────────────────────
app.addDomain("acme.com", {
  ssl: "full_strict",
  redirectWww: true,
});

app.addDomain("api.acme.com", {
  ssl: "full_strict",
});

// ── Export ───────────────────────────────────────────────────
export default app;
```

### What `levi build` Produces

```
.levi/                              ← generated, gitignored
├── graph.json                      ← serialized app graph
├── workers/
│   ├── api/
│   │   └── wrangler.jsonc          ← generated config for api worker
│   ├── web/
│   │   └── wrangler.jsonc
│   └── job-runner/
│       └── wrangler.jsonc
├── provisions.json                 ← resource provisioning plan
└── topology.html                   ← visual graph (optional)
```

Each generated `wrangler.jsonc` is a **complete, valid** Wrangler config. If you eject from Levi, you copy these files and you're done.

---

## CLI Surface

```
levi init                        # scaffold a new Levi project
levi build                       # parse levi.app.ts → generate all configs
levi dev                         # build + launch all workers locally via miniflare
levi provision [--env staging]   # create/update CF resources (D1, KV, R2, etc.)
levi deploy [--env production]   # provision + build + deploy all workers
levi graph                       # print the dependency graph to terminal
levi dashboard                   # open local topology dashboard (like Aspire)
levi eject                       # copy generated configs to project root, remove Levi
levi diff [--env production]     # show what would change vs. deployed state
```

### Environment Support

```typescript
// levi.app.ts
const app = new CloudflareApp("acme-saas", {
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
```

`levi deploy --env staging` generates configs with staging-specific bindings and deploys to staging resource instances.

---

## CF Primitive Coverage

Levi's value proposition is **complete** coverage of Cloudflare's resource surface. Every primitive below gets a typed builder method:

### Compute
| Primitive | Builder | Notes |
|---|---|---|
| Workers | `addWorker()` | Framework-aware (hono, vinext, raw) |
| Durable Objects | `addDurableObject()` | With SQLite storage option |
| Workflows | `addWorkflow()` | Step-based durable execution |
| Cron Triggers | via `addWorker({ crons })` | Attached to workers |
| Queue Consumers | via `addWorker({ consumers })` | Attached to workers |
| Tail Workers | `addTailWorker()` | Log pipeline |

### Storage & Data
| Primitive | Builder | Notes |
|---|---|---|
| D1 | `addD1()` | Migration path support |
| KV | `addKV()` | TTL defaults, namespace config |
| R2 | `addR2()` | CORS, lifecycle rules |
| Queues | `addQueue()` | DLQ, retry config |
| Hyperdrive | `addHyperdrive()` | External DB acceleration |
| Vectorize | `addVectorize()` | Dimensions, metric config |

### AI & Intelligence
| Primitive | Builder | Notes |
|---|---|---|
| Workers AI | `addWorkersAI()` | Model binding |
| AI Gateway | `addAIGateway()` | Rate limiting, logging |

### Network & Routing
| Primitive | Builder | Notes |
|---|---|---|
| Custom Domains | `addDomain()` | SSL mode, redirects |
| Routes | via `addWorker({ routes })` | Pattern matching |
| Service Bindings | via `.asService()` | Worker-to-worker RPC |
| mTLS | `addMTLS()` | Client cert binding |
| Tail Workers | `addTailWorker()` | Observability pipeline |

### Secrets & Config
| Primitive | Builder | Notes |
|---|---|---|
| Secrets | `app.secret()` | Env-specific, never in configs |
| Vars | `app.var()` | Environment variables |
| Wrangler Overrides | `addWorker({ wrangler: {} })` | Escape hatch for any wrangler.jsonc field |

---

## Implementation Phases

### Phase 0: Skeleton (Week 1-2)
- CLI scaffolding with `commander` or `citty`
- `CloudflareApp` class with `addWorker()`, `addD1()`, `addKV()`, `addR2()`
- `levi build` → generates `wrangler.jsonc` files
- `levi dev` → spawns `wrangler dev` per worker
- Zero CF API calls — pure config generation

**Ship this. It's already useful.**

### Phase 1: Full Primitives (Week 3-4)
- All storage builders (Queues, Hyperdrive, Vectorize)
- Durable Objects with class routing
- Service bindings with `.asService()`
- Cron and Queue consumer attachment
- Environment support (staging/production)
- `levi graph` terminal visualization

### Phase 2: Provisioning (Week 5-6)
- CF API integration via `cloudflare-typescript` SDK
- `levi provision` creates/updates D1 databases, KV namespaces, R2 buckets
- `levi diff` shows provisioning plan (like `terraform plan`)
- `levi deploy` chains provision → build → deploy
- Secret management via Wrangler secrets API

### Phase 3: Dashboard & DX (Week 7-8)
- Local topology dashboard (HTML served on a port during `levi dev`)
- Shows app graph, worker status, log streaming
- Framework presets: `framework: "hono"` auto-configures entrypoint patterns
- Framework presets: `framework: "vinext"` handles vinext-specific config
- `levi init` interactive scaffolder with framework selection

### Phase 4: Advanced (Future)
- `levi eject` for clean exit
- Monorepo workspace detection (pnpm/npm/yarn workspaces)
- Integration testing harness (spin up full topology, run tests, tear down)
- Claude Code agent skill for Levi projects
- Containers support (when CF containers GA)

---

## Package Structure

```
@flarefound/levi                   ← core library + types
@flarefound/levi-cli               ← CLI binary (thin wrapper over core)
create-levi                        ← npm init scaffolder
```

Published under the `@flarefound` scope. The `levi` unscoped name can be pursued for the CLI binary.

---

## Key Technical Decisions

### Why TypeScript for the AppHost (not TOML/YAML/JSON)?

The same reason Aspire uses C# and Pulumi uses general-purpose languages: **you need conditionals, loops, functions, and type safety** when declaring infrastructure. Consider:

```typescript
// Conditional based on environment
if (app.env === "production") {
  app.addHyperdrive("analytics-db", { ... });
}

// Loop to create per-tenant resources
for (const tenant of tenants) {
  app.addD1(`db-${tenant.id}`, { ... });
}

// Shared config extracted to a function
function addStandardWorker(name: string, entry: string) {
  return app.addWorker(name, {
    framework: "hono",
    entrypoint: entry,
    bindings: { DB: mainDb, CACHE: sessionCache },
  });
}
```

TOML can't do this. A TypeScript apphost can.

### Why Generate wrangler.jsonc Instead of Calling CF APIs Directly?

1. **Wrangler handles bundling.** Levi should never touch esbuild/rolldown.
2. **Wrangler handles dev server.** Miniflare integration is complex and evolving.
3. **Wrangler handles deploy.** Upload, versioning, rollback — all handled.
4. **Ejectability.** Generated configs are your escape hatch.
5. **Forward compatibility.** When Wrangler adds features, you add a passthrough.

### The Escape Hatch

Every builder accepts a `wrangler` override for raw config injection:

```typescript
app.addWorker("api", {
  // ...typed config...
  wrangler: {
    // any raw wrangler.jsonc fields — passed through verbatim
    observability: { enabled: true },
    placement: { mode: "smart" },
  },
});
```

This ensures Levi never blocks you from using a new CF feature.

---

## Competitive Moat & FlareFound Alignment

Levi is not a standalone product play. It's a **strategic asset** for FlareFound:

1. **Open source marketing.** Every GitHub star is a potential consulting lead.
2. **Consulting accelerator.** FlareFound engagements start faster when the client project is bootstrapped with Levi.
3. **Expertise signal.** Building the orchestration tool proves deep CF platform knowledge.
4. **Content engine.** Each Levi feature maps to a blog post, talk, or tutorial.
5. **Upsell path.** "We built the tool. We'll build your app with it."

### vs. Void Cloud

Void is a platform (think Vercel). Levi is a tool (think Pulumi/Aspire). They don't compete — they serve different audiences:

- **Void:** Solo devs and small teams who want zero infrastructure thinking. Framework-coupled. Managed platform.
- **Levi:** Consultants, agencies, and teams who need full control, multi-service architectures, and custom CF configurations. Framework-agnostic. Self-hosted tooling.

A FlareFound client with a complex multi-worker, multi-database architecture is never going to use Void. They need Levi.

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| CF ships native apphost / Aspire-like feature | Medium | Levi's thin-wrapper design means low maintenance cost. Pivot to adapter/extension if CF ships something. |
| Wrangler config format changes | High (it already moved from TOML to JSONC) | Abstract config generation behind versioned emitters. |
| Scope creep into framework territory | High (builder's trap) | Strict boundary: Levi orchestrates, it does not build/bundle/serve. |
| Low adoption as OSS | Medium | Primary value is internal (FlareFound consulting). OSS adoption is gravy. |
| Void Cloud captures the market | Low-Medium | Different segment. Void is PaaS, Levi is tooling. Both can coexist. |

---

## Success Metrics (6 months)

- [ ] Phase 0-1 shipped and used on 1+ FlareFound client project
- [ ] GitGate bootstrapped with Levi as dogfood validation
- [ ] 3+ blog posts on FlareFound tied to Levi features
- [ ] Package published to npm under `@flarefound/levi`
- [ ] 50+ GitHub stars (awareness metric)
- [ ] 1 conference talk or meetup presentation

---

## Open Questions

1. **Naming:** Is `levi` available on npm? Fallback: `@flarefound/levi`, `cf-levi`, `levi-cf`
2. **Dashboard:** Build custom, or integrate with Aspire dashboard protocol?
3. **Containers:** CF containers are in open beta as of June 2025. When to add support?
4. **Testing:** Should Levi include a `levi test` that spins up the full topology in Miniflare for integration tests?
5. **vinext-specific features:** Should Levi have first-class vinext presets that auto-configure KV caching, R2 for assets, etc.?

---

## Next Steps

1. Reserve `levi` or `@flarefound/levi` on npm
2. Scaffold the repo with Phase 0 scope
3. Build the `CloudflareApp` class + `addWorker()` + `addD1()` + `addKV()` + `addR2()`
4. Generate first `wrangler.jsonc` from `levi.app.ts`
5. Dogfood on GitGate
