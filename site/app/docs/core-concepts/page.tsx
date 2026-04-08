import Link from "next/link";
import { DocLayout } from "../../../components/DocLayout";
import { CodeBlock } from "../../../components/CodeBlock";

export default function CoreConceptsPage() {
  return (
    <DocLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-denim-50">Core Concepts</h1>
          <span className="red-tab-h">essential</span>
        </div>
        <p className="text-denim-200 text-lg leading-relaxed max-w-2xl">
          Levi lets you declare your entire Cloudflare application as a typed
          graph of resources and bindings. This page explains the mental
          model, the build pipeline, and why every generated config is fully
          ejectable.
        </p>
      </div>

      <div className="stitch-separator mb-10" />

      {/* ── The App Graph ──────────────────────────────────────── */}
      <h2>The App Graph</h2>

      <p>
        Every Levi project starts with a single file:{" "}
        <code className="inline-code">levi.app.ts</code>. When you call
        methods like <code className="inline-code">app.addWorker()</code> or{" "}
        <code className="inline-code">app.addD1()</code>, Levi
        builds a <strong>directed acyclic graph (DAG)</strong> of resources
        and their dependencies.
      </p>

      <p>
        The graph captures which resources exist, how they connect, and in
        what order they need to be provisioned and deployed. This is the same
        idea behind .NET Aspire's application model, adapted for Cloudflare's
        primitives.
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
        <span className="syn-str">"my-saas"</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-cmt">{"// Resources (nodes in the graph)"}</span>
        {"\n"}
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
        <span className="syn-str">"session-cache"</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-cmt">{"// Bindings (edges in the graph)"}</span>
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
        <span className="syn-str">"./src/api/index.ts"</span>
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
        The resulting graph is a DAG. The topological sort of this graph
        determines provisioning order (databases before workers that
        reference them) and deployment order (dependencies first, dependents
        second).
      </p>

      <CodeBlock title="App Graph visualization" lang="ascii">
        <span className="syn-cmt">{"//  levi graph  output:"}</span>
        {"\n\n"}
        {"  main-db (D1)        session-cache (KV)"}{"\n"}
        {"       \\                   /"}{"\n"}
        {"        \\                 /"}{"\n"}
        {"         v               v"}{"\n"}
        {"       +-----------------+"}{"\n"}
        {"       |   api (Worker)  |"}{"\n"}
        {"       +-----------------+"}{"\n"}
        {"\n"}
        <span className="syn-cmt">{"  Deploy order: main-db -> session-cache -> api"}</span>
      </CodeBlock>

      <div className="stitch-separator my-8" />

      {/* ── Resources ──────────────────────────────────────────── */}
      <h2>Resources</h2>

      <p>
        A <strong>resource</strong> is any Cloudflare primitive that Levi
        knows how to provision and configure. Each resource maps 1:1 to a
        real Cloudflare entity: a Worker script, a D1 database, a KV
        namespace, an R2 bucket, and so on.
      </p>

      <p>
        Resources are created through typed factory methods on the{" "}
        <code className="inline-code">FlareApp</code> instance. Every
        resource has a <strong>logical name</strong> (used for references
        within the graph) and generates a deterministic{" "}
        <strong>physical name</strong> for the Cloudflare API.
      </p>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dashed border-denim-600">
              <th className="text-left py-2 pr-4 text-denim-300 font-semibold">Method</th>
              <th className="text-left py-2 pr-4 text-denim-300 font-semibold">CF Primitive</th>
              <th className="text-left py-2 text-denim-300 font-semibold">Binding Type</th>
            </tr>
          </thead>
          <tbody className="text-denim-200">
            <tr className="border-b border-dashed border-denim-800">
              <td className="py-2 pr-4"><code className="inline-code">addWorker()</code></td>
              <td className="py-2 pr-4">Worker Script</td>
              <td className="py-2">Service Binding</td>
            </tr>
            <tr className="border-b border-dashed border-denim-800">
              <td className="py-2 pr-4"><code className="inline-code">addD1()</code></td>
              <td className="py-2 pr-4">D1 Database</td>
              <td className="py-2">D1 Binding</td>
            </tr>
            <tr className="border-b border-dashed border-denim-800">
              <td className="py-2 pr-4"><code className="inline-code">addKV()</code></td>
              <td className="py-2 pr-4">KV Namespace</td>
              <td className="py-2">KV Binding</td>
            </tr>
            <tr className="border-b border-dashed border-denim-800">
              <td className="py-2 pr-4"><code className="inline-code">addR2()</code></td>
              <td className="py-2 pr-4">R2 Bucket</td>
              <td className="py-2">R2 Binding</td>
            </tr>
            <tr className="border-b border-dashed border-denim-800">
              <td className="py-2 pr-4"><code className="inline-code">addQueue()</code></td>
              <td className="py-2 pr-4">Queue</td>
              <td className="py-2">Queue Binding</td>
            </tr>
            <tr className="border-b border-dashed border-denim-800">
              <td className="py-2 pr-4"><code className="inline-code">addDurableObject()</code></td>
              <td className="py-2 pr-4">Durable Object</td>
              <td className="py-2">DO Binding</td>
            </tr>
            <tr className="border-b border-dashed border-denim-800">
              <td className="py-2 pr-4"><code className="inline-code">addVectorize()</code></td>
              <td className="py-2 pr-4">Vectorize Index</td>
              <td className="py-2">Vectorize Binding</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><code className="inline-code">addWorkersAI()</code></td>
              <td className="py-2 pr-4">Workers AI</td>
              <td className="py-2">AI Binding</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Levi resolves logical names to physical IDs automatically. You never
        write a TOML config by hand — the framework generates a{" "}
        <code className="inline-code">wrangler.jsonc</code> for every worker
        with all bindings resolved.
      </p>

      <div className="stitch-separator my-8" />

      {/* ── Bindings ───────────────────────────────────────────── */}
      <h2>Bindings</h2>

      <p>
        <strong>Bindings</strong> are the edges in the App Graph. They
        declare that a worker needs access to a particular resource at
        runtime. In Cloudflare, bindings are the mechanism through which
        Workers access D1, KV, R2, Queues, and other Workers.
      </p>

      <p>
        Levi makes binding declarative. Instead of writing binding
        configuration in TOML or JSON, you pass resources into the{" "}
        <code className="inline-code">bindings</code> object of a worker,
        and the framework infers the correct binding type, name,
        and ID at build time.
      </p>

      <CodeBlock title="Binding a D1 database" lang="typescript">
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">db</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-const">app</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">addD1</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"users-db"</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
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
        <span className="syn-str">"./src/api/index.ts"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">bindings</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>{" "}
        <span className="syn-prop">USERS_DB</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-const">db</span>{" "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-cmt">{"// In your worker code, access the binding:"}</span>
        {"\n"}
        <span className="syn-kw">export default</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"  "}
        <span className="syn-kw">async</span>{" "}
        <span className="syn-fn">fetch</span>
        <span className="syn-punc">(</span>
        <span className="syn-const">req</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-const">env</span>
        <span className="syn-punc">)</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"    "}
        <span className="syn-cmt">{"// env.USERS_DB is the D1 binding (auto-named from logical name)"}</span>
        {"\n"}
        {"    "}
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">rows</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-kw">await</span>{" "}
        <span className="syn-const">env</span>
        <span className="syn-punc">.</span>
        <span className="syn-prop">USERS_DB</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">prepare</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"SELECT * FROM users"</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">all</span>
        <span className="syn-punc">()</span>
        <span className="syn-punc">;</span>
        {"\n"}
        {"  "}
        <span className="syn-punc">{"}"}</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">;</span>
      </CodeBlock>

      <h3>Binding Name Resolution</h3>

      <p>
        The binding name in your worker environment is derived from the
        resource's logical name using <strong>SCREAMING_SNAKE_CASE</strong>{" "}
        convention. For example:
      </p>

      <ul>
        <li><code className="inline-code">users-db</code> becomes <code className="inline-code">USERS_DB</code></li>
        <li><code className="inline-code">session-cache</code> becomes <code className="inline-code">SESSION_CACHE</code></li>
        <li><code className="inline-code">uploads</code> becomes <code className="inline-code">UPLOADS</code></li>
      </ul>

      <p>
        You can control the binding name by choosing the key in the{" "}
        <code className="inline-code">bindings</code> object, e.g.{" "}
        <code className="inline-code">{`bindings: { DB: db }`}</code>.
      </p>

      <div className="stitch-separator my-8" />

      {/* ── Service Bindings ───────────────────────────────────── */}
      <h2>Service Bindings</h2>

      <p>
        Service bindings let one worker call another worker{" "}
        <strong>without going over the network</strong>. The call happens
        in-process on the same Cloudflare colo, with zero HTTP overhead.
        This is the backbone of Levi's multi-worker architecture.
      </p>

      <p>
        To create a service binding, call{" "}
        <code className="inline-code">.asService()</code> on a worker
        resource, then bind it to the consuming worker:
      </p>

      <CodeBlock title="Worker-to-worker RPC" lang="typescript">
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">api</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-const">app</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">addWorker</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"api"</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-punc">{"{"}</span>{" "}
        <span className="syn-prop">entrypoint</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"./src/api/index.ts"</span>{" "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">frontend</span>{" "}
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
        <span className="syn-str">"./src/web/index.ts"</span>
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
        <span className="syn-cmt">{"// In your frontend worker:"}</span>
        {"\n"}
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">res</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-kw">await</span>{" "}
        <span className="syn-const">env</span>
        <span className="syn-punc">.</span>
        <span className="syn-prop">API</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">fetch</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"/users"</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n"}
        <span className="syn-cmt">{"// Zero network hop — in-process on the same colo"}</span>
      </CodeBlock>

      <p>
        Service bindings are <strong>edges in the graph</strong> just like
        storage bindings. They affect deployment order: Levi deploys the
        target worker (the API) before the consuming worker (the frontend),
        because the service binding needs a live target to resolve against.
      </p>

      <div className="stitch-separator my-8" />

      {/* ── The Build Pipeline ─────────────────────────────────── */}
      <h2>The Build Pipeline</h2>

      <p>
        When you run <code className="inline-code">levi build</code>, the
        framework executes a deterministic pipeline that turns your{" "}
        <code className="inline-code">levi.app.ts</code> into deployable
        artifacts.
      </p>

      <CodeBlock title="Build pipeline stages" lang="ascii">
        {"  levi.app.ts"}{"\n"}
        {"      |"}{"\n"}
        {"      v"}{"\n"}
        {"  [1] Parse & Evaluate"}{"\n"}
        {"      |  Execute the TypeScript file, collect all"}{"\n"}
        {"      |  addWorker/addD1/addKV/... calls"}{"\n"}
        {"      v"}{"\n"}
        {"  [2] Build App Graph"}{"\n"}
        {"      |  Construct the DAG from resources + bindings"}{"\n"}
        {"      |  Validate: no cycles, no missing refs"}{"\n"}
        {"      v"}{"\n"}
        {"  [3] Topological Sort"}{"\n"}
        {"      |  Determine provisioning & deployment order"}{"\n"}
        {"      v"}{"\n"}
        {"  [4] Config Generation"}{"\n"}
        {"      |  Emit wrangler.jsonc per worker"}{"\n"}
        {"      |  Resolve binding IDs from provisioned resources"}{"\n"}
        {"      v"}{"\n"}
        {"  [5] Output"}{"\n"}
        {"      Write everything to .levi/ directory"}{"\n"}
      </CodeBlock>

      <h3>The .levi/ Directory</h3>

      <p>
        All build artifacts land in a{" "}
        <code className="inline-code">.levi/</code> directory at the project
        root. This directory is the single source of truth for what gets
        deployed:
      </p>

      <CodeBlock title=".levi/ output structure" lang="bash">
        <span className="syn-const">.levi/</span>
        {"\n"}
        {"  "}
        <span className="syn-const">api/</span>
        {"\n"}
        {"    wrangler.jsonc      "}
        <span className="syn-cmt"># Generated config for the api worker</span>
        {"\n"}
        {"  "}
        <span className="syn-const">web/</span>
        {"\n"}
        {"    wrangler.jsonc      "}
        <span className="syn-cmt"># Generated config for the web worker</span>
        {"\n"}
        {"  graph.json            "}
        <span className="syn-cmt"># Serialized app graph</span>
        {"\n"}
        {"  provision-plan.json   "}
        <span className="syn-cmt"># Resources to create/update</span>
      </CodeBlock>

      <p>
        The <code className="inline-code">.levi/</code> directory should be
        gitignored. It is fully deterministic: running{" "}
        <code className="inline-code">levi build</code> twice on the same
        input always produces the same output.
      </p>

      <div className="stitch-separator my-8" />

      {/* ── Ejectability ───────────────────────────────────────── */}
      <h2>Ejectability</h2>

      <p>
        A core design principle of Levi:{" "}
        <strong>you are never locked in</strong>. Every generated{" "}
        <code className="inline-code">wrangler.jsonc</code> is a valid,
        standalone Cloudflare configuration file. If you decide Levi is not
        for you, run <code className="inline-code">levi eject</code> and
        take the generated configs with you.
      </p>

      <CodeBlock title="Eject to standalone wrangler configs" lang="bash">
        <span className="syn-fn">$</span>{" "}
        <span className="syn-const">levi eject</span>
        {"\n\n"}
        <span className="syn-cmt">{"# Copies from .levi/ to your project root:"}</span>
        {"\n"}
        {"  api/wrangler.jsonc    -> ./api/wrangler.jsonc"}{"\n"}
        {"  web/wrangler.jsonc    -> ./web/wrangler.jsonc"}{"\n\n"}
        <span className="syn-cmt">{"# You can now deploy directly with wrangler:"}</span>
        {"\n"}
        <span className="syn-fn">$</span>{" "}
        <span className="syn-const">cd api && npx wrangler deploy</span>
        {"\n"}
        <span className="syn-fn">$</span>{" "}
        <span className="syn-const">cd web && npx wrangler deploy</span>
      </CodeBlock>

      <div className="denim-pocket p-5 my-8">
        <h3 style={{ marginTop: 0 }}>What eject copies</h3>
        <ul>
          <li>
            All <code className="inline-code">wrangler.jsonc</code> files
            with fully resolved binding IDs
          </li>
          <li>
            Migration files referenced by D1 database configs
          </li>
          <li>
            A <code className="inline-code">package.json</code> script for
            each worker with the correct wrangler command
          </li>
        </ul>
        <p className="text-sm text-denim-400 mt-3 mb-0">
          After ejecting, you own the configs entirely. Levi has no runtime
          dependency — it is a build-time-only tool.
        </p>
      </div>

      <div className="stitch-separator my-8" />

      {/* ── Putting It Together ────────────────────────────────── */}
      <h2>Putting It All Together</h2>

      <p>
        Here is a complete{" "}
        <code className="inline-code">levi.app.ts</code> for a typical SaaS
        application with an API, a frontend, a background worker, a D1
        database, KV cache, and R2 file storage:
      </p>

      <CodeBlock title="Full example — levi.app.ts" lang="typescript">
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
        <span className="syn-str">"main-db"</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n"}
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">kv</span>{" "}
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
        <span className="syn-const">files</span>{" "}
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
        <span className="syn-str">"background-tasks"</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-cmt">{"// ── API Worker ──"}</span>
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
        <span className="syn-str">"./src/api/index.ts"</span>
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
        <span className="syn-prop">KV</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-const">kv</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-prop">FILES</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-const">files</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-prop">TASKS</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-const">tasks</span>{" "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-cmt">{"// ── Background Worker ──"}</span>
        {"\n"}
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">worker</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-const">app</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">addWorker</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"background"</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">entrypoint</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"./src/worker/index.ts"</span>
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
        {"\n"}
        {"\n"}
        <span className="syn-cmt">{"// ── Frontend ──"}</span>
        {"\n"}
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
        <span className="syn-str">"vinext"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">entrypoint</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"./src/web/index.ts"</span>
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
        From this single file, <code className="inline-code">levi build</code>{" "}
        generates 3 wrangler configs, resolves all bindings, and{" "}
        <code className="inline-code">levi deploy</code> provisions the D1
        database, KV namespace, R2 bucket, and queue, then deploys workers
        in topological order.
      </p>

      <div className="stitch-separator my-8" />

      {/* Next steps */}
      <div className="flex flex-wrap gap-3 mt-8">
        <Link
          href="/docs/cli"
          className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
        >
          CLI Reference →
        </Link>
        <Link
          href="/docs/workers"
          className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
        >
          Workers →
        </Link>
        <Link
          href="/docs/vinext"
          className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
        >
          vinext Integration →
        </Link>
      </div>
    </DocLayout>
  );
}
