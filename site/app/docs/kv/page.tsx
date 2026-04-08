import { DocLayout } from "../../../components/DocLayout";
import { CodeBlock } from "../../../components/CodeBlock";

export const metadata = {
  title: "KV Namespaces — Levi Docs",
  description:
    "Declare Cloudflare KV namespaces with default TTLs, bind them to workers, and use the global key-value store at the edge.",
};

export default function KVPage() {
  return (
    <DocLayout>
      {/* ── Header ─────────────────────────────────── */}
      <div className="stitch-border-b pb-8 mb-10">
        <h1 className="text-4xl font-bold text-wash-300 mb-3">
          KV Namespaces
        </h1>
        <p className="text-lg text-denim-300 leading-relaxed max-w-2xl">
          Cloudflare KV is a globally distributed, eventually consistent
          key-value store. With Levi, you declare a KV namespace in one line,
          configure default TTLs, and bind it to any worker — all in TypeScript.
        </p>
      </div>

      {/* ── Overview ───────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">Overview</h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          <code className="inline-code">addKV(name, options?)</code> registers a
          KV namespace resource in the Levi application model. KV is optimized
          for read-heavy workloads — values are cached at every Cloudflare data
          center and served from the location closest to the reader.
        </p>
        <ul className="list-disc list-inside text-denim-200 space-y-1 ml-2">
          <li>Global low-latency reads from 300+ data centers</li>
          <li>Values up to 25 MiB per key</li>
          <li>Namespace-level isolation — no cross-contamination between environments</li>
          <li>Optional per-key or default TTL for automatic expiration</li>
          <li>Metadata attached to each key for efficient filtering</li>
          <li>List operations with prefix filtering and cursor-based pagination</li>
        </ul>
        <p className="text-denim-200 leading-relaxed mt-4">
          KV is eventually consistent — writes propagate globally within 60
          seconds. For strong consistency requirements, consider D1 or Durable
          Objects instead.
        </p>
      </section>

      {/* ── Basic Usage ────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">Basic Usage</h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          Declare a KV namespace and bind it to a worker in two lines:
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
          <span className="syn-prop">CACHE</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">cache</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
        </CodeBlock>
      </section>

      {/* ── TTL Configuration ──────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">
          TTL Configuration
        </h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          Set a default TTL (time-to-live) in seconds for all keys written to
          this namespace. Individual writes can still override the default.
        </p>
        <CodeBlock title="Default TTL" lang="typescript">
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">sessions</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addKV</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"sessions"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">ttl</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-num">3600</span>
          <span className="syn-punc">,</span>
          {"  "}
          <span className="syn-cmt">{"// 1 hour"}</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">featureFlags</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addKV</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"flags"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">ttl</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-num">300</span>
          <span className="syn-punc">,</span>
          {"   "}
          <span className="syn-cmt">{"// 5 minutes"}</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
        </CodeBlock>
        <p className="text-denim-200 leading-relaxed">
          When <code className="inline-code">ttl</code> is set, every{" "}
          <code className="inline-code">put()</code> call that doesn't specify
          its own <code className="inline-code">expirationTtl</code> will use
          this value. Keys expire and are automatically deleted after the TTL
          elapses.
        </p>
      </section>

      {/* ── Binding to Workers ─────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">
          Binding to Workers
        </h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          KV namespaces work identically to other Levi bindings. Pass the handle
          into a worker's <code className="inline-code">bindings</code> and use
          any key you like. You can bind the same namespace to multiple workers
          and use different binding names in each.
        </p>
        <CodeBlock title="Multiple bindings" lang="typescript">
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">kv</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addKV</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"app-config"</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">{"// API worker reads config"}</span>
          {"\n"}
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
          <span className="syn-prop">CONFIG</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">kv</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">{"// Admin worker writes config"}</span>
          {"\n"}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addWorker</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"admin"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">entrypoint</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./src/admin.ts"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">bindings</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">APP_CONFIG</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">kv</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
        </CodeBlock>
      </section>

      {/* ── Options Reference ──────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">
          Options Reference
        </h2>
        <p className="text-denim-200 leading-relaxed mb-6">
          All properties accepted by{" "}
          <code className="inline-code">addKV(name, options?)</code>:
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
                <td className="py-2 pr-4"><code className="inline-code">ttl</code></td>
                <td className="py-2 pr-4"><code className="inline-code">number</code></td>
                <td className="py-2 pr-4">--</td>
                <td className="py-2">Default time-to-live in seconds for all keys. Individual <code className="inline-code">put()</code> calls can override.</td>
              </tr>
              <tr className="border-b border-denim-800">
                <td className="py-2 pr-4"><code className="inline-code">namespaceId</code></td>
                <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                <td className="py-2 pr-4">auto</td>
                <td className="py-2">Explicit KV namespace ID for importing an existing namespace</td>
              </tr>
              <tr>
                <td className="py-2 pr-4"><code className="inline-code">previewId</code></td>
                <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                <td className="py-2 pr-4">--</td>
                <td className="py-2">Separate namespace ID for <code className="inline-code">wrangler dev</code> preview environments</td>
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
          When you bind a KV namespace to a worker, Levi generates the{" "}
          <code className="inline-code">kv_namespaces</code> array in the
          worker's wrangler config:
        </p>
        <CodeBlock title="wrangler.jsonc (kv_namespaces section)" lang="jsonc">
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">"kv_namespaces"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">[</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">"binding"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"CACHE"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">"id"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"a1b2c3d4e5f6..."</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">"binding"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"SESSIONS"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">"id"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"f6e5d4c3b2a1..."</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">"preview_id"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"0000aaaa1111..."</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"}"}</span>
          {"\n"}
          {"  "}
          <span className="syn-punc">]</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
        </CodeBlock>
        <p className="text-denim-200 leading-relaxed">
          The namespace <code className="inline-code">id</code> is resolved
          automatically during deployment. If you import an existing namespace
          with <code className="inline-code">namespaceId</code>, that value is
          used directly.
        </p>
      </section>

      {/* ── Usage in Worker Code ───────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">
          Usage in Worker Code
        </h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          Inside your worker, access the KV namespace through the binding name
          you chose. KV provides{" "}
          <code className="inline-code">get</code>,{" "}
          <code className="inline-code">put</code>,{" "}
          <code className="inline-code">delete</code>,{" "}
          <code className="inline-code">list</code>, and{" "}
          <code className="inline-code">getWithMetadata</code> methods.
        </p>
        <CodeBlock title="src/api.ts — Hono handler with KV" lang="typescript">
          <span className="syn-kw">import</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-type">Hono</span>{" "}
          <span className="syn-punc">{"}"}</span>{" "}
          <span className="syn-kw">from</span>{" "}
          <span className="syn-str">"hono"</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-kw">type</span>{" "}
          <span className="syn-type">Env</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">CACHE</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-type">KVNamespace</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">app</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-kw">new</span>{" "}
          <span className="syn-type">Hono</span>
          <span className="syn-op">&lt;</span>
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-type">Bindings</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-type">Env</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-op">&gt;</span>
          <span className="syn-punc">()</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">{"// Read-through cache pattern"}</span>
          {"\n"}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">get</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"/products/:id"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-kw">async</span>{" "}
          <span className="syn-punc">(</span>
          <span className="syn-const">c</span>
          <span className="syn-punc">)</span>{" "}
          <span className="syn-kw">=&gt;</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">id</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">req</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">param</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"id"</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          {"  "}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">cacheKey</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-str">`product:${"${"}id${"}"}`</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          {"  "}
          <span className="syn-cmt">{"// Check cache first"}</span>
          {"\n"}
          {"  "}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">cached</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-kw">await</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">env</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">CACHE</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">get</span>
          <span className="syn-punc">(</span>
          <span className="syn-const">cacheKey</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-str">"json"</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          {"  "}
          <span className="syn-kw">if</span>{" "}
          <span className="syn-punc">(</span>
          <span className="syn-const">cached</span>
          <span className="syn-punc">)</span>{" "}
          <span className="syn-kw">return</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">json</span>
          <span className="syn-punc">(</span>
          <span className="syn-const">cached</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          {"  "}
          <span className="syn-cmt">{"// Fetch from origin"}</span>
          {"\n"}
          {"  "}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">product</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-kw">await</span>{" "}
          <span className="syn-fn">fetchProductFromOrigin</span>
          <span className="syn-punc">(</span>
          <span className="syn-const">id</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          {"  "}
          <span className="syn-cmt">{"// Cache for 5 minutes"}</span>
          {"\n"}
          {"  "}
          <span className="syn-kw">await</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">env</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">CACHE</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">put</span>
          <span className="syn-punc">(</span>
          <span className="syn-const">cacheKey</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-type">JSON</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">stringify</span>
          <span className="syn-punc">(</span>
          <span className="syn-const">product</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">expirationTtl</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-num">300</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">metadata</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">fetchedAt</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-type">Date</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">now</span>
          <span className="syn-punc">()</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          {"  "}
          <span className="syn-kw">return</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">json</span>
          <span className="syn-punc">(</span>
          <span className="syn-const">product</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">{"// Store a session token"}</span>
          {"\n"}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">post</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"/auth/login"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-kw">async</span>{" "}
          <span className="syn-punc">(</span>
          <span className="syn-const">c</span>
          <span className="syn-punc">)</span>{" "}
          <span className="syn-kw">=&gt;</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">token</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">crypto</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">randomUUID</span>
          <span className="syn-punc">()</span>
          <span className="syn-punc">;</span>
          {"\n"}
          {"  "}
          <span className="syn-kw">await</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">env</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">CACHE</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">put</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">`session:${"${"}token${"}"}`</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-type">JSON</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">stringify</span>
          <span className="syn-punc">(</span>
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">userId</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-num">42</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">expirationTtl</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-num">86400</span>
          <span className="syn-punc">,</span>
          {"  "}
          <span className="syn-cmt">{"// 24 hours"}</span>
          {"\n"}
          {"  "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          {"  "}
          <span className="syn-kw">return</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">json</span>
          <span className="syn-punc">(</span>
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-const">token</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">{"// List keys by prefix"}</span>
          {"\n"}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">get</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"/cache/keys"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-kw">async</span>{" "}
          <span className="syn-punc">(</span>
          <span className="syn-const">c</span>
          <span className="syn-punc">)</span>{" "}
          <span className="syn-kw">=&gt;</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">prefix</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">req</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">query</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"prefix"</span>
          <span className="syn-punc">)</span>{" "}
          <span className="syn-op">||</span>{" "}
          <span className="syn-str">""</span>
          <span className="syn-punc">;</span>
          {"\n"}
          {"  "}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">list</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-kw">await</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">env</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">CACHE</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">list</span>
          <span className="syn-punc">(</span>
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-const">prefix</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-prop">limit</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-num">100</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          {"  "}
          <span className="syn-kw">return</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">json</span>
          <span className="syn-punc">(</span>
          <span className="syn-const">list</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">keys</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-kw">export default</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">;</span>
        </CodeBlock>
      </section>

      <div className="red-tab" />
    </DocLayout>
  );
}
