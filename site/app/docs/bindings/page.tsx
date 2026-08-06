import { DocLayout } from "../../../components/DocLayout";
import { CodeBlock } from "../../../components/CodeBlock";

export default function BindingsPage() {
  return (
    <DocLayout>
      <div className="space-y-10">
        {/* Header */}
        <header>
          <div className="flex items-center gap-3 mb-4">
            <span className="red-tab-h">new</span>
            <span className="text-xs text-denim-500 font-mono">
              Platform
            </span>
          </div>
          <h1 className="text-4xl font-bold text-denim-50 stitch-border-b pb-4">
            More Bindings
          </h1>
          <p className="mt-4 text-denim-300 text-lg leading-relaxed">
            Levi 0.4.0 covers every Workers binding type. This page documents
            the bindings added to complete the set: Analytics Engine, Browser
            Rendering, Rate Limiting, Secrets Store, and Tail Workers. Each
            follows the same pattern you already know -- declare the resource
            in <code className="inline-code">levi.app.ts</code>, attach it to
            a Worker via <code className="inline-code">bindings</code>, and
            Levi generates the config.
          </p>
        </header>

        {/* Analytics Engine */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Analytics Engine
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Workers Analytics Engine gives you unlimited-cardinality analytics
            at scale -- write data points from your Workers and query them
            with SQL. Datasets are created automatically on first write, so
            there is nothing to provision. Declare one with{" "}
            <code className="inline-code">app.addAnalyticsEngine()</code>.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">metrics</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addAnalyticsEngine</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"usage-events"</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">api</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addWorker</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"api"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">entrypoint</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"./src/index.ts"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">bindings</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">METRICS</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">metrics</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed mb-4">
            At runtime, write data points with{" "}
            <code className="inline-code">writeDataPoint()</code>:
          </p>
          <CodeBlock title="src/index.ts" lang="ts">
            <span className="syn-const">env</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">METRICS</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">writeDataPoint</span>
            <span className="syn-punc">({"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">blobs</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">[</span>
            <span className="syn-str">"signup"</span>
            <span className="syn-punc">]</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">doubles</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">[</span>
            <span className="syn-num">1</span>
            <span className="syn-punc">]</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">indexes</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">[</span>
            <span className="syn-const">userId</span>
            <span className="syn-punc">]</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"})"}</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-denim-700">
                  <th className="py-2 pr-4 text-denim-400 font-medium">Option</th>
                  <th className="py-2 pr-4 text-denim-400 font-medium">Type</th>
                  <th className="py-2 pr-4 text-denim-400 font-medium">Default</th>
                  <th className="py-2 text-denim-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-denim-300">
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">dataset</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">resource name</td>
                  <td className="py-2">Dataset to write to; auto-created on first write</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-denim-300 leading-relaxed mt-4">
            Levi generates the{" "}
            <code className="inline-code">analytics_engine_datasets</code>{" "}
            key in the bound Worker's config. If you prefer not to declare a
            standalone resource, the worker-level shorthand{" "}
            <code className="inline-code">
              analyticsEngineDatasets: {"{"} METRICS: "dataset-name" {"}"}
            </code>{" "}
            produces the same binding.
          </p>
        </section>

        {/* Browser Rendering */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Browser Rendering
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Browser Rendering lets your Workers control a headless browser --
            take screenshots, render PDFs, or scrape pages -- via{" "}
            <code className="inline-code">@cloudflare/puppeteer</code>. Like
            Workers AI, it is a singleton binding:{" "}
            <code className="inline-code">app.addBrowserRendering()</code>{" "}
            takes no name argument. It is an account capability, so there is
            nothing to provision.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">browser</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addBrowserRendering</span>
            <span className="syn-punc">()</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">renderer</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addWorker</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"renderer"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">entrypoint</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"./src/index.ts"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">bindings</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">BROWSER</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">browser</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <CodeBlock title="src/index.ts" lang="ts">
            <span className="syn-kw">import</span>{" "}
            <span className="syn-const">puppeteer</span>{" "}
            <span className="syn-kw">from</span>{" "}
            <span className="syn-str">"@cloudflare/puppeteer"</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">browser</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-kw">await</span>{" "}
            <span className="syn-const">puppeteer</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">launch</span>
            <span className="syn-punc">(</span>
            <span className="syn-const">env</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">BROWSER</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed mt-4">
            The worker-level shorthand{" "}
            <code className="inline-code">browser: true</code> also works if
            you do not need to share the resource variable.
          </p>
        </section>

        {/* Rate Limiting */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Rate Limiting
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            The Workers rate limiting binding gives you fast per-colo counters
            you query with{" "}
            <code className="inline-code">limit({"{"} key {"}"})</code> --
            ideal for per-user or per-IP throttling inside your Worker logic.
            Declare one with{" "}
            <code className="inline-code">app.addRateLimit()</code>.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">limiter</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addRateLimit</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"api-limiter"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">limit</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">100</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">period</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">60</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">api</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addWorker</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"api"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">entrypoint</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"./src/index.ts"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">bindings</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">LIMITER</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">limiter</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <CodeBlock title="src/index.ts" lang="ts">
            <span className="syn-kw">const</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-const">success</span>{" "}
            <span className="syn-punc">{"}"}</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-kw">await</span>{" "}
            <span className="syn-const">env</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">LIMITER</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">limit</span>
            <span className="syn-punc">({"{"}</span>{" "}
            <span className="syn-prop">key</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">clientIp</span>{" "}
            <span className="syn-punc">{"})"}</span>
            <span className="syn-punc">;</span>
            {"\n"}
            <span className="syn-kw">if</span>{" "}
            <span className="syn-punc">(</span>
            <span className="syn-op">!</span>
            <span className="syn-const">success</span>
            <span className="syn-punc">)</span>{" "}
            <span className="syn-kw">return</span>{" "}
            <span className="syn-kw">new</span>{" "}
            <span className="syn-type">Response</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"Too many requests"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">status</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">429</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-denim-700">
                  <th className="py-2 pr-4 text-denim-400 font-medium">Option</th>
                  <th className="py-2 pr-4 text-denim-400 font-medium">Type</th>
                  <th className="py-2 pr-4 text-denim-400 font-medium">Default</th>
                  <th className="py-2 text-denim-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-denim-300">
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">limit</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">number</code></td>
                  <td className="py-2 pr-4">required</td>
                  <td className="py-2">Operations allowed per period</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">period</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">10 | 60</code></td>
                  <td className="py-2 pr-4">required</td>
                  <td className="py-2">Window in seconds; the only values Cloudflare supports, and Levi validates this at build</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">namespaceId</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">derived</td>
                  <td className="py-2">Digits only. Counters are shared across Workers with the same ID. When omitted, Levi derives a stable ID by hashing the resource name -- set it explicitly when sharing counters across apps</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-denim-900/50 border border-denim-700 rounded-md p-4 mt-4">
            <p className="text-denim-300 text-sm">
              <strong className="text-thread-400">Note:</strong> This is
              different from{" "}
              <code className="inline-code">app.addRateLimitRule()</code>{" "}
              (zone-edge HTTP rate limiting, see the Edge Rules page). The
              binding is in-Worker logic you control -- you pick the key and
              decide what happens on rejection. The edge rule blocks requests
              before your Worker ever runs.
            </p>
          </div>
        </section>

        {/* Secrets Store */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Secrets Store
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Secrets Store holds account-level secrets that can be shared
            across Workers. Your code reads the value at runtime with{" "}
            <code className="inline-code">await env.BINDING.get()</code>.
            Declare a secret with{" "}
            <code className="inline-code">app.addSecretsStoreSecret()</code>.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">stripeKey</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addSecretsStoreSecret</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"stripe-api-key"</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">api</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addWorker</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"api"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">entrypoint</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"./src/index.ts"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">bindings</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">STRIPE_KEY</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">stripeKey</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <CodeBlock title="src/index.ts" lang="ts">
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">key</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-kw">await</span>{" "}
            <span className="syn-const">env</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">STRIPE_KEY</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">get</span>
            <span className="syn-punc">()</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-denim-700">
                  <th className="py-2 pr-4 text-denim-400 font-medium">Option</th>
                  <th className="py-2 pr-4 text-denim-400 font-medium">Type</th>
                  <th className="py-2 pr-4 text-denim-400 font-medium">Default</th>
                  <th className="py-2 text-denim-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-denim-300">
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">secretName</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">resource name</td>
                  <td className="py-2">Name of the secret inside the store</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">storeId</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">Bind to an existing store by ID (skips store provisioning)</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">storeName</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">Name for the store Levi creates during provisioning</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-denim-300 leading-relaxed mt-4">
            <code className="inline-code">levi provision</code> creates the
            store (via{" "}
            <code className="inline-code">wrangler secrets-store store create</code>
            ) and patches the resulting{" "}
            <code className="inline-code">store_id</code> into generated
            configs. Secret values are set separately -- they never touch{" "}
            <code className="inline-code">levi.app.ts</code> or generated
            config:
          </p>
          <CodeBlock title="Setting the secret value" lang="sh">
            <span className="syn-fn">wrangler</span>{" "}
            secrets-store secret create{" "}
            <span className="syn-const">{"<store-id>"}</span>{" "}
            <span className="syn-prop">--name</span>{" "}
            stripe-api-key{" "}
            <span className="syn-prop">--scopes</span>{" "}
            workers{" "}
            <span className="syn-prop">--remote</span>
          </CodeBlock>
          <div className="bg-denim-900/50 border border-denim-700 rounded-md p-4 mt-4">
            <p className="text-denim-300 text-sm">
              <strong className="text-redtab-500">Beta limit:</strong>{" "}
              Secrets Store currently allows one store per account. All
              secrets you declare share that store.
            </p>
          </div>
        </section>

        {/* Tail Workers */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Tail Workers
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            <code className="inline-code">app.addTailWorker(name, {"{"} entrypoint, bindings? {"}"})</code>{" "}
            existed before 0.4.0, but this release completes the loop: tail
            workers now get their own generated wrangler config and deploy
            before their producers. Producers declare them via the{" "}
            <code className="inline-code">tailConsumers</code> worker option,
            which accepts a string name or the resource itself.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">sink</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addTailWorker</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"log-sink"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">entrypoint</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"./src/sink.ts"</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">api</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addWorker</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"api"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">entrypoint</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"./src/index.ts"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">tailConsumers</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">[</span>
            <span className="syn-const">sink</span>
            <span className="syn-punc">]</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed mb-4">
            Levi generates the{" "}
            <code className="inline-code">tail_consumers</code> array in the
            producer's config:
          </p>
          <CodeBlock title="wrangler.jsonc" lang="jsonc">
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">"tail_consumers"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">[</span>
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">"service"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"log-sink"</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">]</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
          </CodeBlock>
          <div className="bg-denim-900/50 border border-denim-700 rounded-md p-4 mt-4">
            <p className="text-denim-300 text-sm">
              <strong className="text-thread-400">Tip:</strong> Tail workers
              pair well with{" "}
              <code className="inline-code">addAnalyticsEngine</code>. Give
              the tail worker an Analytics Engine binding and it becomes a
              structured log analytics pipeline -- every producer event lands
              in a queryable dataset.
            </p>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
