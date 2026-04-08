import { DocLayout } from "../../../components/DocLayout";
import { CodeBlock } from "../../../components/CodeBlock";

export const metadata = {
  title: "R2 Buckets — Levi Docs",
  description:
    "Declare Cloudflare R2 object storage buckets with CORS, lifecycle rules, and jurisdiction — all in TypeScript.",
};

export default function R2Page() {
  return (
    <DocLayout>
      {/* ── Header ─────────────────────────────────── */}
      <div className="stitch-border-b pb-8 mb-10">
        <h1 className="text-4xl font-bold text-wash-300 mb-3">R2 Buckets</h1>
        <p className="text-lg text-denim-300 leading-relaxed max-w-2xl">
          Cloudflare R2 is S3-compatible object storage with zero egress fees.
          With Levi, you declare R2 buckets with CORS rules, lifecycle policies,
          and jurisdiction settings — then bind them to workers for direct
          access from the edge.
        </p>
      </div>

      {/* ── Overview ───────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">Overview</h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          <code className="inline-code">addR2(name, options?)</code> registers an
          R2 bucket resource in the Levi application model. R2 provides an
          S3-compatible API for storing and retrieving objects of any size, with
          automatic global distribution and zero egress fees.
        </p>
        <ul className="list-disc list-inside text-denim-200 space-y-1 ml-2">
          <li>S3-compatible API — use existing S3 SDKs and tools</li>
          <li>Zero egress fees — no charges for data transfer out</li>
          <li>Objects up to 5 TB each</li>
          <li>Automatic multipart upload support</li>
          <li>Conditional operations with ETags and HTTP headers</li>
          <li>Worker bindings for zero-latency access from the edge</li>
          <li>Optional CORS configuration for browser uploads</li>
          <li>Lifecycle rules for automatic object expiration</li>
          <li>Jurisdiction restrictions for data sovereignty compliance</li>
        </ul>
      </section>

      {/* ── Basic Usage ────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">Basic Usage</h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          Create an R2 bucket and bind it to a worker:
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
          <span className="syn-const">uploads</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addR2</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"uploads"</span>
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
          <span className="syn-str">"./src/api.ts"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">bindings</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">UPLOADS</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">uploads</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
        </CodeBlock>
      </section>

      {/* ── CORS Configuration ─────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">
          CORS Configuration
        </h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          If your bucket needs to accept direct uploads from the browser (e.g.
          presigned URLs or direct PUT requests), configure CORS with the{" "}
          <code className="inline-code">allowedOrigins</code> option. This sets
          the appropriate CORS headers on the bucket.
        </p>
        <CodeBlock title="CORS-enabled bucket" lang="typescript">
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">uploads</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addR2</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"uploads"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">allowedOrigins</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">[</span>
          {"\n"}
          {"    "}
          <span className="syn-str">"https://app.example.com"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-str">"https://admin.example.com"</span>
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
        <p className="text-denim-200 leading-relaxed mb-4">
          For development, you can add{" "}
          <code className="inline-code">"http://localhost:3000"</code> to the
          origins array. In production, restrict this to your actual domain(s)
          to prevent unauthorized uploads.
        </p>
        <CodeBlock title="Wide-open CORS (development only)" lang="typescript">
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">devBucket</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addR2</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"dev-uploads"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">allowedOrigins</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">[</span>
          <span className="syn-str">"*"</span>
          <span className="syn-punc">]</span>
          <span className="syn-punc">,</span>
          {"  "}
          <span className="syn-cmt">{"// DO NOT use in production"}</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
        </CodeBlock>
      </section>

      {/* ── Lifecycle Rules ────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">
          Lifecycle Rules
        </h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          Automatically expire and delete objects after a specified number of
          days. This is useful for temporary files, build artifacts, or
          compliance-driven data retention policies.
        </p>
        <CodeBlock title="Lifecycle configuration" lang="typescript">
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">tempFiles</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addR2</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"temp-files"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">lifecycle</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">[</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">prefix</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"tmp/"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">expiration</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">days</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-num">1</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"     "}
          <span className="syn-cmt">{"// delete after 24 hours"}</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">prefix</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"logs/"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">expiration</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">days</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-num">90</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"    "}
          <span className="syn-cmt">{"// retain logs for 90 days"}</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">prefix</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"builds/"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">expiration</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">days</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-num">30</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"    "}
          <span className="syn-cmt">{"// clean up old builds"}</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"}"}</span>
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
        <p className="text-denim-200 leading-relaxed">
          Each rule targets objects matching a key prefix. Objects are deleted
          automatically after the specified number of days from their upload
          date. Rules without a prefix apply to all objects in the bucket.
        </p>
      </section>

      {/* ── Jurisdiction ───────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">Jurisdiction</h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          For data sovereignty and compliance requirements, restrict where your
          R2 data is stored. The <code className="inline-code">jurisdiction</code>{" "}
          option ensures all objects remain within a specific geographic region.
        </p>
        <CodeBlock title="EU jurisdiction" lang="typescript">
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">euData</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">addR2</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"eu-data"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">jurisdiction</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"eu"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
        </CodeBlock>
        <p className="text-denim-200 leading-relaxed">
          Supported jurisdictions include{" "}
          <code className="inline-code">"eu"</code> for the European Union and{" "}
          <code className="inline-code">"fedramp"</code> for FedRAMP-compliant
          US regions. When a jurisdiction is set, Levi adds the{" "}
          <code className="inline-code">jurisdiction</code> field to the
          generated R2 bucket configuration.
        </p>
      </section>

      {/* ── Options Reference ──────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">
          Options Reference
        </h2>
        <p className="text-denim-200 leading-relaxed mb-6">
          All properties accepted by{" "}
          <code className="inline-code">addR2(name, options?)</code>:
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
                <td className="py-2 pr-4"><code className="inline-code">allowedOrigins</code></td>
                <td className="py-2 pr-4"><code className="inline-code">string[]</code></td>
                <td className="py-2 pr-4">--</td>
                <td className="py-2">CORS allowed origins for browser-based access to the bucket</td>
              </tr>
              <tr className="border-b border-denim-800">
                <td className="py-2 pr-4"><code className="inline-code">lifecycle</code></td>
                <td className="py-2 pr-4"><code className="inline-code">LifecycleRule[]</code></td>
                <td className="py-2 pr-4">--</td>
                <td className="py-2">Array of lifecycle rules with prefix and expiration (days)</td>
              </tr>
              <tr className="border-b border-denim-800">
                <td className="py-2 pr-4"><code className="inline-code">jurisdiction</code></td>
                <td className="py-2 pr-4"><code className="inline-code">"eu" | "fedramp"</code></td>
                <td className="py-2 pr-4">--</td>
                <td className="py-2">Geographic jurisdiction for data sovereignty compliance</td>
              </tr>
              <tr className="border-b border-denim-800">
                <td className="py-2 pr-4"><code className="inline-code">bucketName</code></td>
                <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                <td className="py-2 pr-4">name</td>
                <td className="py-2">Override the actual bucket name (defaults to the resource name)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4"><code className="inline-code">previewBucketName</code></td>
                <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                <td className="py-2 pr-4">--</td>
                <td className="py-2">Separate bucket name for <code className="inline-code">wrangler dev</code> preview environments</td>
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
          When you bind an R2 bucket to a worker, Levi generates the{" "}
          <code className="inline-code">r2_buckets</code> array in the worker's
          wrangler config:
        </p>
        <CodeBlock title="wrangler.jsonc (r2_buckets section)" lang="jsonc">
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-prop">"r2_buckets"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">[</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">"binding"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"UPLOADS"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">"bucket_name"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"uploads"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">"jurisdiction"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"eu"</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">"binding"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"ASSETS"</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">"bucket_name"</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"static-assets"</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"}"}</span>
          {"\n"}
          {"  "}
          <span className="syn-punc">]</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
        </CodeBlock>
      </section>

      {/* ── Usage in Worker Code ───────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">
          Usage in Worker Code
        </h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          Inside your worker, access the R2 bucket through the binding name you
          chose. R2 provides{" "}
          <code className="inline-code">put</code>,{" "}
          <code className="inline-code">get</code>,{" "}
          <code className="inline-code">delete</code>,{" "}
          <code className="inline-code">list</code>, and{" "}
          <code className="inline-code">head</code> methods. Objects include
          rich metadata, ETags, and HTTP-standard headers.
        </p>
        <CodeBlock title="src/api.ts — File upload & retrieval" lang="typescript">
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
          <span className="syn-prop">UPLOADS</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-type">R2Bucket</span>{" "}
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
          <span className="syn-cmt">{"// Upload a file"}</span>
          {"\n"}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">put</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"/files/:key"</span>
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
          <span className="syn-const">key</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">req</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">param</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"key"</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          {"  "}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">body</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-kw">await</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">req</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">arrayBuffer</span>
          <span className="syn-punc">()</span>
          <span className="syn-punc">;</span>
          {"\n"}
          {"  "}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">contentType</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">req</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">header</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"content-type"</span>
          <span className="syn-punc">)</span>{" "}
          <span className="syn-op">||</span>{" "}
          <span className="syn-str">"application/octet-stream"</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          {"  "}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">obj</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-kw">await</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">env</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">UPLOADS</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">put</span>
          <span className="syn-punc">(</span>
          <span className="syn-const">key</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-const">body</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">httpMetadata</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-const">contentType</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">customMetadata</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">uploadedBy</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"api"</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          {"  "}
          <span className="syn-kw">return</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">json</span>
          <span className="syn-punc">(</span>
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"    "}
          <span className="syn-const">key</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">size</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">obj</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">size</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">etag</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">obj</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">httpEtag</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
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
          <span className="syn-cmt">{"// Download a file"}</span>
          {"\n"}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">get</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"/files/:key"</span>
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
          <span className="syn-const">key</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">req</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">param</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"key"</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          {"  "}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">obj</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-kw">await</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">env</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">UPLOADS</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">get</span>
          <span className="syn-punc">(</span>
          <span className="syn-const">key</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          {"  "}
          <span className="syn-kw">if</span>{" "}
          <span className="syn-punc">(</span>
          <span className="syn-op">!</span>
          <span className="syn-const">obj</span>
          <span className="syn-punc">)</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"    "}
          <span className="syn-kw">return</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">json</span>
          <span className="syn-punc">(</span>
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">error</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-str">"Not found"</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-num">404</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          {"  "}
          <span className="syn-punc">{"}"}</span>
          {"\n\n"}
          {"  "}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">headers</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-kw">new</span>{" "}
          <span className="syn-type">Headers</span>
          <span className="syn-punc">()</span>
          <span className="syn-punc">;</span>
          {"\n"}
          {"  "}
          <span className="syn-const">headers</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">set</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"etag"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-const">obj</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">httpEtag</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          {"  "}
          <span className="syn-kw">if</span>{" "}
          <span className="syn-punc">(</span>
          <span className="syn-const">obj</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">httpMetadata</span>
          <span className="syn-op">?.</span>
          <span className="syn-prop">contentType</span>
          <span className="syn-punc">)</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"    "}
          <span className="syn-const">headers</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">set</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"content-type"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-const">obj</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">httpMetadata</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">contentType</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          {"  "}
          <span className="syn-punc">{"}"}</span>
          {"\n\n"}
          {"  "}
          <span className="syn-kw">return</span>{" "}
          <span className="syn-kw">new</span>{" "}
          <span className="syn-type">Response</span>
          <span className="syn-punc">(</span>
          <span className="syn-const">obj</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">body</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-const">headers</span>{" "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">{"// List objects by prefix"}</span>
          {"\n"}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">get</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"/files"</span>
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
          <span className="syn-const">prefix</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">req</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">query</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"prefix"</span>
          <span className="syn-punc">)</span>{" "}
          <span className="syn-op">||</span>{" "}
          <span className="syn-str">""</span>
          <span className="syn-punc">;</span>
          {"\n"}
          {"  "}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">cursor</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">req</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">query</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"cursor"</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          {"  "}
          <span className="syn-kw">const</span>{" "}
          <span className="syn-const">listed</span>{" "}
          <span className="syn-op">=</span>{" "}
          <span className="syn-kw">await</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">env</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">UPLOADS</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">list</span>
          <span className="syn-punc">(</span>
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"    "}
          <span className="syn-const">prefix</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-const">cursor</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">limit</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-num">50</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">include</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-punc">[</span>
          <span className="syn-str">"httpMetadata"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-str">"customMetadata"</span>
          <span className="syn-punc">]</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          {"  "}
          <span className="syn-kw">return</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">json</span>
          <span className="syn-punc">(</span>
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">objects</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">listed</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">objects</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">map</span>
          <span className="syn-punc">(</span>
          <span className="syn-punc">(</span>
          <span className="syn-const">o</span>
          <span className="syn-punc">)</span>{" "}
          <span className="syn-kw">=&gt;</span>{" "}
          <span className="syn-punc">(</span>
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">key</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">o</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">key</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">size</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">o</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">size</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">uploaded</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">o</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">uploaded</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"      "}
          <span className="syn-prop">etag</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">o</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">httpEtag</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">truncated</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">listed</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">truncated</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"    "}
          <span className="syn-prop">cursor</span>
          <span className="syn-punc">:</span>{" "}
          <span className="syn-const">listed</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">truncated</span>{" "}
          <span className="syn-op">?</span>{" "}
          <span className="syn-const">listed</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">cursor</span>{" "}
          <span className="syn-op">:</span>{" "}
          <span className="syn-kw">undefined</span>
          <span className="syn-punc">,</span>
          {"\n"}
          {"  "}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          <span className="syn-punc">{"}"}</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n\n"}
          <span className="syn-cmt">{"// Delete a file"}</span>
          {"\n"}
          <span className="syn-const">app</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">delete</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"/files/:key"</span>
          <span className="syn-punc">,</span>{" "}
          <span className="syn-kw">async</span>{" "}
          <span className="syn-punc">(</span>
          <span className="syn-const">c</span>
          <span className="syn-punc">)</span>{" "}
          <span className="syn-kw">=&gt;</span>{" "}
          <span className="syn-punc">{"{"}</span>
          {"\n"}
          {"  "}
          <span className="syn-kw">await</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">env</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">UPLOADS</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">delete</span>
          <span className="syn-punc">(</span>
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-prop">req</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">param</span>
          <span className="syn-punc">(</span>
          <span className="syn-str">"key"</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">)</span>
          <span className="syn-punc">;</span>
          {"\n"}
          {"  "}
          <span className="syn-kw">return</span>{" "}
          <span className="syn-const">c</span>
          <span className="syn-punc">.</span>
          <span className="syn-fn">json</span>
          <span className="syn-punc">(</span>
          <span className="syn-punc">{"{"}</span>{" "}
          <span className="syn-prop">deleted</span>
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
