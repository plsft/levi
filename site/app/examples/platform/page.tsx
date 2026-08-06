import { Code } from "../../../components/Code";
import Link from "next/link";

export default function PlatformExamplePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 prose-denim">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-denim-50">Multi-Tenant SaaS — Workers for Platforms</h1>
          <span className="red-tab-h">Full Example</span>
        </div>
        <p className="text-denim-200 text-lg leading-relaxed max-w-3xl">
          Run untrusted customer Workers at scale with dispatch namespaces. This example builds
          &quot;tenantflow&quot;, a platform where every customer deploys their own code to an isolated
          Worker. Levi 0.4.0 declares the dispatch namespace, the outbound guard that filters tenant
          egress, per-tenant rate limiting, Secrets Store, and ops email notifications — all in one file.
        </p>
      </div>

      <div className="stitch-separator mb-12" />

      <section className="mb-12">
        <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>Project Structure</h2>
        <Code>{`tenantflow/
├── src/
│   ├── router.ts         # Dispatch worker — resolves tenant, rate limits, dispatches
│   ├── guard.ts          # Outbound worker — filters all tenant egress
│   └── admin.ts          # Admin API — tenant CRUD, script uploads
└── levi.app.ts           # FlareApp definition`}</Code>
      </section>

      <div className="stitch-separator mb-12" />

      <section className="mb-12">
        <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>levi.app.ts</h2>
        <Code>{`import { FlareApp } from "@flarefound/levi";

const app = new FlareApp("tenantflow", {
  compatibility_date: "2026-04-01",
  defaultZone: "tenantflow.example",
});

// Outbound guard — intercepts all fetch() egress from tenant code
const guard = app.addWorker("outbound-guard", {
  entrypoint: "./src/guard.ts",
});

// The dispatch namespace running customer Workers
const tenants = app.addDispatchNamespace("customers-prod", {
  outbound: { service: guard, parameters: ["customer_id"] },
});

// Per-tenant API rate limiting (shared counter namespace)
const limiter = app.addRateLimit("tenant-api", { limit: 300, period: 60 });

// Platform secrets, shared across workers via Secrets Store
const platformKey = app.addSecretsStoreSecret("platform-signing-key");

// Notify ops when a tenant deploy fails
const alerts = app.addEmail("ops-alerts", {
  destinationAddress: "ops@tenantflow.example",
});

// Usage metering
const usage = app.addAnalyticsEngine("tenant-usage");

// The router: every request → resolve tenant → dispatch
const router = app.addWorker("router", {
  entrypoint: "./src/router.ts",
  bindings: {
    DISPATCH: tenants,
    LIMITER: limiter,
    SIGNING_KEY: platformKey,
    ALERTS: alerts,
    USAGE: usage,
  },
  routes: ["*.tenantflow.example/*"],
});

app.addDomain("tenantflow.example", { ssl: "full_strict" });

export default app;`}</Code>
      </section>

      <div className="stitch-separator mb-12" />

      <section className="mb-12">
        <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>Router — src/router.ts</h2>
        <p className="text-denim-200 leading-relaxed max-w-3xl">
          The router is the front door for every tenant request. It resolves the tenant from the
          subdomain, applies the shared rate limit, then dispatches into the namespace.
        </p>
        <Code>{`export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const host = new URL(request.url).hostname;
    const tenant = host.split(".")[0]; // acme.tenantflow.example → "acme"

    // Per-tenant rate limiting
    const { success } = await env.LIMITER.limit({ key: tenant });
    if (!success) {
      return new Response("Rate limit exceeded", { status: 429 });
    }

    try {
      // Grab the tenant's Worker from the dispatch namespace and run it.
      // The outbound guard receives customer_id on every fetch() the
      // tenant code makes.
      const worker = env.DISPATCH.get(tenant);
      const response = await worker.fetch(request);

      // Meter the request for billing
      env.USAGE.writeDataPoint({
        blobs: [tenant],
        doubles: [1],
        indexes: [tenant],
      });

      return response;
    } catch (err) {
      if (String(err).includes("Worker not found")) {
        return new Response(\`No such tenant: \${tenant}\`, { status: 404 });
      }
      throw err;
    }
  },
};`}</Code>
      </section>

      <div className="stitch-separator mb-12" />

      <section className="mb-12">
        <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>Outbound Guard — src/guard.ts</h2>
        <p className="text-denim-200 leading-relaxed max-w-3xl">
          Every <code>fetch()</code> made by tenant code passes through this Worker first. The
          <code> customer_id</code> parameter declared on the namespace arrives in the environment,
          so you can audit and filter egress per tenant.
        </p>
        <Code>{`const BLOCKED = ["localhost", "127.0.0.1", "169.254.169.254", "internal.tenantflow.example"];

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const customerId = env.customer_id; // set by the dispatch namespace
    const hostname = new URL(request.url).hostname;

    if (BLOCKED.some((h) => hostname === h || hostname.endsWith("." + h))) {
      console.log(\`blocked egress from \${customerId} → \${hostname}\`);
      return new Response("Egress to internal hosts is not allowed", { status: 403 });
    }

    return fetch(request);
  },
};`}</Code>
      </section>

      <div className="stitch-separator mb-12" />

      <section className="mb-12">
        <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>Provision &amp; Deploy</h2>
        <Code>{`levi build       # compile workers, validate the app graph
levi provision   # creates the dispatch namespace (wrangler dispatch-namespace create),
                 # the Secrets Store secret, and registers the ops-alerts email destination
levi deploy      # deploys the router, guard, and admin workers`}</Code>
        <p className="text-denim-200 leading-relaxed max-w-3xl">
          Tenant scripts themselves are uploaded into the namespace via the Cloudflare API at
          runtime — your admin API calls it whenever a customer deploys. See the{" "}
          <Link href="/docs/platforms">Workers for Platforms docs</Link> for the upload flow.
        </p>
      </section>

      <div className="stitch-separator mb-12" />

      <div className="denim-pocket p-5">
        <h2 className="text-sm font-bold text-denim-300 uppercase tracking-widest mb-3">
          Ready to Build?
        </h2>
        <p className="text-sm text-denim-300 mb-4">
          Clone this example and deploy with a single command.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/getting-started"
            className="px-4 py-2 text-sm bg-wash-600/20 border border-dashed border-wash-500 rounded-md text-wash-300 hover:bg-wash-600/30 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/docs/platforms"
            className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
          >
            Workers for Platforms Docs
          </Link>
        </div>
      </div>
    </div>
  );
}
