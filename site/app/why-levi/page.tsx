import { DocLayout } from "../../components/DocLayout";
import Link from "next/link";

const comparisonRows = [
  {
    dimension: "Mental model",
    levi: "AppHost: one typed file declares the whole topology",
    aspire: "AppHost: processes, containers, endpoints",
    sst: "IaC components on Pulumi engine",
    alchemy: "TypeScript-native IaC resources",
    terraform: "HCL resource graph",
    wrangler: "One config file per worker",
  },
  {
    dimension: "Cloudflare bindings model",
    levi: "First-class (D1, KV, R2, DO, Queues, AI, …)",
    aspire: "Not modeled — ports & connection strings",
    sst: "Covered via Pulumi provider",
    alchemy: "Covered",
    terraform: "Covered, verbose",
    wrangler: "First-class",
  },
  {
    dimension: "State ownership",
    levi: "None — wrangler configs are the artifact",
    aspire: "Deployment manifests",
    sst: "Pulumi state file",
    alchemy: "State files",
    terraform: "tfstate",
    wrangler: "None",
  },
  {
    dimension: "Eject path",
    levi: "levi eject → plain wrangler project, zero trace",
    aspire: "—",
    sst: "Locked to SST constructs",
    alchemy: "Manual rewrite",
    terraform: "Manual rewrite",
    wrangler: "n/a (already there)",
  },
  {
    dimension: "Zone edge rules (WAF, cache, redirects)",
    levi: "Declared in-app, synced via Rulesets API",
    aspire: "—",
    sst: "—",
    alchemy: "Partial",
    terraform: "Yes (separate stack)",
    wrangler: "—",
  },
  {
    dimension: "Workers for Platforms",
    levi: "addDispatchNamespace()",
    aspire: "—",
    sst: "—",
    alchemy: "—",
    terraform: "Partial",
    wrangler: "CLI only",
  },
  {
    dimension: "Drift detection",
    levi: "levi diff (workers + zone rules)",
    aspire: "—",
    sst: "pulumi preview",
    alchemy: "Plan step",
    terraform: "terraform plan",
    wrangler: "—",
  },
  {
    dimension: "Local dev",
    levi: "wrangler dev / miniflare (native)",
    aspire: "DCP orchestrator",
    sst: "sst dev",
    alchemy: "Via wrangler",
    terraform: "—",
    wrangler: "Native",
  },
];

