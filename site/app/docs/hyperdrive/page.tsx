import { DocLayout } from "../../../components/DocLayout";
import { CodeBlock } from "../../../components/CodeBlock";

export default function HyperdrivePage() {
  return (
    <DocLayout>
      <div className="space-y-10">
        {/* Header */}
        <header>
          <div className="flex items-center gap-3 mb-4">
            <span className="red-tab-h">resource</span>
            <span className="text-xs text-denim-500 font-mono">
              Storage &amp; Data
            </span>
          </div>
          <h1 className="text-4xl font-bold text-denim-50 stitch-border-b pb-4">
            Hyperdrive
          </h1>
          <p className="mt-4 text-denim-300 text-lg leading-relaxed">
            Cloudflare Hyperdrive accelerates access to existing regional
            databases by maintaining persistent connection pools close to the
            origin and caching query results at the edge. Connect your Workers
            to PostgreSQL, MySQL, or any TCP-accessible database without
            paying the cold-connection penalty on every request. Levi manages
            Hyperdrive configuration, secret handling, and binding generation.
          </p>
        </header>

        {/* Overview */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Overview
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Workers are globally distributed, but traditional databases live in
            a single region. Every new Worker invocation would normally need to
            open a fresh TCP + TLS connection to the database, adding hundreds
            of milliseconds of latency. Hyperdrive solves this by:
          </p>
          <ul className="list-disc list-inside text-denim-300 space-y-2 mb-4">
            <li>
              <strong className="text-wash-300">Connection pooling</strong> --
              Maintains warm, persistent connections to your database close to
              the origin, eliminating the per-request connection setup overhead
            </li>
            <li>
              <strong className="text-wash-300">Query caching</strong> --
              Optionally caches read query results at the edge with
              configurable TTL and stale-while-revalidate behavior
            </li>
            <li>
              <strong className="text-wash-300">Zero migration</strong> --
              Works with your existing database. No changes to schema, queries,
              or drivers required. Just swap the connection string.
            </li>
          </ul>
          <p className="text-denim-300 leading-relaxed">
            Your Worker connects to Hyperdrive's local endpoint (provided via
            the binding), and Hyperdrive handles the rest -- routing the
            connection through the global pool, caching eligible queries, and
            returning results at edge speed.
          </p>
        </section>

        {/* Creating a Config */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Creating a Configuration
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Declare a Hyperdrive configuration in your{" "}
            <code className="inline-code">levi.app.ts</code> using{" "}
            <code className="inline-code">app.addHyperdrive()</code>. The
            connection string should use{" "}
            <code className="inline-code">app.secret()</code> to keep
            credentials out of source control.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">legacyDb</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addHyperdrive</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"legacy-db"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">connectionString</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-fn">app.secret</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"PG_URL"</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed">
            The <code className="inline-code">PG_URL</code> secret is never
            written to generated config files. It is provisioned separately
            via <code className="inline-code">wrangler secret put</code> or
            the Cloudflare API during{" "}
            <code className="inline-code">levi provision</code>.
          </p>
        </section>

        {/* Connection Strings */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Connection Strings
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Hyperdrive supports PostgreSQL and MySQL connection strings.
            Always use <code className="inline-code">app.secret()</code> for
            production credentials to ensure they never appear in generated
            config or source control.
          </p>
          <CodeBlock title="Connection string formats" lang="ts">
            <span className="syn-cmt">{"// PostgreSQL"}</span>
            {"\n"}
            <span className="syn-str">"postgres://user:password@host:5432/database"</span>
            {"\n\n"}
            <span className="syn-cmt">{"// MySQL"}</span>
            {"\n"}
            <span className="syn-str">"mysql://user:password@host:3306/database"</span>
            {"\n\n"}
            <span className="syn-cmt">{"// Using app.secret() (recommended)"}</span>
            {"\n"}
            <span className="syn-prop">connectionString</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-fn">app.secret</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"DATABASE_URL"</span>
            <span className="syn-punc">)</span>
            {"\n\n"}
            <span className="syn-cmt">{"// Plain string (for non-sensitive / test databases only)"}</span>
            {"\n"}
            <span className="syn-prop">connectionString</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"postgres://test:test@localhost:5432/testdb"</span>
          </CodeBlock>
          <div className="bg-denim-900/50 border border-denim-700 rounded-md p-4 mt-4">
            <p className="text-denim-300 text-sm">
              <strong className="text-redtab-500">Warning:</strong> Never
              hardcode production database credentials in your{" "}
              <code className="inline-code">levi.app.ts</code>. Use{" "}
              <code className="inline-code">app.secret()</code> so Levi
              manages the secret through Cloudflare's secure secret storage.
            </p>
          </div>
        </section>

        {/* Caching Configuration */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Caching Configuration
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Hyperdrive can cache query results at the edge to reduce load on
            your origin database and improve read latency. Caching is
            configured via the{" "}
            <code className="inline-code">caching</code> option.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">cachedDb</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addHyperdrive</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"main-db"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">connectionString</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-fn">app.secret</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"DATABASE_URL"</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">caching</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"    "}<span className="syn-prop">maxAge</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">120</span>
            <span className="syn-punc">,</span>
            {"        "}
            <span className="syn-cmt">{"// Cache results for 2 minutes"}</span>
            {"\n"}
            {"    "}<span className="syn-prop">staleWhileRevalidate</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">30</span>
            <span className="syn-punc">,</span>
            {" "}
            <span className="syn-cmt">{"// Serve stale for 30s while refreshing"}</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed mb-4">
            For workloads where stale reads are unacceptable (e.g., financial
            transactions, auth checks), disable caching entirely:
          </p>
          <CodeBlock title="Disabling cache" lang="ts">
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">strictDb</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addHyperdrive</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"auth-db"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">connectionString</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-fn">app.secret</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"AUTH_DB_URL"</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">caching</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">disabled</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">true</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-denim-700">
                  <th className="py-2 pr-4 text-denim-400 font-medium">Caching Option</th>
                  <th className="py-2 pr-4 text-denim-400 font-medium">Type</th>
                  <th className="py-2 pr-4 text-denim-400 font-medium">Default</th>
                  <th className="py-2 text-denim-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-denim-300">
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">disabled</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">boolean</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">false</code></td>
                  <td className="py-2">Disable all query caching; every query goes to origin</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">maxAge</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">number</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">60</code></td>
                  <td className="py-2">Max cache lifetime in seconds before eviction</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">staleWhileRevalidate</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">number</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">15</code></td>
                  <td className="py-2">Seconds to serve stale results during background refresh</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Local Development */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Local Development
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            During <code className="inline-code">levi dev</code>, Hyperdrive
            cannot connect to your production database's connection pool. Use
            the <code className="inline-code">localConnectionString</code>{" "}
            option to provide a direct connection to a local or development
            database.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">db</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addHyperdrive</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"main-db"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">connectionString</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-fn">app.secret</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"DATABASE_URL"</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">localConnectionString</span>
            <span className="syn-punc">:</span>
            {"\n"}
            {"    "}<span className="syn-str">"postgres://postgres:postgres@localhost:5432/myapp_dev"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed">
            When running locally, Wrangler uses{" "}
            <code className="inline-code">localConnectionString</code>{" "}
            directly. In deployed environments, Hyperdrive's connection pool
            is used with the production{" "}
            <code className="inline-code">connectionString</code>.
          </p>
        </section>

        {/* Options Reference */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Options Reference
          </h2>
          <h3 className="text-lg font-medium text-wash-300 mt-6 mb-2">
            HyperdriveOptions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-denim-700">
                  <th className="py-2 pr-4 text-denim-400 font-medium">Option</th>
                  <th className="py-2 pr-4 text-denim-400 font-medium">Type</th>
                  <th className="py-2 pr-4 text-denim-400 font-medium">Default</th>
                  <th className="py-2 text-denim-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-denim-300">
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">connectionString</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string | SecretRef</code></td>
                  <td className="py-2 pr-4">required</td>
                  <td className="py-2">Database connection string (use app.secret() for production)</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">caching</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">HyperdriveCachingConfig</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">Query result caching configuration</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">localConnectionString</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">Connection string for local development (levi dev)</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">configId</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">Bind to an existing Hyperdrive config ID (skips provisioning)</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">originAccess</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">"access"</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">Connect through Cloudflare Access for private databases</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Generated Config */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Generated Config
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Levi generates the{" "}
            <code className="inline-code">hyperdrive</code> array in each
            bound Worker's{" "}
            <code className="inline-code">wrangler.jsonc</code>.
          </p>
          <CodeBlock title="wrangler.jsonc" lang="jsonc">
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">"hyperdrive"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">[</span>
            {"\n"}
            {"    "}<span className="syn-punc">{"{"}</span>
            {"\n"}
            {"      "}<span className="syn-prop">"binding"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"DB"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"      "}<span className="syn-prop">"id"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"legacy-db"</span>
            {"\n"}
            {"    "}<span className="syn-punc">{"}"}</span>
            {"\n"}
            {"  "}<span className="syn-punc">]</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed mt-4">
            The <code className="inline-code">id</code> field references the
            Hyperdrive configuration by name (or by{" "}
            <code className="inline-code">configId</code> if provided). The
            connection string and caching settings are managed by Cloudflare
            at the Hyperdrive config level, not in wrangler.jsonc.
          </p>
        </section>

        {/* Usage in Worker Code */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Usage in Worker Code
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            At runtime, the Hyperdrive binding provides a{" "}
            <code className="inline-code">connectionString</code> property
            that points to Hyperdrive's local proxy. Pass this to any standard
            PostgreSQL or MySQL client library. The connection is automatically
            routed through Hyperdrive's global connection pool.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
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
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">compatibility_date</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"2026-04-01"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">db</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addHyperdrive</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"legacy-db"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">connectionString</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-fn">app.secret</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"PG_URL"</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">localConnectionString</span>
            <span className="syn-punc">:</span>
            {"\n"}
            {"    "}<span className="syn-str">"postgres://postgres:postgres@localhost:5432/myapp_dev"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">caching</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">maxAge</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">60</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-prop">staleWhileRevalidate</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">15</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-fn">app.addWorker</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"api"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">entrypoint</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"./src/api/index.ts"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">bindings</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">DB</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">db</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">placement</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">mode</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"smart"</span>{" "}
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

          <CodeBlock title="src/api/index.ts (using pg driver)" lang="ts">
            <span className="syn-kw">import</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-type">Client</span>{" "}
            <span className="syn-punc">{"}"}</span>{" "}
            <span className="syn-kw">from</span>{" "}
            <span className="syn-str">"pg"</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-kw">export default</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-kw">async</span>{" "}
            <span className="syn-fn">fetch</span>
            <span className="syn-punc">(</span>
            <span className="syn-const">request</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-const">env</span>
            <span className="syn-punc">)</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"    "}<span className="syn-cmt">{"// Get the Hyperdrive connection string"}</span>
            {"\n"}
            {"    "}<span className="syn-kw">const</span>{" "}
            <span className="syn-const">client</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-kw">new</span>{" "}
            <span className="syn-type">Client</span>
            <span className="syn-punc">({"{"}</span>
            {"\n"}
            {"      "}<span className="syn-prop">connectionString</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">env</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">DB</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">connectionString</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"    "}<span className="syn-punc">{"})"}</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            {"    "}<span className="syn-kw">await</span>{" "}
            <span className="syn-const">client</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">connect</span>
            <span className="syn-punc">()</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            {"    "}<span className="syn-kw">try</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"      "}<span className="syn-kw">const</span>{" "}
            <span className="syn-const">result</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-kw">await</span>{" "}
            <span className="syn-const">client</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">query</span>
            <span className="syn-punc">(</span>
            {"\n"}
            {"        "}<span className="syn-str">"SELECT id, name, email FROM users LIMIT 100"</span>
            {"\n"}
            {"      "}<span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            {"      "}<span className="syn-kw">return</span>{" "}
            <span className="syn-type">Response</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">json</span>
            <span className="syn-punc">(</span>
            <span className="syn-const">result</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">rows</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"    "}<span className="syn-punc">{"}"}</span>{" "}
            <span className="syn-kw">finally</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"      "}<span className="syn-kw">await</span>{" "}
            <span className="syn-const">client</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">end</span>
            <span className="syn-punc">()</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"    "}<span className="syn-punc">{"}"}</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">;</span>
          </CodeBlock>

          <div className="bg-denim-900/50 border border-denim-700 rounded-md p-4 mt-4">
            <p className="text-denim-300 text-sm">
              <strong className="text-thread-400">Tip:</strong> Enable{" "}
              <code className="inline-code">
                placement: {"{"} mode: "smart" {"}"}
              </code>{" "}
              on Workers that use Hyperdrive. Smart Placement automatically
              runs the Worker closer to the database origin, further reducing
              latency.
            </p>
          </div>
        </section>

        {/* Multiple Databases */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Multiple Databases
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            A single Worker can connect to multiple databases through separate
            Hyperdrive configurations. Each gets its own binding, connection
            pool, and caching settings.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">mainDb</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addHyperdrive</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"main-pg"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">connectionString</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-fn">app.secret</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"MAIN_DB_URL"</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">caching</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">maxAge</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">60</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">analyticsDb</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addHyperdrive</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"analytics-pg"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">connectionString</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-fn">app.secret</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"ANALYTICS_DB_URL"</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">caching</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">maxAge</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">300</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-fn">app.addWorker</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"api"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">entrypoint</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"./src/api/index.ts"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">bindings</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"    "}<span className="syn-prop">MAIN_DB</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">mainDb</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"    "}<span className="syn-prop">ANALYTICS_DB</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">analyticsDb</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
        </section>
      </div>
    </DocLayout>
  );
}
