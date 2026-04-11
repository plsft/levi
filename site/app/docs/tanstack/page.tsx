import Link from "next/link";
import { DocLayout } from "../../../components/DocLayout";
import { CodeBlock } from "../../../components/CodeBlock";

export default function TanStackPage() {
  return (
    <DocLayout>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-denim-50">TanStack SPA Integration</h1>
          <span className="red-tab-h">Network</span>
        </div>
        <p className="text-denim-200 text-lg leading-relaxed max-w-2xl">
          Levi provides first-class support for TanStack SPA — Vite + React + TanStack Query +
          TanStack Router deployed as a pure client-side Cloudflare Worker with static assets.
        </p>
      </div>

      <div className="stitch-separator mb-10" />

      {/* Why TanStack SPA? */}
      <h2>Why TanStack SPA?</h2>
      <p>
        TanStack SPA is a pure client-side application framework. Unlike vinext (which does
        server-side rendering), TanStack SPA ships zero server-rendered HTML — all data fetching
        happens in the browser via TanStack Query. This makes it ideal for:
      </p>
      <ul>
        <li>Apps where SEO is not critical (dashboards, admin panels, internal tools)</li>
        <li>Teams already familiar with TanStack Query and TanStack Router</li>
        <li>Maximum performance via aggressive client-side caching</li>
        <li>Simple deployment — just static assets served from a Worker</li>
      </ul>

      <div className="stitch-separator my-8" />

      {/* Scaffolding */}
      <h2>Scaffolding</h2>
      <p>
        Use <code className="inline-code">levi init</code> with the TanStack SPA framework:
      </p>

      <CodeBlock title="Scaffold with TanStack SPA" lang="bash">
        <span className="syn-fn">$</span>{" "}
        <span className="syn-const">levi init my-app --framework tanstack</span>
        {"\n\n"}
        {"  Creating project in ./my-app"}{"\n"}
        {"  Scaffolding TanStack SPA frontend..."}{"\n"}
        {"  Scaffolding Hono API worker..."}{"\n"}
        {"  Writing levi.app.ts..."}{"\n\n"}
        <span className="syn-str">{"  Done! cd my-app && levi dev to start."}</span>
      </CodeBlock>

      <p>
        This creates a project with two workers — an API worker (Hono) and a web worker (TanStack SPA).
      </p>

      <CodeBlock title="Project structure" lang="bash">
        <span className="syn-cmt">{"# TanStack SPA project"}</span>
        {"\n"}
        {"./my-app/"}{"\n"}
        {"├── levi.app.ts"}{"\n"}
        {"├── src/"}{"\n"}
        {"│   ├── api/"}{"\n"}
        {"│   │   └── index.ts        # Hono API worker"}{"\n"}
        {"│   └── web/"}{"\n"}
        {"│       ├── app/"}{"\n"}
        {"│       │   ├── routes/"}{"\n"}
        {"│       │   └── query.ts"}{"\n"}
        {"│       ├── main.tsx"}{"\n"}
        {"│       └── entry-client.tsx"}{"\n"}
        {"├── package.json"}{"\n"}
        {"└── tsconfig.json"}
      </CodeBlock>

      <div className="stitch-separator my-8" />

      {/* The TanStack SPA Pattern */}
      <h2>The TanStack SPA Pattern</h2>
      <p>
        A TanStack SPA app consists of two workers:
      </p>
      <ol>
        <li>
          <strong>API Worker (Hono)</strong> — Handles all server-side logic, database access,
          and business rules. Exposed as a service binding to the frontend.
        </li>
        <li>
          <strong>Web Worker (TanStack SPA)</strong> — Serves the React SPA frontend as static
          assets. Calls the API worker via service binding (no external HTTP).
        </li>
      </ol>

      <CodeBlock title="levi.app.ts — TanStack SPA pattern" lang="typescript">
        <span className="syn-kw">import</span>{" "}
        <span className="syn-punc">{"{"}</span>{" "}
        <span className="syn-type">FlareApp</span>{" "}
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
        <span className="syn-punc">,</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">compatibility_date</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"2026-04-01"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-cmt">{"// ── Storage ──────────────────────────────────────────────"}</span>
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
        {"\n\n"}
        <span className="syn-cmt">{"// ── API Worker (Hono) ────────────────────────────────────"}</span>
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
        <span className="syn-prop">framework</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"hono"</span>
        <span className="syn-punc">,</span>
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
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"    "}
        <span className="syn-prop">DB</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-const">db</span>
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
        <span className="syn-cmt">{"// ── Web Worker (TanStack SPA) ───────────────────────────"}</span>
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
        <span className="syn-str">"./src/web"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">bindings</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"    "}
        <span className="syn-prop">API</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-const">api</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">asService</span>
        <span className="syn-punc">(),</span>
        {"\n"}
        {"  "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        <span className="syn-prop">routes</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">[</span>
        <span className="syn-str">"example.com/*"</span>
        <span className="syn-punc">],</span>
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

      {/* What framework: "tanstack" Does */}
      <h2>What framework: "tanstack" Does</h2>
      <p>
        Setting <code className="inline-code">{"framework: \"tanstack\""}</code> triggers
        automatic configuration in the generated wrangler.jsonc:
      </p>

      <ul>
        <li>
          <strong>Assets configuration</strong> — Levi generates the <code className="inline-code">assets</code>{" "}
          block pointing to <code className="inline-code">dist/client/</code> for static file serving
        </li>
        <li>
          <strong>Service binding</strong> — The <code className="inline-code">API</code> binding
          is a service binding to the Hono API worker (not an HTTP call)
        </li>
        <li>
          <strong>No SSR</strong> — TanStack SPA is pure client-side; no server rendering overhead
        </li>
      </ul>

      <CodeBlock title="Generated wrangler.jsonc (web worker)" lang="jsonc">
        {"{"}
        {"\n"}
        {"  "}
        <span className="syn-str">"name"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"my-app-web"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-str">"main"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"./.levi/workers/web/index.js"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-str">"assets"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"    "}
        <span className="syn-str">"directory"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"./src/web/dist/client"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"    "}
        <span className="syn-str">"binding"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"ASSETS"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-str">"services"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"    "}
        <span className="syn-str">"API"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"my-app-api"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-str">"compatibility_date"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"2026-04-01"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-str">"routes"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">[</span>
        <span className="syn-str">"example.com/*"</span>
        <span className="syn-punc">]</span>
        {"\n"}
        {"}"}
      </CodeBlock>

      <div className="stitch-separator my-8" />

      {/* Service Binding in TanStack Query */}
      <h2>Calling the API via Service Binding</h2>
      <p>
        In your TanStack SPA, you call the API worker using the service binding.
        Cloudflare Workers passes the call directly to the API worker without leaving
        the Cloudflare network — no external HTTP request.
      </p>

      <CodeBlock title="src/web/app/query.ts" lang="typescript">
        <span className="syn-kw">import</span>{" "}
        <span className="syn-punc">{"{"}</span>{" "}
        <span className="syn-type">QueryClient</span>{" "}
        <span className="syn-punc">{"}"}</span>{" "}
        <span className="syn-kw">from</span>{" "}
        <span className="syn-str">"@tanstack/react-query"</span>
        <span className="syn-punc">;</span>
        {"\n"}
        <span className="syn-kw">import</span>{" "}
        <span className="syn-punc">{"{"}</span>{" "}
        <span className="syn-type">Env</span>{" "}
        <span className="syn-punc">{"}"}</span>{" "}
        <span className="syn-kw">from</span>{" "}
        <span className="syn-str">"./env"</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-kw">export</span>{" "}
        <span className="syn-kw">function</span>{" "}
        <span className="syn-fn">createQueryClient</span>
        <span className="syn-punc">()</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"  "}
        <span className="syn-kw">return</span>{" "}
        <span className="syn-kw">new</span>{" "}
        <span className="syn-type">QueryClient</span>
        <span className="syn-punc">({"{"}</span>
        {"\n"}
        {"    "}
        <span className="syn-prop">defaultOptions</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"      "}
        <span className="syn-prop">queries</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"        "}
        <span className="syn-prop">staleTime</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-number">1000</span>
        <span className="syn-punc"> *</span>{" "}
        <span className="syn-number">60</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"      "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"    "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
        {"\n\n"}
        <span className="syn-cmt">{"// Call the API worker via service binding"}</span>
        {"\n"}
        <span className="syn-kw">export</span>{" "}
        <span className="syn-kw">async function</span>{" "}
        <span className="syn-fn">fetchApi</span>
        <span className="syn-punc">&lt;</span>
        <span className="syn-type">T</span>
        <span className="syn-punc">&gt;(</span>
        <span className="syn-const">env</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-type">Env</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-const">path</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-type">string</span>
        <span className="syn-punc">)</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"  "}
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">response</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-kw">await</span>{" "}
        <span className="syn-const">env</span>
        <span className="syn-punc">.</span>
        <span className="syn-type">API</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">fetch</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"/api"</span>
        <span className="syn-punc">{" + "}</span>
        <span className="syn-type">path</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n"}
        {"  "}
        <span className="syn-kw">if</span>{" "}
        <span className="syn-punc">(!</span>
        <span className="syn-const">response</span>
        <span className="syn-punc">.</span>
        <span className="syn-const">ok</span>
        <span className="syn-punc">)</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"    "}
        <span className="syn-kw">throw</span>{" "}
        <span className="syn-kw">new</span>{" "}
        <span className="syn-type">Error</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"API request failed"</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n"}
        {"  "}
        <span className="syn-punc">{"}"}</span>
        {"\n"}
        {"  "}
        <span className="syn-kw">return</span>{" "}
        <span className="syn-const">response</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">json</span>
        <span className="syn-punc">&lt;</span>
        <span className="syn-type">T</span>
        <span className="syn-punc">&gt;()</span>
        <span className="syn-punc">;</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
      </CodeBlock>

      <div className="stitch-separator my-8" />

      {/* vinext vs TanStack */}
      <h2>vinext vs. TanStack SPA</h2>
      <p>
        Choose based on your app&apos;s requirements:
      </p>

      <table className="w-full text-sm mb-6">
        <thead>
          <tr className="border-b border-wash-600">
            <th className="text-left py-2 text-wash-300">Feature</th>
            <th className="text-left py-2 text-wash-300">vinext</th>
            <th className="text-left py-2 text-wash-300">TanStack SPA</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-wash-700">
            <td className="py-2">SSR</td>
            <td className="py-2 text-green-400">Yes — server-rendered HTML</td>
            <td className="py-2 text-red-400">No — pure client-side</td>
          </tr>
          <tr className="border-b border-wash-700">
            <td className="py-2">SEO</td>
            <td className="py-2 text-green-400">Good — pages are server-rendered</td>
            <td className="py-2 text-red-400">Poor — requires extra config</td>
          </tr>
          <tr className="border-b border-wash-700">
            <td className="py-2">Initial load</td>
            <td className="py-2 text-green-400">Faster — HTML from server</td>
            <td className="py-2 text-yellow-400">Slower — JS must download first</td>
          </tr>
          <tr className="border-b border-wash-700">
            <td className="py-2">Data fetching</td>
            <td className="py-2">Server components + TanStack Query</td>
            <td className="py-2">TanStack Query only</td>
          </tr>
          <tr className="border-b border-wash-700">
            <td className="py-2">Best for</td>
            <td className="py-2">Content sites, marketing pages, e-commerce</td>
            <td className="py-2">Dashboards, admin panels, internal tools</td>
          </tr>
        </tbody>
      </table>

      <div className="stitch-separator my-8" />

      {/* Build & Deploy */}
      <h2>Build & Deploy</h2>

      <h3>Build steps for TanStack SPA worker</h3>
      <CodeBlock title="Build" lang="bash">
        <span className="syn-fn">$</span>{" "}
        <span className="syn-const">levi build</span>
        {"\n\n"}
        {"  [1] Building TanStack SPA frontend..."}{"\n"}
        {"    $ cd src/web && npm run build"}{"\n"}
        {"  [2] Generating wrangler configs..."}{"\n"}
        {"    Generated: .levi/workers/api/wrangler.jsonc"}{"\n"}
        {"    Generated: .levi/workers/web/wrangler.jsonc"}{"\n"}
        {"  ✓ Build complete: 2 workers, 1 D1 database"}
      </CodeBlock>

      <h3>Deploy</h3>
      <CodeBlock title="Deploy" lang="bash">
        <span className="syn-fn">$</span>{" "}
        <span className="syn-const">levi deploy</span>
        {"\n\n"}
        {"  ✓ Provisioning resources..."}{"\n"}
        {"  ✓ Deployed api worker"}{"\n"}
        {"  ✓ Deployed web worker"}{"\n"}
        {"  ✓ Deployment complete"}
      </CodeBlock>

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
            href="/docs/service-bindings"
            className="px-4 py-2 text-sm bg-wash-600/20 border border-dashed border-wash-500 rounded-md text-wash-300 hover:bg-wash-600/30 transition-colors"
          >
            Service Bindings
          </Link>
          <Link
            href="/docs/cli"
            className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
          >
            CLI Reference
          </Link>
          <Link
            href="/examples"
            className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
          >
            Examples
          </Link>
        </div>
      </div>
    </DocLayout>
  );
}
