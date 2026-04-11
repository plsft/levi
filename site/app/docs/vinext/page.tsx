import Link from "next/link";
import { DocLayout } from "../../../components/DocLayout";
import { CodeBlock } from "../../../components/CodeBlock";

export default function VinextPage() {
  return (
    <DocLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-denim-50">vinext Integration</h1>
        </div>
        <p className="text-denim-200 text-lg leading-relaxed max-w-2xl">
          vinext is a frontend framework for Levi projects.
          It is Vite-native, runs on Cloudflare Workers, and supports
          React 19 SSR out of the box. Levi provides first-class
          integration with zero extra configuration.
        </p>
      </div>

      <div className="stitch-separator mb-10" />

      {/* ── Why vinext? ────────────────────────────────────────── */}
      <h2>Why vinext?</h2>

      <p>
        Levi is framework-agnostic — you can deploy any Worker. But when you
        need a frontend, vinext is a{" "}
        because it was designed for exactly this stack:
      </p>

      <ul>
        <li>
          <strong>Vite-native</strong> — No webpack, no custom bundler. Uses
          Vite's module graph for dev and production builds, with HMR that
          works on Workers.
        </li>
        <li>
          <strong>Cloudflare Workers native</strong> — SSR runs directly on
          Workers, not Node.js. No compatibility shims, no polyfills for
          Node APIs.
        </li>
        <li>
          <strong>React 19 with RSC</strong> — Full support for server
          components, server actions, and streaming SSR.
        </li>
        <li>
          <strong>Next.js API surface</strong> — Familiar routing, layouts,
          and data fetching patterns. File-system routing with{" "}
          <code className="inline-code">app/</code> directory.
        </li>
        <li>
          <strong>Service binding ready</strong> — Access other Levi workers
          directly from your SSR layer via{" "}
          <code className="inline-code">cloudflare:workers</code> env
          bindings.
        </li>
      </ul>

      <div className="denim-pocket p-5 my-8">
        <h3 style={{ marginTop: 0 }}>vinext vs. other frameworks</h3>
        <p className="text-sm text-denim-300 mb-0">
          You can use any framework that compiles to a Worker (Remix,
          Astro, SvelteKit with CF adapter). vinext simply has the deepest
          integration with Levi — when you set{" "}
          <code className="inline-code">{"framework: \"vinext\""}</code>,
          Levi automatically configures assets serving, node_compat,
          SSR entry points, and service bindings. With other frameworks,
          you configure these manually.
        </p>
      </div>

      <div className="stitch-separator my-8" />

      {/* ── Setup ──────────────────────────────────────────────── */}
      <h2>Setup</h2>

      <p>
        The fastest way to start is with{" "}
        <code className="inline-code">levi init</code>. Select "vinext"
        when prompted for a framework:
      </p>

      <CodeBlock title="Scaffold with vinext" lang="bash">
        <span className="syn-fn">$</span>{" "}
        <span className="syn-const">levi init my-app --framework vinext</span>
        {"\n\n"}
        {"  Creating project in ./my-app"}{"\n"}
        {"  Scaffolding vinext frontend..."}{"\n"}
        {"  Scaffolding Hono API worker..."}{"\n"}
        {"  Writing levi.app.ts..."}{"\n"}
        {"  Installing dependencies..."}{"\n\n"}
        <span className="syn-str">{"  Done! cd my-app && levi dev to start."}</span>
      </CodeBlock>

      <h3>What Gets Scaffolded</h3>

      <p>
        The init command creates a monorepo-style project with the frontend
        and API side by side:
      </p>

      <CodeBlock title="Project structure" lang="bash">
        <span className="syn-const">my-app/</span>
        {"\n"}
        {"  levi.app.ts               "}
        <span className="syn-cmt"># App graph: vinext + Hono API</span>
        {"\n"}
        {"  package.json"}{"\n"}
        {"  tsconfig.json"}{"\n"}
        {"  src/"}{"\n"}
        {"    web/                    "}
        <span className="syn-cmt"># vinext frontend</span>
        {"\n"}
        {"      app/"}{"\n"}
        {"        layout.tsx          "}
        <span className="syn-cmt"># Root layout</span>
        {"\n"}
        {"        page.tsx            "}
        <span className="syn-cmt"># Home page</span>
        {"\n"}
        {"      components/"}{"\n"}
        {"      styles/"}{"\n"}
        {"      entry.server.tsx      "}
        <span className="syn-cmt"># SSR entry point</span>
        {"\n"}
        {"      entry.client.tsx      "}
        <span className="syn-cmt"># Client hydration</span>
        {"\n"}
        {"    api/"}{"\n"}
        {"      index.ts             "}
        <span className="syn-cmt"># Hono API worker</span>
        {"\n"}
        {"      routes/"}{"\n"}
      </CodeBlock>

      <div className="stitch-separator my-8" />

      {/* ── Configuration ──────────────────────────────────────── */}
      <h2>Configuration</h2>

      <p>
        When you add a worker with{" "}
        <code className="inline-code">{"framework: \"vinext\""}</code>, Levi
        automatically configures the underlying wrangler config with
        everything vinext needs to run on Workers:
      </p>

      <CodeBlock title="levi.app.ts — vinext worker" lang="typescript">
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
        <span className="syn-str">"vinext"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">entrypoint</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"./src/web/entry.server.tsx"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
      </CodeBlock>

      <h3>What framework: "vinext" Does</h3>

      <p>
        Setting the framework option triggers several automatic
        configuration steps during{" "}
        <code className="inline-code">levi build</code>:
      </p>

      <ul>
        <li>
          <strong>Assets serving</strong> — Configures the{" "}
          <code className="inline-code">assets</code> field in
          wrangler.jsonc to serve the Vite build output (JS bundles, CSS,
          images) from the Workers static assets pipeline.
        </li>
        <li>
          <strong>node_compat</strong> — Enables{" "}
          <code className="inline-code">node_compat = true</code> so that
          vinext's SSR runtime can use Node.js APIs available on Workers
          (crypto, streams, Buffer, etc.).
        </li>
        <li>
          <strong>SSR entry point</strong> — Sets the main module to{" "}
          <code className="inline-code">entry.server.tsx</code>, which
          handles incoming requests, renders React components to a stream,
          and returns the HTML response.
        </li>
        <li>
          <strong>Build command</strong> — Hooks into{" "}
          <code className="inline-code">levi build</code> to run{" "}
          <code className="inline-code">vinext build</code> before
          generating the wrangler config.
        </li>
      </ul>

      <CodeBlock title="Generated wrangler.jsonc (simplified)" lang="json">
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">"name"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"my-app-web"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">"main"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"./src/web/entry.server.tsx"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">"compatibility_date"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"2025-01-01"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">"node_compat"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-num">true</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">"assets"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"    "}
        <span className="syn-prop">"directory"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"./dist/client"</span>
        {"\n"}
        {"  "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">"services"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">[</span>
        {"\n"}
        {"    "}
        <span className="syn-punc">{"{"}</span>{" "}
        <span className="syn-prop">"binding"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"API"</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-prop">"service"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"my-app-api"</span>{" "}
        <span className="syn-punc">{"}"}</span>
        {"\n"}
        {"  "}
        <span className="syn-punc">]</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
      </CodeBlock>

      <div className="stitch-separator my-8" />

      {/* ── Service Bindings ───────────────────────────────────── */}
      <h2>Service Bindings</h2>

      <p>
        The most powerful pattern in a Levi + vinext app is connecting your
        frontend to your API through{" "}
        <strong>service bindings</strong>. Instead of making HTTP requests to
        an external URL, your vinext SSR code calls the API worker directly
        — in-process, with zero network latency.
      </p>

      <CodeBlock title="Binding the API to the frontend" lang="typescript">
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
        <span className="syn-const">db</span>{" "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
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
        <span className="syn-str">"vinext"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">entrypoint</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"./src/web/entry.server.tsx"</span>
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
        With this binding in place, your vinext components can call the API
        without any external HTTP requests. The call goes through the Worker
        runtime's service binding, staying on the same Cloudflare colo.
      </p>

      <div className="stitch-separator my-8" />

      {/* ── Environment Access ─────────────────────────────────── */}
      <h2>Environment Access</h2>

      <p>
        In your vinext server-side code (server components, server actions,
        API routes), you access Cloudflare bindings through the{" "}
        <code className="inline-code">cloudflare:workers</code> module.
        This gives you typed access to every binding declared in your App
        Graph.
      </p>

      <CodeBlock title="Server component with service binding" lang="typescript">
        <span className="syn-cmt">{"// src/web/app/page.tsx (server component)"}</span>
        {"\n\n"}
        <span className="syn-kw">import</span>{" "}
        <span className="syn-punc">{"{"}</span>{" "}
        <span className="syn-fn">getCloudflareContext</span>{" "}
        <span className="syn-punc">{"}"}</span>{" "}
        <span className="syn-kw">from</span>{" "}
        <span className="syn-str">"cloudflare:workers"</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-kw">export default</span>{" "}
        <span className="syn-kw">async function</span>{" "}
        <span className="syn-fn">HomePage</span>
        <span className="syn-punc">()</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"  "}
        <span className="syn-kw">const</span>{" "}
        <span className="syn-punc">{"{"}</span>{" "}
        <span className="syn-const">env</span>{" "}
        <span className="syn-punc">{"}"}</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-fn">getCloudflareContext</span>
        <span className="syn-punc">()</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        {"  "}
        <span className="syn-cmt">{"// Call the API worker via service binding"}</span>
        {"\n"}
        {"  "}
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
        <span className="syn-str">"/api/products"</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n"}
        {"  "}
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">products</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-kw">await</span>{" "}
        <span className="syn-const">res</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">json</span>
        <span className="syn-punc">()</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        {"  "}
        <span className="syn-kw">return</span>{" "}
        <span className="syn-punc">(</span>
        {"\n"}
        {"    "}
        <span className="syn-op">{"<"}</span>
        <span className="syn-type">div</span>
        <span className="syn-op">{">"}</span>
        {"\n"}
        {"      "}
        <span className="syn-op">{"<"}</span>
        <span className="syn-type">h1</span>
        <span className="syn-op">{">"}</span>
        {"Products"}
        <span className="syn-op">{"</"}</span>
        <span className="syn-type">h1</span>
        <span className="syn-op">{">"}</span>
        {"\n"}
        {"      "}
        <span className="syn-punc">{"{"}</span>
        <span className="syn-const">products</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">map</span>
        <span className="syn-punc">(</span>
        <span className="syn-const">p</span>{" "}
        <span className="syn-op">{"=>"}</span>{" "}
        <span className="syn-punc">(</span>
        {"\n"}
        {"        "}
        <span className="syn-op">{"<"}</span>
        <span className="syn-type">div</span>{" "}
        <span className="syn-prop">key</span>
        <span className="syn-op">=</span>
        <span className="syn-punc">{"{"}</span>
        <span className="syn-const">p</span>
        <span className="syn-punc">.</span>
        <span className="syn-prop">id</span>
        <span className="syn-punc">{"}"}</span>
        <span className="syn-op">{">"}</span>
        <span className="syn-punc">{"{"}</span>
        <span className="syn-const">p</span>
        <span className="syn-punc">.</span>
        <span className="syn-prop">name</span>
        <span className="syn-punc">{"}"}</span>
        <span className="syn-op">{"</"}</span>
        <span className="syn-type">div</span>
        <span className="syn-op">{">"}</span>
        {"\n"}
        {"      "}
        <span className="syn-punc">)</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">{"}"}</span>
        {"\n"}
        {"    "}
        <span className="syn-op">{"</"}</span>
        <span className="syn-type">div</span>
        <span className="syn-op">{">"}</span>
        {"\n"}
        {"  "}
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
      </CodeBlock>

      <h3>Server Actions</h3>

      <p>
        Server actions also have full access to bindings. You can use them
        to call the API worker, write to KV, or enqueue messages — all
        from a form submission:
      </p>

      <CodeBlock title="Server action with service binding" lang="typescript">
        <span className="syn-cmt">{"// src/web/app/actions.ts"}</span>
        {"\n"}
        <span className="syn-str">"use server"</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-kw">import</span>{" "}
        <span className="syn-punc">{"{"}</span>{" "}
        <span className="syn-fn">getCloudflareContext</span>{" "}
        <span className="syn-punc">{"}"}</span>{" "}
        <span className="syn-kw">from</span>{" "}
        <span className="syn-str">"cloudflare:workers"</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-kw">export async function</span>{" "}
        <span className="syn-fn">createProduct</span>
        <span className="syn-punc">(</span>
        <span className="syn-const">formData</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-type">FormData</span>
        <span className="syn-punc">)</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"  "}
        <span className="syn-kw">const</span>{" "}
        <span className="syn-punc">{"{"}</span>{" "}
        <span className="syn-const">env</span>{" "}
        <span className="syn-punc">{"}"}</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-fn">getCloudflareContext</span>
        <span className="syn-punc">()</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        {"  "}
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
        <span className="syn-str">"/api/products"</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"    "}
        <span className="syn-prop">method</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"POST"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"    "}
        <span className="syn-prop">body</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-type">JSON</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">stringify</span>
        <span className="syn-punc">(</span>
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"      "}
        <span className="syn-prop">name</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-const">formData</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">get</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"name"</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"      "}
        <span className="syn-prop">price</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-type">Number</span>
        <span className="syn-punc">(</span>
        <span className="syn-const">formData</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">get</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"price"</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"    "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        {"  "}
        <span className="syn-kw">return</span>{" "}
        <span className="syn-const">res</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">json</span>
        <span className="syn-punc">()</span>
        <span className="syn-punc">;</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
      </CodeBlock>

      <div className="stitch-separator my-8" />

      {/* ── Full Example ───────────────────────────────────────── */}
      <h2>Full Example</h2>

      <p>
        Here is a complete <code className="inline-code">levi.app.ts</code>{" "}
        for a typical vinext + Hono full-stack application with D1, KV,
        and a background worker:
      </p>

      <CodeBlock title="levi.app.ts — Full-stack vinext app" lang="typescript">
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
        <span className="syn-str">"my-store"</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-cmt">{"// ── Storage layer ──"}</span>
        {"\n"}
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">db</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-const">app</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">addD1</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"store-db"</span>
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
        <span className="syn-const">emailQueue</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-const">app</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">addQueue</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"email-queue"</span>
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
        <span className="syn-prop">SESSIONS</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-const">sessions</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-prop">EMAIL_QUEUE</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-const">emailQueue</span>{" "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-cmt">{"// ── Background email worker ──"}</span>
        {"\n"}
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">emailWorker</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-const">app</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">addWorker</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"email-worker"</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-punc">{"{"}</span>{" "}
        <span className="syn-prop">entrypoint</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"./src/email/index.ts"</span>{" "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n"}
        {"\n"}
        <span className="syn-cmt">{"// ── Frontend (vinext) ──"}</span>
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
        <span className="syn-str">"./src/web/entry.server.tsx"</span>
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

      <h3>App Graph for This Example</h3>

      <CodeBlock title="levi graph output" lang="ascii">
        {"  my-store"}{"\n"}
        {"  ========"}{"\n\n"}
        {"  store-db (D1)    sessions (KV)    email-queue (Queue)"}{"\n"}
        {"       \\              |     \\              /"}{"\n"}
        {"        \\             |      \\            /"}{"\n"}
        {"         v            v       v          v"}{"\n"}
        {"       +-------+   +------+  +-------------+"}{"\n"}
        {"       |  api  |   |  web |  | email-worker |"}{"\n"}
        {"       +-------+   +------+  +-------------+"}{"\n"}
        {"            \\        ^"}{"\n"}
        {"             \\      /"}{"\n"}
        {"         (service binding)"}{"\n\n"}
        {"  Deploy order:"}{"\n"}
        {"    1. store-db, sessions, email-queue  (provision)"}{"\n"}
        {"    2. api, email-worker                (deploy)"}{"\n"}
        {"    3. web                              (deploy)"}{"\n"}
      </CodeBlock>

      <div className="stitch-separator my-8" />

      {/* ── Build & Deploy ─────────────────────────────────────── */}
      <h2>Build & Deploy</h2>

      <p>
        Levi handles the vinext build output as part of its standard build
        pipeline. Here is the complete workflow from code to production:
      </p>

      <h3>Build Phase</h3>

      <p>
        When <code className="inline-code">levi build</code> encounters a
        vinext worker, it runs the vinext build toolchain before generating
        the wrangler config:
      </p>

      <CodeBlock title="Build steps for vinext worker" lang="bash">
        <span className="syn-fn">$</span>{" "}
        <span className="syn-const">levi build</span>
        {"\n\n"}
        {"  [1] Parsing levi.app.ts..."}{"\n"}
        {"  [2] Building App Graph: 6 resources, 8 bindings"}{"\n"}
        {"  [3] Building vinext frontend..."}{"\n"}
        {"      Running: vite build --mode production"}{"\n"}
        {"      Client bundle: 142 KB (gzipped)"}{"\n"}
        {"      SSR bundle: 89 KB"}{"\n"}
        {"  [4] Generating wrangler configs..."}{"\n"}
        {"      .levi/api/wrangler.jsonc"}{"\n"}
        {"      .levi/email-worker/wrangler.jsonc"}{"\n"}
        {"      .levi/web/wrangler.jsonc"}{"\n\n"}
        <span className="syn-str">{"  Build complete (2.1s)"}</span>
      </CodeBlock>

      <h3>Deploy Phase</h3>

      <p>
        Deployment follows the topological sort. The vinext worker is
        deployed last because it depends on the API worker via a service
        binding:
      </p>

      <CodeBlock title="Deploy all" lang="bash">
        <span className="syn-fn">$</span>{" "}
        <span className="syn-const">levi deploy</span>
        {"\n\n"}
        {"  Provisioning resources..."}{"\n"}
        {"    D1: store-db           [exists]"}{"\n"}
        {"    KV: sessions           [exists]"}{"\n"}
        {"    Queue: email-queue     [exists]"}{"\n\n"}
        {"  Deploying workers..."}{"\n"}
        {"    [1/3] api             deployed  https://api.my-store.workers.dev"}{"\n"}
        {"    [2/3] email-worker    deployed  (queue consumer)"}{"\n"}
        {"    [3/3] web             deployed  https://web.my-store.workers.dev"}{"\n\n"}
        <span className="syn-str">{"  All 3 workers deployed."}</span>
      </CodeBlock>

      <h3>Local Development</h3>

      <p>
        During <code className="inline-code">levi dev</code>, the vinext
        frontend runs with Vite's dev server and HMR. The service binding
        to the API worker works locally too — Levi wires the local worker
        instances together:
      </p>

      <CodeBlock title="Local dev with vinext" lang="bash">
        <span className="syn-fn">$</span>{" "}
        <span className="syn-const">levi dev</span>
        {"\n\n"}
        {"  Starting 3 workers..."}{"\n"}
        {"    api          -> http://localhost:8787"}{"\n"}
        {"    email-worker -> (queue consumer)"}{"\n"}
        {"    web          -> http://localhost:5173  (vinext dev)"}{"\n\n"}
        {"  Service bindings: web -> api"}{"\n"}
        {"  HMR active on web"}{"\n\n"}
        <span className="syn-str">{"  Ready. Open http://localhost:5173"}</span>
      </CodeBlock>

      <div className="stitch-separator my-8" />

      {/* ── Tips ───────────────────────────────────────────────── */}
      <h2>Tips & Best Practices</h2>

      <ul>
        <li>
          <strong>Keep API logic in the API worker</strong> — Your vinext
          frontend should be thin. Use service bindings to call the API
          for all data access and mutations.
        </li>
        <li>
          <strong>Use server components for data fetching</strong> — vinext
          server components run on the Worker, which means service binding
          calls have zero network latency. Fetch data in server components
          and pass it to client components as props.
        </li>
        <li>
          <strong>Client components for interactivity</strong> — Interactive
          elements (forms, modals, animations) should be client components.
          Use server actions for form submissions to keep the API call
          server-side.
        </li>
        <li>
          <strong>Shared types</strong> — Define your API types in a shared
          package (e.g., <code className="inline-code">src/shared/types.ts</code>)
          and import them in both the API worker and vinext frontend for
          end-to-end type safety.
        </li>
        <li>
          <strong>Environment variables</strong> — Secrets and config values
          are set per-worker in Levi. The vinext worker and API worker have
          independent environment variables, which is a security advantage.
        </li>
      </ul>

      <div className="stitch-separator my-8" />

      {/* Navigation */}
      <div className="flex flex-wrap gap-3 mt-8">
        <Link
          href="/docs/core-concepts"
          className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
        >
          Core Concepts →
        </Link>
        <Link
          href="/docs/service-bindings"
          className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
        >
          Service Bindings →
        </Link>
        <Link
          href="/docs/cli"
          className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
        >
          CLI Reference →
        </Link>
      </div>
    </DocLayout>
  );
}
