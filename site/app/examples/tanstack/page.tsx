import Link from "next/link";
import { DashboardCode, CustomersCode, InvoicesCode } from "./code";

export default function TanstackExamplePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 prose-denim">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-denim-50">Invoice SaaS — TanStack SPA</h1>
          <span className="red-tab-h">Full Example</span>
        </div>
        <p className="text-denim-200 text-lg leading-relaxed max-w-3xl">
          A complete invoice management application using TanStack SPA frontend with a Hono API backend.
          Features login, dashboard with stats, customer CRUD with modal, and invoice list with view modal.
        </p>
      </div>

      <div className="stitch-separator mb-12" />

      <section className="mb-12">
        <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>Project Structure</h2>
        <pre className="bg-denim-900 border border-denim-700 rounded-lg p-4 text-denim-100 text-sm overflow-x-auto">{`invoice-saas/
├── src/
│   ├── api/
│   │   └── index.ts          # Hono API worker
│   ├── web/
│   │   ├── main.tsx          # TanStack Query + Router setup
│   │   └── app/
│   │       ├── query.ts      # fetchApi helper
│   │       └── routes/
│   │           ├── index.tsx     # Login page
│   │           ├── dashboard.tsx  # Stats dashboard
│   │           ├── customers.tsx  # Customer CRUD with modal
│   │           └── invoices.tsx   # Invoice list with view modal
├── migrations/
│   └── 001_init.sql          # D1 schema
└── levi.app.ts               # FlareApp definition`}</pre>
      </section>

      <div className="stitch-separator mb-12" />

      <section className="mb-12">
        <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>levi.app.ts</h2>
        <pre className="bg-denim-900 border border-denim-700 rounded-lg p-4 text-denim-100 text-sm overflow-x-auto">{`import { FlareApp } from "@flarefound/levi";

const app = new FlareApp("invoice-saas", {
  compatibility_dates: "2026-04-01",
});

const db = app.addD1("main-db", { migrations: "./migrations" });

const api = app.addWorker("api", {
  framework: "hono",
  entrypoint: "./src/api/index.ts",
  bindings: { DB: db },
  routes: ["api.invoice.example.com/*"],
});

const web = app.addWorker("web", {
  framework: "tanstack",
  entrypoint: "./src/web",
  bindings: { API: api.asService() },
  routes: ["app.invoice.example.com/*"],
});

app.addDomain("invoice.example.com", { ssl: "full_strict" });

export default app;`}</pre>
      </section>

      <div className="stitch-separator mb-12" />

      <section className="mb-12">
        <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>Dashboard — src/web/app/routes/dashboard.tsx</h2>
        <DashboardCode />
      </section>

      <div className="stitch-separator mb-12" />

      <section className="mb-12">
        <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>Customers — src/web/app/routes/customers.tsx (with Modal)</h2>
        <CustomersCode />
      </section>

      <div className="stitch-separator mb-12" />

      <section className="mb-12">
        <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>Invoices — src/web/app/routes/invoices.tsx (with View Modal)</h2>
        <InvoicesCode />
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
            href="/docs/tanstack"
            className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
          >
            TanStack Docs
          </Link>
        </div>
      </div>
    </div>
  );
}