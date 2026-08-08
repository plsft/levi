import Link from "next/link";
import { DocLayout } from "../../../components/DocLayout";
import { CodeBlock } from "../../../components/CodeBlock";

export default function ServiceBindingsPage() {
  return (
    <DocLayout>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-denim-50">Service Bindings</h1>
          <span className="red-tab-h">Compute</span>
        </div>
        <p className="text-denim-200 text-lg leading-relaxed max-w-2xl">
          Service bindings enable zero-latency, in-process RPC between Cloudflare
          Workers. Instead of making HTTP requests across the network, one worker
          calls another directly through a binding — no cold starts, no network
          hops, no serialization overhead.
        </p>
      </div>

      <div className="stitch-separator mb-10" />

      {/* Overview */}
      <h2>Overview</h2>
      <p>
        In a microservices architecture on Cloudflare, you often have multiple
        workers that need to communicate. Without service bindings, worker A
        would need to make a <span className="inline-code">fetch()</span> call
        over the public internet to reach worker B — adding latency, egress
        costs, and requiring authentication between services.
      </p>
      <p>
        Service bindings solve this by creating a direct, in-process link between
        workers. The calling worker gets a binding in its environment that
        behaves like a <span className="inline-code">fetch()</span> API but
        executes entirely within Cloudflare's runtime. The call never leaves
        the data center.
      </p>
      <ul>
        <li>
          <strong>Zero network latency</strong> — Calls happen in-process,
          not over the network.
        </li>
        <li>
          <strong>No egress costs</strong> — Traffic between bound workers
          is free.
        </li>
        <li>
          <strong>No authentication needed</strong> — Service bindings are
          private by default. Only workers you explicitly bind can call each
          other.
        </li>
        <li>
          <strong>Full Request/Response API</strong> — The binding exposes the
          standard <span className="inline-code">fetch()</span> interface, so
          your code looks the same as a regular HTTP call.
        </li>
      </ul>

      <div className="stitch-separator my-8" />

      {/* Creating Service Bindings */}
      <h2>Creating Service Bindings</h2>
      <p>
        In Levi, you create a service binding by calling{" "}
        <span className="inline-code">.asService()</span> on a worker, then
        binding it to the calling worker. The{" "}
        <span className="inline-code">.asService()</span> method returns a
        reference that Levi uses to generate the correct wrangler configuration.
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
        <span className="syn-str">"my-app"</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-cmt">{"// Define the API worker"}</span>
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
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-cmt">{"// Define the web worker"}</span>
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
        <span className="syn-prop">entrypoint</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"./src/web.ts"</span>
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
        <span className="syn-punc">()</span>{" "}
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
        The <span className="inline-code">api.asService()</span> call tells Levi
        that the API worker should be available as a service binding. When bound
        to the web worker, it appears as{" "}
        <span className="inline-code">env.API</span> in the web worker's
        environment (the binding name is derived from the worker name, uppercased).
      </p>

      <div className="stitch-separator my-8" />

      {/* React SPA + API Pattern */}
      <h2>React SPA + API Pattern</h2>
      <p>
        The most common use case for service bindings in Levi is the{" "}
        <strong>React SPA frontend + Hono API</strong> pattern. Your React app
        handles SSR, routing, and static assets, while a separate Hono-based
        worker serves the API. The frontend calls the API through a service
        binding — no public API endpoint required.
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
        <span className="syn-str">"fullstack-app"</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-cmt">{"// Hono API worker"}</span>
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
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-cmt">{"// React SPA frontend worker"}</span>
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
        <span className="syn-punc">()</span>{" "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
      </CodeBlock>

      <p>
        This pattern has significant advantages over a traditional frontend-calls-API setup:
      </p>
      <ul>
        <li>
          <strong>No CORS</strong> — Since calls happen via service binding, there
          is no cross-origin request. No CORS headers needed.
        </li>
        <li>
          <strong>No public API surface</strong> — The API worker doesn't need
          a public route. It can be entirely private, accessible only through
          the service binding.
        </li>
        <li>
          <strong>Shared authentication</strong> — The frontend can forward session
          tokens directly through the binding without exposing them to the client.
        </li>
      </ul>

      <div className="stitch-separator my-8" />

      {/* Full Example */}
      <h2>Full Example</h2>
      <p>
        Here is a complete example with a React web worker calling a Hono API
        via service binding, with shared D1 and KV resources:
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
        <span className="syn-str">"saas-platform"</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-cmt">{"// Shared resources"}</span>
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
        <span className="syn-const">cache</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-const">app</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">addKV</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"sessions"</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-cmt">{"// API worker (Hono)"}</span>
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
        <span className="syn-const">cache</span>{" "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-cmt">{"// Web worker (React SPA)"}</span>
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

      <div className="stitch-separator my-8" />

      {/* Generated Config */}
      <h2>Generated Config</h2>
      <p>
        Levi generates the <span className="inline-code">services</span> array
        in the calling worker's wrangler.jsonc. Here is what the web worker's
        configuration looks like:
      </p>

      <CodeBlock title="wrangler.jsonc (web worker, generated)" lang="jsonc">
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">"name"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"saas-platform-web"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">"main"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"./web/worker.ts"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">"services"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">[</span>
        {"\n"}
        {"    "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"      "}
        <span className="syn-prop">"binding"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"API"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"      "}
        <span className="syn-prop">"service"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"saas-platform-api"</span>
        {"\n"}
        {"    "}
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
        <span className="syn-str">"SESSIONS"</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-prop">"id"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"..."</span>{" "}
        <span className="syn-punc">{"}"}</span>
        {"\n"}
        {"  "}
        <span className="syn-punc">]</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
      </CodeBlock>

      <p>
        The <span className="inline-code">binding</span> field is the name you
        use in your worker code to access the service. The{" "}
        <span className="inline-code">service</span> field is the deployed name
        of the target worker (which Levi derives from{" "}
        <span className="inline-code">appName-workerName</span>).
      </p>

      <div className="stitch-separator my-8" />

      {/* Usage in Worker Code */}
      <h2>Usage in Worker Code</h2>
      <p>
        Once bound, you call the service binding exactly like{" "}
        <span className="inline-code">fetch()</span>. The binding is available
        on the <span className="inline-code">env</span> object:
      </p>

      <CodeBlock title="web/app/routes/dashboard.tsx (server loader)" lang="typescript">
        <span className="syn-kw">export async function</span>{" "}
        <span className="syn-fn">loader</span>
        <span className="syn-punc">({"{"}</span>{" "}
        <span className="syn-const">context</span>{" "}
        <span className="syn-punc">{"}"})</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"  "}
        <span className="syn-cmt">
          {"// Call the API via service binding — no network hop"}
        </span>
        {"\n"}
        {"  "}
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">res</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-kw">await</span>{" "}
        <span className="syn-const">context</span>
        <span className="syn-punc">.</span>
        <span className="syn-const">env</span>
        <span className="syn-punc">.</span>
        <span className="syn-const">API</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">fetch</span>
        <span className="syn-punc">(</span>
        {"\n"}
        {"    "}
        <span className="syn-kw">new</span>{" "}
        <span className="syn-type">Request</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"http://internal/api/dashboard"</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"      "}
        <span className="syn-prop">headers</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-const">context</span>
        <span className="syn-punc">.</span>
        <span className="syn-const">request</span>
        <span className="syn-punc">.</span>
        <span className="syn-const">headers</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"    "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        {"\n"}
        {"  "}
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        {"  "}
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">data</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-kw">await</span>{" "}
        <span className="syn-const">res</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">json</span>
        <span className="syn-punc">()</span>
        <span className="syn-punc">;</span>
        {"\n"}
        {"  "}
        <span className="syn-kw">return</span>{" "}
        <span className="syn-punc">{"{"}</span>{" "}
        <span className="syn-const">data</span>{" "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">;</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
      </CodeBlock>

      <div className="denim-pocket p-5 mb-6">
        <p className="text-sm text-denim-300" style={{ marginBottom: 0 }}>
          <strong>Note:</strong> The URL in the{" "}
          <span className="inline-code">fetch()</span> call can be any valid URL
          — it doesn't need to resolve to a real host. The service binding
          intercepts the request and routes it directly to the target worker.
          Using <span className="inline-code">http://internal/</span> is a
          common convention.
        </p>
      </div>

      <div className="stitch-separator my-8" />

      {/* Next Steps */}
      <div className="denim-pocket p-5">
        <h2
          className="text-sm font-bold text-denim-300 uppercase tracking-widest mb-3"
          style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}
        >
          Next Steps
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/examples/react"
            className="px-4 py-2 text-sm bg-wash-600/20 border border-dashed border-wash-500 rounded-md text-wash-300 hover:bg-wash-600/30 transition-colors"
          >
            React 19 SPA
          </Link>
          <Link
            href="/docs/workers"
            className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
          >
            Workers
          </Link>
          <Link
            href="/examples"
            className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
          >
            Full Examples
          </Link>
        </div>
      </div>
    </DocLayout>
  );
}
