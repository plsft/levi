import Link from "next/link";
import { DocLayout } from "../../../components/DocLayout";
import { CodeBlock } from "../../../components/CodeBlock";

export const metadata = {
  title: "Best Practices — Levi Docs",
  description:
    "Platform limits, architecture patterns, pricing traps, deployment gotchas, and workarounds for building production Cloudflare applications with Levi.",
};

export default function BestPracticesPage() {
  return (
    <DocLayout>
      {/* ── Header ─────────────────────────────────── */}
      <div className="stitch-border-b pb-8 mb-10">
        <h1 className="text-4xl font-bold text-wash-300 mb-3">
          Best Practices
        </h1>
        <p className="text-lg text-denim-300 leading-relaxed max-w-2xl">
          Hard-won knowledge from production Cloudflare deployments. Platform
          limits, architecture patterns, pricing traps, and the gotchas that
          won't appear in the happy-path documentation.
        </p>
      </div>

      {/* ── Platform Limits ────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">
          Platform Limits at a Glance
        </h2>
        <p className="text-denim-200 leading-relaxed mb-6">
          Every Cloudflare service has hard limits. Hitting them at 2 AM in
          production is not the time to learn about them. This table covers the
          numbers that matter most.
        </p>

        {/* Workers */}
        <h3 className="text-lg font-bold text-denim-100 mb-3">Workers</h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm text-denim-200 border-collapse">
            <thead>
              <tr className="border-b border-denim-700 text-left">
                <th className="py-2 pr-4 text-denim-300 font-semibold">Limit</th>
                <th className="py-2 pr-4 text-denim-300 font-semibold">Free</th>
                <th className="py-2 pr-4 text-denim-300 font-semibold">Paid</th>
                <th className="py-2 text-denim-300 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-denim-800">
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">CPU time</td>
                <td className="py-2 pr-4">10 ms</td>
                <td className="py-2 pr-4">30 s (up to 5 min)</td>
                <td className="py-2 text-denim-400">CPU time, not wall time. Fetches, KV reads, D1 queries don't count.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Memory</td>
                <td className="py-2 pr-4">128 MB</td>
                <td className="py-2 pr-4">128 MB</td>
                <td className="py-2 text-denim-400">Per isolate, not per request. Graceful restart on exceed.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Script size</td>
                <td className="py-2 pr-4">3 MB gzip</td>
                <td className="py-2 pr-4">10 MB gzip</td>
                <td className="py-2 text-denim-400">64 MB uncompressed on both. Check with <code className="inline-code">wrangler check startup</code>.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Subrequests</td>
                <td className="py-2 pr-4">50</td>
                <td className="py-2 pr-4">1,000+</td>
                <td className="py-2 text-denim-400">Paid default raised to 10,000. Configurable up to 10M.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Request body</td>
                <td className="py-2 pr-4">100 MB</td>
                <td className="py-2 pr-4">100{"\u2013"}500 MB</td>
                <td className="py-2 text-denim-400">Tied to account plan (Pro/Biz/Ent), not Workers plan. Returns 413 if exceeded.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Env vars</td>
                <td className="py-2 pr-4">64</td>
                <td className="py-2 pr-4">128</td>
                <td className="py-2 text-denim-400">Includes secrets. Each value max 5 KB.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Cron triggers</td>
                <td className="py-2 pr-4">5</td>
                <td className="py-2 pr-4">250</td>
                <td className="py-2 text-denim-400">Per account, not per Worker. Cron Workers limited to 15 min wall time.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Startup time</td>
                <td className="py-2 pr-4">1 s</td>
                <td className="py-2 pr-4">1 s</td>
                <td className="py-2 text-denim-400">Global scope must parse + execute in {"<"}1 s. Error 10021 if exceeded.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* D1 */}
        <h3 className="text-lg font-bold text-denim-100 mb-3">D1</h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm text-denim-200 border-collapse">
            <thead>
              <tr className="border-b border-denim-700 text-left">
                <th className="py-2 pr-4 text-denim-300 font-semibold">Limit</th>
                <th className="py-2 pr-4 text-denim-300 font-semibold">Free</th>
                <th className="py-2 pr-4 text-denim-300 font-semibold">Paid</th>
                <th className="py-2 text-denim-300 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-denim-800">
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Database size</td>
                <td className="py-2 pr-4">500 MB</td>
                <td className="py-2 pr-4 font-bold text-redtab-400">10 GB hard cap</td>
                <td className="py-2 text-denim-400">Cannot be increased. Biggest D1 limitation. Use multiple databases.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Databases per account</td>
                <td className="py-2 pr-4">50</td>
                <td className="py-2 pr-4">50,000</td>
                <td className="py-2 text-denim-400">Per-tenant database pattern is explicitly encouraged.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Rows read per query</td>
                <td className="py-2 pr-4">500K</td>
                <td className="py-2 pr-4">500K (soft)</td>
                <td className="py-2 text-denim-400">A single poorly-indexed SELECT can scan millions of rows.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Rows written per query</td>
                <td className="py-2 pr-4">10K</td>
                <td className="py-2 pr-4">10K (soft)</td>
                <td className="py-2 text-denim-400">Batch inserts {">"} 10K need chunking.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Row size</td>
                <td className="py-2 pr-4">~2 MB</td>
                <td className="py-2 pr-4">~2 MB</td>
                <td className="py-2 text-denim-400">TEXT/BLOB columns count toward limit.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Query response</td>
                <td className="py-2 pr-4">20 MB</td>
                <td className="py-2 pr-4">20 MB</td>
                <td className="py-2 text-denim-400">Total payload from a single query.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* KV */}
        <h3 className="text-lg font-bold text-denim-100 mb-3">KV</h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm text-denim-200 border-collapse">
            <thead>
              <tr className="border-b border-denim-700 text-left">
                <th className="py-2 pr-4 text-denim-300 font-semibold">Limit</th>
                <th className="py-2 pr-4 text-denim-300 font-semibold">Value</th>
                <th className="py-2 text-denim-300 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-denim-800">
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Value size</td>
                <td className="py-2 pr-4">25 MB</td>
                <td className="py-2 text-denim-400">Both plans.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Write rate</td>
                <td className="py-2 pr-4 font-bold text-redtab-400">1/sec per key</td>
                <td className="py-2 text-denim-400">Hard limit. Per individual key, not global. Use Durable Objects for faster writes.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Consistency</td>
                <td className="py-2 pr-4">~60 s</td>
                <td className="py-2 text-denim-400">Eventually consistent. Write propagation takes up to 60 seconds globally.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">TTL minimum</td>
                <td className="py-2 pr-4">60 s</td>
                <td className="py-2 text-denim-400">Cannot set TTL below 60 seconds.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Metadata per key</td>
                <td className="py-2 pr-4">1 KB</td>
                <td className="py-2 text-denim-400">JSON metadata attached to each key.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* R2 */}
        <h3 className="text-lg font-bold text-denim-100 mb-3">R2</h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm text-denim-200 border-collapse">
            <thead>
              <tr className="border-b border-denim-700 text-left">
                <th className="py-2 pr-4 text-denim-300 font-semibold">Limit</th>
                <th className="py-2 pr-4 text-denim-300 font-semibold">Value</th>
                <th className="py-2 text-denim-300 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-denim-800">
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Single PUT</td>
                <td className="py-2 pr-4">5 GB</td>
                <td className="py-2 text-denim-400">Use multipart for larger objects.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Multipart max</td>
                <td className="py-2 pr-4">5 TB</td>
                <td className="py-2 text-denim-400">10,000 parts x 5 GB each.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Buckets per account</td>
                <td className="py-2 pr-4">1,000</td>
                <td className="py-2 text-denim-400">Request increase if needed.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">List per request</td>
                <td className="py-2 pr-4">1,000</td>
                <td className="py-2 text-denim-400">Use <code className="inline-code">cursor</code> for pagination. Always check <code className="inline-code">truncated</code>.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Object metadata</td>
                <td className="py-2 pr-4">2 KB</td>
                <td className="py-2 text-denim-400">Immutable after PUT. Store mutable metadata in D1.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Durable Objects */}
        <h3 className="text-lg font-bold text-denim-100 mb-3">Durable Objects</h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm text-denim-200 border-collapse">
            <thead>
              <tr className="border-b border-denim-700 text-left">
                <th className="py-2 pr-4 text-denim-300 font-semibold">Limit</th>
                <th className="py-2 pr-4 text-denim-300 font-semibold">Free</th>
                <th className="py-2 pr-4 text-denim-300 font-semibold">Paid</th>
                <th className="py-2 text-denim-300 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-denim-800">
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Storage per instance</td>
                <td className="py-2 pr-4">1 GB</td>
                <td className="py-2 pr-4">10 GB</td>
                <td className="py-2 text-denim-400">Per individual DO, not total.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Throughput</td>
                <td className="py-2 pr-4" colSpan={2}>~1,000 req/sec</td>
                <td className="py-2 text-denim-400">Soft limit. Single-threaded. Scale horizontally across instances.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Eviction</td>
                <td className="py-2 pr-4" colSpan={2}>~10 s inactivity</td>
                <td className="py-2 text-denim-400">In-memory state lost. Only <code className="inline-code">ctx.storage</code> persists.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">WebSocket message</td>
                <td className="py-2 pr-4" colSpan={2}>32 MB</td>
                <td className="py-2 text-denim-400">Increased from 1 MB in 2025.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Queues */}
        <h3 className="text-lg font-bold text-denim-100 mb-3">Queues</h3>
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm text-denim-200 border-collapse">
            <thead>
              <tr className="border-b border-denim-700 text-left">
                <th className="py-2 pr-4 text-denim-300 font-semibold">Limit</th>
                <th className="py-2 pr-4 text-denim-300 font-semibold">Value</th>
                <th className="py-2 text-denim-300 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-denim-800">
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Message size</td>
                <td className="py-2 pr-4">128 KB</td>
                <td className="py-2 text-denim-400">Messages {">"} 64 KB billed as multiple write operations.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Batch size</td>
                <td className="py-2 pr-4">100 messages / 256 KB</td>
                <td className="py-2 text-denim-400">Consumer receives arrays, not single messages.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Throughput</td>
                <td className="py-2 pr-4">5,000 msg/sec</td>
                <td className="py-2 text-denim-400">Per queue.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-denim-100">Ordering</td>
                <td className="py-2 pr-4">Best-effort</td>
                <td className="py-2 text-denim-400">No FIFO guarantee. At-least-once delivery. Design consumers idempotent.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="stitch-separator my-8" />

      {/* ── Workers Gotchas ────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">
          Workers Gotchas
        </h2>

        <div className="space-y-6">
          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              fetch() to the same zone fails without Service Bindings
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed mb-3">
              Worker A on <code className="inline-code">example.com</code> cannot{" "}
              <code className="inline-code">fetch("https://example.com/api")</code>{" "}
              to reach Worker B. The request loops back to Worker A.
            </p>
            <CodeBlock title="levi.app.ts" lang="typescript">
              <span className="syn-cmt">{"// Use service bindings instead"}</span>
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
              <span className="syn-punc">{"{"}</span>{" "}
              <span className="syn-punc">...</span>{" "}
              <span className="syn-punc">{"}"}</span>
              <span className="syn-punc">)</span>
              <span className="syn-punc">;</span>
              {"\n"}
              <span className="syn-kw">const</span>{" "}
              <span className="syn-const">web</span>{" "}
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
              <span className="syn-punc">{"}"}</span>
              <span className="syn-punc">)</span>
              <span className="syn-punc">;</span>
            </CodeBlock>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              waitUntil() is not durable
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              <code className="inline-code">event.waitUntil()</code> extends
              execution 30 seconds past the response but is not durable. Isolate
              eviction kills in-progress work. Use Queues or Workflows for anything
              that must complete.
            </p>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              Global scope runs once per isolate, not per request
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              Expensive initialization is amortized across requests, but mutable
              global state is shared between concurrent requests. Keep per-request
              state inside the handler.
            </p>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              nodejs_compat is partial
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              The <code className="inline-code">nodejs_compat</code> flag enables{" "}
              <code className="inline-code">node:buffer</code>,{" "}
              <code className="inline-code">node:crypto</code>,{" "}
              <code className="inline-code">node:stream</code>,{" "}
              <code className="inline-code">node:util</code>, and more {"\u2014"} but
              not all methods are implemented. Always test with{" "}
              <code className="inline-code">wrangler dev</code> before deploying.
            </p>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              Compatibility dates matter more than you think
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              Using an old <code className="inline-code">compatibility_date</code>{" "}
              means missing years of fixes and improvements. Always use the latest
              date for new projects. Test before updating existing ones.
            </p>
          </div>
        </div>
      </section>

      <div className="stitch-separator my-8" />

      {/* ── D1 Gotchas ─────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">
          D1 Gotchas
        </h2>

        <div className="space-y-6">
          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              10 GB is a hard cap with no exceptions
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed mb-3">
              Cloudflare will not raise this limit. Your architecture must use many
              small databases. The per-tenant pattern (one D1 per customer) is
              explicitly recommended {"\u2014"} pricing is per-query, not per-database,
              so running thousands of databases is economical.
            </p>
            <CodeBlock title="levi.app.ts" lang="typescript">
              <span className="syn-cmt">{"// Per-tenant isolation"}</span>
              {"\n"}
              <span className="syn-kw">const</span>{" "}
              <span className="syn-const">tenantDb</span>{" "}
              <span className="syn-op">=</span>{" "}
              <span className="syn-const">app</span>
              <span className="syn-punc">.</span>
              <span className="syn-fn">addD1</span>
              <span className="syn-punc">(</span>
              <span className="syn-str">"tenant-db"</span>
              <span className="syn-punc">,</span>{" "}
              <span className="syn-punc">{"{"}</span>{" "}
              <span className="syn-prop">migrations</span>
              <span className="syn-punc">:</span>{" "}
              <span className="syn-str">"./migrations"</span>{" "}
              <span className="syn-punc">{"}"}</span>
              <span className="syn-punc">)</span>
              <span className="syn-punc">;</span>
              {"\n"}
              <span className="syn-kw">const</span>{" "}
              <span className="syn-const">controlDb</span>{" "}
              <span className="syn-op">=</span>{" "}
              <span className="syn-const">app</span>
              <span className="syn-punc">.</span>
              <span className="syn-fn">addD1</span>
              <span className="syn-punc">(</span>
              <span className="syn-str">"control-plane"</span>
              <span className="syn-punc">,</span>{" "}
              <span className="syn-punc">{"{"}</span>{" "}
              <span className="syn-prop">migrations</span>
              <span className="syn-punc">:</span>{" "}
              <span className="syn-str">"./migrations/control"</span>{" "}
              <span className="syn-punc">{"}"}</span>
              <span className="syn-punc">)</span>
              <span className="syn-punc">;</span>
            </CodeBlock>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              Billing is per-row-read, not per-query
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              A <code className="inline-code">SELECT * FROM users</code> scanning
              100K rows costs 100K row-reads even if it returns 10 results. Add
              indexes for every <code className="inline-code">WHERE</code> clause.
              Run <code className="inline-code">EXPLAIN QUERY PLAN</code> on every
              query before shipping.
            </p>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              Single-threaded per database
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              Queries execute sequentially. Heavy concurrent write load increases
              latency. Read replicas help reads, but writes are always sequential.
              For write-heavy workloads, shard across multiple D1 databases.
            </p>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              SQL support has gaps
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              D1 supports CTEs, window functions, <code className="inline-code">RETURNING</code>,{" "}
              and <code className="inline-code">json_extract()</code>. It does{" "}
              <strong>not</strong> support FULL OUTER JOIN, RIGHT OUTER JOIN,
              ALTER COLUMN types, ADD CONSTRAINT after creation, or stored procedures.
              Use the table recreation pattern for schema changes.
            </p>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              Read replicas add eventual consistency
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              With <code className="inline-code">readReplication: true</code>,
              writes go to the primary with ~60 s replication lag. A user writing
              then immediately reading may not see their own write. Use the{" "}
              <code className="inline-code">consistency</code> parameter for
              post-write reads.
            </p>
          </div>
        </div>
      </section>

      <div className="stitch-separator my-8" />

      {/* ── KV & R2 Gotchas ────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">
          KV & R2 Gotchas
        </h2>

        <div className="space-y-6">
          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              KV is not a database
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              KV is eventually consistent with ~60 s propagation. Writing from one
              edge and reading from another returns stale data. 1 write/sec per key
              is a hard limit. For counters, sessions needing updates {">"} 1/sec, or
              anything requiring strong consistency, use Durable Objects.
            </p>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              R2 Workers binding is not the S3 API
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              <code className="inline-code">env.BUCKET.get()</code>,{" "}
              <code className="inline-code">.put()</code>,{" "}
              <code className="inline-code">.list()</code> are Cloudflare-specific.
              If porting S3 code, use the S3-compatible endpoint with an S3 client
              library instead. The Workers binding and S3 API are separate interfaces.
            </p>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              r2.dev URLs are rate-limited
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              Generated <code className="inline-code">r2.dev</code> URLs are for
              development only. Use a custom domain CNAME in production. Strict rate
              limits on <code className="inline-code">r2.dev</code> will throttle
              production traffic.
            </p>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              R2 object metadata is immutable
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              You cannot update metadata without re-uploading the entire object.
              Store mutable metadata in D1 and use R2 for the blob only.
            </p>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              R2 list() returns max 1,000 objects
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              Always check <code className="inline-code">list_result.truncated</code>{" "}
              and use <code className="inline-code">list_result.cursor</code> for
              pagination. This is not <code className="inline-code">startAfter</code>.
            </p>
          </div>
        </div>
      </section>

      <div className="stitch-separator my-8" />

      {/* ── Durable Objects Gotchas ─────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">
          Durable Objects Gotchas
        </h2>

        <div className="space-y-6">
          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              Single-threaded means sequential
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              One request at a time per DO instance. Concurrent requests are queued.
              This gives you strong consistency but limits throughput to ~1,000 req/sec.
              A chat room with all messages routing to one DO will hit this under
              moderate load. Shard by room, user, or time bucket.
            </p>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              Eviction is real
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              DOs are evicted after ~10 seconds of inactivity. The constructor runs
              again on the next request. In-memory state is lost. Only{" "}
              <code className="inline-code">ctx.storage</code> (SQLite or KV)
              persists. Design for reconstruction from storage on every wake-up.
            </p>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              Use SQLite-backed DOs for new classes
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              New classes should use <code className="inline-code">sqlite: true</code>{" "}
              (which maps to <code className="inline-code">new_sqlite_classes</code> in
              migrations), not the legacy KV-backed storage. SQLite DOs support full
              SQL queries within a single instance.
            </p>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              WebSocket Hibernation is critical for scale
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              Use <code className="inline-code">acceptWebSocket()</code> +{" "}
              <code className="inline-code">getWebSockets()</code> for the
              Hibernation API. The DO can be evicted while WebSocket connections stay
              open, waking only on incoming messages. Without this, you pay for idle
              duration.
            </p>
          </div>
        </div>
      </section>

      <div className="stitch-separator my-8" />

      {/* ── Architecture Patterns ──────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">
          Architecture Patterns
        </h2>
        <p className="text-denim-200 leading-relaxed mb-6">
          These patterns have been validated in production. Match the pattern to
          your use case before designing from scratch.
        </p>

        <div className="space-y-8">
          {/* Pattern 1 */}
          <div>
            <h3 className="text-lg font-bold text-denim-100 mb-2">
              Worker {"\u2192"} Queue {"\u2192"} Worker (async processing)
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed mb-3">
              Heavy processing should enqueue work, return 202, and process in a
              dedicated consumer Worker. This prevents long-running jobs from affecting
              API latency and avoids CPU time limits.
            </p>
            <CodeBlock title="levi.app.ts" lang="typescript">
              <span className="syn-kw">const</span>{" "}
              <span className="syn-const">jobs</span>{" "}
              <span className="syn-op">=</span>{" "}
              <span className="syn-const">app</span>
              <span className="syn-punc">.</span>
              <span className="syn-fn">addQueue</span>
              <span className="syn-punc">(</span>
              <span className="syn-str">"jobs"</span>
              <span className="syn-punc">,</span>{" "}
              <span className="syn-punc">{"{"}</span>{" "}
              <span className="syn-prop">retries</span>
              <span className="syn-punc">:</span>{" "}
              <span className="syn-num">3</span>{" "}
              <span className="syn-punc">{"}"}</span>
              <span className="syn-punc">)</span>
              <span className="syn-punc">;</span>
              {"\n\n"}
              <span className="syn-cmt">{"// API enqueues work"}</span>
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
              <span className="syn-prop">framework</span>
              <span className="syn-punc">:</span>{" "}
              <span className="syn-str">"hono"</span>
              <span className="syn-punc">,</span>
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
              <span className="syn-prop">JOBS</span>
              <span className="syn-punc">:</span>{" "}
              <span className="syn-const">jobs</span>{" "}
              <span className="syn-punc">{"}"}</span>
              <span className="syn-punc">,</span>
              {"\n"}
              <span className="syn-punc">{"}"}</span>
              <span className="syn-punc">)</span>
              <span className="syn-punc">;</span>
              {"\n\n"}
              <span className="syn-cmt">{"// Dedicated consumer processes work"}</span>
              {"\n"}
              <span className="syn-const">app</span>
              <span className="syn-punc">.</span>
              <span className="syn-fn">addWorker</span>
              <span className="syn-punc">(</span>
              <span className="syn-str">"processor"</span>
              <span className="syn-punc">,</span>{" "}
              <span className="syn-punc">{"{"}</span>
              {"\n"}
              {"  "}
              <span className="syn-prop">entrypoint</span>
              <span className="syn-punc">:</span>{" "}
              <span className="syn-str">"./src/processor.ts"</span>
              <span className="syn-punc">,</span>
              {"\n"}
              {"  "}
              <span className="syn-prop">consumers</span>
              <span className="syn-punc">:</span>{" "}
              <span className="syn-punc">[{"{"}</span>{" "}
              <span className="syn-prop">queue</span>
              <span className="syn-punc">:</span>{" "}
              <span className="syn-const">jobs</span>
              <span className="syn-punc">,</span>{" "}
              <span className="syn-prop">maxBatchSize</span>
              <span className="syn-punc">:</span>{" "}
              <span className="syn-num">10</span>{" "}
              <span className="syn-punc">{"}]"}</span>
              <span className="syn-punc">,</span>
              {"\n"}
              <span className="syn-punc">{"}"}</span>
              <span className="syn-punc">)</span>
              <span className="syn-punc">;</span>
            </CodeBlock>
          </div>

          {/* Pattern 2 */}
          <div>
            <h3 className="text-lg font-bold text-denim-100 mb-2">
              Worker {"\u2192"} Durable Object (coordination / exactly-once)
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              When you need mutual exclusion, real-time state, or exactly-once
              processing, route requests through a Durable Object. The DO is the
              single source of truth for its entity. Use for rate limiting, distributed
              locks, collaborative editing, and WebSocket rooms.
            </p>
          </div>

          {/* Pattern 3 */}
          <div>
            <h3 className="text-lg font-bold text-denim-100 mb-2">
              R2 for blobs + D1 for metadata
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              Never store blobs in D1 (2 MB row limit, 10 GB database cap). Store the
              file in R2 and the R2 key plus metadata in D1. Since R2 metadata is
              immutable, D1 is the right place for mutable attributes (tags, status,
              access count).
            </p>
          </div>

          {/* Pattern 4 */}
          <div>
            <h3 className="text-lg font-bold text-denim-100 mb-2">
              Service Bindings for microservice decomposition
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed mb-3">
              Split a monolith into multiple Workers communicating via Service
              Bindings (zero-latency RPC within the same colo). Each Worker has its
              own CPU limit, memory, and can be deployed independently.
            </p>
            <CodeBlock title="levi.app.ts" lang="typescript">
              <span className="syn-kw">const</span>{" "}
              <span className="syn-const">auth</span>{" "}
              <span className="syn-op">=</span>{" "}
              <span className="syn-const">app</span>
              <span className="syn-punc">.</span>
              <span className="syn-fn">addWorker</span>
              <span className="syn-punc">(</span>
              <span className="syn-str">"auth"</span>
              <span className="syn-punc">,</span>{" "}
              <span className="syn-punc">{"{"}</span>{" "}
              <span className="syn-punc">...</span>{" "}
              <span className="syn-punc">{"}"}</span>
              <span className="syn-punc">)</span>
              <span className="syn-punc">;</span>
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
              <span className="syn-prop">bindings</span>
              <span className="syn-punc">:</span>{" "}
              <span className="syn-punc">{"{"}</span>{" "}
              <span className="syn-prop">AUTH</span>
              <span className="syn-punc">:</span>{" "}
              <span className="syn-const">auth</span>
              <span className="syn-punc">.</span>
              <span className="syn-fn">asService</span>
              <span className="syn-punc">()</span>{" "}
              <span className="syn-punc">{"}"}</span>
              <span className="syn-punc">,</span>
              {"\n"}
              <span className="syn-punc">{"}"}</span>
              <span className="syn-punc">)</span>
              <span className="syn-punc">;</span>
            </CodeBlock>
          </div>

          {/* Pattern 5 */}
          <div>
            <h3 className="text-lg font-bold text-denim-100 mb-2">
              Multiple D1 databases for tenant isolation
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              One D1 per tenant gives each customer their own 10 GB, independent
              backup, and performance isolation. D1 supports up to 50,000 databases
              per account, and billing is per-query not per-database. This is the
              recommended SaaS architecture.
            </p>
          </div>
        </div>
      </section>

      <div className="stitch-separator my-8" />

      {/* ── Pricing Traps ──────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">
          Pricing Traps
        </h2>
        <p className="text-denim-200 leading-relaxed mb-6">
          These are the cost surprises teams encounter after going to production.
        </p>

        <div className="space-y-6">
          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-redtab-400 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              D1 row reads are the #1 surprise bill
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              A single poorly-indexed <code className="inline-code">SELECT</code>{" "}
              scanning 1M rows costs 1M row-reads at $0.001/million. Run{" "}
              <code className="inline-code">EXPLAIN QUERY PLAN</code> on every
              production query. Add indexes for every{" "}
              <code className="inline-code">WHERE</code> clause.
            </p>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-redtab-400 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              Workers CPU billing compounds
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              After the first 10M requests/month: $0.30/million requests{" "}
              <strong>plus</strong> $0.02/million ms CPU. Compute-heavy Workers can
              have CPU charges exceed request charges. Profile with{" "}
              <code className="inline-code">wrangler tail</code> to find hot paths.
            </p>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-redtab-400 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              R2 write operations cost 10x reads
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              <code className="inline-code">put()</code> = Class A ($4.50/million).{" "}
              <code className="inline-code">get()</code> = Class B ($0.36/million).
              Small-object writes add up fast. Batch writes where possible and cache
              reads aggressively.
            </p>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-redtab-400 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              Durable Object duration charges
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              $0.001 per 128 MB-hour. One DO active 24/7 costs ~$0.72/month. Fine
              for a handful, expensive for millions of always-on instances. Use the
              WebSocket Hibernation API to reduce active duration.
            </p>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-redtab-400 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              Queue messages over 64 KB count double
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              A 65 KB message costs 2 write operations. Design payloads small {"\u2014"}{" "}
              send IDs and references, not full data. Let the consumer fetch what it
              needs.
            </p>
          </div>
        </div>
      </section>

      <div className="stitch-separator my-8" />

      {/* ── Deployment Best Practices ──────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">
          Deployment Best Practices
        </h2>

        <div className="space-y-6">
          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              Keep Wrangler on latest
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              Always use <code className="inline-code">wrangler@latest</code> in
              devDependencies. Older versions lack support for new Workers runtime APIs,
              redirected deploy configs, and binding auto-provisioning. Version mismatches
              between global and local wrangler cause real deployment failures.
            </p>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              wrangler secret put defaults to production
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              With named environments, omitting{" "}
              <code className="inline-code">--env staging</code> sends the secret to
              the default (production) environment. This has caused outages. Always
              specify the environment explicitly.
            </p>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              Use .dev.vars for local secrets, not .env
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              Wrangler does not read <code className="inline-code">.env</code> files.
              Create a <code className="inline-code">.dev.vars</code> file for local
              development secrets. Production secrets go via{" "}
              <code className="inline-code">wrangler secret put</code> or the
              Cloudflare dashboard.
            </p>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              Always configure dead-letter queues
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              Failed messages after max retries are silently lost unless a DLQ is
              configured. In production, always set up a dead-letter queue to catch
              failures.
            </p>
            <CodeBlock title="levi.app.ts" lang="typescript">
              <span className="syn-kw">const</span>{" "}
              <span className="syn-const">dlq</span>{" "}
              <span className="syn-op">=</span>{" "}
              <span className="syn-const">app</span>
              <span className="syn-punc">.</span>
              <span className="syn-fn">addQueue</span>
              <span className="syn-punc">(</span>
              <span className="syn-str">"jobs-dlq"</span>
              <span className="syn-punc">)</span>
              <span className="syn-punc">;</span>
              {"\n"}
              <span className="syn-kw">const</span>{" "}
              <span className="syn-const">jobs</span>{" "}
              <span className="syn-op">=</span>{" "}
              <span className="syn-const">app</span>
              <span className="syn-punc">.</span>
              <span className="syn-fn">addQueue</span>
              <span className="syn-punc">(</span>
              <span className="syn-str">"jobs"</span>
              <span className="syn-punc">,</span>{" "}
              <span className="syn-punc">{"{"}</span>
              {"\n"}
              {"  "}
              <span className="syn-prop">retries</span>
              <span className="syn-punc">:</span>{" "}
              <span className="syn-num">3</span>
              <span className="syn-punc">,</span>
              {"\n"}
              {"  "}
              <span className="syn-prop">deadLetterQueue</span>
              <span className="syn-punc">:</span>{" "}
              <span className="syn-str">"jobs-dlq"</span>
              <span className="syn-punc">,</span>
              {"\n"}
              <span className="syn-punc">{"}"}</span>
              <span className="syn-punc">)</span>
              <span className="syn-punc">;</span>
            </CodeBlock>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              Run wrangler types after config changes
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              <code className="inline-code">wrangler types</code> generates TypeScript
              type bindings from your wrangler config. Run it after every config change
              to keep types in sync with reality.
            </p>
          </div>
        </div>
      </section>

      <div className="stitch-separator my-8" />

      {/* ── Local Development Tips ─────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">
          Local Development Tips
        </h2>

        <div className="space-y-6">
          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              levi dev uses Miniflare under the hood
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              <code className="inline-code">levi dev</code> runs each Worker via
              Wrangler's local mode. D1 stores to local SQLite, R2 to the local
              filesystem, KV to local files. State persists in{" "}
              <code className="inline-code">.wrangler/state/</code>.
            </p>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              --local vs --remote matters
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              <code className="inline-code">wrangler dev</code> defaults to local
              (Miniflare). AI bindings and some features only work with{" "}
              <code className="inline-code">--remote</code>. Test in the correct
              mode for your use case.
            </p>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              Seed local D1 with SQL files
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              Use <code className="inline-code">wrangler d1 execute DB_NAME --local --file=seed.sql</code>{" "}
              to populate your local database. Without{" "}
              <code className="inline-code">--local</code>, the command runs against
              production.
            </p>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              Use wrangler tail for production debugging
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              <code className="inline-code">wrangler tail</code> streams live logs
              from production. Filter with{" "}
              <code className="inline-code">wrangler tail --status error</code> to
              see only errors. Essential for diagnosing issues without adding logging
              infrastructure.
            </p>
          </div>
        </div>
      </section>

      <div className="stitch-separator my-8" />

      {/* ── vinext-Specific Gotchas ────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">
          vinext Deployment Gotchas
        </h2>

        <div className="space-y-6">
          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              Do not register the RSC plugin manually
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              vinext auto-registers <code className="inline-code">@vitejs/plugin-rsc</code>{" "}
              when it detects an <code className="inline-code">app/</code> directory.
              Adding <code className="inline-code">rsc()</code> in your{" "}
              <code className="inline-code">vite.config.ts</code> causes{" "}
              <em>"Duplicate @vitejs/plugin-rsc detected"</em> build failures.
            </p>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              Match Vite and plugin-react versions
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              Always match <code className="inline-code">@vitejs/plugin-react</code>{" "}
              major to your Vite major. Vite 8 {"\u2192"} plugin-react 6.x. Vite 7{" "}
              {"\u2192"} plugin-react 5.x. Mismatches cause ERESOLVE failures.
            </p>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              Install all dependencies upfront
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              vinext tries to auto-install missing deps during build. On Windows,
              these auto-installs fail. Install{" "}
              <code className="inline-code">react-server-dom-webpack</code>,{" "}
              <code className="inline-code">@vitejs/plugin-rsc</code>, and{" "}
              <code className="inline-code">@cloudflare/vite-plugin</code>{" "}
              explicitly before the first build.
            </p>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              Use two-step build + deploy on Windows
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              <code className="inline-code">vinext deploy</code> fails on Windows
              with ENOENT because it shells out to a bash script. Use{" "}
              <code className="inline-code">npx vinext build</code> then{" "}
              <code className="inline-code">npx wrangler deploy</code> instead.
            </p>
          </div>

          <div className="denim-pocket p-5">
            <h3 className="text-base font-bold text-denim-100 mb-2"
                style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
              Custom domains need separate trigger deployment
            </h3>
            <p className="text-sm text-denim-300 leading-relaxed">
              The <code className="inline-code">@cloudflare/vite-plugin</code>{" "}
              generates its own deploy config that doesn't include your routes.
              After <code className="inline-code">wrangler deploy</code>, run{" "}
              <code className="inline-code">wrangler triggers deploy</code>{" "}
              separately to apply custom domain routes from your root wrangler config.
            </p>
          </div>
        </div>
      </section>

      <div className="stitch-separator my-8" />

      {/* ── Things That Don't Exist (Yet) ──────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-wash-200 mb-4">
          Things That Don't Exist (Yet)
        </h2>
        <p className="text-denim-200 leading-relaxed mb-4">
          Knowing what the platform <em>can't</em> do saves hours of debugging.
        </p>

        <ul className="list-disc list-inside text-denim-200 space-y-3 ml-2">
          <li>
            <strong className="text-denim-100">No native PostgreSQL</strong>{" "}
            {"\u2014"} D1 is SQLite. Use{" "}
            <Link href="/docs/hyperdrive" className="text-wash-400 hover:text-wash-300">
              Hyperdrive
            </Link>{" "}
            to connect to external Postgres (Neon, Supabase, RDS).
          </li>
          <li>
            <strong className="text-denim-100">No GPU in Containers</strong>{" "}
            {"\u2014"} Use Workers AI for inference instead.
          </li>
          <li>
            <strong className="text-denim-100">No cron on Durable Objects</strong>{" "}
            {"\u2014"} Use <code className="inline-code">setAlarm()</code> inside
            the DO, or a Cron Trigger Worker that pokes the DO.
          </li>
          <li>
            <strong className="text-denim-100">No global strongly-consistent store</strong>{" "}
            {"\u2014"} KV is eventually consistent. DOs are strongly consistent but
            single-region per instance. No globally strongly-consistent database exists
            on the platform.
          </li>
          <li>
            <strong className="text-denim-100">WebSocket servers require Durable Objects</strong>{" "}
            {"\u2014"} Workers can upgrade to WebSocket and use{" "}
            <code className="inline-code">WebSocketPair</code>, but persistent
            server state needs DOs with the Hibernation API.
          </li>
          <li>
            <strong className="text-denim-100">No inbound TCP/UDP</strong>{" "}
            {"\u2014"} Workers can make outbound TCP via{" "}
            <code className="inline-code">cloudflare:sockets</code>. Inbound raw
            TCP/UDP is not supported. Use Spectrum or Containers for raw socket
            workloads.
          </li>
          <li>
            <strong className="text-denim-100">No Container autoscaling</strong>{" "}
            {"\u2014"} Containers are in beta with no autoscaling. Build your own
            scaling logic in the managing Worker.
          </li>
        </ul>
      </section>

      <div className="stitch-separator my-8" />

      {/* ── Next Steps ─────────────────────────────── */}
      <div className="denim-pocket p-5">
        <h2 className="text-sm font-bold text-denim-300 uppercase tracking-widest mb-3"
            style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
          Next Steps
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/docs/workers"
            className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
          >
            Workers Reference
          </Link>
          <Link
            href="/docs/d1"
            className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
          >
            D1 Databases
          </Link>
          <Link
            href="/docs/queues"
            className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
          >
            Queues
          </Link>
          <Link
            href="/docs/durable-objects"
            className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
          >
            Durable Objects
          </Link>
          <Link
            href="/examples"
            className="px-4 py-2 text-sm bg-wash-600/20 border border-dashed border-wash-500 rounded-md text-wash-300 hover:bg-wash-600/30 transition-colors"
          >
            Full-Stack Examples
          </Link>
        </div>
      </div>
    </DocLayout>
  );
}
