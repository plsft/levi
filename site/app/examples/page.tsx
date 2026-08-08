import Link from "next/link";
import { CodeBlock } from "../../components/CodeBlock";

export default function ExamplesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 prose-denim">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-denim-50">Examples</h1>
          <span className="red-tab-h">Cookbook</span>
        </div>
        <p className="text-denim-200 text-lg leading-relaxed max-w-3xl">
          Complete, copy-pasteable{" "}
          <span className="inline-code">levi.app.ts</span> files for real-world
          application architectures. Each example shows how to declare your
          entire Cloudflare topology in TypeScript — from a simple worker to a
          multi-service SaaS platform.
        </p>
      </div>

      {/* ── Full example deep-dives ── */}
      <div className="mb-12">
        <div className="grid sm:grid-cols-2 gap-4 not-prose">
          {[
            {
              href: "/examples/ai",
              tag: "AI",
              title: "AI Applications",
              desc: "RAG chatbot, browser-powered research agent, and a metered AI API — Workers AI, Vectorize, AI Gateway, Browser Rendering, and Analytics Engine.",
            },
            {
              href: "/examples/react",
              tag: "React 19",
              title: "Plain React 19 SPA",
              desc: "No meta-framework: Vite + React 19 Actions, useOptimistic, and use() — served by a Worker with a Hono API behind a service binding.",
            },
            {
              href: "/examples/platform",
              tag: "0.4.0",
              title: "Multi-Tenant SaaS Platform",
              desc: "Workers for Platforms: dispatch namespaces, outbound guards, per-tenant rate limiting, Secrets Store, and ops email alerts.",
            },
            {
              href: "/examples/edge",
              tag: "0.4.0",
              title: "Edge-Hardened Production App",
              desc: "WAF, cache rules, redirects, HTTP rate limiting, and security headers declared next to the app — plus tail workers and analytics.",
            },
            {
              href: "/examples/tanstack",
              tag: "Full-stack",
              title: "Invoice SaaS — TanStack SPA",
              desc: "Complete invoice manager: TanStack SPA frontend, Hono API, D1, and custom domains.",
            },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group block stitch-border rounded-lg p-5 bg-denim-900/50 hover:bg-denim-800/60 transition-all hover:border-wash-400"
            >
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base font-semibold text-denim-100 group-hover:text-wash-300 transition-colors m-0">
                  {card.title}
                </h3>
                <span className="red-tab-h">{card.tag}</span>
              </div>
              <p className="text-sm text-denim-300 leading-relaxed m-0">{card.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="stitch-separator mb-12" />

      {/* ── Example 1: Minimal Worker ── */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
            Minimal Worker
          </h2>
          <span className="red-tab-h">Starter</span>
        </div>
        <p>
          The simplest possible Levi application: a single Cloudflare Worker
          with a KV namespace for caching. This is the "Hello World" of Levi —
          if you can write this, you understand the fundamentals.
        </p>

        <CodeBlock title="levi.app.ts" lang="typescript">
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
          <span className="syn-str">"hello-world"</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">{"// A KV namespace for caching responses"}</span>
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
          {"\n\n"}
          <span className="syn-cmt">{"// A single worker"}</span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">worker</span>{" "}
          <span className="syn-op">=</span>{" "}
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
          <span className="syn-str">"./src/index.ts"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">bindings</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">CACHE</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">cache</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-kw">export default</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">;</span>
        </CodeBlock>

        <p>
          Run <span className="inline-code">levi build</span> and Levi
          generates a <span className="inline-code">wrangler.jsonc</span> with
          the KV binding. Run{" "}
          <span className="inline-code">levi deploy</span> and both the KV
          namespace and worker are provisioned on Cloudflare.
        </p>
      </section>

      <div className="stitch-separator my-12" />

      {/* ── Example 2: React Full-Stack ── */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
            React Full-Stack App
          </h2>
          <span className="red-tab-h">Intermediate</span>
        </div>
        <p>
          A production-ready full-stack application: React 19 SPA frontend, Hono
          API backend, D1 database, KV for sessions, R2 for file uploads, and
          service bindings connecting front to back. This is a solid
          architecture for most web applications.
        </p>

        <CodeBlock title="levi.app.ts" lang="typescript">
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
          <span className="syn-str">"fullstack"</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">{"// ── Storage ──"}</span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">db</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addD1</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"main"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">migrations</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./migrations"</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">sessions</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addKV</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"sessions"</span>
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
          {"\n\n"}
          <span className="syn-cmt">{"// ── API (Hono) ──"}</span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">api</span>{" "}
          <span className="syn-op">=</span>{" "}
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
          <span className="syn-str">"./api/src/index.ts"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-prop">bindings</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">DB</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">db</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">SESSIONS</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">sessions</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">UPLOADS</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">uploads</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">{"// ── Frontend (React 19 SPA) ──"}</span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">web</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addWorker</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"web"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">framework</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"tanstack"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">entrypoint</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./web"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">bindings</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">API</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">api</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">asService</span>
          <span className="syn-punc">()</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">SESSIONS</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">sessions</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-kw">export default</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">;</span>
        </CodeBlock>

        <p>
          The web worker calls the API through a service binding — zero
          latency, no CORS, no public API endpoint. The API worker has direct
          access to D1, KV, and R2. The frontend shares session state via KV.
        </p>
      </section>

      <div className="stitch-separator my-12" />

      {/* ── Example 3: API with Background Jobs ── */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
            API with Background Jobs
          </h2>
          <span className="red-tab-h">Intermediate</span>
        </div>
        <p>
          A Hono API that offloads long-running work to a background queue. The
          API sends messages to a Cloudflare Queue, and a separate consumer
          worker processes them asynchronously. D1 stores results. Ideal for
          email sending, image processing, webhook delivery, or any task that
          should not block the HTTP response.
        </p>

        <CodeBlock title="levi.app.ts" lang="typescript">
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
          <span className="syn-str">"job-runner"</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">{"// ── Storage ──"}</span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">db</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addD1</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"jobs"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">migrations</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./migrations"</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">{"// ── Queue ──"}</span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">jobQueue</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addQueue</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"jobs"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">retries</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-num">3</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">deadLetterQueue</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">dlq</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">dlq</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addQueue</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"dead-letters"</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">{"// ── API Worker (producer) ──"}</span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">api</span>{" "}
          <span className="syn-op">=</span>{" "}
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
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">DB</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">db</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">JOBS</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">jobQueue</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">{"// ── Consumer Worker (processes jobs) ──"}</span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">consumer</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addWorker</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"consumer"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">entrypoint</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./src/consumer.ts"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">bindings</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">DB</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">db</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-kw">export default</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">;</span>
        </CodeBlock>

        <p>
          The API worker sends jobs to the queue via{" "}
          <span className="inline-code">env.JOBS.send({"{ ... }"})</span>. The
          consumer worker receives batches of messages and processes them. Failed
          messages are retried up to 3 times before being sent to the
          dead-letter queue for manual inspection.
        </p>
      </section>

      <div className="stitch-separator my-12" />

      {/* ── Example 4: AI-Powered App ── */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
            AI-Powered RAG Application
          </h2>
          <span className="red-tab-h">Advanced</span>
        </div>
        <p>
          A Retrieval-Augmented Generation application that combines Workers AI
          for embeddings and text generation, Vectorize for semantic search, and
          D1 for document storage. Users ask questions and get grounded answers
          from your knowledge base. AI Gateway provides rate limiting and
          caching for inference calls.
        </p>

        <CodeBlock title="levi.app.ts" lang="typescript">
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
          <span className="syn-str">"knowledge-bot"</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">{"// ── AI ──"}</span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">ai</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addWorkersAI</span>
          <span className="syn-punc">()</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">gateway</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addAIGateway</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"gateway"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">id</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"knowledge-bot-gw"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">rateLimiting</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">rps</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-num">50</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">strategy</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"sliding_window"</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">caching</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">enabled</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">true</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">ttl</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-num">3600</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">logCollection</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">true</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">{"// ── Vector Database ──"}</span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">vectors</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addVectorize</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"embeddings"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">dimensions</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-num">768</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">metric</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"cosine"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">{"// ── Document Storage ──"}</span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">db</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addD1</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"documents"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">migrations</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./migrations"</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">{"// ── RAG API Worker ──"}</span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">ragApi</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addWorker</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"rag-api"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">entrypoint</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./src/rag.ts"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">bindings</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">AI</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">ai</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">VECTORS</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">vectors</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">DB</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">db</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">{"// ── Ingestion Worker (indexes new documents) ──"}</span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">ingester</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addWorker</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"ingester"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">entrypoint</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./src/ingester.ts"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">bindings</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">AI</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">ai</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">VECTORS</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">vectors</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">DB</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">db</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-kw">export default</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">;</span>
        </CodeBlock>

        <p>
          The ingestion worker chunks documents, generates embeddings via{" "}
          <span className="inline-code">@cf/baai/bge-base-en-v1.5</span>, and
          stores them in Vectorize. The RAG API receives user queries, searches
          Vectorize for relevant context, retrieves full documents from D1, and
          generates grounded answers via{" "}
          <span className="inline-code">@cf/meta/llama-3.1-8b-instruct</span>.
          All AI calls are rate-limited and cached through the gateway.
        </p>
      </section>

      <div className="stitch-separator my-12" />

      {/* ── Example 5: Multi-Service SaaS ── */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
            Multi-Service SaaS Platform
          </h2>
          <span className="red-tab-h">Advanced</span>
        </div>
        <p>
          The full monty: a production SaaS application with a React 19 frontend,
          Hono API, background job runner, D1 database, KV for sessions, R2 for
          file storage, Queues for async processing, Durable Objects for
          real-time collaboration, Workers AI for smart features, Hyperdrive for
          connecting to an external PostgreSQL database, and multiple custom
          domains. This is the architecture the Levi PRD was designed to
          support.
        </p>

        <CodeBlock title="levi.app.ts" lang="typescript">
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
          <span className="syn-str">"acme-saas"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">environments</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">staging</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">vars</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">LOG_LEVEL</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"debug"</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">secrets</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">[</span>
          <span className="syn-str">"STRIPE_KEY"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-str">"PG_URL"</span>
          <span className="syn-punc">]</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">production</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">vars</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">LOG_LEVEL</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"warn"</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">secrets</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">[</span>
          <span className="syn-str">"STRIPE_KEY"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-str">"PG_URL"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-str">"DATADOG_KEY"</span>
          <span className="syn-punc">]</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
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
          {"\n\n"}
          <span className="syn-cmt">
            {"// ═══════════════════════════════════════════════════"}
          </span>
          {"\n"}
          <span className="syn-cmt">
            {"// Storage & Data"}
          </span>
          {"\n"}
          <span className="syn-cmt">
            {"// ═══════════════════════════════════════════════════"}
          </span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">db</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addD1</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"main"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">migrations</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./migrations"</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">sessions</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addKV</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"sessions"</span>
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
          <span className="syn-const">taskQueue</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addQueue</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"tasks"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">retries</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-num">3</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">
            {"// External Postgres via Hyperdrive"}
          </span>
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
          <span className="syn-str">"$PG_URL"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">caching</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">maxAge</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-num">60</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">
            {"// ═══════════════════════════════════════════════════"}
          </span>
          {"\n"}
          <span className="syn-cmt">
            {"// AI & Intelligence"}
          </span>
          {"\n"}
          <span className="syn-cmt">
            {"// ═══════════════════════════════════════════════════"}
          </span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">ai</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addWorkersAI</span>
          <span className="syn-punc">()</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addAIGateway</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"gateway"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">id</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"acme-gateway"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">rateLimiting</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">rps</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-num">200</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">caching</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">enabled</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">true</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">ttl</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-num">1800</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">logCollection</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">true</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">
            {"// ═══════════════════════════════════════════════════"}
          </span>
          {"\n"}
          <span className="syn-cmt">
            {"// Durable Objects (real-time collaboration)"}
          </span>
          {"\n"}
          <span className="syn-cmt">
            {"// ═══════════════════════════════════════════════════"}
          </span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">rooms</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addDurableObject</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"rooms"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">className</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"CollabRoom"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">entrypoint</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./src/collab-room.ts"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">
            {"// ═══════════════════════════════════════════════════"}
          </span>
          {"\n"}
          <span className="syn-cmt">{"// Workers (Compute)"}</span>
          {"\n"}
          <span className="syn-cmt">
            {"// ═══════════════════════════════════════════════════"}
          </span>
          {"\n\n"}
          <span className="syn-cmt">{"// Hono API"}</span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">api</span>{" "}
          <span className="syn-op">=</span>{" "}
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
          <span className="syn-str">"./api/src/index.ts"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">bindings</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">DB</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">db</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">SESSIONS</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">sessions</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">UPLOADS</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">uploads</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">TASKS</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">taskQueue</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">PG</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">pg</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">AI</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">ai</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">ROOMS</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">rooms</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">{"// Background job runner"}</span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">jobRunner</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addWorker</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"jobs"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">entrypoint</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./jobs/src/index.ts"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">bindings</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">DB</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">db</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">UPLOADS</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">uploads</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">PG</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">pg</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">AI</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">ai</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          {"\n"}
          <span className="syn-cmt">{"// React 19 SPA frontend"}</span>
          {"\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">web</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addWorker</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"web"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">framework</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"tanstack"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">entrypoint</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./web"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">bindings</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">API</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">api</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">asService</span>
          <span className="syn-punc">()</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">SESSIONS</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">sessions</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">
            {"// ═══════════════════════════════════════════════════"}
          </span>
          {"\n"}
          <span className="syn-cmt">{"// Domains"}</span>
          {"\n"}
          <span className="syn-cmt">
            {"// ═══════════════════════════════════════════════════"}
          </span>
          {"\n"}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addDomain</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"acme.com"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">ssl</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"full_strict"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">redirectWww</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">true</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addDomain</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"api.acme.com"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">ssl</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"full_strict"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-kw">export default</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">;</span>
        </CodeBlock>

        <p>
          This single file declares <strong>15 resources</strong> across 3
          workers, 1 Durable Object, 6 storage primitives, AI, Hyperdrive, and
          2 domains. Run <span className="inline-code">levi graph</span> to
          visualize the dependency tree, or{" "}
          <span className="inline-code">levi deploy --env production</span> to
          provision everything at once.
        </p>

        <h3>What Levi Generates</h3>
        <ul>
          <li>
            3 <span className="inline-code">wrangler.jsonc</span> files (web,
            api, jobs) — each with the correct bindings
          </li>
          <li>
            D1 database provisioned with migration files applied
          </li>
          <li>
            KV namespace, R2 bucket, and Queue created on your Cloudflare
            account
          </li>
          <li>
            Hyperdrive configuration pointing to your external Postgres
          </li>
          <li>
            Durable Object binding wired to the API worker
          </li>
          <li>
            Service binding connecting the React frontend to the Hono API
          </li>
          <li>
            DNS records and SSL configuration for both domains
          </li>
          <li>
            AI Gateway with rate limiting, caching, and logging
          </li>
        </ul>
      </section>

      <div className="stitch-separator my-12" />

      {/* Footer */}
      <div className="denim-pocket p-5">
        <h2
          className="text-sm font-bold text-denim-300 uppercase tracking-widest mb-3"
          style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}
        >
          Ready to Build?
        </h2>
        <p className="text-sm text-denim-300 mb-4" style={{ marginBottom: "1rem" }}>
          Start with the minimal example and scale up as your application grows.
          Every example above works with{" "}
          <span className="inline-code">levi deploy</span> — no additional
          configuration needed.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/getting-started"
            className="px-4 py-2 text-sm bg-wash-600/20 border border-dashed border-wash-500 rounded-md text-wash-300 hover:bg-wash-600/30 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/docs/core-concepts"
            className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
          >
            Core Concepts
          </Link>
          <Link
            href="/docs/cli"
            className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
          >
            CLI Reference
          </Link>
        </div>
      </div>
    </div>
  );
}
