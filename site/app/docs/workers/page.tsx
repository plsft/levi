import { DocLayout } from "../../../components/DocLayout";
import { CodeBlock } from "../../../components/CodeBlock";

export const metadata = {
  title: "Workers — Levi Docs",
  description:
    "Deploy Cloudflare Workers with full binding support, cron triggers, queue consumers, and framework-aware builds.",
};

export default function WorkersPage() {
  return (
    <DocLayout>
      {/* ── Header ─────────────────────────────────── */}
      <div className="stitch-border-b pb-8 mb-10">
        <h1 className="text-4xl font-bold text-wash-300 mb-3">Workers</h1>
        <p className="text-lg text-denim-300 leading-relaxed max-w-2xl">
          Workers are the compute primitive in Levi. Call{" "}
          <code className="inline-code">addWorker()</code> on your app host to
          declare a Cloudflare Worker with bindings, routes, cron triggers,
          queue consumers, and custom build configuration — all in TypeScript.
        </p>
      </div>

      {/* ── Overview ───────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">Overview</h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          <code className="inline-code">addWorker(name, options)</code> registers
          a Worker resource in the Levi application model. At build time, Levi
          resolves every binding reference, generates a{" "}
          <code className="inline-code">wrangler.jsonc</code> configuration file,
          and orchestrates the deployment through Wrangler. The method returns a{" "}
          <code className="inline-code">WorkerResource</code> handle you can pass
          to other resources (service bindings, queues, etc.).
        </p>
        <p className="text-denim-200 leading-relaxed mb-4">
          Levi supports four framework modes that change how the worker is built
          and served:
        </p>
        <ul className="list-disc list-inside text-denim-200 space-y-1 ml-2">
          <li>
            <strong className="text-wash-300">vinext</strong> — Full-stack React 19
            + Vite SSR on Workers (recommended)
          </li>
          <li>
            <strong className="text-wash-300">tanstack</strong> — Vite + React +
            TanStack Query + TanStack Router (pure SPA, no SSR)
          </li>
          <li>
            <strong className="text-wash-300">hono</strong> — Lightweight Hono API
            framework with automatic middleware wiring
          </li>
          <li>
            <strong className="text-wash-300">raw</strong> — Bare fetch handler, no
            framework overhead
          </li>
        </ul>
      </section>

      {/* ── Basic Usage ────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">Basic Usage</h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          The simplest worker declaration requires only a name and an entry
          point. Levi infers sensible defaults for everything else.
        </p>
        <CodeBlock title="app.host.ts" lang="typescript">
          <span className="syn-kw">import</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-type">FlareApp</span>{" "}
          <span className="syn-punc">{"}"}</span>{" "}
          <span className="syn-kw">from</span>{" "}
          <span className="syn-str">"@flarefound/levi"</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">app</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-kw">new</span>{" "}
          <span className="syn-type">FlareApp</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"my-project"</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addWorker</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"api"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">entrypoint</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./src/worker.ts"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
        </CodeBlock>
        <p className="text-denim-200 leading-relaxed">
          This generates a minimal <code className="inline-code">wrangler.jsonc</code>{" "}
          with the worker name set to{" "}
          <code className="inline-code">my-project-api</code>, compatibility
          flags enabled, and a default build command.
        </p>
      </section>

      {/* ── Framework Detection ────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">
          Framework Detection
        </h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          Set the <code className="inline-code">framework</code> option to change
          how Levi builds and bundles the worker. Each mode adds
          framework-specific configuration to the generated wrangler config.
        </p>
        <CodeBlock title="vinext framework" lang="typescript">
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addWorker</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"web"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">entrypoint</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./src/app.ts"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">framework</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"vinext"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">
            {"// Adds site config, assets binding, and Vite SSR build step"}
          </span>
        </CodeBlock>
        <CodeBlock title="hono framework" lang="typescript">
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addWorker</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"api"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">entrypoint</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./src/api.ts"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">framework</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"hono"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">
            {"// Adds Hono-optimized bundling, typed env injection"}
          </span>
        </CodeBlock>
        <CodeBlock title="raw (no framework)" lang="typescript">
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addWorker</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"edge-fn"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">entrypoint</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./src/handler.ts"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">framework</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"raw"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">
            {"// Minimal config — just the fetch handler, no extras"}
          </span>
        </CodeBlock>
      </section>

      {/* ── Bindings ───────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">Bindings</h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          Bindings connect your worker to Cloudflare resources. Pass the resource
          handles returned by other <code className="inline-code">add*()</code>{" "}
          methods into the worker's <code className="inline-code">bindings</code>{" "}
          object. Levi resolves the binding IDs and generates the correct
          wrangler configuration automatically.
        </p>
        <CodeBlock title="Full bindings example" lang="typescript">
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">db</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addD1</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"main-db"</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">cache</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addKV</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"cache"</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">uploads</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addR2</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"uploads"</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">tasks</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addQueue</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"tasks"</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">counter</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addDurableObject</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"counter"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">className</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"Counter"</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">vectors</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addVectorize</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"embeddings"</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">pg</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addHyperdrive</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"postgres"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">connectionString</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"postgresql://user:pass@host/db"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addWorker</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"api"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">entrypoint</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./src/api.ts"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">bindings</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">DB</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">db</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">CACHE</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">cache</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">UPLOADS</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">uploads</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">TASKS</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">tasks</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">COUNTER</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">counter</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">VECTORS</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">vectors</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">PG</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">pg</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">AI</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"ai"</span>
          <span className="syn-punc">,</span>
          {"  "}
          <span className="syn-cmt">{"// built-in AI binding"}</span>
          {"\n"}
          {"  "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
        </CodeBlock>
        <p className="text-denim-200 leading-relaxed">
          The binding keys (<code className="inline-code">DB</code>,{" "}
          <code className="inline-code">CACHE</code>, etc.) become the property
          names on the <code className="inline-code">env</code> object inside your
          worker code. Levi generates the correct{" "}
          <code className="inline-code">d1_databases</code>,{" "}
          <code className="inline-code">kv_namespaces</code>,{" "}
          <code className="inline-code">r2_buckets</code>, and other arrays in the
          wrangler config.
        </p>
      </section>

      {/* ── Routes ─────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">Routes</h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          Use the <code className="inline-code">routes</code> array to map URL
          patterns to a worker. Levi supports both pattern routes and custom
          domain routes.
        </p>
        <CodeBlock title="Route configuration" lang="typescript">
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addWorker</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"web"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">entrypoint</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./src/web.ts"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">routes</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">[</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">pattern</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"example.com/*"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">zone_name</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"example.com"</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">pattern</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"api.example.com/v1/*"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">zone_name</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"example.com"</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">custom_domain</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-kw">true</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">pattern</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"app.example.com"</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-punc">]</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
        </CodeBlock>
      </section>

      {/* ── Cron Triggers ──────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">Cron Triggers</h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          Schedule your worker to run on a cron schedule using the{" "}
          <code className="inline-code">crons</code> array. Each entry is a
          <code className="inline-code">CronConfig</code> object with a <code className="inline-code">pattern</code> field.
        </p>
        <CodeBlock title="Cron configuration" lang="typescript">
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addWorker</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"scheduler"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">entrypoint</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./src/scheduler.ts"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">crons</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">[</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">pattern</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"0 * * * *"</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"      "}
          <span className="syn-cmt">{"// every hour"}</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">pattern</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"*/15 * * * *"</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"  "}
          <span className="syn-cmt">{"// every 15 minutes"}</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">pattern</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"0 0 * * MON"</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"  "}
          <span className="syn-cmt">{"// every Monday at midnight"}</span>
          {"\n"}
          {"  "}
          <span className="syn-punc">]</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
        </CodeBlock>
        <p className="text-denim-200 leading-relaxed">
          Levi writes these into the{" "}
          <code className="inline-code">triggers.crons</code> array in the generated
          wrangler config. Your worker must export a{" "}
          <code className="inline-code">scheduled</code> handler to receive the
          events.
        </p>
      </section>

      {/* ── Queue Consumers ────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">
          Queue Consumers
        </h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          Attach your worker as a consumer for one or more queues using the{" "}
          <code className="inline-code">consumers</code> array. Each entry
          references a queue resource and optionally configures batching.
        </p>
        <CodeBlock title="Queue consumer configuration" lang="typescript">
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">emailQueue</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addQueue</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"emails"</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">emailDlq</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addQueue</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"email-dlq"</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addWorker</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"email-worker"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">entrypoint</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./src/email-worker.ts"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">consumers</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">[</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">queue</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">emailQueue</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">maxBatchSize</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-num">10</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">maxWaitMs</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-num">30</span>
          <span className="syn-punc">,</span>
          {"  "}
          <span className="syn-cmt">{"// seconds"}</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">maxRetries</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-num">3</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">deadLetterQueue</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">emailDlq</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-punc">]</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
        </CodeBlock>
      </section>

      {/* ── Build Config ───────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">Build Config</h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          Override the default build behavior with custom commands and watch
          directories. Useful when your worker has a non-standard build pipeline.
        </p>
        <CodeBlock title="Custom build" lang="typescript">
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addWorker</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"api"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">entrypoint</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./dist/worker.js"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">build</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">command</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"npm run build:worker"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">cwd</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./packages/api"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">watchDir</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./packages/api/src"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
        </CodeBlock>
      </section>

      {/* ── Placement ──────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">Placement</h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          Cloudflare Smart Placement automatically runs your worker close to the
          backend services it talks to, reducing latency. Enable it with the{" "}
          <code className="inline-code">placement</code> option.
        </p>
        <CodeBlock title="Smart placement" lang="typescript">
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addWorker</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"api"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">entrypoint</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./src/api.ts"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">placement</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">mode</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"smart"</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
        </CodeBlock>
      </section>

      {/* ── Observability ──────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">Observability</h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          Configure log shipping and trace sampling to monitor your workers in
          production.
        </p>
        <CodeBlock title="Observability config" lang="typescript">
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addWorker</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"api"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">entrypoint</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./src/api.ts"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">observability</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">enabled</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-kw">true</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">headSamplingRate</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-num">0.1</span>
          <span className="syn-punc">,</span>
          {"  "}
          <span className="syn-cmt">{"// sample 10% of requests"}</span>
          {"\n"}
          {"  "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">logpush</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-kw">true</span>
          <span className="syn-punc">,</span>
          {"         "}
          <span className="syn-cmt">{"// enable Workers Logpush"}</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
        </CodeBlock>
      </section>

      {/* ── Escape Hatch ───────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">Escape Hatch</h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          Need to set a wrangler option that Levi doesn't model yet? Use the{" "}
          <code className="inline-code">wrangler</code> escape hatch to inject
          raw key-value pairs directly into the generated config. Values here are
          merged last, so they can override anything Levi generates.
        </p>
        <CodeBlock title="Raw wrangler injection" lang="typescript">
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addWorker</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"api"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">entrypoint</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./src/api.ts"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">wrangler</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">node_compat</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-kw">true</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">usage_model</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"unbound"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">limits</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">cpu_ms</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-num">50</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
        </CodeBlock>
      </section>

      {/* ── Full API Reference ─────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">
          Full API Reference
        </h2>
        <p className="text-denim-200 leading-relaxed mb-6">
          All properties accepted by{" "}
          <code className="inline-code">addWorker(name, options)</code>:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-denim-700">
                <th className="py-3 pr-4 text-wash-300 font-semibold">
                  Property
                </th>
                <th className="py-3 pr-4 text-wash-300 font-semibold">Type</th>
                <th className="py-3 pr-4 text-wash-300 font-semibold">
                  Default
                </th>
                <th className="py-3 text-wash-300 font-semibold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="text-denim-200">
              <tr className="border-b border-denim-800">
                <td className="py-2 pr-4"><code className="inline-code">entrypoint</code></td>
                <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                <td className="py-2 pr-4">--</td>
                <td className="py-2">Path to the worker entry point</td>
              </tr>
              <tr className="border-b border-denim-800">
                <td className="py-2 pr-4"><code className="inline-code">framework</code></td>
                <td className="py-2 pr-4"><code className="inline-code">"vinext" | "hono" | "raw"</code></td>
                <td className="py-2 pr-4"><code className="inline-code">"raw"</code></td>
                <td className="py-2">Framework mode for build and runtime</td>
              </tr>
              <tr className="border-b border-denim-800">
                <td className="py-2 pr-4"><code className="inline-code">bindings</code></td>
                <td className="py-2 pr-4"><code className="inline-code">Record&lt;string, Resource&gt;</code></td>
                <td className="py-2 pr-4"><code className="inline-code">{"{}"}</code></td>
                <td className="py-2">Resource bindings (D1, KV, R2, Queue, DO, AI, etc.)</td>
              </tr>
              <tr className="border-b border-denim-800">
                <td className="py-2 pr-4"><code className="inline-code">routes</code></td>
                <td className="py-2 pr-4"><code className="inline-code">Route[]</code></td>
                <td className="py-2 pr-4"><code className="inline-code">[]</code></td>
                <td className="py-2">URL pattern or custom domain routes</td>
              </tr>
              <tr className="border-b border-denim-800">
                <td className="py-2 pr-4"><code className="inline-code">crons</code></td>
                <td className="py-2 pr-4"><code className="inline-code">CronConfig[]</code></td>
                <td className="py-2 pr-4"><code className="inline-code">[]</code></td>
                <td className="py-2">Cron trigger objects with <code className="inline-code">pattern</code> field</td>
              </tr>
              <tr className="border-b border-denim-800">
                <td className="py-2 pr-4"><code className="inline-code">consumers</code></td>
                <td className="py-2 pr-4"><code className="inline-code">Consumer[]</code></td>
                <td className="py-2 pr-4"><code className="inline-code">[]</code></td>
                <td className="py-2">Queue consumer configurations</td>
              </tr>
              <tr className="border-b border-denim-800">
                <td className="py-2 pr-4"><code className="inline-code">build</code></td>
                <td className="py-2 pr-4"><code className="inline-code">BuildConfig</code></td>
                <td className="py-2 pr-4">auto</td>
                <td className="py-2">Custom build command, cwd, watch directory</td>
              </tr>
              <tr className="border-b border-denim-800">
                <td className="py-2 pr-4"><code className="inline-code">placement</code></td>
                <td className="py-2 pr-4"><code className="inline-code">{"{ mode: \"smart\" }"}</code></td>
                <td className="py-2 pr-4">--</td>
                <td className="py-2">Smart placement for backend co-location</td>
              </tr>
              <tr className="border-b border-denim-800">
                <td className="py-2 pr-4"><code className="inline-code">observability</code></td>
                <td className="py-2 pr-4"><code className="inline-code">ObservabilityConfig</code></td>
                <td className="py-2 pr-4">--</td>
                <td className="py-2">Head sampling rate and tracing config</td>
              </tr>
              <tr className="border-b border-denim-800">
                <td className="py-2 pr-4"><code className="inline-code">logpush</code></td>
                <td className="py-2 pr-4"><code className="inline-code">boolean</code></td>
                <td className="py-2 pr-4"><code className="inline-code">false</code></td>
                <td className="py-2">Enable Workers Logpush integration</td>
              </tr>
              <tr className="border-b border-denim-800">
                <td className="py-2 pr-4"><code className="inline-code">compatibilityDate</code></td>
                <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                <td className="py-2 pr-4">today</td>
                <td className="py-2">Workers compatibility date</td>
              </tr>
              <tr className="border-b border-denim-800">
                <td className="py-2 pr-4"><code className="inline-code">compatibilityFlags</code></td>
                <td className="py-2 pr-4"><code className="inline-code">string[]</code></td>
                <td className="py-2 pr-4"><code className="inline-code">[]</code></td>
                <td className="py-2">Additional compatibility flags</td>
              </tr>
              <tr>
                <td className="py-2 pr-4"><code className="inline-code">wrangler</code></td>
                <td className="py-2 pr-4"><code className="inline-code">Record&lt;string, any&gt;</code></td>
                <td className="py-2 pr-4"><code className="inline-code">{"{}"}</code></td>
                <td className="py-2">Raw config injected into wrangler.jsonc (escape hatch)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Generated Config ───────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">
          Generated Config
        </h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          Here is what Levi generates for a worker with multiple bindings, cron
          triggers, and smart placement:
        </p>
        <CodeBlock title="wrangler.jsonc (generated)" lang="jsonc">
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">"name"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"my-project-api"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">"main"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./src/api.ts"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">"compatibility_date"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"2026-04-01"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">"placement"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">"mode"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"smart"</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">"d1_databases"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">[</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">"binding"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"DB"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">"database_name"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"main-db"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">"database_id"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"&lt;auto&gt;"</span>{" "}
          <span className="syn-punc">{"}"}</span>
          {"\n"}
          {"  "}
          <span className="syn-punc">]</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">"kv_namespaces"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">[</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">"binding"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"CACHE"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">"id"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"&lt;auto&gt;"</span>{" "}
          <span className="syn-punc">{"}"}</span>
          {"\n"}
          {"  "}
          <span className="syn-punc">]</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">"r2_buckets"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">[</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">"binding"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"UPLOADS"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">"bucket_name"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"uploads"</span>{" "}
          <span className="syn-punc">{"}"}</span>
          {"\n"}
          {"  "}
          <span className="syn-punc">]</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">"queues"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">"producers"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">[</span>
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">"binding"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"TASKS"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">"queue"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"tasks"</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">]</span>
          {"\n"}
          {"  "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">"durable_objects"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">"bindings"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">[</span>
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">"name"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"COUNTER"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">"class_name"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"Counter"</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">]</span>
          {"\n"}
          {"  "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">"vectorize"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">[</span>
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">"binding"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"VECTORS"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">"index_name"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"embeddings"</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">]</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">"hyperdrive"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">[</span>
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">"binding"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"PG"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">"id"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"&lt;auto&gt;"</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">]</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">"ai"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">"binding"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"AI"</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">"triggers"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">"crons"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">[</span>
          <span className="syn-str">"0 * * * *"</span>
          <span className="syn-punc">]</span>
          {"\n"}
          {"  "}
          <span className="syn-punc">{"}"}</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
        </CodeBlock>
      </section>

      <div className="red-tab" />
    </DocLayout>
  );
}
