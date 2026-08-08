import Link from "next/link";
import { DocLayout } from "../../../components/DocLayout";
import { CodeBlock } from "../../../components/CodeBlock";

function CommandSection({
  name,
  description,
  children,
}: {
  name: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 id={name.replace(/\s+/g, "-").toLowerCase()}>
        <code className="inline-code text-lg">{`levi ${name}`}</code>
      </h2>
      <p>{description}</p>
      {children}
    </section>
  );
}

function FlagTable({
  flags,
}: {
  flags: { flag: string; alias?: string; desc: string; default?: string }[];
}) {
  return (
    <div className="overflow-x-auto mb-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-dashed border-denim-600">
            <th className="text-left py-2 pr-4 text-denim-300 font-semibold">Flag</th>
            <th className="text-left py-2 pr-4 text-denim-300 font-semibold">Alias</th>
            <th className="text-left py-2 pr-4 text-denim-300 font-semibold">Description</th>
            <th className="text-left py-2 text-denim-300 font-semibold">Default</th>
          </tr>
        </thead>
        <tbody className="text-denim-200">
          {flags.map((f) => (
            <tr key={f.flag} className="border-b border-dashed border-denim-800">
              <td className="py-2 pr-4">
                <code className="inline-code">{f.flag}</code>
              </td>
              <td className="py-2 pr-4 text-denim-400">
                {f.alias ? <code className="inline-code">{f.alias}</code> : "—"}
              </td>
              <td className="py-2 pr-4">{f.desc}</td>
              <td className="py-2 text-denim-400">{f.default || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CLIReferencePage() {
  return (
    <DocLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-denim-50">CLI Reference</h1>
          <span className="red-tab-h">9 commands</span>
        </div>
        <p className="text-denim-200 text-lg leading-relaxed max-w-2xl">
          Complete reference for every command in the Levi CLI. All commands
          are run from your project root where{" "}
          <code className="inline-code">levi.app.ts</code> lives.
        </p>
      </div>

      <div className="stitch-separator mb-10" />

      {/* Quick overview */}
      <div className="denim-pocket p-5 mb-10">
        <h3 style={{ marginTop: 0 }} className="text-sm font-bold text-denim-300 uppercase tracking-widest mb-3">
          All Commands
        </h3>
          <div className="grid sm:grid-cols-3 gap-2 text-sm">
          <div><code className="inline-code">levi init</code> <span className="text-denim-400 ml-1">scaffold</span></div>
          <div><code className="inline-code">levi build</code> <span className="text-denim-400 ml-1">compile</span></div>
          <div><code className="inline-code">levi dev</code> <span className="text-denim-400 ml-1">local dev</span></div>
          <div><code className="inline-code">levi deploy</code> <span className="text-denim-400 ml-1">ship</span></div>
          <div><code className="inline-code">levi provision</code> <span className="text-denim-400 ml-1">create infra</span></div>
          <div><code className="inline-code">levi graph</code> <span className="text-denim-400 ml-1">visualize</span></div>
          <div><code className="inline-code">levi eject</code> <span className="text-denim-400 ml-1">escape hatch</span></div>
          <div><code className="inline-code">levi diff</code> <span className="text-denim-400 ml-1">compare</span></div>
          <div><code className="inline-code">levi dashboard</code> <span className="text-denim-400 ml-1">TUI</span></div>
        </div>
      </div>

      {/* ── levi init ──────────────────────────────────────────── */}
      <CommandSection
        name="init"
        description="Scaffold a new Levi project with interactive prompts or flags. Creates the project directory, levi.app.ts, package.json, and the initial worker/framework files."
      >
        <CodeBlock title="Usage" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi init</span>{" "}
          <span className="syn-cmt">[project-name]</span>{" "}
          <span className="syn-cmt">[flags]</span>
        </CodeBlock>

        <FlagTable
          flags={[
            { flag: "--template", alias: "-t", desc: "Starter template to use", default: "minimal" },
            { flag: "--framework", alias: "-f", desc: "Project flavor (tanstack, hono, raw)", default: "prompt" },
            { flag: "--package-manager", alias: "-p", desc: "npm, pnpm, yarn, or bun", default: "auto-detect" },
            { flag: "--git", desc: "Initialize a git repository", default: "true" },
            { flag: "--install", desc: "Install dependencies after scaffold", default: "true" },
            { flag: "--yes", alias: "-y", desc: "Accept all defaults, skip prompts", default: "false" },
          ]}
        />

        <h3>Framework Options</h3>
        <p>
          When prompted (or using <code className="inline-code">--framework</code>), you can choose:
        </p>
        <ul>
          <li>
            <strong>TanStack SPA</strong> — Recommended for full-stack apps. Scaffolds a
            Vite + React 19 + TanStack Query + TanStack Router SPA frontend with a
            Hono API worker. Plain React, pure client-side.
          </li>
          <li>
            <strong>hono</strong> — Pure API project. Scaffolds only a Hono-based
            worker with no frontend.
          </li>
          <li>
            <strong>raw</strong> — Plain Worker with no framework. Pair with your
            own Vite setup for a{" "}
            <Link href="/examples/react" className="text-wash-400 hover:text-wash-300">
              plain React 19 SPA
            </Link>
            .
          </li>
        </ul>

        <CodeBlock title="Example output" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi init my-app --framework tanstack</span>
          {"\n\n"}
          {"  Creating project in ./my-app"}{"\n"}
          {"  Scaffolding React SPA frontend..."}{"\n"}
          {"  Scaffolding Hono API worker..."}{"\n"}
          {"  Writing levi.app.ts..."}{"\n"}
          {"  Installing dependencies..."}{"\n\n"}
          <span className="syn-str">{"  Done! cd my-app && levi dev to start."}</span>
        </CodeBlock>

        <h3>What Gets Generated</h3>
        <CodeBlock title="Project structure" lang="bash">
          <span className="syn-const">my-app/</span>
          {"\n"}
          {"  levi.app.ts           "}
          <span className="syn-cmt"># App graph definition</span>
          {"\n"}
          {"  package.json"}{"\n"}
          {"  tsconfig.json"}{"\n"}
          {"  src/"}{"\n"}
          {"    api/"}{"\n"}
          {"      index.ts          "}
          <span className="syn-cmt"># Hono API worker</span>
          {"\n"}
          {"    web/                "}
          <span className="syn-cmt"># React SPA (if frontend selected)</span>
          {"\n"}
          {"      main.tsx"}{"\n"}
          {"      app/"}{"\n"}
          {"      components/"}{"\n"}
        </CodeBlock>
      </CommandSection>

      <div className="stitch-separator my-6" />

      {/* ── levi build ─────────────────────────────────────────── */}
      <CommandSection
        name="build"
        description="Parse levi.app.ts, construct the App Graph, and generate wrangler.jsonc configs for every worker into the .levi/ directory."
      >
        <CodeBlock title="Usage" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi build</span>{" "}
          <span className="syn-cmt">[flags]</span>
        </CodeBlock>

        <FlagTable
          flags={[
            { flag: "--config", alias: "-c", desc: "Path to app definition file", default: "levi.app.ts" },
            { flag: "--env", alias: "-e", desc: "Target environment (e.g., production, staging)", default: "none" },
            { flag: "--filter", alias: "-f", desc: "Build only specific workers (comma-separated)", default: "all" },
          ]}
        />

        <CodeBlock title="Example output" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi build</span>
          {"\n\n"}
          {"  Building Levi app...\n"}{"\n"}
          {"  \u2713 Generated api/wrangler.jsonc\n"}{"\n"}
          {"  \u2713 Generated web/wrangler.jsonc\n"}{"\n"}
          {"  \u2713 Generated log-sink/wrangler.jsonc\n"}{"\n"}
          {"  \u2713 Generated graph.json\n"}{"\n"}
          {"  \u2713 Generated zones/acme.com.rules.json\n"}{"\n"}
          {"  Build complete: 2 worker(s), 9 total resource(s), 1 zone manifest(s)\n"}
        </CodeBlock>

        <h3>Output Structure</h3>
        <p>
          The <code className="inline-code">.levi/</code> directory contains
          one subdirectory per worker \u2014 including tail workers, which get
          their own configs \u2014 each with a{" "}
          <code className="inline-code">wrangler.jsonc</code>. With{" "}
          <code className="inline-code">--env staging</code>, output goes to{" "}
          <code className="inline-code">.levi/staging/</code>. The directory also
          contains <code className="inline-code">graph.json</code> (the
          serialized DAG) and, when the app declares{" "}
          <Link href="/docs/edge-rules" className="text-wash-400 hover:text-wash-300">
            edge rules or snippets
          </Link>
          , one <code className="inline-code">zones/&lt;zone&gt;.rules.json</code>{" "}
          desired-state manifest per zone.
        </p>
      </CommandSection>

      <div className="stitch-separator my-6" />

      {/* ── levi dev ───────────────────────────────────────────── */}
      <CommandSection
        name="dev"
        description="Start local development servers for all workers (or a filtered subset). Spawns wrangler dev under the hood, with live reload and local bindings."
      >
        <CodeBlock title="Usage" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi dev</span>{" "}
          <span className="syn-cmt">[flags]</span>
        </CodeBlock>

        <FlagTable
          flags={[
            { flag: "--env", alias: "-e", desc: "Target environment (e.g., staging, production)", default: "none" },
            { flag: "--filter", alias: "-f", desc: "Run only specific workers (comma-separated)", default: "all" },
            { flag: "--port", alias: "-p", desc: "Base port for the first worker", default: "8787" },
          ]}
        />

        <CodeBlock title="Example — full stack" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi dev</span>
          {"\n\n"}
          {"  [api] Starting wrangler dev on port 8787...\n"}{"\n"}
          {"  [web] Starting wrangler dev on port 8788...\n"}{"\n"}
          {"  [worker] Starting wrangler dev on port 8789...\n\n"}{"\n"}
          {"  Built 3 worker config(s) to .levi/\n"}{"\n"}
          {"  Running 3 worker(s) in dev mode. Press Ctrl+C to stop.\n"}{"\n"}
          {"  Service bindings active: web -> api"}{"\n"}
          <span className="syn-str">{"  Ready. Watching for changes..."}</span>
        </CodeBlock>

        <CodeBlock title="Example — filtered" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi dev --filter api,web</span>
          {"\n\n"}
          {"  Starting 2 workers (filtered)..."}{"\n"}
          {"    api       -> http://localhost:8787"}{"\n"}
          {"    web       -> http://localhost:8788"}{"\n\n"}
          <span className="syn-str">{"  Ready. Watching for changes..."}</span>
        </CodeBlock>

        <p>
          Under the hood, <code className="inline-code">levi dev</code> runs{" "}
          <code className="inline-code">levi build</code> first, then spawns{" "}
          <code className="inline-code">wrangler dev</code> for each worker
          using the generated configs. Local service bindings are wired up
          automatically between workers using the{" "}
          <code className="inline-code">--service</code> flag.
        </p>
      </CommandSection>

      <div className="stitch-separator my-6" />

      {/* ── levi deploy ────────────────────────────────────────── */}
      <CommandSection
        name="deploy"
        description="Build and deploy all workers to Cloudflare in topological order. Provisions any new resources first, then deploys workers using wrangler."
      >
        <CodeBlock title="Usage" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi deploy</span>{" "}
          <span className="syn-cmt">[flags]</span>
        </CodeBlock>

        <FlagTable
          flags={[
            { flag: "--env", alias: "-e", desc: "Target environment", default: "production" },
            { flag: "--filter", alias: "-f", desc: "Deploy only specific workers", default: "all" },
            { flag: "--detach", alias: "-d", desc: "Don't wait for deployment to complete", default: "false" },
            { flag: "--skip-provision", desc: "Skip resource provisioning step", default: "false" },
          ]}
        />

        <CodeBlock title="Example output" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi deploy --env production</span>
          {"\n\n"}
          {"  Loading Levi app..."}{"\n"}
          {"  ✓ Build complete: 5 resources, 3 workers."}{"\n"}
          {"  ✓ Built 3 worker config(s)"}{"\n"}
          {"  Resources to provision:"}{"\n\n"}
          {"    D1:"}{"\n"}
          {"      - main-db"}{"\n\n"}
          {"    KV:"}{"\n"}
          {"      - cache"}{"\n\n"}
          {"    R2:"}{"\n"}
          {"      - uploads"}{"\n\n"}
          {"    QUEUE:"}{"\n"}
          {"      - background-tasks"}{"\n\n"}
          {"    VECTORIZE:"}{"\n"}
          {"      - embeddings"}{"\n\n"}
          {"  Starting provisioning..."}{"\n"}
          {"  Creating d1: main-db"}{"\n"}
          {"    Created D1: main-db {\"database_id\":\"fa9ee4c0-...\"}"}{"\n"}
          {"    Applying D1 migrations..."}{"\n"}
          {"  Creating kv: cache"}{"\n"}
          {"    Created KV: cache {\"id\":\"7ff98c11-...\"}"}{"\n"}
          {"  Creating r2: uploads"}{"\n"}
          {"    Created R2: uploads {\"bucket_name\":\"uploads\"}"}{"\n"}
          {"  Creating queues: background-tasks"}{"\n"}
          {"    Created queue 'background-tasks'"}{"\n"}
          {"  Creating vectorize: embeddings"}{"\n"}
          {"    Created Vectorize: embeddings {\"index_name\":\"embeddings\"}"}{"\n"}
          {"  Re-generating configs with real resource IDs..."}{"\n"}
          {"  ✓ Configs updated with real resource IDs"}{"\n"}
          {"  Deploy order: api -> background -> web"}{"\n"}
          {"  Starting deploy..."}{"\n"}
          {"  Deploying api..."}{"\n"}
          {"    ✓ Deployed api"}{"\n"}
          {"  Deploying background..."}{"\n"}
          {"    ✓ Deployed background"}{"\n"}
          {"  Deploying web..."}{"\n"}
          {"    ✓ Deployed web"}{"\n"}
          {"  ✓ Deployment complete: 3/3 worker(s) deployed successfully"}
        </CodeBlock>

        <h3>Topological Ordering</h3>
        <p>
          Deployment order respects the App Graph. A worker with service
          bindings to another worker is deployed <em>after</em> its
          dependency. This ensures that service binding targets are live
          before consumers attempt to reach them.
        </p>
      </CommandSection>

      <div className="stitch-separator my-6" />

      {/* ── levi provision ─────────────────────────────────────── */}
      <CommandSection
        name="provision"
        description="Create or update Cloudflare resources without deploying workers: D1, KV, R2, Queues, Vectorize, dispatch namespaces, and the Secrets Store via wrangler; DNS, Email Routing, and edge rules/snippets via the Cloudflare API."
      >
        <CodeBlock title="Usage" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi provision</span>{" "}
          <span className="syn-cmt">[flags]</span>
        </CodeBlock>

        <FlagTable
          flags={[
            { flag: "--env", alias: "-e", desc: "Target environment", default: "production" },
            { flag: "--filter", alias: "-f", desc: "Provision only specific resources (comma-separated)", default: "all" },
          ]}
        />

        <CodeBlock title="Example output" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi provision</span>
          {"\n\n"}
          {"  Resources to provision:"}{"\n\n"}
          {"    D1:"}{"\n"}
          {"      - main-db"}{"\n\n"}
          {"    KV:"}{"\n"}
          {"      - cache"}{"\n\n"}
          {"    R2:"}{"\n"}
          {"      - uploads"}{"\n\n"}
          {"    QUEUE:"}{"\n"}
          {"      - background-tasks"}{"\n\n"}
          {"    VECTORIZE:"}{"\n"}
          {"      - embeddings"}{"\n\n"}
          {"    DISPATCH-NAMESPACE:"}{"\n"}
          {"      - customers-prod"}{"\n\n"}
          {"    SECRETS STORE:"}{"\n"}
          {"      - stripe-api-key (store: default)"}{"\n\n"}
          {"    EDGE RULES & SNIPPETS (via Cloudflare API):"}{"\n"}
          {"      - redirect: www-to-apex"}{"\n"}
          {"      - waf: challenge-bots"}{"\n\n"}
          {"  Creating d1: main-db"}{"\n"}
          {"    Created D1: main-db {\"database_id\":\"fa9ee4c0-...\"}"}{"\n"}
          {"    Applying D1 migrations..."}{"\n"}
          {"  Creating kv: cache"}{"\n"}
          {"    Created KV: cache {\"id\":\"7ff98c11-...\"}"}{"\n"}
          {"  Creating r2: uploads"}{"\n"}
          {"    Created R2: uploads {\"bucket_name\":\"uploads\"}"}{"\n"}
          {"  Creating queues: background-tasks"}{"\n"}
          {"    Created queue 'background-tasks'"}{"\n"}
          {"  Creating vectorize: embeddings"}{"\n"}
          {"    Created Vectorize: embeddings {\"index_name\":\"embeddings\"}"}{"\n"}
          {"  Creating dispatch-namespace: customers-prod"}{"\n"}
          {"  ✓ Secrets Store \"default\" ready (2e2a8231...)"}{"\n"}
          {"  Syncing edge rules via Cloudflare API..."}{"\n"}
          {"  ✓ acme.com http_request_dynamic_redirect: +1 ~0 -0 =0"}{"\n"}
          {"  ✓ acme.com http_request_firewall_custom: +1 ~0 -0 =0 (2 unmanaged rule(s) untouched)"}{"\n"}
          {"  Updating worker configs with real resource IDs..."}{"\n"}
          {"  ✓ Provisioning complete."}
        </CodeBlock>

        <h3>API-Provisioned Resources</h3>
        <p>
          Domains, Email Routing, edge rules, and snippets are provisioned
          through the Cloudflare API and require{" "}
          <code className="inline-code">CLOUDFLARE_API_TOKEN</code>. When the
          token is missing, those steps downgrade to warnings — wrangler-based
          provisioning still runs. Edge rule syncs only ever touch rules
          tagged <code className="inline-code">Managed by Levi:</code>; use{" "}
          <code className="inline-code">--dry-run</code> to list everything
          without creating anything.
        </p>
      </CommandSection>

      <div className="stitch-separator my-6" />

      {/* ── levi graph ─────────────────────────────────────────── */}
      <CommandSection
        name="graph"
        description="Print a terminal-friendly visualization of the App Graph. Shows all resources, their bindings, and the resolved deployment order."
      >
        <CodeBlock title="Usage" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi graph</span>
        </CodeBlock>

        <CodeBlock title="Example output" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi graph</span>
          {"\n\n"}
          {"  acme-saas"}{"\n"}
          {"  ========="}{"\n\n"}
          {"  Resources:"}{"\n"}
          {"    [D1]     main-db"}{"\n"}
          {"    [KV]     cache"}{"\n"}
          {"    [R2]     uploads"}{"\n"}
          {"    [Queue]  background-tasks"}{"\n"}
          {"    [Worker] api"}{"\n"}
          {"    [Worker] background"}{"\n"}
          {"    [Worker] web"}{"\n\n"}
          {"  Bindings:"}{"\n"}
          {"    api <- main-db, cache, uploads, background-tasks"}{"\n"}
          {"    background <- main-db, background-tasks (consumer)"}{"\n"}
          {"    web <- api (service binding)"}{"\n\n"}
          {"  Deploy order:"}{"\n"}
          {"    1. main-db, cache, uploads, background-tasks  (provision)"}{"\n"}
          {"    2. api, background                            (deploy)"}{"\n"}
          {"    3. web                                        (deploy)"}{"\n"}
        </CodeBlock>
      </CommandSection>

      <div className="stitch-separator my-6" />

      {/* ── levi eject ─────────────────────────────────────────── */}
      <CommandSection
        name="eject"
        description="Copy all generated wrangler.jsonc files out of .levi/ into your project root. After ejecting, you can use wrangler directly and remove Levi entirely."
      >
        <CodeBlock title="Usage" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi eject</span>
        </CodeBlock>

        <CodeBlock title="Example output" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi eject</span>
          {"\n\n"}
          {"  This will copy generated configs to your project root."}{"\n"}
          {"  You can then use wrangler directly."}{"\n\n"}
          {"  Continue? (y/N) y"}{"\n\n"}
          {"  Copying..."}{"\n"}
          {"    .levi/api/wrangler.jsonc -> ./api/wrangler.jsonc"}{"\n"}
          {"    .levi/web/wrangler.jsonc -> ./web/wrangler.jsonc"}{"\n"}
          {"    .levi/background/wrangler.jsonc -> ./background/wrangler.jsonc"}{"\n\n"}
          {"  Adding deploy scripts to package.json..."}{"\n"}
          {"    \"deploy:api\": \"cd api && npx wrangler deploy\""}{"\n"}
          {"    \"deploy:web\": \"cd web && npx wrangler deploy\""}{"\n"}
          {"    \"deploy:background\": \"cd background && npx wrangler deploy\""}{"\n\n"}
          <span className="syn-str">{"  Ejected. You can now remove @flarefound/levi from your dependencies."}</span>
        </CodeBlock>

        <h3>What Gets Copied</h3>
        <ul>
          <li>
            <code className="inline-code">wrangler.jsonc</code> for each
            worker, with all binding IDs fully resolved
          </li>
          <li>
            D1 migration files referenced in the configs
          </li>
          <li>
            Deploy scripts added to your{" "}
            <code className="inline-code">package.json</code>
          </li>
        </ul>

        <p>
          Ejecting requires a confirmation prompt. The original{" "}
          <code className="inline-code">levi.app.ts</code> is not deleted —
          you can always go back by running{" "}
          <code className="inline-code">levi build</code> again.
        </p>
      </CommandSection>

      <div className="stitch-separator my-6" />

      {/* ── levi diff ──────────────────────────────────────────── */}
      <CommandSection
        name="diff"
        description="Compare generated worker configs against deployed versions, and declared edge rules against the live zone state. Read-only — the dry run for both deploy and provision."
      >
        <CodeBlock title="Usage" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi diff</span>{" "}
          <span className="syn-cmt">[flags]</span>
        </CodeBlock>

        <FlagTable
          flags={[
            { flag: "--env", alias: "-e", desc: "Target environment (production, staging, etc.)", default: "production" },
            { flag: "--worker", alias: "-w", desc: "Compare a specific worker only", default: "all" },
            { flag: "--local", desc: "Compare against local configs only (skip remote)", default: "false" },
            { flag: "--json", desc: "Output diff as machine-readable JSON", default: "false" },
          ]}
        />

        <CodeBlock title="Example output" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi diff</span>
          {"\n\n"}
          {"  Levi Diff \u2014 3 worker(s), 7 resource(s)\n"}{"\n"}
          {"  ~ api/wrangler.jsonc (remote diff)\n"}{"\n"}
          {"    deployed: 4/10/2026 2:34:56 PM  id: xxxxx-xxxx\n"}{"\n"}
          {"    (differs from deployed version)\n"}{"\n\n"}
          {"  = web/wrangler.jsonc (unchanged)\n"}{"\n"}
          {"    no changes\n"}{"\n\n"}
          {"  ~ background/wrangler.jsonc (local diff)\n"}{"\n"}
          {"    removed:\n"}{"\n"}
          {"      - kv_namespaces: []\n"}{"\n"}
          {"    added:\n"}{"\n"}
          {"      + kv_namespaces:\n"}{"\n"}
          {"        - binding: CACHE\n"}{"\n"}
          {"        - id: xxxxx\n"}{"\n\n"}
          {"  Zone: acme.com (edge rules)\n"}{"\n"}
          {"    http_request_dynamic_redirect:\n"}{"\n"}
          {"      + www-to-apex\n"}{"\n"}
          {"    http_request_firewall_custom: (2 unmanaged untouched)\n"}{"\n"}
          {"      = challenge-bots\n"}
        </CodeBlock>

        <p>
          Levi diff shows three levels of comparison: <strong>local</strong>{" "}
          (generated config vs. what is on disk in <code className="inline-code">.levi/</code>),{" "}
          <strong>remote</strong> (generated config vs. what is actually deployed
          on Cloudflare), and <strong>zone</strong> (declared{" "}
          <Link href="/docs/edge-rules" className="text-wash-400 hover:text-wash-300">
            edge rules &amp; snippets
          </Link>{" "}
          vs. the live zone, using the exact same plan{" "}
          <code className="inline-code">levi provision</code> would apply).
          Remote comparison requires an active Wrangler login; the zone section
          requires <code className="inline-code">CLOUDFLARE_API_TOKEN</code> and
          is skipped with <code className="inline-code">--local</code>.{" "}
          <code className="inline-code">--json</code> includes a{" "}
          <code className="inline-code">zones</code> array alongside the worker
          diffs.
        </p>
      </CommandSection>

      <div className="stitch-separator my-6" />

      {/* ── levi dashboard ─────────────────────────────────────── */}
      <CommandSection
        name="dashboard"
        description="ASCII dashboard showing your application topology, bindings, and resource overview. Run in your terminal alongside levi dev."
      >
        <CodeBlock title="Usage" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi dashboard</span>{" "}
          <span className="syn-cmt">[flags]</span>
        </CodeBlock>

        <FlagTable
          flags={[
            { flag: "--watch", alias: "-w", desc: "Watch for file changes and refresh", default: "false" },
          ]}
        />

        <CodeBlock title="Example output" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi dashboard</span>
          {"\n\n"}
          {"  \x1b[1m Levi Dashboard \u2014 my-saas\x1b[0m\n"}{"\n"}
          {"  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n"}{"\n"}
          {"    3 workers  \u00b7  7 resources  \u00b7  9 bindings\n"}{"\n"}
          {"  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n"}{"\n"}
          {"  \u2502  WORKERS                                \u2502  BINDINGS                       \u2502\n"}{"\n"}
          {"  \u2502  api     ./src/api/index.ts     [TW]  \u2502  api.DB \u2192 DB  main-db        \u2502\n"}{"\n"}
          {"  \u2502  web     ./src/web/entry.tsx    2     \u2502  api.CACHE \u2192 KV  cache         \u2502\n"}{"\n"}
          {"  \u2502  worker  ./src/worker/index.ts        \u2502  api.UPLOADS \u2192 R2  uploads        \u2502\n"}{"\n"}
          {"  \u2502                                         \u2502  web.API \u2192 Worker  api          \u2502\n"}{"\n"}
          {"  \u2502  INFRASTRUCTURE                           \u2502                                  \u2502\n"}{"\n"}
          {"  \u2502  DB  main-db                            \u2502  RESOURCES                       \u2502\n"}{"\n"}
          {"  \u2502  KV  cache                              \u2502  >> api     >> web     >> worker   \u2502\n"}{"\n"}
          {"  \u2502  S3  uploads                            \u2502  DB cache   S3 uploads MQ queue    \u2502\n"}{"\n"}
          {"  \u2502  MQ  background-tasks                   \u2502                                  \u2502\n"}{"\n"}
          {"  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n"}{"\n"}
          {"  \u25bc Ctrl+C to exit  \u00b7 levi graph for text mode  \u00b7 levi.app.ts\n"}
        </CodeBlock>

        <p>
          The dashboard shows workers, infrastructure resources, and all bindings
          in a terminal-native ASCII layout. Use <code className="inline-code">--watch</code> to
          keep it open while you edit <code className="inline-code">levi.app.ts</code>.
        </p>
      </CommandSection>

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
          href="/examples/react"
          className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
        >
          React 19 SPA →
        </Link>
        <Link
          href="/docs/workers"
          className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
        >
          Workers →
        </Link>
      </div>
    </DocLayout>
  );
}
