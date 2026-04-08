import { DocLayout } from "../../../components/DocLayout";
import { CodeBlock } from "../../../components/CodeBlock";
import Link from "next/link";

export default function PipelinesPage() {
  return (
    <DocLayout>
      <div className="space-y-10">
        {/* Header */}
        <header>
          <div className="flex items-center gap-3 mb-4">
            <span className="red-tab-h">beta</span>
            <span className="text-xs text-denim-500 font-mono">
              Storage &amp; Data
            </span>
          </div>
          <h1 className="text-4xl font-bold text-denim-50 stitch-border-b pb-4">
            Pipelines
          </h1>
          <p className="mt-4 text-denim-300 text-lg leading-relaxed">
            Cloudflare Pipelines let you ingest high-volume event data from
            Workers, transform it with SQL, and deliver it to R2 as
            Apache Iceberg tables or Parquet files. Pipelines are built from three
            components &mdash; Streams, Pipelines, and Sinks &mdash; that chain
            together into a serverless ETL flow. Levi manages stream bindings and
            wrangler configuration from your{" "}
            <code className="inline-code">levi.app.ts</code>.
          </p>
        </header>

        {/* Overview */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Overview
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Pipelines provide a managed, serverless data pipeline on Cloudflare's
            network. Instead of running Kafka, Kinesis, or custom ETL
            infrastructure, you declare event streams that Workers can write to
            and let Cloudflare handle batching, transformation, and delivery.
          </p>
          <ul className="list-disc list-inside text-denim-300 space-y-1">
            <li>
              <strong className="text-wash-300">Streams</strong> &mdash; Ingest
              points where Workers send structured events via a binding
            </li>
            <li>
              <strong className="text-wash-300">Pipelines</strong> &mdash; SQL
              transformations that filter, reshape, or route events between
              streams and sinks
            </li>
            <li>
              <strong className="text-wash-300">Sinks</strong> &mdash;
              Destinations where processed events land: R2 buckets as Parquet,
              JSON, or Iceberg tables via the R2 Data Catalog
            </li>
            <li>
              Automatic batching, compression, and exactly-once delivery to R2
            </li>
            <li>
              Schema enforcement at the stream level to ensure data quality
            </li>
            <li>
              Native integration with analytics tools that read Iceberg or Parquet
            </li>
          </ul>
        </section>

        {/* Basic Usage */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Basic Usage
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Declare a pipeline in your{" "}
            <code className="inline-code">levi.app.ts</code> using{" "}
            <code className="inline-code">app.addPipeline()</code>. The returned
            resource reference is bound to Workers so they can send events to the
            stream at runtime.
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
            <span className="syn-const">events</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addPipeline</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"analytics-stream"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">streamId</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"stream-abc123"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed">
            This declares a pipeline resource bound to an existing stream
            identified by <code className="inline-code">stream-abc123</code>.
            Levi will generate the{" "}
            <code className="inline-code">pipelines</code> array in the bound
            Worker's <code className="inline-code">wrangler.jsonc</code> during{" "}
            <code className="inline-code">levi build</code>.
          </p>
        </section>

        {/* Architecture */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Architecture
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            The Pipelines system has three discrete stages that events flow
            through:
          </p>
          <div className="bg-denim-900/50 border border-denim-700 rounded-lg p-6 mb-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
              <div className="bg-denim-800 border border-wash-600/30 rounded px-4 py-2 text-wash-300 font-medium text-center">
                Worker
                <div className="text-xs text-denim-400 mt-1">env.STREAM.send()</div>
              </div>
              <span className="text-denim-500 text-lg">&rarr;</span>
              <div className="bg-denim-800 border border-thread-400/30 rounded px-4 py-2 text-thread-400 font-medium text-center">
                Stream
                <div className="text-xs text-denim-400 mt-1">Schema + Ingest</div>
              </div>
              <span className="text-denim-500 text-lg">&rarr;</span>
              <div className="bg-denim-800 border border-thread-400/30 rounded px-4 py-2 text-thread-400 font-medium text-center">
                Pipeline
                <div className="text-xs text-denim-400 mt-1">SQL Transform</div>
              </div>
              <span className="text-denim-500 text-lg">&rarr;</span>
              <div className="bg-denim-800 border border-redtab-500/30 rounded px-4 py-2 text-redtab-400 font-medium text-center">
                Sink
                <div className="text-xs text-denim-400 mt-1">R2 / Iceberg</div>
              </div>
            </div>
          </div>
          <ul className="list-disc list-inside text-denim-300 space-y-2">
            <li>
              <strong className="text-wash-300">Stream</strong> &mdash;
              The entry point. Events are sent by Workers and validated against
              an optional schema. Streams batch events for efficient delivery
              downstream.
            </li>
            <li>
              <strong className="text-wash-300">Pipeline</strong> &mdash;
              Reads from a stream, applies a SQL transformation (filter, project,
              aggregate), and writes to a sink. SQL runs on Cloudflare's
              infrastructure with no external compute needed.
            </li>
            <li>
              <strong className="text-wash-300">Sink</strong> &mdash;
              The output destination. Currently supports R2 buckets with Parquet
              or JSON format, and the R2 Data Catalog for Iceberg table management.
            </li>
          </ul>
        </section>

        {/* Creating Streams */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Creating Streams
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Streams are created via the Wrangler CLI. Each stream has a name and
            an optional schema that enforces the shape of events at ingest time.
          </p>
          <CodeBlock title="Terminal" lang="bash">
            <span className="syn-cmt">{"# Create a stream with an inline schema"}</span>
            {"\n"}
            <span className="syn-fn">wrangler</span>{" "}
            <span className="syn-const">pipelines streams create</span>{" "}
            <span className="syn-str">analytics-events</span>{" "}
            <span className="syn-op">\</span>
            {"\n"}
            {"  "}<span className="syn-op">--schema</span>{" "}
            <span className="syn-str">
              {"'{ \"fields\": ["}
              {"\n"}
              {"    { \"name\": \"event_type\", \"type\": \"string\", \"required\": true },"}
              {"\n"}
              {"    { \"name\": \"user_id\", \"type\": \"string\", \"required\": true },"}
              {"\n"}
              {"    { \"name\": \"amount\", \"type\": \"float64\" },"}
              {"\n"}
              {"    { \"name\": \"timestamp\", \"type\": \"timestamp\" }"}
              {"\n"}
              {"  ] }'"}
            </span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed mb-4">
            Supported schema field types:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-denim-700">
                  <th className="py-2 pr-4 text-denim-400 font-medium">Type</th>
                  <th className="py-2 text-denim-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-denim-300">
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2">UTF-8 string value</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">int64</code></td>
                  <td className="py-2">64-bit signed integer</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">float64</code></td>
                  <td className="py-2">64-bit floating point number</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">boolean</code></td>
                  <td className="py-2">True or false</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">timestamp</code></td>
                  <td className="py-2">ISO 8601 timestamp string, stored as microsecond precision</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">json</code></td>
                  <td className="py-2">Arbitrary nested JSON object (not queryable in pipeline SQL)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-denim-300 leading-relaxed mt-4">
            Schemas are <strong className="text-wash-300">immutable</strong>{" "}
            after creation. To change a schema, create a new stream and migrate
            your pipeline to read from it.
          </p>
        </section>

        {/* Creating Sinks */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Creating Sinks
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Sinks define where processed events are delivered. Currently two sink
            types are supported: direct R2 output (Parquet or JSON files) and the
            R2 Data Catalog (Iceberg tables managed by Cloudflare).
          </p>

          <h3 className="text-lg font-medium text-wash-300 mt-6 mb-2">
            R2 Sink (Parquet/JSON)
          </h3>
          <p className="text-denim-300 leading-relaxed mb-4">
            Writes batched events to an R2 bucket as Parquet or JSON files.
            Files are partitioned by time and compressed automatically.
          </p>
          <CodeBlock title="Terminal" lang="bash">
            <span className="syn-fn">wrangler</span>{" "}
            <span className="syn-const">pipelines sinks create</span>{" "}
            <span className="syn-str">analytics-r2</span>{" "}
            <span className="syn-op">\</span>
            {"\n"}
            {"  "}<span className="syn-op">--type</span>{" "}
            <span className="syn-str">r2</span>{" "}
            <span className="syn-op">\</span>
            {"\n"}
            {"  "}<span className="syn-op">--bucket</span>{" "}
            <span className="syn-str">my-analytics-bucket</span>{" "}
            <span className="syn-op">\</span>
            {"\n"}
            {"  "}<span className="syn-op">--format</span>{" "}
            <span className="syn-str">parquet</span>{" "}
            <span className="syn-op">\</span>
            {"\n"}
            {"  "}<span className="syn-op">--compression</span>{" "}
            <span className="syn-str">zstd</span>
          </CodeBlock>

          <h3 className="text-lg font-medium text-wash-300 mt-6 mb-2">
            R2 Data Catalog Sink (Iceberg)
          </h3>
          <p className="text-denim-300 leading-relaxed mb-4">
            Writes events as Apache Iceberg tables managed by the R2 Data Catalog.
            This enables querying with tools like DuckDB, Spark, or Trino directly
            against R2 without additional metadata infrastructure.
          </p>
          <CodeBlock title="Terminal" lang="bash">
            <span className="syn-fn">wrangler</span>{" "}
            <span className="syn-const">pipelines sinks create</span>{" "}
            <span className="syn-str">analytics-iceberg</span>{" "}
            <span className="syn-op">\</span>
            {"\n"}
            {"  "}<span className="syn-op">--type</span>{" "}
            <span className="syn-str">r2-data-catalog</span>{" "}
            <span className="syn-op">\</span>
            {"\n"}
            {"  "}<span className="syn-op">--bucket</span>{" "}
            <span className="syn-str">my-analytics-bucket</span>{" "}
            <span className="syn-op">\</span>
            {"\n"}
            {"  "}<span className="syn-op">--catalog</span>{" "}
            <span className="syn-str">my-catalog</span>{" "}
            <span className="syn-op">\</span>
            {"\n"}
            {"  "}<span className="syn-op">--database</span>{" "}
            <span className="syn-str">analytics</span>{" "}
            <span className="syn-op">\</span>
            {"\n"}
            {"  "}<span className="syn-op">--table</span>{" "}
            <span className="syn-str">events</span>
          </CodeBlock>

          <p className="text-denim-300 leading-relaxed mt-4 mb-2">
            Supported compression options for R2 sinks:
          </p>
          <ul className="list-disc list-inside text-denim-300 space-y-1">
            <li>
              <code className="inline-code">zstd</code> &mdash; Best
              compression ratio, recommended for most workloads
            </li>
            <li>
              <code className="inline-code">gzip</code> &mdash; Wide
              compatibility with existing tools
            </li>
            <li>
              <code className="inline-code">snappy</code> &mdash; Fastest
              decompression, good for interactive queries
            </li>
            <li>
              <code className="inline-code">none</code> &mdash; No compression,
              useful for debugging or small volumes
            </li>
          </ul>
        </section>

        {/* Creating Pipelines */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Creating Pipelines
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Pipelines connect a stream to a sink with an optional SQL
            transformation. The SQL runs on Cloudflare's infrastructure and
            supports filtering, projection, and basic aggregation.
          </p>
          <CodeBlock title="Terminal" lang="bash">
            <span className="syn-cmt">{"# Simple pass-through pipeline"}</span>
            {"\n"}
            <span className="syn-fn">wrangler</span>{" "}
            <span className="syn-const">pipelines create</span>{" "}
            <span className="syn-str">analytics-pipeline</span>{" "}
            <span className="syn-op">\</span>
            {"\n"}
            {"  "}<span className="syn-op">--stream</span>{" "}
            <span className="syn-str">analytics-events</span>{" "}
            <span className="syn-op">\</span>
            {"\n"}
            {"  "}<span className="syn-op">--sink</span>{" "}
            <span className="syn-str">analytics-r2</span>
          </CodeBlock>
          <CodeBlock title="Terminal (with SQL filter)" lang="bash">
            <span className="syn-cmt">{"# Pipeline with SQL transformation"}</span>
            {"\n"}
            <span className="syn-fn">wrangler</span>{" "}
            <span className="syn-const">pipelines create</span>{" "}
            <span className="syn-str">purchases-only</span>{" "}
            <span className="syn-op">\</span>
            {"\n"}
            {"  "}<span className="syn-op">--stream</span>{" "}
            <span className="syn-str">analytics-events</span>{" "}
            <span className="syn-op">\</span>
            {"\n"}
            {"  "}<span className="syn-op">--sink</span>{" "}
            <span className="syn-str">analytics-iceberg</span>{" "}
            <span className="syn-op">\</span>
            {"\n"}
            {"  "}<span className="syn-op">--sql</span>{" "}
            <span className="syn-str">
              {"\"SELECT event_type, user_id, amount, timestamp "}
              {"FROM stream WHERE event_type = 'purchase' AND amount > 0\""}
            </span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed mb-4">
            The SQL dialect supports:
          </p>
          <ul className="list-disc list-inside text-denim-300 space-y-1">
            <li>
              <code className="inline-code">SELECT</code> with column projection
              and aliases
            </li>
            <li>
              <code className="inline-code">WHERE</code> for filtering rows
            </li>
            <li>
              <code className="inline-code">CASE</code> expressions for
              conditional logic
            </li>
            <li>
              String functions:{" "}
              <code className="inline-code">LOWER()</code>,{" "}
              <code className="inline-code">UPPER()</code>,{" "}
              <code className="inline-code">CONCAT()</code>,{" "}
              <code className="inline-code">SUBSTRING()</code>
            </li>
            <li>
              Math functions:{" "}
              <code className="inline-code">ROUND()</code>,{" "}
              <code className="inline-code">ABS()</code>,{" "}
              <code className="inline-code">FLOOR()</code>,{" "}
              <code className="inline-code">CEIL()</code>
            </li>
            <li>
              The source table is always referenced as{" "}
              <code className="inline-code">stream</code> in the FROM clause
            </li>
          </ul>
        </section>

        {/* Binding to Workers */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Binding to Workers
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Pass the pipeline resource into a Worker's{" "}
            <code className="inline-code">bindings</code> map. At runtime the
            Worker uses the binding to send events to the stream. The binding
            exposes a <code className="inline-code">Pipeline&lt;T&gt;</code>{" "}
            type with a <code className="inline-code">send()</code> method.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">events</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addPipeline</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"analytics-stream"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">streamId</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"stream-abc123"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">api</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addWorker</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"api"</span>
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
            <span className="syn-prop">EVENTS</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">events</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed mb-4">
            In your Worker code, send events using the binding:
          </p>
          <CodeBlock title="src/index.ts" lang="ts">
            <span className="syn-kw">interface</span>{" "}
            <span className="syn-type">AnalyticsEvent</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">event_type</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-type">string</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"  "}<span className="syn-prop">user_id</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-type">string</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"  "}<span className="syn-prop">amount</span>
            <span className="syn-punc">?:</span>{" "}
            <span className="syn-type">number</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"  "}<span className="syn-prop">timestamp</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-type">string</span>
            <span className="syn-punc">;</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            {"\n\n"}
            <span className="syn-kw">interface</span>{" "}
            <span className="syn-type">Env</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">EVENTS</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-type">Pipeline</span>
            <span className="syn-punc">&lt;</span>
            <span className="syn-type">AnalyticsEvent</span>
            <span className="syn-punc">&gt;</span>
            <span className="syn-punc">;</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            {"\n\n"}
            <span className="syn-kw">export default</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-kw">async</span>{" "}
            <span className="syn-fn">fetch</span>
            <span className="syn-punc">(</span>
            <span className="syn-const">request</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-type">Request</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-const">env</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-type">Env</span>
            <span className="syn-punc">)</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"    "}<span className="syn-cmt">{"// Send a single event"}</span>
            {"\n"}
            {"    "}<span className="syn-kw">await</span>{" "}
            <span className="syn-const">env</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">EVENTS</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">send</span>
            <span className="syn-punc">(</span>
            <span className="syn-punc">[</span>
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"      "}<span className="syn-prop">event_type</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"page_view"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"      "}<span className="syn-prop">user_id</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"usr_123"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"      "}<span className="syn-prop">timestamp</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-kw">new</span>{" "}
            <span className="syn-type">Date</span>
            <span className="syn-punc">().</span>
            <span className="syn-fn">toISOString</span>
            <span className="syn-punc">()</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"    "}<span className="syn-punc">{"}]"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            {"    "}<span className="syn-kw">return new</span>{" "}
            <span className="syn-type">Response</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"OK"</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>{" "}
            <span className="syn-kw">satisfies</span>{" "}
            <span className="syn-type">ExportedHandler</span>
            <span className="syn-punc">&lt;</span>
            <span className="syn-type">Env</span>
            <span className="syn-punc">&gt;</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed">
            The <code className="inline-code">send()</code> method accepts an
            array of events. Events are batched automatically by the runtime for
            efficient delivery. The generic type parameter on{" "}
            <code className="inline-code">Pipeline&lt;T&gt;</code> provides
            compile-time type safety for event payloads.
          </p>
        </section>

        {/* Pipeline Options Reference */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Pipeline Options Reference
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            All properties available when calling{" "}
            <code className="inline-code">app.addPipeline(name, options)</code>.
          </p>
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
                  <td className="py-2 pr-4"><code className="inline-code">streamId</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">required</td>
                  <td className="py-2">The ID of the stream to bind to (from <code className="inline-code">wrangler pipelines streams list</code>)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-denim-300 leading-relaxed mt-4">
            The <code className="inline-code">streamId</code> is the only
            required option. Streams, pipelines (SQL transforms), and sinks are
            created and managed via the Wrangler CLI. The Levi resource
            declaration binds an existing stream to a Worker so it can send events
            at runtime.
          </p>
        </section>

        {/* Generated Config */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Generated Config
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            When you run <code className="inline-code">levi build</code>, Levi
            generates the <code className="inline-code">pipelines</code> array
            in the Worker's{" "}
            <code className="inline-code">wrangler.jsonc</code>. Each entry
            maps a binding name to a stream ID.
          </p>
          <CodeBlock title="wrangler.jsonc (api worker)" lang="jsonc">
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">"name"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"api"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">"pipelines"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">[</span>
            {"\n"}
            {"    "}<span className="syn-punc">{"{"}</span>
            {"\n"}
            {"      "}<span className="syn-prop">"binding"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"EVENTS"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"      "}<span className="syn-prop">"pipeline"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"stream-abc123"</span>
            {"\n"}
            {"    "}<span className="syn-punc">{"}"}</span>
            {"\n"}
            {"  "}<span className="syn-punc">]</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed">
            The <code className="inline-code">binding</code> field matches the
            key used in the Worker's{" "}
            <code className="inline-code">bindings</code> map. The{" "}
            <code className="inline-code">pipeline</code> field is the stream ID
            that the Worker sends events to. Cloudflare routes events from the
            stream through any connected pipelines to their configured sinks.
          </p>
        </section>

        {/* Full Example */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Full Example
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            A complete ecommerce analytics setup: an API Worker captures user
            events (page views, add-to-cart, purchases), sends them to a pipeline
            stream, where a SQL transformation filters purchase events and routes
            them to an Iceberg table on R2 for downstream analytics.
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
            <span className="syn-str">"ecommerce"</span>
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
            <span className="syn-cmt">{"// Analytics pipeline — bound to a pre-created stream"}</span>
            {"\n"}
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">analytics</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addPipeline</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"analytics-stream"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">streamId</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"stream-ecom-events"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-cmt">{"// R2 bucket for raw event storage"}</span>
            {"\n"}
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">dataBucket</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addR2</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"analytics-data"</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-cmt">{"// API Worker — captures and sends events"}</span>
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
            {"    "}<span className="syn-prop">EVENTS</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">analytics</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"    "}<span className="syn-prop">DATA</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">dataBucket</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"}"}</span>
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

          <CodeBlock title="src/api/index.ts (Worker)" lang="ts">
            <span className="syn-kw">interface</span>{" "}
            <span className="syn-type">EcomEvent</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">event_type</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"page_view"</span>{" "}
            <span className="syn-op">|</span>{" "}
            <span className="syn-str">"add_to_cart"</span>{" "}
            <span className="syn-op">|</span>{" "}
            <span className="syn-str">"purchase"</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"  "}<span className="syn-prop">user_id</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-type">string</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"  "}<span className="syn-prop">product_id</span>
            <span className="syn-punc">?:</span>{" "}
            <span className="syn-type">string</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"  "}<span className="syn-prop">amount</span>
            <span className="syn-punc">?:</span>{" "}
            <span className="syn-type">number</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"  "}<span className="syn-prop">timestamp</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-type">string</span>
            <span className="syn-punc">;</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            {"\n\n"}
            <span className="syn-kw">interface</span>{" "}
            <span className="syn-type">Env</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">EVENTS</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-type">Pipeline</span>
            <span className="syn-punc">&lt;</span>
            <span className="syn-type">EcomEvent</span>
            <span className="syn-punc">&gt;</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"  "}<span className="syn-prop">DATA</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-type">R2Bucket</span>
            <span className="syn-punc">;</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            {"\n\n"}
            <span className="syn-kw">export default</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-kw">async</span>{" "}
            <span className="syn-fn">fetch</span>
            <span className="syn-punc">(</span>
            <span className="syn-const">request</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-type">Request</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-const">env</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-type">Env</span>
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
            {"\n\n"}
            {"    "}<span className="syn-cmt">{"// Track page views"}</span>
            {"\n"}
            {"    "}<span className="syn-kw">if</span>{" "}
            <span className="syn-punc">(</span>
            <span className="syn-const">url</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">pathname</span>{" "}
            <span className="syn-op">===</span>{" "}
            <span className="syn-str">"/track"</span>{" "}
            <span className="syn-op">&&</span>{" "}
            <span className="syn-const">request</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">method</span>{" "}
            <span className="syn-op">===</span>{" "}
            <span className="syn-str">"POST"</span>
            <span className="syn-punc">)</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"      "}<span className="syn-kw">const</span>{" "}
            <span className="syn-const">body</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-kw">await</span>{" "}
            <span className="syn-const">request</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">json</span>
            <span className="syn-punc">&lt;</span>
            <span className="syn-type">EcomEvent</span>
            <span className="syn-punc">&gt;</span>
            <span className="syn-punc">()</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            {"      "}<span className="syn-cmt">{"// Send event to the pipeline stream"}</span>
            {"\n"}
            {"      "}<span className="syn-kw">await</span>{" "}
            <span className="syn-const">env</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">EVENTS</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">send</span>
            <span className="syn-punc">(</span>
            <span className="syn-punc">[</span>
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"        "}<span className="syn-op">...</span>
            <span className="syn-const">body</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"        "}<span className="syn-prop">timestamp</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-kw">new</span>{" "}
            <span className="syn-type">Date</span>
            <span className="syn-punc">().</span>
            <span className="syn-fn">toISOString</span>
            <span className="syn-punc">()</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"      "}<span className="syn-punc">{"}]"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            {"      "}<span className="syn-kw">return new</span>{" "}
            <span className="syn-type">Response</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"Event tracked"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">status</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">202</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"    "}<span className="syn-punc">{"}"}</span>
            {"\n\n"}
            {"    "}<span className="syn-cmt">{"// Batch send for checkout flows"}</span>
            {"\n"}
            {"    "}<span className="syn-kw">if</span>{" "}
            <span className="syn-punc">(</span>
            <span className="syn-const">url</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">pathname</span>{" "}
            <span className="syn-op">===</span>{" "}
            <span className="syn-str">"/checkout"</span>{" "}
            <span className="syn-op">&&</span>{" "}
            <span className="syn-const">request</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">method</span>{" "}
            <span className="syn-op">===</span>{" "}
            <span className="syn-str">"POST"</span>
            <span className="syn-punc">)</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"      "}<span className="syn-kw">const</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-const">userId</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-const">items</span>{" "}
            <span className="syn-punc">{"}"}</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-kw">await</span>{" "}
            <span className="syn-const">request</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">json</span>
            <span className="syn-punc">&lt;</span>
            <span className="syn-kw">any</span>
            <span className="syn-punc">&gt;</span>
            <span className="syn-punc">()</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"      "}<span className="syn-kw">const</span>{" "}
            <span className="syn-const">now</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-kw">new</span>{" "}
            <span className="syn-type">Date</span>
            <span className="syn-punc">().</span>
            <span className="syn-fn">toISOString</span>
            <span className="syn-punc">()</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            {"      "}<span className="syn-cmt">{"// Send multiple events in one call"}</span>
            {"\n"}
            {"      "}<span className="syn-kw">await</span>{" "}
            <span className="syn-const">env</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">EVENTS</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">send</span>
            <span className="syn-punc">(</span>
            {"\n"}
            {"        "}<span className="syn-const">items</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">map</span>
            <span className="syn-punc">((</span>
            <span className="syn-const">item</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-kw">any</span>
            <span className="syn-punc">)</span>{" "}
            <span className="syn-op">=&gt;</span>{" "}
            <span className="syn-punc">({"{"}</span>
            {"\n"}
            {"          "}<span className="syn-prop">event_type</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"purchase"</span>{" "}
            <span className="syn-kw">as const</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"          "}<span className="syn-prop">user_id</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">userId</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"          "}<span className="syn-prop">product_id</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">item</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">id</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"          "}<span className="syn-prop">amount</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">item</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">price</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"          "}<span className="syn-prop">timestamp</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">now</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"        "}<span className="syn-punc">{"})"}</span>
            <span className="syn-punc">)</span>
            {"\n"}
            {"      "}<span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            {"      "}<span className="syn-kw">return new</span>{" "}
            <span className="syn-type">Response</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"Checkout complete"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">status</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">200</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"    "}<span className="syn-punc">{"}"}</span>
            {"\n\n"}
            {"    "}<span className="syn-kw">return new</span>{" "}
            <span className="syn-type">Response</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"Not Found"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">status</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">404</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>{" "}
            <span className="syn-kw">satisfies</span>{" "}
            <span className="syn-type">ExportedHandler</span>
            <span className="syn-punc">&lt;</span>
            <span className="syn-type">Env</span>
            <span className="syn-punc">&gt;</span>
            <span className="syn-punc">;</span>
          </CodeBlock>

          <p className="text-denim-300 leading-relaxed mt-4 mb-2">
            The corresponding Wrangler CLI commands to set up the pipeline
            infrastructure:
          </p>
          <CodeBlock title="Terminal (setup)" lang="bash">
            <span className="syn-cmt">{"# 1. Create the stream with schema"}</span>
            {"\n"}
            <span className="syn-fn">wrangler</span>{" "}
            <span className="syn-const">pipelines streams create</span>{" "}
            <span className="syn-str">ecom-events</span>{" "}
            <span className="syn-op">\</span>
            {"\n"}
            {"  "}<span className="syn-op">--schema</span>{" "}
            <span className="syn-str">
              {"'{ \"fields\": ["}
              {"\n"}
              {"    { \"name\": \"event_type\", \"type\": \"string\", \"required\": true },"}
              {"\n"}
              {"    { \"name\": \"user_id\", \"type\": \"string\", \"required\": true },"}
              {"\n"}
              {"    { \"name\": \"product_id\", \"type\": \"string\" },"}
              {"\n"}
              {"    { \"name\": \"amount\", \"type\": \"float64\" },"}
              {"\n"}
              {"    { \"name\": \"timestamp\", \"type\": \"timestamp\" }"}
              {"\n"}
              {"  ] }'"}
            </span>
            {"\n\n"}
            <span className="syn-cmt">{"# 2. Create R2 Data Catalog sink"}</span>
            {"\n"}
            <span className="syn-fn">wrangler</span>{" "}
            <span className="syn-const">pipelines sinks create</span>{" "}
            <span className="syn-str">ecom-iceberg</span>{" "}
            <span className="syn-op">\</span>
            {"\n"}
            {"  "}<span className="syn-op">--type</span>{" "}
            <span className="syn-str">r2-data-catalog</span>{" "}
            <span className="syn-op">\</span>
            {"\n"}
            {"  "}<span className="syn-op">--bucket</span>{" "}
            <span className="syn-str">analytics-data</span>{" "}
            <span className="syn-op">\</span>
            {"\n"}
            {"  "}<span className="syn-op">--catalog</span>{" "}
            <span className="syn-str">ecom-catalog</span>{" "}
            <span className="syn-op">\</span>
            {"\n"}
            {"  "}<span className="syn-op">--database</span>{" "}
            <span className="syn-str">analytics</span>{" "}
            <span className="syn-op">\</span>
            {"\n"}
            {"  "}<span className="syn-op">--table</span>{" "}
            <span className="syn-str">events</span>
            {"\n\n"}
            <span className="syn-cmt">{"# 3. Create pipeline with SQL filter for purchases"}</span>
            {"\n"}
            <span className="syn-fn">wrangler</span>{" "}
            <span className="syn-const">pipelines create</span>{" "}
            <span className="syn-str">ecom-purchases</span>{" "}
            <span className="syn-op">\</span>
            {"\n"}
            {"  "}<span className="syn-op">--stream</span>{" "}
            <span className="syn-str">ecom-events</span>{" "}
            <span className="syn-op">\</span>
            {"\n"}
            {"  "}<span className="syn-op">--sink</span>{" "}
            <span className="syn-str">ecom-iceberg</span>{" "}
            <span className="syn-op">\</span>
            {"\n"}
            {"  "}<span className="syn-op">--sql</span>{" "}
            <span className="syn-str">
              {"\"SELECT user_id, product_id, amount, timestamp "}
              {"FROM stream WHERE event_type = 'purchase'\""}
            </span>
            {"\n\n"}
            <span className="syn-cmt">{"# 4. Deploy with Levi"}</span>
            {"\n"}
            <span className="syn-fn">levi</span>{" "}
            <span className="syn-const">build</span>
            {"\n"}
            <span className="syn-fn">levi</span>{" "}
            <span className="syn-const">deploy</span>
          </CodeBlock>
        </section>

        {/* Limitations */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Limitations
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Pipelines are currently in{" "}
            <strong className="text-redtab-400">beta</strong>. Be aware of the
            following constraints:
          </p>
          <ul className="list-disc list-inside text-denim-300 space-y-2">
            <li>
              <strong className="text-wash-300">Account limits</strong> &mdash;
              Maximum of 20 streams, 20 pipelines, and 20 sinks per account
              during beta.
            </li>
            <li>
              <strong className="text-wash-300">Payload size</strong> &mdash;
              Each <code className="inline-code">send()</code> call is limited to
              5 MB total payload. Split large event batches across multiple calls.
            </li>
            <li>
              <strong className="text-wash-300">Immutable schemas</strong>{" "}
              &mdash; Stream schemas cannot be modified after creation. To evolve
              a schema, create a new stream and update your pipeline configuration.
            </li>
            <li>
              <strong className="text-wash-300">SQL subset</strong> &mdash;
              Pipeline SQL supports filtering and projection but does not support
              JOINs, subqueries, window functions, or GROUP BY aggregation.
            </li>
            <li>
              <strong className="text-wash-300">Sink types</strong> &mdash;
              Only R2 (Parquet/JSON) and R2 Data Catalog (Iceberg) sinks are
              available. External destinations (S3, BigQuery, webhooks) are not
              yet supported.
            </li>
            <li>
              <strong className="text-wash-300">Delivery latency</strong> &mdash;
              Events are batched before delivery to sinks. Expect 1&ndash;5 minute
              latency between sending an event and seeing it in R2, depending on
              batch fill rate.
            </li>
            <li>
              <strong className="text-wash-300">Beta API surface</strong> &mdash;
              CLI commands, configuration fields, and runtime APIs may change
              before general availability. Pin your wrangler version and check
              release notes on upgrade.
            </li>
          </ul>
        </section>

        {/* Next Steps */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Next Steps
          </h2>
          <ul className="list-disc list-inside text-denim-300 space-y-2">
            <li>
              <Link href="/docs/r2" className="text-wash-400 hover:text-wash-300 underline">
                R2 Buckets
              </Link>{" "}
              &mdash; Set up the R2 bucket that pipelines deliver events to
            </li>
            <li>
              <Link href="/docs/workers" className="text-wash-400 hover:text-wash-300 underline">
                Workers
              </Link>{" "}
              &mdash; Learn how Workers send events to pipeline streams
            </li>
            <li>
              <Link href="/docs/queues" className="text-wash-400 hover:text-wash-300 underline">
                Queues
              </Link>{" "}
              &mdash; For message-passing patterns (vs. analytics streaming)
            </li>
            <li>
              <Link href="/docs/containers" className="text-wash-400 hover:text-wash-300 underline">
                Containers
              </Link>{" "}
              &mdash; Run custom processing workloads alongside pipeline streams
            </li>
          </ul>
        </section>
      </div>
    </DocLayout>
  );
}
