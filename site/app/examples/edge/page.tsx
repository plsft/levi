import Link from "next/link";

export default function EdgeExamplePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 prose-denim">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-denim-50">Edge-Hardened Production App</h1>
          <span className="red-tab-h">Full Example</span>
        </div>
        <p className="text-denim-200 text-lg leading-relaxed max-w-3xl">
          A production app where the entire zone edge is declared in code. The app plus its WAF,
          cache rules, redirects, rate limits, security headers, and observability — all in one{" "}
          levi.app.ts, using Levi 0.4.0&apos;s edge rules layer. No Terraform, no dashboard
          clicking. Levi tags every rule it creates with &quot;Managed by Levi:&quot; and never
          touches rules it doesn&apos;t own.
        </p>
      </div>

      <div className="stitch-separator mb-12" />

      <section className="mb-12">
        <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>levi.app.ts — Compute</h2>
        <p className="text-denim-200 leading-relaxed max-w-3xl">
          The compute layer first: a Hono API worker backed by D1 and KV, an Analytics Engine
          dataset for metrics, and a tail worker that receives the API worker&apos;s logs.
        </p>
        <pre className="bg-denim-900 border border-denim-700 rounded-lg p-4 text-denim-100 text-sm overflow-x-auto">{`import { FlareApp } from "@flarefound/levi";

const app = new FlareApp("acme-shop", {
  compatibility_date: "2026-04-01",
  defaultZone: "acme-shop.example",
});

// ── Compute ──────────────────────────────────────────────
const db = app.addD1("shop-db", { migrations: "./migrations" });
const sessions = app.addKV("sessions");

const sink = app.addTailWorker("log-sink", {
  entrypoint: "./src/sink.ts",
});

const metrics = app.addAnalyticsEngine("shop-metrics");

const api = app.addWorker("api", {
  framework: "hono",
  entrypoint: "./src/api.ts",
  bindings: { DB: db, SESSIONS: sessions, METRICS: metrics },
  routes: ["acme-shop.example/api/*"],
  tailConsumers: [sink],
});

app.addDomain("acme-shop.example", { ssl: "full_strict" });`}</pre>
      </section>

      <div className="stitch-separator mb-12" />

      <section className="mb-12">
        <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>levi.app.ts — The Edge, Declared</h2>
        <p className="text-denim-200 leading-relaxed max-w-3xl">
          Everything that would normally live in the dashboard — redirects, cache policy, WAF,
          rate limiting, response headers — is part of the same app definition. Same file, same
          diff, same deploy.
        </p>
        <pre className="bg-denim-900 border border-denim-700 rounded-lg p-4 text-denim-100 text-sm overflow-x-auto">{`// ── The edge, declared ───────────────────────────────────
// Legacy domain → new domain, path preserved
app.addRedirect("www-to-apex", {
  from: "https://www.acme-shop.example/*",
  to: "https://acme-shop.example/\${1}",
  status: 301,
});

// Cache static assets hard; never cache the API
app.addCacheRule("static-assets", {
  match: { pathStartsWith: "/assets/" },
  cache: true,
  edgeTtl: 86400,
  browserTtl: 3600,
});
app.addCacheRule("api-bypass", {
  match: { pathStartsWith: "/api/" },
  cache: false,
});

// Challenge unverified bots before they reach the worker
app.addWAFRule("challenge-bots", {
  expression: "cf.client.bot and not cf.verified_bot",
  action: "managed_challenge",
});

// Brute-force protection on login, at the edge
app.addRateLimitRule("login-limit", {
  expression: 'http.request.uri.path eq "/api/login"',
  requestsPerPeriod: 10,
  period: 60,
  mitigationTimeout: 600,
});

// Security headers on every response
app.addHeaderRule("security-headers", {
  direction: "response",
  headers: {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Server": { operation: "remove" },
  },
});

export default app;`}</pre>
      </section>

      <div className="stitch-separator mb-12" />

      <section className="mb-12">
        <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>What levi build Produces</h2>
        <p className="text-denim-200 leading-relaxed max-w-3xl">
          Each worker gets its own generated wrangler config, and every zone with edge rules gets
          a rules manifest describing exactly what Levi will manage.
        </p>
        <pre className="bg-denim-900 border border-denim-700 rounded-lg p-4 text-denim-100 text-sm overflow-x-auto">{`.levi/
├── workers/
│   ├── api/
│   │   └── wrangler.jsonc
│   └── log-sink/
│       └── wrangler.jsonc
└── zones/
    └── acme-shop.example.rules.json`}</pre>
        <p className="text-denim-200 leading-relaxed max-w-3xl">
          An excerpt from the zone manifest — note the description prefix, which is how Levi
          recognizes its own rules on subsequent runs:
        </p>
        <pre className="bg-denim-900 border border-denim-700 rounded-lg p-4 text-denim-100 text-sm overflow-x-auto">{`{
  "zone": "acme-shop.example",
  "rulesets": {
    "http_request_dynamic_redirect": [
      {
        "description": "Managed by Levi: www-to-apex",
        "expression": "(http.host eq \\"www.acme-shop.example\\")",
        "action": "redirect",
        "action_parameters": {
          "from_value": {
            "status_code": 301,
            "target_url": {
              "expression": "wildcard_replace(http.request.full_uri, \\"https://www.acme-shop.example/*\\", \\"https://acme-shop.example/\${1}\\")"
            },
            "preserve_query_string": true
          }
        }
      }
    ]
  }
}`}</pre>
      </section>

      <div className="stitch-separator mb-12" />

      <section className="mb-12">
        <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>Drift Detection</h2>
        <p className="text-denim-200 leading-relaxed max-w-3xl">
          <code>levi diff</code> compares the declared edge against what&apos;s live in the zone
          and shows exactly what would change before anything is applied.
        </p>
        <pre className="bg-denim-900 border border-denim-700 rounded-lg p-4 text-denim-100 text-sm overflow-x-auto">{`$ levi diff

Zone: acme-shop.example
  Redirects
    + create  www-to-apex          (301, path preserved)
  Cache Rules
    = unchanged  static-assets
    + create  api-bypass
  WAF Custom Rules
    + create  challenge-bots
    (2 unmanaged rules present — untouched)
  Rate Limiting
    = unchanged  login-limit
  Header Transforms
    + create  security-headers

3 to create, 2 unchanged, 0 to delete.

$ levi provision
✔ Zone acme-shop.example: 3 rules created, 2 unchanged`}</pre>
        <p className="text-denim-200 leading-relaxed max-w-3xl">
          The safety model is simple: Levi only ever creates, updates, or deletes rules whose
          description starts with &quot;Managed by Levi:&quot;. Anything created by hand in the
          dashboard — or by another tool — is invisible to Levi&apos;s writes. It shows up in the
          diff as an unmanaged count, and it stays exactly as it is.
        </p>
      </section>

      <div className="stitch-separator mb-12" />

      <section className="mb-12">
        <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>Observability Included</h2>
        <p className="text-denim-200 leading-relaxed max-w-3xl">
          The tail worker gets its own generated config and deploys first, so the API
          worker&apos;s logs have somewhere to go from its very first request. Inside the API
          worker, metrics go straight to Analytics Engine via{" "}
          <code>env.METRICS.writeDataPoint(...)</code> — no HTTP hop, no batching code. The sink
          itself is about ten lines:
        </p>
        <pre className="bg-denim-900 border border-denim-700 rounded-lg p-4 text-denim-100 text-sm overflow-x-auto">{`// src/sink.ts
export default {
  async tail(events) {
    for (const event of events) {
      for (const log of event.logs) {
        console.log(JSON.stringify({
          worker: event.scriptName,
          outcome: event.outcome,
          message: log.message,
        }));
      }
    }
  },
};`}</pre>
      </section>

      <div className="stitch-separator mb-12" />

      <div className="denim-pocket p-5">
        <h2 className="text-sm font-bold text-denim-300 uppercase tracking-widest mb-3">
          Ready to Build?
        </h2>
        <p className="text-sm text-denim-300 mb-4">
          Declare your whole edge in code and let Levi keep it honest.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/docs/edge-rules"
            className="px-4 py-2 text-sm bg-wash-600/20 border border-dashed border-wash-500 rounded-md text-wash-300 hover:bg-wash-600/30 transition-colors"
          >
            Edge Rules Docs
          </Link>
          <Link
            href="/why-levi"
            className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
          >
            Why Levi
          </Link>
        </div>
      </div>
    </div>
  );
}
