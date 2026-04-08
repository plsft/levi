import Link from "next/link";
import { DocLayout } from "../../../components/DocLayout";
import { CodeBlock } from "../../../components/CodeBlock";

export default function DomainsPage() {
  return (
    <DocLayout>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-denim-50">Domains & SSL</h1>
          <span className="red-tab-h">Network</span>
        </div>
        <p className="text-denim-200 text-lg leading-relaxed max-w-2xl">
          Attach custom domains to your Cloudflare Workers with automatic SSL
          certificate provisioning. Levi handles DNS records, SSL modes, WWW
          redirects, and worker routes — all from your app definition.
        </p>
      </div>

      <div className="stitch-separator mb-10" />

      {/* Overview */}
      <h2>Overview</h2>
      <p>
        Every Cloudflare Worker gets a default{" "}
        <span className="inline-code">*.workers.dev</span> subdomain, but
        production applications need custom domains. Levi's domain system
        lets you declare domains as resources in your app graph, automatically
        configuring DNS records, SSL certificates, and worker routes when you
        deploy.
      </p>
      <p>
        Domains in Levi require that the domain's DNS is already managed by
        Cloudflare (i.e., the zone exists in your account). Levi will create
        the appropriate DNS records and route rules — it will not transfer
        domain registration.
      </p>

      <div className="stitch-separator my-8" />

      {/* Adding Domains */}
      <h2>Adding Domains</h2>
      <p>
        Use <span className="inline-code">app.addDomain()</span> to attach a
        custom domain to your application. The domain is linked to a worker
        via the worker's route configuration.
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
        <span className="syn-str">"my-site"</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">domain</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-const">app</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">addDomain</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"example.com"</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">ssl</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"full_strict"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">redirectWww</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-const">true</span>
        <span className="syn-punc">,</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">worker</span>{" "}
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
        <span className="syn-str">"./src/web.ts"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">routes</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">[</span>
        <span className="syn-str">"example.com/*"</span>
        <span className="syn-punc">]</span>
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
        When you run <span className="inline-code">levi deploy</span>, Levi
        will:
      </p>
      <ul>
        <li>
          Create a CNAME DNS record pointing{" "}
          <span className="inline-code">example.com</span> to your worker.
        </li>
        <li>
          Set the zone SSL mode to{" "}
          <span className="inline-code">full_strict</span>.
        </li>
        <li>
          Create a redirect rule from{" "}
          <span className="inline-code">www.example.com</span> to{" "}
          <span className="inline-code">example.com</span>.
        </li>
        <li>
          Register the worker route pattern{" "}
          <span className="inline-code">example.com/*</span>.
        </li>
      </ul>

      <div className="stitch-separator my-8" />

      {/* SSL Modes */}
      <h2>SSL Modes</h2>
      <p>
        Cloudflare offers four SSL modes that control how traffic is encrypted
        between the visitor, Cloudflare's edge, and your origin. Since Levi
        deploys to Workers (which run on Cloudflare's edge), the most relevant
        modes are <span className="inline-code">full</span> and{" "}
        <span className="inline-code">full_strict</span>.
      </p>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="stitch-border-b">
              <th className="text-left py-3 px-4 text-denim-200 font-semibold">
                Mode
              </th>
              <th className="text-left py-3 px-4 text-denim-200 font-semibold">
                Description
              </th>
              <th className="text-left py-3 px-4 text-denim-200 font-semibold">
                Certificate Required
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-denim-800">
              <td className="py-3 px-4">
                <span className="inline-code">off</span>
              </td>
              <td className="py-3 px-4 text-denim-300">
                No encryption. All traffic is sent as plain HTTP. Not
                recommended for any production use.
              </td>
              <td className="py-3 px-4 text-denim-400">No</td>
            </tr>
            <tr className="border-b border-denim-800">
              <td className="py-3 px-4">
                <span className="inline-code">flexible</span>
              </td>
              <td className="py-3 px-4 text-denim-300">
                HTTPS between visitor and Cloudflare, but HTTP between
                Cloudflare and origin. Useful only for legacy origins that
                cannot serve HTTPS.
              </td>
              <td className="py-3 px-4 text-denim-400">No</td>
            </tr>
            <tr className="border-b border-denim-800">
              <td className="py-3 px-4">
                <span className="inline-code">full</span>
              </td>
              <td className="py-3 px-4 text-denim-300">
                HTTPS end-to-end. Cloudflare connects to the origin over HTTPS
                but does not validate the origin certificate. Acceptable for
                self-signed certificates.
              </td>
              <td className="py-3 px-4 text-denim-400">
                Self-signed OK
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4">
                <span className="inline-code">full_strict</span>
              </td>
              <td className="py-3 px-4 text-denim-300">
                HTTPS end-to-end with full certificate validation. Requires a
                valid, trusted certificate on the origin. This is the
                recommended mode for all new applications.
              </td>
              <td className="py-3 px-4 text-denim-400">
                <span className="text-wash-400">Valid CA-signed</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="denim-pocket p-5 mb-6">
        <p className="text-sm text-denim-300" style={{ marginBottom: 0 }}>
          <strong>Recommendation:</strong> Always use{" "}
          <span className="inline-code">full_strict</span> for Workers-based
          applications. Since Workers run directly on Cloudflare's edge,
          certificates are automatically provisioned and fully trusted.
        </p>
      </div>

      <div className="stitch-separator my-8" />

      {/* WWW Redirect */}
      <h2>WWW Redirect</h2>
      <p>
        The <span className="inline-code">redirectWww</span> option creates an
        automatic 301 redirect from the{" "}
        <span className="inline-code">www</span> subdomain to the apex domain
        (or vice versa). This is a common requirement for SEO — search engines
        treat <span className="inline-code">www.example.com</span> and{" "}
        <span className="inline-code">example.com</span> as different sites, so
        you want a canonical redirect.
      </p>

      <CodeBlock title="levi.app.ts" lang="typescript">
        <span className="syn-cmt">
          {"// Redirect www.example.com → example.com (301)"}
        </span>
        {"\n"}
        <span className="syn-const">app</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">addDomain</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"example.com"</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">ssl</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"full_strict"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">redirectWww</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-const">true</span>
        <span className="syn-punc">,</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
      </CodeBlock>

      <p>
        When <span className="inline-code">redirectWww</span> is{" "}
        <span className="inline-code">true</span>, Levi creates a Page Rule
        (or Redirect Rule) that performs a permanent redirect. The redirect
        preserves the full URL path and query string.
      </p>

      <div className="stitch-separator my-8" />

      {/* Worker Routes */}
      <h2>Worker Routes</h2>
      <p>
        Worker routes determine which HTTP requests are handled by your worker
        on a given domain. Routes use pattern matching with wildcards.
      </p>

      <CodeBlock title="levi.app.ts" lang="typescript">
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">worker</span>{" "}
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
        <span className="syn-str">"./src/api.ts"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">routes</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">[</span>
        {"\n"}
        {"    "}
        <span className="syn-str">"api.example.com/*"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"    "}
        <span className="syn-str">"example.com/api/*"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-punc">]</span>
        <span className="syn-punc">,</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
      </CodeBlock>

      <h3>Route Patterns</h3>
      <ul>
        <li>
          <span className="inline-code">example.com/*</span> — Matches all
          paths on the apex domain.
        </li>
        <li>
          <span className="inline-code">api.example.com/*</span> — Matches all
          paths on a specific subdomain.
        </li>
        <li>
          <span className="inline-code">example.com/api/*</span> — Matches
          only paths under <span className="inline-code">/api/</span>.
        </li>
        <li>
          <span className="inline-code">*.example.com/*</span> — Matches all
          subdomains and all paths (wildcard subdomain).
        </li>
      </ul>

      <p>
        When a domain is declared with{" "}
        <span className="inline-code">addDomain()</span> and a worker has
        routes referencing that domain, Levi ensures the DNS records and route
        configuration are deployed together.
      </p>

      <div className="stitch-separator my-8" />

      {/* Options Reference */}
      <h2>Options Reference</h2>

      <h3>DomainOptions</h3>
      <p>
        The <span className="inline-code">addDomain(hostname, options)</span>{" "}
        method accepts the following configuration:
      </p>

      <div className="denim-pocket p-5 mb-6">
        <ul>
          <li>
            <span className="inline-code">ssl</span>{" "}
            <span className="text-denim-400 text-sm">
              (string, default: "full_strict")
            </span>{" "}
            — SSL mode for the zone. One of{" "}
            <span className="inline-code">"off"</span>,{" "}
            <span className="inline-code">"flexible"</span>,{" "}
            <span className="inline-code">"full"</span>, or{" "}
            <span className="inline-code">"full_strict"</span>.
          </li>
          <li>
            <span className="inline-code">redirectWww</span>{" "}
            <span className="text-denim-400 text-sm">
              (boolean, default: false)
            </span>{" "}
            — Create a 301 redirect from{" "}
            <span className="inline-code">www.{"{hostname}"}</span> to{" "}
            <span className="inline-code">{"{hostname}"}</span>.
          </li>
          <li>
            <span className="inline-code">proxied</span>{" "}
            <span className="text-denim-400 text-sm">
              (boolean, default: true)
            </span>{" "}
            — Whether DNS records should be proxied through Cloudflare (orange
            cloud). Set to <span className="inline-code">false</span> for
            DNS-only mode.
          </li>
          <li>
            <span className="inline-code">ttl</span>{" "}
            <span className="text-denim-400 text-sm">
              (number, default: 1)
            </span>{" "}
            — DNS record TTL in seconds. Use{" "}
            <span className="inline-code">1</span> for automatic (recommended
            when proxied).
          </li>
          <li>
            <span className="inline-code">zoneId</span>{" "}
            <span className="text-denim-400 text-sm">(string, optional)</span>{" "}
            — Explicit Cloudflare zone ID. If omitted, Levi looks up the zone
            by hostname from your account.
          </li>
        </ul>
      </div>

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
            href="/docs/environments"
            className="px-4 py-2 text-sm bg-wash-600/20 border border-dashed border-wash-500 rounded-md text-wash-300 hover:bg-wash-600/30 transition-colors"
          >
            Environments
          </Link>
          <Link
            href="/docs/workers"
            className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
          >
            Workers
          </Link>
          <Link
            href="/examples"
            className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
          >
            Full Examples
          </Link>
        </div>
      </div>
    </DocLayout>
  );
}
