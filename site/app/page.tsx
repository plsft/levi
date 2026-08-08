import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════
   Levi — Home / Marketing Landing Page
   ═══════════════════════════════════════════════════════════════ */

const primitives = [
  {
    category: "Compute",
    items: [
      { name: "Worker", method: ".addWorker()", desc: "Standard Workers with bundling, routes, and bindings" },
      { name: "Durable Object", method: ".addDurableObject()", desc: "Stateful, single-instance compute with storage" },
      { name: "Service Binding", method: ".asService()", desc: "Zero-latency internal RPC between Workers" },
      { name: "Cron Trigger", method: "crons: [...]", desc: "Scheduled Workers on cron expressions" },
    ],
  },
  {
    category: "Storage & Data",
    items: [
      { name: "D1 Database", method: ".addD1()", desc: "SQLite at the edge with automatic migrations" },
      { name: "KV Namespace", method: ".addKV()", desc: "Global, low-latency key-value storage" },
      { name: "R2 Bucket", method: ".addR2()", desc: "S3-compatible object storage, zero egress" },
      { name: "Queue", method: ".addQueue()", desc: "Reliable message queues with batching" },
      { name: "Vectorize", method: ".addVectorize()", desc: "Vector database for embeddings and search" },
      { name: "Hyperdrive", method: ".addHyperdrive()", desc: "Connection pooling for external Postgres" },
    ],
  },
  {
    category: "AI & Intelligence",
    items: [
      { name: "Workers AI", method: ".addWorkersAI()", desc: "Run inference on Cloudflare's GPU fleet" },
      { name: "AI Gateway", method: ".addAIGateway()", desc: "Proxy, cache, and rate-limit LLM calls" },
    ],
  },
  {
    category: "AI & Observability",
    items: [
      { name: "Workflows", method: ".addWorkflow()", desc: "Durable, multi-step execution with retries" },
      { name: "Analytics Engine", method: ".addAnalyticsEngine()", desc: "Unlimited-cardinality analytics from Workers" },
      { name: "Browser Rendering", method: ".addBrowserRendering()", desc: "Headless browser for screenshots and scraping" },
      { name: "Tail Worker", method: ".addTailWorker()", desc: "Structured log consumers, deployed in order" },
    ],
  },
  {
    category: "Network",
    items: [
      { name: "Custom Domain", method: ".addDomain()", desc: "DNS, SSL, and routing in one declaration" },
      { name: "mTLS Certificate", method: ".addMTLS()", desc: "Client certificates for upstream calls" },
      { name: "Environment", method: "environments: {...}", desc: "staging/production config overrides" },
    ],
  },
  {
    category: "Edge",
    items: [
      { name: "Redirect", method: ".addRedirect()", desc: "Zone redirects with wildcard captures" },
      { name: "Cache Rule", method: ".addCacheRule()", desc: "Edge and browser TTLs, custom cache keys" },
      { name: "WAF Rule", method: ".addWAFRule()", desc: "Custom firewall rules in the Rules language" },
      { name: "Rate Limit Rule", method: ".addRateLimitRule()", desc: "HTTP rate limiting before your Worker runs" },
      { name: "Header Rule", method: ".addHeaderRule()", desc: "Request/response header transforms" },
      { name: "Snippet", method: ".addSnippet()", desc: "Lightweight JS at the edge, before Workers" },
    ],
  },
  {
    category: "Platform",
    items: [
      { name: "Dispatch Namespace", method: ".addDispatchNamespace()", desc: "Workers for Platforms multi-tenant SaaS" },
      { name: "Email", method: ".addEmail()", desc: "send_email bindings + Email Routing provisioning" },
      { name: "Rate Limiter", method: ".addRateLimit()", desc: "In-Worker counters with limit({ key })" },
      { name: "Secrets Store", method: ".addSecretsStoreSecret()", desc: "Account-level secrets shared across Workers" },
      { name: "Container", method: ".addContainer()", desc: "Docker images alongside Workers (beta)" },
      { name: "Pipeline", method: ".addPipeline()", desc: "Ingest and deliver data streams to R2 (beta)" },
    ],
  },
];

