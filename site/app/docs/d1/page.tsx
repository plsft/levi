import { DocLayout } from "../../../components/DocLayout";
import { CodeBlock } from "../../../components/CodeBlock";

export const metadata = {
  title: "D1 Databases — Levi Docs",
  description:
    "Provision Cloudflare D1 SQLite databases with migrations, read replication, and location hints — all declared in TypeScript.",
};

export default function D1Page() {
  return (
    <DocLayout>
      {/* ── Header ─────────────────────────────────── */}
      <div className="stitch-border-b pb-8 mb-10">
        <h1 className="text-4xl font-bold text-wash-300 mb-3">D1 Databases</h1>
        <p className="text-lg text-denim-300 leading-relaxed max-w-2xl">
          D1 is Cloudflare's serverless SQLite database, purpose-built for the
          edge. With Levi, you declare a D1 database in one line and bind it to
          any number of workers — Levi handles provisioning, migration paths,
          and wrangler configuration.
        </p>
      </div>

      {/* ── Overview ───────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">Overview</h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          <code className="inline-code">addD1(name, options?)</code> registers a
          D1 database resource in the Levi application model. The returned handle
          can be passed into worker bindings, and Levi generates the correct{" "}
          <code className="inline-code">d1_databases</code> array in the
          worker's <code className="inline-code">wrangler.jsonc</code>.
        </p>
        <p className="text-denim-200 leading-relaxed mb-4">
          D1 databases are built on SQLite and run inside Cloudflare's global
          network. They support transactions, JSON functions, full-text search,
          and automatic read replication for low-latency reads worldwide.
        </p>
        <ul className="list-disc list-inside text-denim-200 space-y-1 ml-2">
          <li>Serverless — no connection pools, no idle costs</li>
          <li>Automatic backups and point-in-time recovery</li>
          <li>
            Read replication across 100+ Cloudflare data centers
          </li>
          <li>Up to 10 GB per database (production tier)</li>
          <li>SQL-standard interface with SQLite extensions</li>
        </ul>
      </section>

      {/* ── Basic Usage ────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">Basic Usage</h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          The simplest declaration requires only a name. Levi creates (or
          references) a D1 database and returns a handle for binding.
        </p>
        <CodeBlock title="app.host.ts" lang="typescript">
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
          <span className="syn-str">"my-project"</span>
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
          <span className="syn-str">"my-db"</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">{"// Bind it to a worker"}</span>
          {"\n"}
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
        </CodeBlock>
      </section>

      {/* ── Migrations ─────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">Migrations</h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          D1 supports file-based migrations. Point Levi at your migrations
          directory and it will configure the database to apply them
          automatically during deployment. Migrations are plain{" "}
          <code className="inline-code">.sql</code> files, numbered sequentially.
        </p>
        <CodeBlock title="Migrations configuration" lang="typescript">
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">db</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addD1</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"my-db"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">migrations</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./migrations"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">migrationsTable</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"_levi_migrations"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
        </CodeBlock>
        <p className="text-denim-200 leading-relaxed mb-4">
          Migration files should follow a numbered naming convention:
        </p>
        <CodeBlock title="migrations/" lang="plaintext">
          {"migrations/\n"}
          {"  0001_create_users.sql\n"}
          {"  0002_add_email_index.sql\n"}
          {"  0003_create_posts.sql"}
        </CodeBlock>
        <p className="text-denim-200 leading-relaxed mb-4">
          Each file is a standard SQL script. D1 tracks which migrations have
          been applied in the table specified by{" "}
          <code className="inline-code">migrationsTable</code> (defaults to{" "}
          <code className="inline-code">d1_migrations</code>).
        </p>
        <CodeBlock title="0001_create_users.sql" lang="sql">
          <span className="syn-kw">CREATE TABLE</span>{" "}
          <span className="syn-type">users</span>{" "}
          <span className="syn-punc">(</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">id</span>{" "}
          <span className="syn-type">INTEGER</span>{" "}
          <span className="syn-kw">PRIMARY KEY AUTOINCREMENT</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">email</span>{" "}
          <span className="syn-type">TEXT</span>{" "}
          <span className="syn-kw">NOT NULL UNIQUE</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">name</span>{" "}
          <span className="syn-type">TEXT</span>{" "}
          <span className="syn-kw">NOT NULL</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">created_at</span>{" "}
          <span className="syn-type">TEXT</span>{" "}
          <span className="syn-kw">DEFAULT</span>{" "}
          <span className="syn-punc">(</span>
          <span className="syn-fn">datetime</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">'now'</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">)</span>
          {"\n"}
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
        </CodeBlock>
      </section>

      {/* ── Binding to Workers ─────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">
          Binding to Workers
        </h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          Pass the D1 handle into a worker's{" "}
          <code className="inline-code">bindings</code> object. The key you
          choose becomes the property name on{" "}
          <code className="inline-code">env</code> inside your worker code.
          A single D1 database can be bound to multiple workers.
        </p>
        <CodeBlock title="Multiple worker bindings" lang="typescript">
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">db</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addD1</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"shared-db"</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">{"// Both workers share the same database"}</span>
          {"\n"}
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
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addWorker</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"cron-worker"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">entrypoint</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./src/cron.ts"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">bindings</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">DATABASE</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">db</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">crons</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">[</span>
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">pattern</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"0 */6 * * *"</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">]</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
        </CodeBlock>
        <p className="text-denim-200 leading-relaxed">
          Note that the binding name can differ between workers — the first uses{" "}
          <code className="inline-code">DB</code> and the second uses{" "}
          <code className="inline-code">DATABASE</code>, but both point to the
          same underlying D1 database.
        </p>
      </section>

      {/* ── Options Reference ──────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">
          Options Reference
        </h2>
        <p className="text-denim-200 leading-relaxed mb-6">
          All properties accepted by{" "}
          <code className="inline-code">addD1(name, options?)</code>:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-denim-700">
                <th className="py-3 pr-4 text-wash-300 font-semibold">
                  Property
                </th>
                <th className="py-3 pr-4 text-wash-300 font-semibold">Type</th>
                <th className="py-3 pr-4 text-wash-300 font-semibold">
                  Default
                </th>
                <th className="py-3 text-wash-300 font-semibold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="text-denim-200">
              <tr className="border-b border-denim-800">
                <td className="py-2 pr-4"><code className="inline-code">migrations</code></td>
                <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                <td className="py-2 pr-4">--</td>
                <td className="py-2">Path to the directory containing numbered <code className="inline-code">.sql</code> migration files</td>
              </tr>
              <tr className="border-b border-denim-800">
                <td className="py-2 pr-4"><code className="inline-code">migrationsTable</code></td>
                <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                <td className="py-2 pr-4"><code className="inline-code">"d1_migrations"</code></td>
                <td className="py-2">Table name used to track applied migrations</td>
              </tr>
              <tr className="border-b border-denim-800">
                <td className="py-2 pr-4"><code className="inline-code">databaseId</code></td>
                <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                <td className="py-2 pr-4">auto</td>
                <td className="py-2">Explicit D1 database UUID (for importing existing databases)</td>
              </tr>
              <tr className="border-b border-denim-800">
                <td className="py-2 pr-4"><code className="inline-code">previewDatabaseId</code></td>
                <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                <td className="py-2 pr-4">--</td>
                <td className="py-2">Separate database UUID for <code className="inline-code">wrangler dev</code> preview environments</td>
              </tr>
              <tr className="border-b border-denim-800">
                <td className="py-2 pr-4"><code className="inline-code">locationHint</code></td>
                <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                <td className="py-2 pr-4">auto</td>
                <td className="py-2">Preferred primary location (e.g. <code className="inline-code">"enam"</code>, <code className="inline-code">"weur"</code>, <code className="inline-code">"apac"</code>)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4"><code className="inline-code">readReplication</code></td>
                <td className="py-2 pr-4"><code className="inline-code">boolean</code></td>
                <td className="py-2 pr-4"><code className="inline-code">false</code></td>
                <td className="py-2">Enable automatic read replication for lower read latency globally</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Generated Config ───────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">
          Generated Config
        </h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          When you bind a D1 database to a worker, Levi generates the following
          in the worker's <code className="inline-code">wrangler.jsonc</code>:
        </p>
        <CodeBlock title="wrangler.jsonc (d1_databases section)" lang="jsonc">
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">"d1_databases"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">[</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">"binding"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"DB"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">"database_name"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"my-db"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">"database_id"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"a1b2c3d4-e5f6-..."</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">"migrations_dir"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"./migrations"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">"migrations_table"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"_levi_migrations"</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"}"}</span>
          {"\n"}
          {"  "}
          <span className="syn-punc">]</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
        </CodeBlock>
        <p className="text-denim-200 leading-relaxed">
          The <code className="inline-code">database_id</code> is resolved
          automatically during deployment. If you import an existing database
          using the <code className="inline-code">databaseId</code> option, that
          UUID is used directly.
        </p>
      </section>

      {/* ── Usage in Worker Code ───────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">
          Usage in Worker Code
        </h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          Inside your worker, access the D1 database through{" "}
          <code className="inline-code">env.DB</code> (or whatever binding name
          you chose). D1 exposes a simple API for queries, batch operations, and
          prepared statements.
        </p>
        <CodeBlock title="src/api.ts — Hono handler" lang="typescript">
          <span className="syn-kw">import</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-type">Hono</span>{" "}
          <span className="syn-punc">{"}"}</span>{" "}
          <span className="syn-kw">from</span>{" "}
          <span className="syn-str">"hono"</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-kw">type</span>{" "}
          <span className="syn-type">Env</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">DB</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-type">D1Database</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">app</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-kw">new</span>{" "}
          <span className="syn-type">Hono</span>
          <span className="syn-op">&lt;</span>
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-type">Bindings</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-type">Env</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-op">&gt;</span>
          <span className="syn-punc">()</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">{"// List all users"}</span>
          {"\n"}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">get</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"/users"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-kw">async</span>{" "}
          <span className="syn-punc">(</span>
          <span className="syn-const">c</span>
          <span className="syn-punc">)</span>{" "}
          <span className="syn-kw">=&gt;</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-const">results</span>{" "}
          <span className="syn-punc">{"}"}</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-kw">await</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">env</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">DB</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">.</span>
          <span className="syn-fn">prepare</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"SELECT id, email, name FROM users ORDER BY created_at DESC"</span>
          <span className="syn-punc">)</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">.</span>
          <span className="syn-fn">all</span>
          <span className="syn-punc">()</span>
          <span className="syn-punc">;</span>
          {"\n"}
          {"  "}
          <span className="syn-kw">return</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">json</span>
          <span className="syn-punc">(</span>
          <span className="syn-const">results</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">{"// Create a user with a prepared statement"}</span>
          {"\n"}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">post</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"/users"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-kw">async</span>{" "}
          <span className="syn-punc">(</span>
          <span className="syn-const">c</span>
          <span className="syn-punc">)</span>{" "}
          <span className="syn-kw">=&gt;</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-const">email</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-const">name</span>{" "}
          <span className="syn-punc">{"}"}</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-kw">await</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">req</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">json</span>
          <span className="syn-punc">()</span>
          <span className="syn-punc">;</span>
          {"\n"}
          {"  "}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">result</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-kw">await</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">env</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">DB</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">.</span>
          <span className="syn-fn">prepare</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"INSERT INTO users (email, name) VALUES (?, ?)"</span>
          <span className="syn-punc">)</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">.</span>
          <span className="syn-fn">bind</span>
          <span className="syn-punc">(</span>
          <span className="syn-const">email</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-const">name</span>
          <span className="syn-punc">)</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">.</span>
          <span className="syn-fn">run</span>
          <span className="syn-punc">()</span>
          <span className="syn-punc">;</span>
          {"\n"}
          {"  "}
          <span className="syn-kw">return</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">json</span>
          <span className="syn-punc">(</span>
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">id</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">result</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">meta</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">last_row_id</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-num">201</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">{"// Batch multiple statements in a transaction"}</span>
          {"\n"}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">post</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"/transfer"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-kw">async</span>{" "}
          <span className="syn-punc">(</span>
          <span className="syn-const">c</span>
          <span className="syn-punc">)</span>{" "}
          <span className="syn-kw">=&gt;</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-const">from</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-const">to</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-const">amount</span>{" "}
          <span className="syn-punc">{"}"}</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-kw">await</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">req</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">json</span>
          <span className="syn-punc">()</span>
          <span className="syn-punc">;</span>
          {"\n"}
          {"  "}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">results</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-kw">await</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">env</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">DB</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">batch</span>
          <span className="syn-punc">([</span>
          {"\n"}
          {"    "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">env</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">DB</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">prepare</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"UPDATE accounts SET balance = balance - ? WHERE id = ?"</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">bind</span>
          <span className="syn-punc">(</span>
          <span className="syn-const">amount</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-const">from</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">env</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">DB</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">prepare</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"UPDATE accounts SET balance = balance + ? WHERE id = ?"</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">bind</span>
          <span className="syn-punc">(</span>
          <span className="syn-const">amount</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-const">to</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-punc">])</span>
          <span className="syn-punc">;</span>
          {"\n"}
          {"  "}
          <span className="syn-kw">return</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">json</span>
          <span className="syn-punc">(</span>
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">ok</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-kw">true</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-kw">export default</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">;</span>
        </CodeBlock>
      </section>

      <div className="red-tab" />
    </DocLayout>
  );
}
