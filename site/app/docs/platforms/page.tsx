import { DocLayout } from "../../../components/DocLayout";
import { CodeBlock } from "../../../components/CodeBlock";

export default function PlatformsPage() {
  return (
    <DocLayout>
      <div className="space-y-10">
        {/* Header */}
        <header>
          <div className="flex items-center gap-3 mb-4">
            <span className="red-tab-h">new</span>
            <span className="text-xs text-denim-500 font-mono">
              Platform
            </span>
          </div>
          <h1 className="text-4xl font-bold text-denim-50 stitch-border-b pb-4">
            Workers for Platforms
          </h1>
          <p className="mt-4 text-denim-300 text-lg leading-relaxed">
            Workers for Platforms lets you run untrusted, user-uploaded
            Workers for multi-tenant SaaS. Dispatch namespaces isolate each
            customer's code in its own Worker while your dispatch worker
            routes every request to the right tenant script. Levi declares
            the namespace, generates the wrangler config, and provisions it
            for you. Requires a Workers for Platforms subscription.
          </p>
        </header>

        {/* Overview */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Overview
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            A dispatch namespace is a container for your customers' Workers.
            Each tenant script runs in full isolation at Cloudflare scale --
            no shared state, no shared runtime, no noisy-neighbor risk. Your
            own "dispatch worker" sits in front: it receives every request,
            resolves which tenant it belongs to, and forwards the request to
            that tenant's script via the namespace binding.
          </p>
          <p className="text-denim-300 leading-relaxed">
            Levi handles the infrastructure side. You declare the namespace
            in <code className="inline-code">levi.app.ts</code>, Levi
            generates the{" "}
            <code className="inline-code">dispatch_namespaces</code> section
            of the bound Worker's{" "}
            <code className="inline-code">wrangler.jsonc</code>, and{" "}
            <code className="inline-code">levi provision</code> creates the
            namespace via{" "}
            <code className="inline-code">
              wrangler dispatch-namespace create
            </code>
            .
          </p>
        </section>

        {/* API */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            API
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Declare a dispatch namespace with{" "}
            <code className="inline-code">
              app.addDispatchNamespace(name, options?)
            </code>
            . The returned resource can be passed to any Worker's{" "}
            <code className="inline-code">bindings</code>.
          </p>
          <h3 className="text-lg font-medium text-wash-300 mt-6 mb-2">
            DispatchNamespaceOptions
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
                  <td className="py-2 pr-4"><code className="inline-code">namespace</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">resource name</td>
                  <td className="py-2">Cloudflare namespace name, if different from the resource name</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">outbound</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">{"{ service, parameters? }"}</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">
                    Outbound worker that intercepts all fetch() egress from
                    tenant code. <code className="inline-code">service</code>{" "}
                    is a <code className="inline-code">string | WorkerResource</code>;{" "}
                    <code className="inline-code">parameters</code> is a{" "}
                    <code className="inline-code">string[]</code> of values
                    passed from the dispatch worker
                  </td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">remote</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">boolean</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">false</code></td>
                  <td className="py-2">Connect to the remote namespace during wrangler dev</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Basic Usage */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Basic Usage
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Declare the namespace and bind it to the Worker that will act as
            your dispatch worker:
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">tenants</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addDispatchNamespace</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"customers-prod"</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">router</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addWorker</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"router"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">entrypoint</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"./src/router.ts"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">bindings</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">DISPATCH</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">tenants</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed mb-4 mt-4">
            At runtime, the binding exposes a{" "}
            <code className="inline-code">get()</code> method that returns a
            handle to a tenant script by name. Resolve the tenant from the
            request (hostname, path, API key -- whatever fits your platform)
            and forward the request:
          </p>
          <CodeBlock title="src/router.ts" lang="ts">
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
            <span className="syn-const">tenant</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">resolveTenant</span>
            <span className="syn-punc">(</span>
            <span className="syn-const">request</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"    "}<span className="syn-kw">const</span>{" "}
            <span className="syn-const">worker</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-const">env</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">DISPATCH</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">get</span>
            <span className="syn-punc">(</span>
            <span className="syn-const">tenant</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"    "}<span className="syn-kw">return</span>{" "}
            <span className="syn-const">worker</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">fetch</span>
            <span className="syn-punc">(</span>
            <span className="syn-const">request</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
        </section>

        {/* Outbound Workers */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Outbound Workers
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Tenant code is untrusted, and by default it can{" "}
            <code className="inline-code">fetch()</code> anything on the
            internet. An outbound worker intercepts every{" "}
            <code className="inline-code">fetch()</code> a tenant script
            makes, giving your platform a single choke point for security
            policy, egress filtering, and metering.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">guard</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addWorker</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"outbound-guard"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">entrypoint</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"./src/guard.ts"</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">tenants</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addDispatchNamespace</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"customers-prod"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">outbound</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">service</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">guard</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-prop">parameters</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">[</span>
            <span className="syn-str">"customer_id"</span>
            <span className="syn-punc">]</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed mt-4">
            The <code className="inline-code">parameters</code> array names
            values your dispatch worker sets when it calls{" "}
            <code className="inline-code">get()</code>; they arrive in the
            outbound worker's env so it knows which tenant is making the
            request. Because <code className="inline-code">service</code>{" "}
            here is the <code className="inline-code">WorkerResource</code>{" "}
            itself (not a string), Levi adds a dependency edge -- the guard
            Worker always deploys before the namespace that references it.
          </p>
        </section>

        {/* Provisioning */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Provisioning
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            <code className="inline-code">levi provision</code> creates the
            namespace by running{" "}
            <code className="inline-code">
              wrangler dispatch-namespace create &lt;name&gt;
            </code>{" "}
            for each declared dispatch namespace that does not already
            exist.
          </p>
          <div className="bg-denim-900/50 border border-denim-700 rounded-md p-4">
            <p className="text-denim-300 text-sm">
              <strong className="text-redtab-500">Warning:</strong> Dispatch
              namespaces require a Workers for Platforms subscription on
              your Cloudflare account. If the subscription is missing,{" "}
              <code className="inline-code">levi provision</code> surfaces
              the Wrangler error verbatim -- enable Workers for Platforms in
              the Cloudflare dashboard and re-run.
            </p>
          </div>
        </section>

        {/* Uploading Tenant Workers */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Uploading Tenant Workers
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Levi manages the namespace and your platform's own Workers -- it
            does not manage the tenant scripts inside the namespace. Those
            are uploaded at runtime by your platform via the Cloudflare API
            (a <code className="inline-code">PUT</code> to{" "}
            <code className="inline-code">
              /accounts/{"{id}"}/workers/dispatch/namespaces/{"{ns}"}/scripts/{"{script}"}
            </code>
            ), typically when a customer saves or deploys their code. That
            flow lives in your application code, outside{" "}
            <code className="inline-code">levi.app.ts</code>. See the{" "}
            <a
              href="https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/"
              className="text-wash-300 underline hover:text-wash-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              Workers for Platforms documentation
            </a>{" "}
            for the upload API and tenant lifecycle.
          </p>
          <div className="bg-denim-900/50 border border-denim-700 rounded-md p-4">
            <p className="text-denim-300 text-sm">
              <strong className="text-thread-400">Tip:</strong> Pair the
              dispatch namespace with{" "}
              <code className="inline-code">app.addRateLimit()</code> for
              per-tenant rate limiting and Custom Hostnames (
              <code className="inline-code">addDomain</code> with{" "}
              <code className="inline-code">customHostname: true</code>) so
              each customer gets their own domain -- together they cover the
              full multi-tenant SaaS platform story.
            </p>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
