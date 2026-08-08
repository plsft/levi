import Link from "next/link";
import { DocLayout } from "../../components/DocLayout";
import { CodeBlock } from "../../components/CodeBlock";

/* ═══════════════════════════════════════════════════════════════
   Getting Started Guide
   ═══════════════════════════════════════════════════════════════ */

export const metadata = {
  title: "Getting Started — Levi",
  description:
    "Install Levi, create your first apphost file, and deploy to Cloudflare in minutes.",
};

export default function GettingStartedPage() {
  return (
    <DocLayout>
      <h1 className="text-3xl sm:text-4xl font-bold text-denim-50 mb-2">
        Getting Started
      </h1>
      <p className="text-denim-300 mb-8 text-lg leading-relaxed">
        Go from zero to a fully deployed Cloudflare application in under five
        minutes. This guide walks through installation, project scaffolding, the
        apphost file, local development, and deployment.
      </p>

      <div className="stitch-separator mb-10" />

      {/* ──────────────────────────────────────────────────────────
          1. Prerequisites
          ────────────────────────────────────────────────────────── */}
      <h2 id="prerequisites">Prerequisites</h2>

      <p>
        Before you begin, make sure you have the following installed and
        configured on your machine:
      </p>

      <ul>
        <li>
          <strong>Node.js 18+</strong> — Levi uses modern Node APIs. We
          recommend the latest LTS release. Check with{" "}
          <span className="inline-code">node --version</span>.
        </li>
        <li>
          <strong>Wrangler CLI</strong> — Install globally with{" "}
          <span className="inline-code">npm install -g wrangler</span>. Levi
          orchestrates Wrangler under the hood, so it must be available on your
          PATH. Verify with{" "}
          <span className="inline-code">wrangler --version</span>.
        </li>
        <li>
          <strong>Cloudflare account</strong> — You need an active account with
          API access. Run{" "}
          <span className="inline-code">wrangler login</span> to authenticate
          before deploying.
        </li>
        <li>
          <strong>A package manager</strong> — npm, pnpm, or yarn. All examples
          use npm, but any will work.
        </li>
      </ul>

      {/* ──────────────────────────────────────────────────────────
          2. Installation
          ────────────────────────────────────────────────────────── */}
      <h2 id="installation">Installation</h2>

      <p>
        Install Levi as a dev dependency in your project. It provides both the
        CLI and the TypeScript SDK for declaring your infrastructure.
      </p>

      <CodeBlock title="terminal" lang="bash">
        <span className="syn-fn">npm</span>{" "}
        <span className="syn-const">install</span>{" "}
        <span className="syn-op">-D</span>{" "}
        <span className="syn-str">@flarefound/levi</span>
      </CodeBlock>

      <p>
        This adds two things to your project: the{" "}
        <span className="inline-code">levi</span> CLI (available via{" "}
        <span className="inline-code">npx levi</span>) and the{" "}
        <span className="inline-code">@flarefound/levi</span> TypeScript module
        you import in your apphost file.
      </p>

      <p>
        You can also install globally if you prefer the CLI always available:
      </p>

      <CodeBlock title="terminal" lang="bash">
        <span className="syn-fn">npm</span>{" "}
        <span className="syn-const">install</span>{" "}
        <span className="syn-op">-g</span>{" "}
        <span className="syn-str">@flarefound/levi</span>
      </CodeBlock>

      {/* ──────────────────────────────────────────────────────────
          3. Initialize
          ────────────────────────────────────────────────────────── */}
      <h2 id="initialize">Initialize a New Project</h2>

      <p>
        The <span className="inline-code">levi init</span> command scaffolds a
        new project with sensible defaults. Run it from an empty directory or
        your existing project root:
      </p>

      <CodeBlock title="terminal" lang="bash">
        <span className="syn-fn">npx</span>{" "}
        <span className="syn-const">levi</span>{" "}
        <span className="syn-const">init</span>
      </CodeBlock>

      <p>
        The interactive wizard prompts you for a few choices:
      </p>

      <ul>
        <li>
          <strong>Project name</strong> — Used as the default prefix for all
          Cloudflare resource names.
        </li>
        <li>
          <strong>Framework</strong> — Choose one:
          <ul className="mt-2 ml-4">
            <li>
              <strong>React 19 SPA</strong> — plain React 19 + Vite, no
              meta-framework. A Worker serves the static build and proxies
              to your API over a service binding.
            </li>
            <li>
              <strong>TanStack SPA</strong> — Vite + React + TanStack Query +
              TanStack Router. Pure client-side SPA, no SSR.
            </li>
            <li>
              <strong>Hono</strong> — Lightweight, fast API framework. Ideal for
              pure APIs and microservices.
            </li>
            <li>
              <strong>Raw</strong> — Bare Workers with no framework. Maximum
              control.
            </li>
          </ul>
        </li>
        <li>
          <strong>Resources</strong> — Optionally scaffold D1, KV, or R2
          bindings in the initial apphost file.
        </li>
      </ul>

      <p>After initialization, your project structure looks like this:</p>

      <CodeBlock title="project structure" lang="text">
        <span className="syn-const">my-app/</span>
        {"\n"}
        <span className="syn-punc">{"  "}├──</span>{" "}
        <span className="syn-str">levi.app.ts</span>
        {"          "}
        <span className="syn-cmt"># Your apphost file</span>
        {"\n"}
        <span className="syn-punc">{"  "}├──</span>{" "}
        <span className="syn-str">package.json</span>
        {"\n"}
        <span className="syn-punc">{"  "}├──</span>{" "}
        <span className="syn-str">tsconfig.json</span>
        {"\n"}
        <span className="syn-punc">{"  "}├──</span>{" "}
        <span className="syn-const">src/</span>
        {"\n"}
        <span className="syn-punc">{"  "}│   └──</span>{" "}
        <span className="syn-str">index.ts</span>
        {"           "}
        <span className="syn-cmt"># Worker entry point</span>
        {"\n"}
        <span className="syn-punc">{"  "}└──</span>{" "}
        <span className="syn-const">.levi/</span>
        {"                "}
        <span className="syn-cmt"># Generated (gitignored)</span>
      </CodeBlock>

      {/* ──────────────────────────────────────────────────────────
          4. The AppHost File
          ────────────────────────────────────────────────────────── */}
      <h2 id="apphost-file">The AppHost File</h2>

      <p>
        The heart of every Levi project is{" "}
        <span className="inline-code">levi.app.ts</span>. This single file
        declares your entire Cloudflare application topology — every Worker,
        every database, every binding, every domain.
      </p>

      <p>
        Think of it like a <span className="inline-code">docker-compose.yml</span>,
        but for Cloudflare, and written in TypeScript with full type safety.
      </p>

      <CodeBlock title="levi.app.ts" lang="TypeScript">
        <span className="syn-kw">import</span>{" "}
        <span className="syn-punc">{"{"}</span>{" "}
        <span className="syn-type">FlareApp</span>{" "}
        <span className="syn-punc">{"}"}</span>{" "}
        <span className="syn-kw">from</span>{" "}
        <span className="syn-str">"@flarefound/levi"</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-cmt">{"// Create the application"}</span>
        {"\n"}
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
        <span className="syn-cmt">{"// Declare resources"}</span>
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
        <span className="syn-cmt">{"// Declare workers and bind resources to them"}</span>
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
        <span className="syn-str">"./src/index.ts"</span>
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
        <span className="syn-const">app</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">addDomain</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"api.my-app.dev"</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-kw">export default</span>{" "}
        <span className="syn-const">app</span>
        <span className="syn-punc">;</span>
      </CodeBlock>

      <h3>How it works</h3>

      <ul>
        <li>
          <strong>
            <span className="inline-code">new FlareApp("my-app")</span>
          </strong>{" "}
          creates the root application container. The name is used as a prefix
          for generated Cloudflare resource names.
        </li>
        <li>
          <strong>
            <span className="inline-code">.addD1()</span>,{" "}
            <span className="inline-code">.addKV()</span>, etc.
          </strong>{" "}
          declare infrastructure resources. Each returns a typed reference you
          can pass to a worker's <span className="inline-code">bindings</span> object.
        </li>
        <li>
          <strong>
            <span className="inline-code">.addWorker(name, options)</span>
          </strong>{" "}
          declares a Worker with its options. Use the{" "}
          <span className="inline-code">bindings</span> field to attach resources and{" "}
          <span className="inline-code">app.addDomain()</span> for custom domains.
        </li>
        <li>
          <strong>
            <span className="inline-code">export default app</span>
          </strong>{" "}
          — The default export is required. Levi reads this file to build the
          dependency graph.
        </li>
      </ul>

      <p>
        Every method is fully typed. Your editor will autocomplete resource
        names, prevent you from binding incompatible types, and flag missing
        required fields at compile time.
      </p>

      {/* ──────────────────────────────────────────────────────────
          5. Build
          ────────────────────────────────────────────────────────── */}
      <h2 id="build">Build</h2>

      <p>
        The <span className="inline-code">levi build</span> command reads your
        apphost file, resolves the dependency graph, and generates Wrangler
        configuration files:
      </p>

      <CodeBlock title="terminal" lang="bash">
        <span className="syn-fn">npx</span>{" "}
        <span className="syn-const">levi</span>{" "}
        <span className="syn-const">build</span>
      </CodeBlock>

      <p>This produces output in the <span className="inline-code">.levi/</span> directory:</p>

      <CodeBlock title=".levi/ output" lang="text">
        <span className="syn-const">.levi/</span>
        {"\n"}
        <span className="syn-punc">{"  "}├──</span>{" "}
        <span className="syn-str">api/</span>
        {"\n"}
        <span className="syn-punc">{"  "}│   └──</span>{" "}
        <span className="syn-str">wrangler.jsonc</span>
        {"      "}
        <span className="syn-cmt"># Generated config for the api worker</span>
        {"\n"}
        <span className="syn-punc">{"  "}├──</span>{" "}
        <span className="syn-str">manifest.json</span>
        {"        "}
        <span className="syn-cmt"># Full resource manifest</span>
        {"\n"}
        <span className="syn-punc">{"  "}└──</span>{" "}
        <span className="syn-str">deploy-order.json</span>
        {"    "}
        <span className="syn-cmt"># Topological deploy ordering</span>
      </CodeBlock>

      <h3>What gets generated</h3>

      <ul>
        <li>
          <strong>One <span className="inline-code">wrangler.jsonc</span> per Worker</strong>{" "}
          — Each contains the full configuration: name, entry point,
          compatibility date, bindings, routes, and any resource-specific
          settings. These are valid, standalone Wrangler configs.
        </li>
        <li>
          <strong><span className="inline-code">manifest.json</span></strong>{" "}
          — A complete map of all declared resources and their relationships.
          Useful for debugging and CI/CD integrations.
        </li>
        <li>
          <strong><span className="inline-code">deploy-order.json</span></strong>{" "}
          — The topologically sorted list of resources to deploy. Resources are
          ordered so that dependencies are created before their dependents.
        </li>
      </ul>

      <p>
        You should add <span className="inline-code">.levi/</span> to your{" "}
        <span className="inline-code">.gitignore</span>. The generated files
        are deterministic and can always be rebuilt from your apphost file.
      </p>

      {/* ──────────────────────────────────────────────────────────
          6. Local Development
          ────────────────────────────────────────────────────────── */}
      <h2 id="local-development">Local Development</h2>

      <p>
        Levi provides a unified dev experience that orchestrates multiple
        Wrangler dev servers:
      </p>

      <CodeBlock title="terminal" lang="bash">
        <span className="syn-fn">npx</span>{" "}
        <span className="syn-const">levi</span>{" "}
        <span className="syn-const">dev</span>
      </CodeBlock>

      <p>What happens under the hood:</p>

      <ul>
        <li>
          Levi runs <span className="inline-code">levi build</span> first to
          generate fresh Wrangler configs.
        </li>
        <li>
          For each Worker declared in your apphost, it spawns a{" "}
          <span className="inline-code">wrangler dev</span> process using the
          generated <span className="inline-code">wrangler.jsonc</span>.
        </li>
        <li>
          Local D1 databases are created automatically using Wrangler's local
          persistence.
        </li>
        <li>
          KV, R2, and other storage bindings use Wrangler's built-in local
          emulation via Miniflare.
        </li>
        <li>
          Service bindings between Workers are wired up so inter-Worker calls
          work locally.
        </li>
        <li>
          Hot module replacement works across the stack (Vite for the
          frontend, wrangler dev for workers).
        </li>
      </ul>

      <p>
        All output is multiplexed into your terminal with color-coded prefixes so
        you can distinguish logs from different Workers. Press{" "}
        <span className="inline-code">Ctrl+C</span> to stop all dev servers
        gracefully.
      </p>

      <CodeBlock title="terminal output" lang="text">
        <span className="syn-kw">[api]</span>{" "}
        <span className="syn-str">Ready on http://localhost:8787</span>
        {"\n"}
        <span className="syn-type">[web]</span>{" "}
        <span className="syn-str">Ready on http://localhost:8788</span>
        {"\n"}
        <span className="syn-kw">[api]</span>{" "}
        <span className="syn-cmt">Bindings: D1(main-db), KV(session-cache)</span>
        {"\n"}
        <span className="syn-type">[web]</span>{" "}
        <span className="syn-cmt">Bindings: ServiceBinding(api)</span>
      </CodeBlock>

      {/* ──────────────────────────────────────────────────────────
          7. Deploy
          ────────────────────────────────────────────────────────── */}
      <h2 id="deploy">Deploy</h2>

      <p>
        When you are ready to ship, deploy everything with a single command:
      </p>

      <CodeBlock title="terminal" lang="bash">
        <span className="syn-fn">npx</span>{" "}
        <span className="syn-const">levi</span>{" "}
        <span className="syn-const">deploy</span>
      </CodeBlock>

      <h3>What happens</h3>

      <ul>
        <li>
          Levi runs <span className="inline-code">levi build</span> to ensure
          configs are up to date.
        </li>
        <li>
          Resources are deployed in{" "}
          <strong>topological order</strong>. D1 databases and KV namespaces are
          created before Workers that depend on them. Workers are deployed
          before service bindings that reference them.
        </li>
        <li>
          Each Worker is deployed via{" "}
          <span className="inline-code">wrangler deploy</span> using the
          generated <span className="inline-code">wrangler.jsonc</span>.
        </li>
        <li>
          Custom domains are configured automatically after Workers are live.
        </li>
      </ul>

      <h3>Environment support</h3>

      <p>
        Deploy to a specific environment by passing the{" "}
        <span className="inline-code">--env</span> flag:
      </p>

      <CodeBlock title="terminal" lang="bash">
        <span className="syn-fn">npx</span>{" "}
        <span className="syn-const">levi</span>{" "}
        <span className="syn-const">deploy</span>{" "}
        <span className="syn-op">--env</span>{" "}
        <span className="syn-str">staging</span>
      </CodeBlock>

      <p>
        Environments are declared in your apphost file using the{" "}
        <span className="inline-code">environments</span> option in the <span className="inline-code">FlareApp</span> constructor. Each environment
        can override resource names, domains, and variable values. See the{" "}
        <Link href="/docs/environments">Environments</Link> documentation for
        details.
      </p>

      <h3>Deploy a single worker</h3>

      <p>
        You can deploy just one worker by name if you do not want to deploy
        everything:
      </p>

      <CodeBlock title="terminal" lang="bash">
        <span className="syn-fn">npx</span>{" "}
        <span className="syn-const">levi</span>{" "}
        <span className="syn-const">deploy</span>{" "}
        <span className="syn-op">--only</span>{" "}
        <span className="syn-str">api</span>
      </CodeBlock>

      {/* ──────────────────────────────────────────────────────────
          8. Next Steps
          ────────────────────────────────────────────────────────── */}
      <h2 id="next-steps">Next Steps</h2>

      <p>
        You now have a working Levi project. Here is where to go from here:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
        <Link
          href="/docs/core-concepts"
          className="stitch-border rounded-lg p-4 bg-denim-900/30 hover:bg-denim-900/50 transition-colors no-underline block"
        >
          <h4 className="text-sm font-bold text-wash-400 mb-1">
            Core Concepts
          </h4>
          <p className="text-xs text-denim-400 !mb-0">
            Understand the dependency graph, resource model, and build pipeline.
          </p>
        </Link>

        <Link
          href="/docs/workers"
          className="stitch-border rounded-lg p-4 bg-denim-900/30 hover:bg-denim-900/50 transition-colors no-underline block"
        >
          <h4 className="text-sm font-bold text-wash-400 mb-1">Workers</h4>
          <p className="text-xs text-denim-400 !mb-0">
            Configure routes, compatibility flags, and environment variables.
          </p>
        </Link>

        <Link
          href="/docs/d1"
          className="stitch-border rounded-lg p-4 bg-denim-900/30 hover:bg-denim-900/50 transition-colors no-underline block"
        >
          <h4 className="text-sm font-bold text-wash-400 mb-1">
            D1 Databases
          </h4>
          <p className="text-xs text-denim-400 !mb-0">
            Add SQLite at the edge with migrations and seed data.
          </p>
        </Link>

        <Link
          href="/docs/kv"
          className="stitch-border rounded-lg p-4 bg-denim-900/30 hover:bg-denim-900/50 transition-colors no-underline block"
        >
          <h4 className="text-sm font-bold text-wash-400 mb-1">
            KV Namespaces
          </h4>
          <p className="text-xs text-denim-400 !mb-0">
            Global key-value storage for sessions, feature flags, and config.
          </p>
        </Link>

        <Link
          href="/docs/r2"
          className="stitch-border rounded-lg p-4 bg-denim-900/30 hover:bg-denim-900/50 transition-colors no-underline block"
        >
          <h4 className="text-sm font-bold text-wash-400 mb-1">R2 Storage</h4>
          <p className="text-xs text-denim-400 !mb-0">
            S3-compatible object storage with zero egress fees.
          </p>
        </Link>

        <Link
          href="/docs/queues"
          className="stitch-border rounded-lg p-4 bg-denim-900/30 hover:bg-denim-900/50 transition-colors no-underline block"
        >
          <h4 className="text-sm font-bold text-wash-400 mb-1">Queues</h4>
          <p className="text-xs text-denim-400 !mb-0">
            Reliable message queues with batching and retry policies.
          </p>
        </Link>

        <Link
          href="/docs/durable-objects"
          className="stitch-border rounded-lg p-4 bg-denim-900/30 hover:bg-denim-900/50 transition-colors no-underline block"
        >
          <h4 className="text-sm font-bold text-wash-400 mb-1">
            Durable Objects
          </h4>
          <p className="text-xs text-denim-400 !mb-0">
            Stateful, single-instance compute with transactional storage.
          </p>
        </Link>

        <Link
          href="/docs/service-bindings"
          className="stitch-border rounded-lg p-4 bg-denim-900/30 hover:bg-denim-900/50 transition-colors no-underline block"
        >
          <h4 className="text-sm font-bold text-wash-400 mb-1">
            Service Bindings
          </h4>
          <p className="text-xs text-denim-400 !mb-0">
            Zero-latency RPC between Workers in the same account.
          </p>
        </Link>

        <Link
          href="/docs/ai"
          className="stitch-border rounded-lg p-4 bg-denim-900/30 hover:bg-denim-900/50 transition-colors no-underline block"
        >
          <h4 className="text-sm font-bold text-wash-400 mb-1">
            Workers AI
          </h4>
          <p className="text-xs text-denim-400 !mb-0">
            Run inference on Cloudflare's GPU fleet with AI Gateway.
          </p>
        </Link>

        <Link
          href="/docs/domains"
          className="stitch-border rounded-lg p-4 bg-denim-900/30 hover:bg-denim-900/50 transition-colors no-underline block"
        >
          <h4 className="text-sm font-bold text-wash-400 mb-1">
            Domains & SSL
          </h4>
          <p className="text-xs text-denim-400 !mb-0">
            Custom domains, DNS configuration, and automatic SSL.
          </p>
        </Link>

        <Link
          href="/examples/react"
          className="stitch-border rounded-lg p-4 bg-denim-900/30 hover:bg-denim-900/50 transition-colors no-underline block"
        >
          <h4 className="text-sm font-bold text-wash-400 mb-1">
            React 19 SPA
          </h4>
          <p className="text-xs text-denim-400 !mb-0">
            Plain React 19 + Vite on Cloudflare Workers — no meta-framework.
          </p>
        </Link>

        <Link
          href="/docs/tanstack"
          className="stitch-border rounded-lg p-4 bg-denim-900/30 hover:bg-denim-900/50 transition-colors no-underline block"
        >
          <h4 className="text-sm font-bold text-wash-400 mb-1">
            TanStack SPA
          </h4>
          <p className="text-xs text-denim-400 !mb-0">
            Vite + React + TanStack Query + TanStack Router. Pure SPA.
          </p>
        </Link>

        <Link
          href="/docs/cli"
          className="stitch-border rounded-lg p-4 bg-denim-900/30 hover:bg-denim-900/50 transition-colors no-underline block"
        >
          <h4 className="text-sm font-bold text-wash-400 mb-1">
            CLI Reference
          </h4>
          <p className="text-xs text-denim-400 !mb-0">
            Full command reference for init, build, dev, deploy, and more.
          </p>
        </Link>
      </div>

      <div className="stitch-separator mt-12 mb-6" />

      <p className="text-sm text-denim-400">
        Found an issue with this guide?{" "}
        <a
          href="https://github.com/plsft/levi/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open an issue on GitHub
        </a>
        .
      </p>
    </DocLayout>
  );
}
