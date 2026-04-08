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
          <div><code className="inline-code">levi dashboard</code> <span className="text-denim-400 ml-1">Phase 3</span></div>
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
            { flag: "--framework", alias: "-f", desc: "Frontend framework (vinext, none)", default: "prompt" },
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
            <strong>vinext</strong> — Recommended. Scaffolds a Vite + React 19 SSR frontend with
            Cloudflare Workers support, plus a Hono API worker.
          </li>
          <li>
            <strong>none</strong> — Pure API project. Scaffolds only a Hono-based
            worker with no frontend.
          </li>
        </ul>

        <CodeBlock title="Example output" lang="bash">
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
          <span className="syn-cmt"># vinext app (if framework selected)</span>
          {"\n"}
          {"      app/"}{"\n"}
          {"      components/"}{"\n"}
          {"      entry.server.tsx"}{"\n"}
          {"      entry.client.tsx"}{"\n"}
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
            { flag: "--outdir", alias: "-o", desc: "Output directory for build artifacts", default: ".levi/" },
            { flag: "--verbose", alias: "-v", desc: "Show detailed build steps", default: "false" },
          ]}
        />

        <CodeBlock title="Example output" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi build</span>
          {"\n\n"}
          {"  Parsing levi.app.ts..."}{"\n"}
          {"  Building App Graph: 5 resources, 7 bindings"}{"\n"}
          {"  Topological sort: main-db -> cache -> uploads -> api -> web"}{"\n"}
          {"  Generating configs..."}{"\n"}
          {"    .levi/api/wrangler.jsonc"}{"\n"}
          {"    .levi/web/wrangler.jsonc"}{"\n"}
          {"    .levi/background/wrangler.jsonc"}{"\n"}
          {"    .levi/graph.json"}{"\n"}
          {"    .levi/provision-plan.json"}{"\n\n"}
          <span className="syn-str">{"  Build complete (143ms)"}</span>
        </CodeBlock>

        <h3>Output Structure</h3>
        <p>
          The <code className="inline-code">.levi/</code> directory contains
          one subdirectory per worker, each with a{" "}
          <code className="inline-code">wrangler.jsonc</code>. It also
          contains <code className="inline-code">graph.json</code> (the
          serialized DAG) and{" "}
          <code className="inline-code">provision-plan.json</code> (the list
          of resources that need to be created on Cloudflare).
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
            { flag: "--filter", alias: "-f", desc: "Run only specific workers (comma-separated)", default: "all" },
            { flag: "--port", alias: "-p", desc: "Base port for the first worker", default: "8787" },
            { flag: "--local", desc: "Force local-only mode (no remote bindings)", default: "true" },
            { flag: "--remote", desc: "Use remote Cloudflare bindings for dev", default: "false" },
            { flag: "--verbose", alias: "-v", desc: "Show wrangler output for all workers", default: "false" },
          ]}
        />

        <CodeBlock title="Example — full stack" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi dev</span>
          {"\n\n"}
          {"  Starting 3 workers..."}{"\n"}
          {"    api       -> http://localhost:8787"}{"\n"}
          {"    web       -> http://localhost:8788"}{"\n"}
          {"    background -> (queue consumer, no HTTP)"}{"\n\n"}
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
            { flag: "--dry-run", desc: "Show what would be deployed without deploying", default: "false" },
            { flag: "--skip-provision", desc: "Skip resource provisioning step", default: "false" },
          ]}
        />

        <CodeBlock title="Example output" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi deploy --env production</span>
          {"\n\n"}
          {"  Building App Graph..."}{"\n"}
          {"  Provisioning resources..."}{"\n"}
          {"    D1: main-db           [exists]"}{"\n"}
          {"    KV: cache             [exists]"}{"\n"}
          {"    R2: uploads           [created]"}{"\n"}
          {"    Queue: background-tasks [exists]"}{"\n\n"}
          {"  Deploying workers (topological order)..."}{"\n"}
          {"    [1/3] api             deployed  https://api.acme.workers.dev"}{"\n"}
          {"    [2/3] background      deployed  (queue consumer)"}{"\n"}
          {"    [3/3] web             deployed  https://web.acme.workers.dev"}{"\n\n"}
          <span className="syn-str">{"  All 3 workers deployed successfully."}</span>
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
        description="Create or update Cloudflare resources (D1, KV, R2, Queues, etc.) without deploying workers. Useful for setting up infrastructure before the first deploy."
      >
        <CodeBlock title="Usage" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi provision</span>{" "}
          <span className="syn-cmt">[flags]</span>
        </CodeBlock>

        <FlagTable
          flags={[
            { flag: "--dry-run", desc: "Preview the provisioning plan without executing", default: "false" },
            { flag: "--env", alias: "-e", desc: "Target environment", default: "production" },
            { flag: "--force", desc: "Re-create resources even if they exist", default: "false" },
          ]}
        />

        <CodeBlock title="Example — dry run" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi provision --dry-run</span>
          {"\n\n"}
          {"  Provisioning plan:"}{"\n"}
          {"    [create] D1 Database: main-db"}{"\n"}
          {"    [create] KV Namespace: cache"}{"\n"}
          {"    [create] R2 Bucket: uploads"}{"\n"}
          {"    [create] Queue: background-tasks"}{"\n\n"}
          <span className="syn-cmt">{"  Dry run — no resources were created."}</span>
        </CodeBlock>

        <CodeBlock title="Example — execute" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi provision</span>
          {"\n\n"}
          {"  Provisioning 4 resources..."}{"\n"}
          {"    D1: main-db              [created] id: a1b2c3d4-..."}{"\n"}
          {"    KV: cache                [created] id: e5f6g7h8-..."}{"\n"}
          {"    R2: uploads              [created]"}{"\n"}
          {"    Queue: background-tasks  [created]"}{"\n\n"}
          <span className="syn-str">{"  All resources provisioned. Run levi deploy to ship."}</span>
        </CodeBlock>
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
        description="Compare the current generated configs in .levi/ against the previously deployed versions. Useful for reviewing changes before deploying."
      >
        <CodeBlock title="Usage" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi diff</span>{" "}
          <span className="syn-cmt">[flags]</span>
        </CodeBlock>

        <FlagTable
          flags={[
            { flag: "--worker", alias: "-w", desc: "Compare a specific worker only", default: "all" },
            { flag: "--json", desc: "Output diff as JSON", default: "false" },
          ]}
        />

        <CodeBlock title="Example output" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi diff</span>
          {"\n\n"}
          {"  Comparing .levi/ with last deployed state..."}{"\n\n"}
          {"  api/wrangler.jsonc:"}{"\n"}
          {"    + d1_databases[0].binding: ANALYTICS_DB"}{"\n"}
          {"    + d1_databases[0].database_id: \"f9a8b7c6...\""}{"\n\n"}
          {"  web/wrangler.jsonc:"}{"\n"}
          {"    (no changes)"}{"\n\n"}
          {"  background/wrangler.jsonc:"}{"\n"}
          {"    (no changes)"}{"\n"}
        </CodeBlock>
      </CommandSection>

      <div className="stitch-separator my-6" />

      {/* ── levi dashboard ─────────────────────────────────────── */}
      <CommandSection
        name="dashboard"
        description="Open the Levi Dashboard — a local web UI for visualizing your App Graph, inspecting bindings, and monitoring deployments. This is a Phase 3 roadmap feature."
      >
        <CodeBlock title="Usage" lang="bash">
          <span className="syn-fn">$</span>{" "}
          <span className="syn-const">levi dashboard</span>
        </CodeBlock>

        <div className="denim-pocket p-5 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="red-tab-h">Phase 3</span>
            <span className="text-sm text-denim-300 font-semibold">Roadmap</span>
          </div>
          <p className="text-sm text-denim-300 mb-0">
            The dashboard is planned for Phase 3 of the Levi roadmap. It
            will provide a visual graph editor, real-time deployment status,
            log tailing, and resource metrics — all in a local web UI
            accessible at{" "}
            <code className="inline-code">http://localhost:4000</code>.
          </p>
        </div>
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
          href="/docs/vinext"
          className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
        >
          vinext Integration →
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
