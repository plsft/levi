import { Code } from "../../../components/Code";
import Link from "next/link";

export default function ReactExamplePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 prose-denim">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-denim-50">Guestbook — Plain React 19 SPA</h1>
          <span className="red-tab-h">Full Example</span>
        </div>
        <p className="text-denim-200 text-lg leading-relaxed max-w-3xl">
          React 19 without a meta-framework. Vite builds the SPA, a tiny Worker serves the static
          assets and proxies /api/* to a Hono API over a zero-latency service binding. Levi has
          a first-class preset for TanStack SPA; for plain React the worker uses{" "}
          <code>framework: &quot;raw&quot;</code> plus the wrangler escape hatch for the assets
          config — every option maps to documented wrangler.jsonc fields.
        </p>
      </div>

      <div className="stitch-separator mb-12" />

      <section className="mb-12">
        <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>Project Structure</h2>
        <Code>{`guestbook/
├── src/
│   ├── api/
│   │   └── index.ts        # Hono API worker (D1)
│   ├── web/
│   │   ├── main.tsx        # createRoot bootstrap
│   │   └── App.tsx         # React 19: useActionState + useOptimistic + use()
│   └── worker.ts           # Asset server + /api proxy
├── migrations/
│   └── 001_entries.sql
├── index.html
├── vite.config.ts
└── levi.app.ts`}</Code>
      </section>

      <div className="stitch-separator mb-12" />

      <section className="mb-12">
        <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>levi.app.ts</h2>
        <Code>{`import { FlareApp } from "@flarefound/levi";

const app = new FlareApp("guestbook", {
  compatibility_date: "2026-04-01",
});

const db = app.addD1("guestbook-db", { migrations: "./migrations" });

const api = app.addWorker("api", {
  framework: "hono",
  entrypoint: "./src/api/index.ts",
  bindings: { DB: db },
});

// Plain React SPA: raw worker + the wrangler escape hatch for assets.
const web = app.addWorker("web", {
  framework: "raw",
  entrypoint: "./src/worker.ts",
  bindings: { API: api.asService() },
  build: { command: "vite build" },
  wrangler: {
    assets: {
      directory: "./dist",
      binding: "ASSETS",
      not_found_handling: "single-page-application",
    },
  },
  routes: ["guestbook.example.com/*"],
});

app.addDomain("guestbook.example.com", { ssl: "full_strict" });

export default app;`}</Code>
      </section>

      <div className="stitch-separator mb-12" />

      <section className="mb-12">
        <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
          Asset Server — src/worker.ts
        </h2>
        <p className="text-denim-200 leading-relaxed max-w-3xl">
          The web worker does exactly two things: forward /api/* requests to the Hono worker over
          the service binding (a zero-latency, in-process call — no network hop), and hand
          everything else to the assets binding. The{" "}
          <code>not_found_handling: &quot;single-page-application&quot;</code> setting makes unknown
          paths fall back to index.html, so client-side routing just works.
        </p>
        <Code>{`export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      // Service binding: zero-latency call into the Hono worker.
      return env.API.fetch(request);
    }

    // Static assets; SPA fallback comes from not_found_handling.
    return env.ASSETS.fetch(request);
  },
};`}</Code>
      </section>

      <div className="stitch-separator mb-12" />

      <section className="mb-12">
        <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
          Bootstrap — src/web/main.tsx
        </h2>
        <Code>{`import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);`}</Code>
      </section>

      <div className="stitch-separator mb-12" />

      <section className="mb-12">
        <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
          React 19 Showcase — src/web/App.tsx
        </h2>
        <p className="text-denim-200 leading-relaxed max-w-3xl">
          The guestbook uses three React 19-only features: <code>use()</code> to unwrap the entries
          promise inside Suspense, a form Action with <code>useActionState</code> posting to
          /api/entries, and <code>useOptimistic</code> to show the new entry instantly before the
          server confirms.
        </p>
        <Code>{`import { use, useOptimistic, useActionState, Suspense } from "react";

type Entry = { name: string; message: string; pending?: boolean };

async function fetchEntries(): Promise<Entry[]> {
  const res = await fetch("/api/entries");
  return res.json();
}

function Entries({ entriesPromise }: { entriesPromise: Promise<Entry[]> }) {
  const entries = use(entriesPromise); // React 19: unwrap a promise in render

  const [optimistic, addOptimistic] = useOptimistic(
    entries,
    (current, entry: Entry) => [entry, ...current],
  );

  const [error, submitAction, isPending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      // React 19: form Actions receive FormData directly
      const name = formData.get("name") as string;
      const message = formData.get("message") as string;
      addOptimistic({ name, message, pending: true });
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, message }),
      });
      if (!res.ok) return "Could not sign the guestbook";
      return null;
    },
    null,
  );

  return (
    <main>
      <h1>Guestbook</h1>

      <form action={submitAction}>
        <input name="name" placeholder="Your name" required />
        <input name="message" placeholder="Say something nice" required />
        <button type="submit" disabled={isPending}>
          {isPending ? "Signing…" : "Sign"}
        </button>
        {error && <p role="alert">{error}</p>}
      </form>

      <ul>
        {optimistic.map((entry, i) => (
          <li key={i} style={{ opacity: entry.pending ? 0.5 : 1 }}>
            <strong>{entry.name}</strong>: {entry.message}
            {entry.pending && <em> pending…</em>}
          </li>
        ))}
      </ul>
    </main>
  );
}

export function App() {
  return (
    <Suspense fallback={<p>Loading entries…</p>}>
      <Entries entriesPromise={fetchEntries()} />
    </Suspense>
  );
}`}</Code>
      </section>

      <div className="stitch-separator mb-12" />

      <section className="mb-12">
        <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
          Hono API — src/api/index.ts
        </h2>
        <Code>{`import { Hono } from "hono";

const app = new Hono<{ Bindings: { DB: D1Database } }>();

app.get("/api/entries", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT name, message, created_at FROM entries ORDER BY created_at DESC LIMIT 50",
  ).all();
  return c.json(results);
});

app.post("/api/entries", async (c) => {
  const { name, message } = await c.req.json<{ name: string; message: string }>();
  await c.env.DB.prepare("INSERT INTO entries (name, message) VALUES (?, ?)")
    .bind(name, message)
    .run();
  return c.json({ ok: true }, 201);
});

export default app;`}</Code>
      </section>

      <div className="stitch-separator mb-12" />

      <section className="mb-12">
        <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>What Levi Generates</h2>
        <p className="text-denim-200 leading-relaxed max-w-3xl">
          Levi generates two wrangler.jsonc files — one per worker. The web worker&apos;s config
          contains the assets block verbatim from the escape hatch, plus the service binding to the
          api worker. Running <code>levi dev</code> starts both workers locally with the binding
          wired, so /api/* requests flow through the same path they take in production.
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
            href="/docs/workers"
            className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
          >
            Workers Docs
          </Link>
        </div>
      </div>
    </div>
  );
}