export default function HomePage() {
  return (
    <>
      {/* ════════════════════════════════════════════════════════════
          HERO
          ════════════════════════════════════════════════════════════ */}
      <section className="denim-wash relative overflow-hidden">
        {/* Decorative stitch lines */}
        <div className="absolute top-0 left-0 right-0 stitch-separator" />
        <div className="absolute bottom-0 left-0 right-0 stitch-separator" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 sm:pb-28">
          {/* Headline */}
          <div className="text-center mb-6">
            <h1 className="inline-flex items-center gap-4">
              <span className="text-7xl sm:text-8xl lg:text-9xl font-bold tracking-tighter text-denim-50">
                levi
              </span>
              <span className="red-tab red-tab-lg rotate-3 text-sm sm:text-base">
                framework
              </span>
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-center text-xl sm:text-2xl font-semibold text-wash-400 mb-4 tracking-wide">
            The AppHost Framework for Cloudflare
          </p>

          {/* Subtitle */}
          <p className="text-center text-base sm:text-lg text-denim-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Declare your entire Cloudflare topology in TypeScript.{" "}
            <span className="text-denim-100 font-medium">One file.</span>{" "}
            <span className="text-denim-100 font-medium">Full type safety.</span>{" "}
            <span className="text-denim-100 font-medium">Zero lock-in.</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-14">
            <Link
              href="/getting-started"
              className="px-8 py-3 rounded-lg font-semibold text-white bg-wash-600 hover:bg-wash-500 transition-colors border-2 border-dashed border-wash-400 text-sm"
            >
              Get Started
            </Link>
            <a
              href="https://github.com/plsft/levi"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-lg font-semibold text-denim-200 bg-denim-800/60 hover:bg-denim-700/60 transition-colors border border-denim-600 text-sm"
            >
              View on GitHub
            </a>
          </div>

          {/* Mini terminal */}
          <div className="max-w-2xl mx-auto">
            <div className="terminal">
              <div className="terminal-header">
                <span className="terminal-dot bg-redtab-500/80" />
                <span className="terminal-dot bg-thread-400/80" />
                <span className="terminal-dot bg-wash-500/80" />
                <span className="ml-2 text-xs text-denim-400">
                  levi.app.ts
                </span>
                <span className="ml-auto text-xs text-denim-500">
                  TypeScript
                </span>
              </div>
              <div className="terminal-body">
                <pre className="text-sm leading-relaxed">
                  <code>
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
                    <span className="syn-kw">export default</span>{" "}
                    <span className="syn-const">app</span>
                    <span className="syn-punc">;</span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          WHY LEVI?
          ════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-denim-50 mb-3">
            Why Levi?
          </h2>
          <div className="stitch-separator max-w-xs mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Card 1 */}
          <div className="denim-pocket p-6 pt-8 bg-denim-900/40 hover:bg-denim-900/60 transition-colors group">
            <div className="flex items-center gap-3 mb-4">
              <span className="red-tab-h">TS</span>
              <h3 className="text-xl font-bold text-denim-50 group-hover:text-wash-300 transition-colors">
                TypeScript-First
              </h3>
            </div>
            <p className="text-denim-300 leading-relaxed">
              Your apphost file <strong className="text-denim-100">IS</strong>{" "}
              your infrastructure. Full IntelliSense, compile-time validation,
              zero TOML. Every resource, every binding, every route — all
              expressed as typed builder methods in a single{" "}
              <span className="inline-code">levi.app.ts</span>.
            </p>
          </div>

          {/* Card 2 */}
          <div className="denim-pocket p-6 pt-8 bg-denim-900/40 hover:bg-denim-900/60 transition-colors group">
            <div className="flex items-center gap-3 mb-4">
              <span className="red-tab-h">CLI</span>
              <h3 className="text-xl font-bold text-denim-50 group-hover:text-wash-300 transition-colors">
                Wrangler Native
              </h3>
            </div>
            <p className="text-denim-300 leading-relaxed">
              Levi generates{" "}
              <span className="inline-code">wrangler.jsonc</span> files. It
              never replaces Wrangler — it{" "}
              <strong className="text-denim-100">orchestrates</strong> it. Under
              the hood, <span className="inline-code">levi dev</span> spawns{" "}
              <span className="inline-code">wrangler dev</span> per worker. No
              magic, no proprietary runtime.
            </p>
          </div>

          {/* Card 3 */}
          <div className="denim-pocket p-6 pt-8 bg-denim-900/40 hover:bg-denim-900/60 transition-colors group">
            <div className="flex items-center gap-3 mb-4">
              <span className="red-tab-h">CF</span>
              <h3 className="text-xl font-bold text-denim-50 group-hover:text-wash-300 transition-colors">
                Complete Coverage
              </h3>
            </div>
            <p className="text-denim-300 leading-relaxed">
              D1, KV, R2, Queues, Durable Objects, Vectorize, Hyperdrive,
              Workers AI, AI Gateway, Domains — every Cloudflare primitive has a
              corresponding builder. If Cloudflare ships it, Levi supports it.
            </p>
          </div>

          {/* Card 4 */}
          <div className="denim-pocket p-6 pt-8 bg-denim-900/40 hover:bg-denim-900/60 transition-colors group">
            <div className="flex items-center gap-3 mb-4">
              <span className="red-tab-h">0</span>
              <h3 className="text-xl font-bold text-denim-50 group-hover:text-wash-300 transition-colors">
                Zero Lock-in
              </h3>
            </div>
            <p className="text-denim-300 leading-relaxed">
              Eject anytime. The generated configs are valid, standalone Wrangler
              configurations. Delete Levi, keep your{" "}
              <span className="inline-code">wrangler.jsonc</span> files, and
              deploy with Wrangler directly. Your infrastructure remains yours.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          POSITIONING
          ════════════════════════════════════════════════════════════ */}
      <section className="border-y border-denim-800">
        <div className="stitch-separator" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-lg sm:text-xl text-denim-200 leading-relaxed mb-2">
              <a
                href="https://void.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="text-wash-400 hover:text-wash-300 underline underline-offset-4 decoration-dashed"
              >
                Void
              </a>{" "}
              is <strong className="text-denim-100">Vercel-for-Cloudflare</strong>.
            </p>
            <p className="text-lg sm:text-xl text-denim-200 leading-relaxed">
              Levi is{" "}
              <strong className="text-denim-100">
                Aspire-for-Cloudflare
              </strong>
              .
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Platform approach */}
            <div className="stitch-border rounded-lg p-6 bg-denim-900/30">
              <h3 className="text-sm font-bold text-denim-400 uppercase tracking-widest mb-4">
                Platform frameworks
              </h3>
              <p className="text-denim-300 leading-relaxed mb-4">
                Abstract away infrastructure. You import an SDK, the platform
                detects what you need, and deploys everything for you. Fast to
                start, but proprietary — your code is coupled to the platform.
              </p>
              <div className="text-xs text-denim-500">
                Vercel, Void Cloud, Netlify
              </div>
            </div>

            {/* AppHost approach */}
            <div className="stitch-border rounded-lg p-6 bg-wash-900/20 border-wash-500">
              <h3 className="text-sm font-bold text-wash-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                AppHost frameworks
                <span className="red-tab">levi</span>
              </h3>
              <p className="text-denim-200 leading-relaxed mb-4">
                Expose infrastructure as code. You declare every resource
                explicitly and Levi generates the configs Wrangler already
                understands. Full visibility, full control, full ejection path.
              </p>
              <div className="text-xs text-wash-500">
                Aspire, Levi, SST, Alchemy, Terraform
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/why-levi"
              className="inline-block text-sm text-wash-400 hover:text-wash-300 underline underline-offset-4 decoration-dashed"
            >
              How Levi compares to Aspire, SST, Alchemy, and Terraform →
            </Link>
          </div>
        </div>
        <div className="stitch-separator" />
      </section>

      {/* ════════════════════════════════════════════════════════════
          FULL CODE EXAMPLE
          ════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-denim-50 mb-3">
            One File. Full Stack.
          </h2>
          <p className="text-denim-300 max-w-xl mx-auto">
            A realistic apphost with a React 19 frontend, Hono API, D1, KV, R2,
            and service bindings — all declared in a single TypeScript file.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="terminal">
            <div className="terminal-header">
              <span className="terminal-dot bg-redtab-500/80" />
              <span className="terminal-dot bg-thread-400/80" />
              <span className="terminal-dot bg-wash-500/80" />
              <span className="ml-2 text-xs text-denim-400">
                levi.app.ts
              </span>
              <span className="ml-auto text-xs text-denim-500">
                TypeScript
              </span>
            </div>
            <div className="terminal-body">
              <pre className="text-sm leading-relaxed">
                <code>
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
                  <span className="syn-cmt">{"// ── Storage ──────────────────────────────────────"}</span>
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
                  {"\n"}
                  <span className="syn-kw">const</span>{" "}
                  <span className="syn-const">uploads</span>{" "}
                  <span className="syn-op">=</span>{" "}
                  <span className="syn-const">app</span>
                  <span className="syn-punc">.</span>
                  <span className="syn-fn">addR2</span>
                  <span className="syn-punc">(</span>
                  <span className="syn-str">"user-uploads"</span>
                  <span className="syn-punc">)</span>
                  <span className="syn-punc">;</span>
                  {"\n\n"}
                  <span className="syn-cmt">{"// ── API Worker (Hono) ────────────────────────────"}</span>
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
                  <span className="syn-str">"./apps/api/src/index.ts"</span>
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
                  <span className="syn-const">cache</span>
                  <span className="syn-punc">,</span>{" "}
                  <span className="syn-prop">UPLOADS</span>
                  <span className="syn-punc">:</span>{" "}
                  <span className="syn-const">uploads</span>{" "}
                  <span className="syn-punc">{"}"}</span>
                  <span className="syn-punc">,</span>
                  {"\n"}
                  {"  "}
                  <span className="syn-prop">routes</span>
                  <span className="syn-punc">:</span>{" "}
                  <span className="syn-punc">[</span>
                  <span className="syn-str">"api.acme.dev/*"</span>
                  <span className="syn-punc">]</span>
                  <span className="syn-punc">,</span>
                  {"\n"}
                  <span className="syn-punc">{"}"}</span>
                  <span className="syn-punc">)</span>
                  <span className="syn-punc">;</span>
                  {"\n\n"}
                  <span className="syn-cmt">{"// ── Frontend (React 19 SPA) ──────────────────────"}</span>
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
                  <span className="syn-str">"raw"</span>
                  <span className="syn-punc">,</span>
                  {"\n"}
                  {"  "}
                  <span className="syn-prop">entrypoint</span>
                  <span className="syn-punc">:</span>{" "}
                  <span className="syn-str">"./apps/web/worker.ts"</span>
                  <span className="syn-punc">,</span>
                  {"\n"}
                  {"  "}
                  <span className="syn-prop">build</span>
                  <span className="syn-punc">:</span>{" "}
                  <span className="syn-punc">{"{"}</span>{" "}
                  <span className="syn-prop">command</span>
                  <span className="syn-punc">:</span>{" "}
                  <span className="syn-str">"vite build"</span>{" "}
                  <span className="syn-punc">{"}"}</span>
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
                  {"  "}
                  <span className="syn-prop">wrangler</span>
                  <span className="syn-punc">:</span>{" "}
                  <span className="syn-punc">{"{"}</span>{" "}
                  <span className="syn-prop">assets</span>
                  <span className="syn-punc">:</span>{" "}
                  <span className="syn-punc">{"{"}</span>{" "}
                  <span className="syn-prop">directory</span>
                  <span className="syn-punc">:</span>{" "}
                  <span className="syn-str">"./dist"</span>
                  <span className="syn-punc">,</span>{" "}
                  <span className="syn-prop">binding</span>
                  <span className="syn-punc">:</span>{" "}
                  <span className="syn-str">"ASSETS"</span>{" "}
                  <span className="syn-punc">{"}"}</span>{" "}
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
                  <span className="syn-str">"acme.dev"</span>
                  <span className="syn-punc">,</span>{" "}
                  <span className="syn-punc">{"{"}</span>{" "}
                  <span className="syn-prop">redirectWww</span>
                  <span className="syn-punc">:</span>{" "}
                  <span className="syn-const">true</span>{" "}
                  <span className="syn-punc">{"}"}</span>
                  <span className="syn-punc">)</span>
                  <span className="syn-punc">;</span>
                  {"\n\n"}
                  <span className="syn-kw">export default</span>{" "}
                  <span className="syn-const">app</span>
                  <span className="syn-punc">;</span>
                </code>
              </pre>
            </div>
          </div>

          <p className="text-center text-sm text-denim-500 mt-4">
            <span className="inline-code">levi build</span> generates one{" "}
            <span className="inline-code">wrangler.jsonc</span> per worker.{" "}
            <span className="inline-code">levi deploy</span> deploys them in
            topological order.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          EVERY CLOUDFLARE PRIMITIVE
          ════════════════════════════════════════════════════════════ */}
      <section className="border-y border-denim-800">
        <div className="stitch-separator" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-denim-50 mb-3">
              Every Cloudflare Primitive
            </h2>
            <p className="text-denim-300 max-w-xl mx-auto">
              One builder method per resource. Declare it in TypeScript, Levi
              handles the rest.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-0">
            {primitives.map((group, gi) => (
              <div key={group.category}>
                {gi > 0 && <div className="stitch-separator my-6" />}
                <h3 className="text-sm font-bold text-denim-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                  {group.category}
                  <span className="red-tab-h">{group.items.length}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {group.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex flex-col p-4 rounded-md border border-denim-800 bg-denim-900/30 hover:border-denim-600 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-denim-100 text-sm">
                          {item.name}
                        </span>
                        <span className="inline-code text-xs">
                          {item.method}
                        </span>
                      </div>
                      <p className="text-xs text-denim-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="stitch-separator" />
      </section>

      {/* ════════════════════════════════════════════════════════════
          INSTALL / CTA
          ════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-denim-50 mb-6">
            Get Stitching
          </h2>

          <div className="terminal mb-8">
            <div className="terminal-header">
              <span className="terminal-dot bg-redtab-500/80" />
              <span className="terminal-dot bg-thread-400/80" />
              <span className="terminal-dot bg-wash-500/80" />
              <span className="ml-2 text-xs text-denim-400">terminal</span>
            </div>
            <div className="terminal-body">
              <pre className="text-sm leading-loose">
                <code>
                  <span className="syn-cmt"># Install</span>
                  {"\n"}
                  <span className="syn-fn">npm</span>{" "}
                  <span className="syn-const">install</span>{" "}
                  <span className="syn-str">@flarefound/levi</span>
                  {"\n\n"}
                  <span className="syn-cmt"># Scaffold a new project</span>
                  {"\n"}
                  <span className="syn-fn">npx</span>{" "}
                  <span className="syn-const">levi</span>{" "}
                  <span className="syn-const">init</span>
                  {"\n\n"}
                  <span className="syn-cmt"># Build wrangler configs</span>
                  {"\n"}
                  <span className="syn-fn">npx</span>{" "}
                  <span className="syn-const">levi</span>{" "}
                  <span className="syn-const">build</span>
                  {"\n\n"}
                  <span className="syn-cmt"># Deploy everything</span>
                  {"\n"}
                  <span className="syn-fn">npx</span>{" "}
                  <span className="syn-const">levi</span>{" "}
                  <span className="syn-const">deploy</span>
                </code>
              </pre>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/getting-started"
              className="px-8 py-3 rounded-lg font-semibold text-white bg-wash-600 hover:bg-wash-500 transition-colors border-2 border-dashed border-wash-400 text-sm"
            >
              Read the Guide
            </Link>
            <a
              href="https://www.npmjs.com/package/@flarefound/levi"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-lg font-semibold text-denim-200 bg-denim-800/60 hover:bg-denim-700/60 transition-colors border border-denim-600 text-sm"
            >
              View on npm
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
