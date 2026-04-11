# levi

**The AppHost Framework for Cloudflare**

Declare your entire Cloudflare application topology — Workers, D1, KV, R2, Queues, Durable Objects, AI, Domains — in a single typed TypeScript file. Levi generates valid `wrangler.jsonc` configs, provisions resources, and orchestrates deployment.

Levi does **not** replace Wrangler. It orchestrates it.

```
npm install -D @flarefound/levi
```

**[Docs](https://levi.flarefound.com)** | **[Getting Started](https://levi.flarefound.com/getting-started)** | **[Examples](https://levi.flarefound.com/examples)** | **[GitHub](https://github.com/plsft/levi)**

---

## Quick Start

```bash
npx levi init          # scaffold a project (vinext, TanStack, hono, or raw)
npx levi build         # generate wrangler.jsonc for every worker
npx levi dev           # local dev — spawns wrangler dev per worker
npx levi deploy        # deploy in dependency order
```

## The AppHost File

One file. Full type safety. Zero lock-in.

```typescript
// levi.app.ts
import { FlareApp } from "@flarefound/levi";

const app = new FlareApp("my-saas", {
  compatibility_date: "2026-04-01",
});

// Storage
const db = app.addD1("main-db", { migrations: "./migrations" });
const cache = app.addKV("sessions", { ttl: 3600 });
const uploads = app.addR2("user-uploads");

// Queue + consumer
const jobs = app.addQueue("background-jobs", { retries: 3 });

// AI
const ai = app.addWorkersAI();

// API worker — binds to everything
const api = app.addWorker("api", {
  framework: "hono",
  entrypoint: "./packages/api/src/index.ts",
  bindings: { DB: db, CACHE: cache, UPLOADS: uploads, JOBS: jobs, AI: ai },
  routes: ["api.acme.com/*"],
  crons: [{ pattern: "0 */6 * * *" }],
});

// Job runner — consumes the queue
app.addWorker("job-runner", {
  entrypoint: "./packages/jobs/src/index.ts",
  bindings: { DB: db, AI: ai },
  consumers: [{ queue: jobs, maxBatchSize: 10 }],
});

// vinext frontend — service binding to API
app.addWorker("web", {
  framework: "vinext",
  entrypoint: "./packages/web",
  bindings: { API: api.asService(), CACHE: cache },
  routes: ["acme.com/*"],
});

// Domains
app.addDomain("acme.com", { ssl: "full_strict", redirectWww: true });
app.addDomain("api.acme.com", { ssl: "full_strict" });

export default app;
```

Run `levi build` and Levi generates a complete, valid `wrangler.jsonc` for each worker — with all bindings, routes, crons, migrations, and compatibility flags resolved.

## Frontend Framework Support

Levi ships with first-class support for these frontend frameworks:

| Framework | Command | Description |
|---|---|---|
| **[vinext](https://vinext.io)** | `framework: "vinext"` | Recommended. Vite + React 19 with SSR, service bindings, `nodejs_compat` |
| **TanStack SPA** | `framework: "tanstack"` | Vite + React + TanStack Query + TanStack Router (pure SPA, no SSR) |
| **Hono** | `framework: "hono"` | Lightweight API framework, no frontend |
| **Raw Worker** | no framework | Plain Worker, no frontend |

## What Levi Generates

```
.levi/
├── workers/
│   ├── api/wrangler.jsonc          ← D1, KV, R2, Queue, AI bindings
│   ├── job-runner/wrangler.jsonc   ← D1, AI bindings + queue consumer
│   └── web/wrangler.jsonc          ← service binding + assets config (vinext/tanstack)
└── graph.json                      ← serialized dependency graph
```

Every generated config is a **standalone, valid** wrangler.jsonc. If you eject from Levi, you copy these files and you're done.

## Cloudflare Primitive Coverage

Every Cloudflare primitive gets a typed builder method with full IntelliSense:

| Category | Primitive | Method |
|---|---|---|
| **Compute** | Workers | `addWorker()` |
| | Durable Objects | `addDurableObject()` |
| | Workflows | `addWorkflow()` |
| | Containers (beta) | `addContainer()` |
| **Storage** | D1 Database | `addD1()` |
| | KV Namespace | `addKV()` |
| | R2 Bucket | `addR2()` |
| | Queues | `addQueue()` |
| | Vectorize | `addVectorize()` |
| | Hyperdrive | `addHyperdrive()` |
| | Pipelines (beta) | `addPipeline()` |
| **AI** | Workers AI | `addWorkersAI()` |
| | AI Gateway | `addAIGateway()` |
| **Network** | Custom Domains | `addDomain()` |
| | Service Bindings | `.asService()` |
| | mTLS | `addMTLS()` |

## CLI Commands

```bash
npx levi init              # scaffold a project
npx levi build             # generate wrangler.jsonc configs
npx levi build --env prod  # generate configs for specific environment
npx levi dev                # local dev with live reload
npx levi dev --env local   # dev with local environment
npx levi deploy            # provision + deploy all workers
npx levi deploy --env prod # deploy to specific environment
npx levi provision         # create Cloudflare resources only
npx levi diff              # compare local vs deployed configs
npx levi dashboard         # ASCII topology dashboard
```

## Programmatic API

The same package works as a library:

```typescript
import { FlareApp, WranglerGenerator } from "@flarefound/levi";

const app = new FlareApp("my-app", { compatibility_date: "2026-04-01" });
const db = app.addD1("db");
const api = app.addWorker("api", {
  entrypoint: "./src/index.ts",
  bindings: { DB: db },
});

// Validate the graph
const result = app.build();
console.log(result.deployOrder); // ["db", "api"]

// Generate wrangler configs
const gen = new WranglerGenerator(app);
for (const [name, config] of gen.generateAll()) {
  console.log(name, WranglerGenerator.serialize(config));
}
```

## DNS Provisioning

Levi provisions custom domains via the Cloudflare REST API:

```typescript
app.addDomain("api.example.com", {
  ssl: "full_strict",
  redirectWww: true,
});
```

```bash
export CLOUDFLARE_API_TOKEN=your-token
npx levi provision
```

Creates DNS records, configures SSL mode, and sets up www redirects — all idempotent.

## vinext First-Class Support

[vinext](https://vinext.io) is the recommended frontend framework. `framework: "vinext"` auto-configures:

- SSR entry point (`dist/server/index.js`)
- Static assets serving (`dist/client/`)
- `nodejs_compat` compatibility flag
- Service bindings for frontend-to-API communication

## TanStack SPA Support

TanStack SPA is a pure client-side frontend using Vite + React + TanStack Query + TanStack Router. `framework: "tanstack"` auto-configures:

- Static assets serving (`dist/client/`)
- Service binding to connected API workers
- No SSR — all data fetching via TanStack Query

```typescript
const api = app.addWorker("api", {
  framework: "hono",
  entrypoint: "./src/api/index.ts",
  bindings: { DB: db },
});

const web = app.addWorker("web", {
  framework: "tanstack",
  entrypoint: "./src/web",
  bindings: { API: api.asService() },
});
```

## Zero Lock-in

Levi generates standard `wrangler.jsonc` files. At any point:

```bash
npx levi eject
```

This copies the configs to your project root. Delete Levi, and you're running on pure Wrangler. No proprietary SDK, no platform dependency, no vendor lock-in.

## Design Principles

1. **Wrangler is the engine. Levi is the driver.** Never reimplement what Wrangler does.
2. **TypeScript-first.** The apphost file is the single source of truth. All configs are generated.
3. **Expose everything.** Every Cloudflare primitive gets a typed builder. No magic.
4. **Local dev is first-class.** `levi dev` runs all workers locally with correct bindings.
5. **Incremental adoption.** Use Levi for one worker or a 12-service monorepo.

## Requirements

- Node.js >= 18
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) >= 3.0 (peer dependency)
- Cloudflare account (for deployment)

## License

MIT — [Flarefound](https://flarefound.com)