export default function WhyLeviPage() {
  return (
    <DocLayout>
      <div className="space-y-10">
        <header>
          <div className="flex items-center gap-3 mb-4">
            <span className="red-tab-h">positioning</span>
            <span className="text-xs text-denim-500 font-mono">Why Levi</span>
          </div>
          <h1 className="text-4xl font-bold text-denim-50 stitch-border-b pb-4">
            Why Levi?
          </h1>
          <p className="mt-4 text-denim-300 text-lg leading-relaxed">
            Aspire went polyglot. SST and Alchemy already speak TypeScript.
            Terraform has a Cloudflare provider. So why does Levi exist? Because
            none of them are built for the thing Cloudflare actually is.
          </p>
        </header>

        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Cloudflare is not a container platform
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Aspire&apos;s resource model — now available in TypeScript as well as
            C# — is fundamentally <strong className="text-wash-300">processes,
            containers, endpoints, and connection strings</strong>. It
            orchestrates things that listen on ports and wires them together
            with environment variables. That model fits Azure Container Apps
            and Kubernetes beautifully. It does not fit Workers at all: there
            are no ports, no connection strings, and no containers — there is
            a <strong className="text-wash-300">bindings graph</strong>. D1
            databases, KV namespaces, R2 buckets, Durable Objects, queues,
            service bindings, workflows, compatibility dates, routes, and
            custom domains. Levi&apos;s entire type system is that graph.
          </p>
          <p className="text-denim-300 leading-relaxed mb-4">
            Aspire validating the &quot;apphost-as-code&quot; category is good
            for Levi — it teaches the market the mental model. Levi is that
            model, native to Cloudflare: <em>Aspire for Cloudflare</em> is
            still the honest one-line description.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            IaC owns your state. Levi refuses to.
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            SST and Alchemy are excellent TypeScript IaC tools, and both treat
            Cloudflare as a real target. But they share Terraform&apos;s core
            trade: <strong className="text-wash-300">they own a state file
            that stands between you and your infrastructure</strong>. Your
            deploys flow through their engine, and leaving means a migration
            project.
          </p>
          <p className="text-denim-300 leading-relaxed mb-4">
            Levi is deliberately not an IaC engine. It is a{" "}
            <strong className="text-wash-300">driver for Wrangler</strong>: it
            generates faithful <code className="inline-code">wrangler.jsonc</code>{" "}
            files you can read, check in, and keep.{" "}
            <code className="inline-code">levi diff</code> compares against live
            state instead of a state file.{" "}
            <code className="inline-code">levi eject</code> copies the generated
            configs into your project and removes Levi from your dependencies —
            a supported, first-class exit, not a threat. If Levi disappeared
            tomorrow, your project would still deploy with plain wrangler.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Levi goes where generalists don&apos;t
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Because Levi only does Cloudflare, it can afford to cover the
            entire platform — including the layers generalist tools skip:
          </p>
          <ul className="list-disc list-inside text-denim-300 space-y-2 mb-4">
            <li>
              <strong className="text-wash-300">
                <Link href="/docs/edge-rules" className="hover:text-wash-400">
                  Zone edge rules
                </Link>
              </strong>{" "}
              — redirects, cache rules, WAF custom rules, HTTP rate limiting,
              header transforms, and Snippets, declared next to the workers
              they protect and synced via the Rulesets API. Classically
              Terraform territory; now one file.
            </li>
            <li>
              <strong className="text-wash-300">
                <Link href="/docs/platforms" className="hover:text-wash-400">
                  Workers for Platforms
                </Link>
              </strong>{" "}
              — dispatch namespaces and outbound workers for multi-tenant
              SaaS, untouched by SST and Alchemy.
            </li>
            <li>
              <strong className="text-wash-300">
                <Link href="/docs/email" className="hover:text-wash-400">
                  Email
                </Link>
              </strong>{" "}
              — send_email bindings plus Email Routing provisioning, end to
              end.
            </li>
            <li>
              <strong className="text-wash-300">
                <Link href="/docs/bindings" className="hover:text-wash-400">
                  Every binding
                </Link>
              </strong>{" "}
              — Analytics Engine, Browser Rendering, rate limiters, Secrets
              Store, tail workers, containers, pipelines, workflows,
              Vectorize, Hyperdrive, AI. New Cloudflare primitives land in
              Levi fast, because tracking them is the whole job.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            The comparison, honestly
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            These are all good tools. The question is what you&apos;re
            building on.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-denim-700 text-left">
                  <th className="py-2 pr-4 text-denim-400 font-medium"></th>
                  <th className="py-2 pr-4 text-wash-300 font-semibold">Levi</th>
                  <th className="py-2 pr-4 text-denim-400 font-medium">Aspire</th>
                  <th className="py-2 pr-4 text-denim-400 font-medium">SST</th>
                  <th className="py-2 pr-4 text-denim-400 font-medium">Alchemy</th>
                  <th className="py-2 pr-4 text-denim-400 font-medium">Terraform</th>
                  <th className="py-2 pr-4 text-denim-400 font-medium">wrangler</th>
                </tr>
              </thead>
              <tbody className="text-denim-300">
                {comparisonRows.map((row) => (
                  <tr key={row.dimension} className="border-b border-denim-800 align-top">
                    <td className="py-2 pr-4 text-denim-400">{row.dimension}</td>
                    <td className="py-2 pr-4 text-wash-300">{row.levi}</td>
                    <td className="py-2 pr-4">{row.aspire}</td>
                    <td className="py-2 pr-4">{row.sst}</td>
                    <td className="py-2 pr-4">{row.alchemy}</td>
                    <td className="py-2 pr-4">{row.terraform}</td>
                    <td className="py-2 pr-4">{row.wrangler}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-denim-500 mt-3">
            &quot;—&quot; means not supported or not a goal of that tool.
            Corrections welcome —{" "}
            <a
              href="https://github.com/plsft/levi/issues"
              className="text-wash-400 hover:text-wash-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              open an issue
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            What Levi won&apos;t do
          </h2>
          <ul className="list-disc list-inside text-denim-300 space-y-2 mb-4">
            <li>
              <strong className="text-wash-300">Multi-cloud.</strong> Levi is
              Cloudflare-only, by design. If you need one tool spanning AWS
              and Cloudflare, use SST, Alchemy, or Terraform — genuinely.
            </li>
            <li>
              <strong className="text-wash-300">Own your deploys.</strong>{" "}
              <code className="inline-code">levi deploy</code> shells out to{" "}
              <code className="inline-code">wrangler deploy</code>. There is no
              proprietary pipeline to be locked into.
            </li>
            <li>
              <strong className="text-wash-300">Hide the platform.</strong>{" "}
              Levi is not a PaaS abstraction. Every option maps to a
              documented Cloudflare setting, and the escape hatch lets you
              write raw wrangler config when you need to.
            </li>
          </ul>
          <div className="bg-denim-900/50 border border-denim-700 rounded-md p-4 mt-4">
            <p className="text-sm text-denim-300">
              <strong className="text-thread-400">The bet:</strong> if you are
              all-in on Cloudflare, a tool that models Cloudflare natively —
              bindings to edge rules — beats a generalist adapter. One file,
              full type safety, zero lock-in.
            </p>
          </div>
        </section>

        <section className="pb-4">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/getting-started"
              className="inline-block px-5 py-2.5 bg-wash-600 hover:bg-wash-500 text-denim-950 font-semibold rounded-md transition-colors text-sm"
            >
              Get Started
            </Link>
            <Link
              href="/docs/edge-rules"
              className="inline-block px-5 py-2.5 border border-denim-600 hover:border-wash-400 text-denim-200 rounded-md transition-colors text-sm"
            >
              Explore Edge Rules
            </Link>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
