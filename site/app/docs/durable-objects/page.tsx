import { DocLayout } from "../../../components/DocLayout";
import { CodeBlock } from "../../../components/CodeBlock";

export default function DurableObjectsPage() {
  return (
    <DocLayout>
      <div className="space-y-10">
        {/* Header */}
        <header>
          <div className="flex items-center gap-3 mb-4">
            <span className="red-tab-h">resource</span>
            <span className="text-xs text-denim-500 font-mono">Compute</span>
          </div>
          <h1 className="text-4xl font-bold text-denim-50 stitch-border-b pb-4">
            Durable Objects
          </h1>
          <p className="mt-4 text-denim-300 text-lg leading-relaxed">
            Durable Objects provide globally unique, strongly consistent,
            single-threaded compute instances with co-located persistent
            storage. They are ideal for coordination, real-time collaboration,
            rate limiting, and any workload that needs stateful serverless.
            Levi manages DO class declarations, bindings, and SQLite storage
            configuration.
          </p>
        </header>

        {/* Overview */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Overview
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Each Durable Object instance is a single JavaScript object that
            runs in one location worldwide. Unlike stateless Workers, a DO
            instance maintains{" "}
            <strong className="text-wash-300">in-memory state</strong> between
            requests and has access to{" "}
            <strong className="text-wash-300">persistent storage</strong> that
            is co-located with the compute. Cloudflare guarantees that only one
            instance of a given ID runs at any time, making DOs perfect for:
          </p>
          <ul className="list-disc list-inside text-denim-300 space-y-1">
            <li>WebSocket-based real-time collaboration</li>
            <li>Per-user or per-session state management</li>
            <li>Distributed locks and leader election</li>
            <li>Rate limiting and counters</li>
            <li>Chat rooms, game lobbies, and multiplayer servers</li>
          </ul>
          <p className="text-denim-300 leading-relaxed mt-4">
            DOs support two storage APIs: the original{" "}
            <strong className="text-wash-300">key-value API</strong> and the
            newer{" "}
            <strong className="text-wash-300">SQLite API</strong> which enables
            relational queries within each DO instance.
          </p>
        </section>

        {/* Creating a DO */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Creating a Durable Object
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Declare a Durable Object class in your{" "}
            <code className="inline-code">levi.app.ts</code> using{" "}
            <code className="inline-code">app.addDurableObject()</code>. The{" "}
            <code className="inline-code">className</code> must match the
            exported class name in your Worker code.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">sessions</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addDurableObject</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"RealtimeSession"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">className</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"RealtimeSession"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">sqlite</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">true</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed">
            This declares a Durable Object class named{" "}
            <code className="inline-code">RealtimeSession</code> with SQLite
            storage enabled. The resource reference is then used to bind the
            DO namespace to Workers.
          </p>
        </section>

        {/* Binding to Workers */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Binding to Workers
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Workers access Durable Objects through namespace bindings. Pass the
            DO resource into a Worker's{" "}
            <code className="inline-code">bindings</code> map to create the
            binding, or use the{" "}
            <code className="inline-code">durableObjects</code> property on
            the Worker to declare DO classes that the Worker itself hosts.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-cmt">{"// Method 1: Bind as a resource"}</span>
            {"\n"}
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
            {"    "}<span className="syn-prop">SESSIONS</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">sessions</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-cmt">{"// Method 2: Declare DO classes on the hosting Worker"}</span>
            {"\n"}
            <span className="syn-fn">app.addWorker</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"realtime"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">entrypoint</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"./src/realtime/index.ts"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">durableObjects</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"    "}<span className="syn-prop">SESSIONS</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"      "}<span className="syn-prop">className</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"RealtimeSession"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"      "}<span className="syn-prop">sqlite</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">true</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"    "}<span className="syn-punc">{"}"}</span>
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

        {/* SQLite Storage */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            SQLite Storage
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Setting <code className="inline-code">sqlite: true</code> enables
            the SQL storage API on the Durable Object. Instead of the
            key-value <code className="inline-code">this.ctx.storage.get()</code>{" "}
            / <code className="inline-code">put()</code> API, your DO class
            gets access to{" "}
            <code className="inline-code">this.ctx.storage.sql</code> for
            running SQL queries against a per-instance SQLite database.
          </p>
          <CodeBlock title="RealtimeSession.ts" lang="ts">
            <span className="syn-kw">import</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-type">DurableObject</span>{" "}
            <span className="syn-punc">{"}"}</span>{" "}
            <span className="syn-kw">from</span>{" "}
            <span className="syn-str">"cloudflare:workers"</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-kw">export class</span>{" "}
            <span className="syn-type">RealtimeSession</span>{" "}
            <span className="syn-kw">extends</span>{" "}
            <span className="syn-type">DurableObject</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-fn">constructor</span>
            <span className="syn-punc">(</span>
            <span className="syn-const">ctx</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-const">env</span>
            <span className="syn-punc">)</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"    "}<span className="syn-kw">super</span>
            <span className="syn-punc">(</span>
            <span className="syn-const">ctx</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-const">env</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            {"    "}<span className="syn-cmt">{"// Create tables on first access"}</span>
            {"\n"}
            {"    "}<span className="syn-const">ctx</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">storage</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">sql</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">exec</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">{"`"}CREATE TABLE IF NOT EXISTS messages {"("}</span>
            {"\n"}
            {"      "}<span className="syn-str">id INTEGER PRIMARY KEY AUTOINCREMENT,</span>
            {"\n"}
            {"      "}<span className="syn-str">user_id TEXT NOT NULL,</span>
            {"\n"}
            {"      "}<span className="syn-str">content TEXT NOT NULL,</span>
            {"\n"}
            {"      "}<span className="syn-str">created_at TEXT DEFAULT CURRENT_TIMESTAMP</span>
            {"\n"}
            {"    "}<span className="syn-str">{")"}{"`"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"}"}</span>
            {"\n\n"}
            {"  "}<span className="syn-kw">async</span>{" "}
            <span className="syn-fn">getMessages</span>
            <span className="syn-punc">()</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"    "}<span className="syn-kw">return</span>{" "}
            <span className="syn-const">this</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">ctx</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">storage</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">sql</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">exec</span>
            <span className="syn-punc">(</span>
            {"\n"}
            {"      "}<span className="syn-str">"SELECT * FROM messages ORDER BY created_at DESC LIMIT 50"</span>
            {"\n"}
            {"    "}<span className="syn-punc">)</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">toArray</span>
            <span className="syn-punc">()</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"}"}</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
          </CodeBlock>
          <div className="bg-denim-900/50 border border-denim-700 rounded-md p-4 mt-4">
            <p className="text-denim-300 text-sm">
              <strong className="text-thread-400">Note:</strong> SQLite storage
              requires{" "}
              <code className="inline-code">
                compatibility_date &gt;= "2024-10-01"
              </code>{" "}
              on the hosting Worker. Each DO instance gets its own isolated
              SQLite database -- data is not shared between instances.
            </p>
          </div>
        </section>

        {/* External DOs */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            External Durable Objects
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Use the <code className="inline-code">scriptName</code> option to
            reference a Durable Object class hosted in a different Worker
            script. This is useful when you need cross-script DO access or
            when the DO is managed outside your Levi application.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">authSessions</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addDurableObject</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"AuthSession"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">className</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"AuthSession"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">scriptName</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"auth-worker"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">environment</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"production"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed">
            When <code className="inline-code">scriptName</code> is set, the
            generated wrangler config includes a{" "}
            <code className="inline-code">script_name</code> field in the
            binding, telling Cloudflare to resolve the DO class from the
            external Worker rather than the current one.
          </p>
        </section>

        {/* Options Reference */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Options Reference
          </h2>
          <h3 className="text-lg font-medium text-wash-300 mt-6 mb-2">
            DurableObjectOptions
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
                  <td className="py-2 pr-4"><code className="inline-code">className</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">required</td>
                  <td className="py-2">Exported class name implementing the DO</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">sqlite</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">boolean</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">false</code></td>
                  <td className="py-2">Enable SQLite storage API instead of KV storage</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">scriptName</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">External Worker script hosting the DO class</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">environment</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">Environment of the external script (requires scriptName)</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">locationHint</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">Preferred region hint for instance placement (e.g. "weur", "enam")</td>
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
            <code className="inline-code">durable_objects.bindings</code>{" "}
            section in the hosting Worker's{" "}
            <code className="inline-code">wrangler.jsonc</code>.
          </p>
          <CodeBlock title="wrangler.jsonc" lang="jsonc">
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">"durable_objects"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"    "}<span className="syn-prop">"bindings"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">[</span>
            {"\n"}
            {"      "}<span className="syn-punc">{"{"}</span>
            {"\n"}
            {"        "}<span className="syn-prop">"name"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"SESSIONS"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"        "}<span className="syn-prop">"class_name"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"RealtimeSession"</span>
            {"\n"}
            {"      "}<span className="syn-punc">{"}"}</span>
            {"\n"}
            {"    "}<span className="syn-punc">]</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"}"}</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed mt-4">
            For external DOs with{" "}
            <code className="inline-code">scriptName</code>, the generated
            config includes the <code className="inline-code">script_name</code>{" "}
            field:
          </p>
          <CodeBlock title="wrangler.jsonc (external DO)" lang="jsonc">
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">"durable_objects"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"    "}<span className="syn-prop">"bindings"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">[</span>
            {"\n"}
            {"      "}<span className="syn-punc">{"{"}</span>
            {"\n"}
            {"        "}<span className="syn-prop">"name"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"AUTH_SESSIONS"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"        "}<span className="syn-prop">"class_name"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"AuthSession"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"        "}<span className="syn-prop">"script_name"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"auth-worker"</span>
            {"\n"}
            {"      "}<span className="syn-punc">{"}"}</span>
            {"\n"}
            {"    "}<span className="syn-punc">]</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"}"}</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
          </CodeBlock>
        </section>

        {/* Usage in Worker Code */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Usage in Worker Code
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            At runtime, access the Durable Object namespace through the
            binding name. Use{" "}
            <code className="inline-code">idFromName()</code> or{" "}
            <code className="inline-code">idFromString()</code> to get a
            stable ID, then call{" "}
            <code className="inline-code">get()</code> to obtain a stub for
            making RPC calls.
          </p>
          <CodeBlock title="src/api/index.ts" lang="ts">
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
            {"    "}<span className="syn-kw">const</span>{" "}
            <span className="syn-const">url</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-kw">new</span>{" "}
            <span className="syn-type">URL</span>
            <span className="syn-punc">(</span>
            <span className="syn-const">request</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">url</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"    "}<span className="syn-kw">const</span>{" "}
            <span className="syn-const">roomId</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-const">url</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">searchParams</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">get</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"room"</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            {"    "}<span className="syn-cmt">{"// Get a stable ID from a name string"}</span>
            {"\n"}
            {"    "}<span className="syn-kw">const</span>{" "}
            <span className="syn-const">id</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-const">env</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">SESSIONS</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">idFromName</span>
            <span className="syn-punc">(</span>
            <span className="syn-const">roomId</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            {"    "}<span className="syn-cmt">{"// Get a stub to interact with the DO instance"}</span>
            {"\n"}
            {"    "}<span className="syn-kw">const</span>{" "}
            <span className="syn-const">stub</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-const">env</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">SESSIONS</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">get</span>
            <span className="syn-punc">(</span>
            <span className="syn-const">id</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            {"    "}<span className="syn-cmt">{"// Call methods on the DO (RPC)"}</span>
            {"\n"}
            {"    "}<span className="syn-kw">const</span>{" "}
            <span className="syn-const">messages</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-kw">await</span>{" "}
            <span className="syn-const">stub</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">getMessages</span>
            <span className="syn-punc">()</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            {"    "}<span className="syn-kw">return</span>{" "}
            <span className="syn-type">Response</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">json</span>
            <span className="syn-punc">(</span>
            <span className="syn-const">messages</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <div className="bg-denim-900/50 border border-denim-700 rounded-md p-4 mt-4">
            <p className="text-denim-300 text-sm">
              <strong className="text-thread-400">Tip:</strong> For WebSocket
              upgrade requests, forward the request directly to the DO stub
              using{" "}
              <code className="inline-code">stub.fetch(request)</code>. The DO
              can then accept the WebSocket connection and manage it with
              full in-memory state.
            </p>
          </div>
        </section>

        {/* Full Example */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Full Example
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            A complete chat room application using Durable Objects with SQLite
            storage for message persistence and WebSocket support.
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
            <span className="syn-str">"chat-app"</span>
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
            <span className="syn-const">chatRoom</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addDurableObject</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"ChatRoom"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">className</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"ChatRoom"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">sqlite</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">true</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-fn">app.addWorker</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"chat-api"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">entrypoint</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"./src/index.ts"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">bindings</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">ROOMS</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">chatRoom</span>{" "}
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
        </section>
      </div>
    </DocLayout>
  );
}
