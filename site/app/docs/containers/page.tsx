import { DocLayout } from "../../../components/DocLayout";
import { CodeBlock } from "../../../components/CodeBlock";
import Link from "next/link";

export default function ContainersPage() {
  return (
    <DocLayout>
      <div className="space-y-10">
        {/* Header */}
        <header>
          <div className="flex items-center gap-3 mb-4">
            <span className="red-tab-h">beta</span>
            <span className="text-xs text-denim-500 font-mono">
              Compute
            </span>
          </div>
          <h1 className="text-4xl font-bold text-denim-50 stitch-border-b pb-4">
            Containers
          </h1>
          <p className="mt-4 text-denim-300 text-lg leading-relaxed">
            Cloudflare Containers extend the Workers platform with full Docker
            support. Run any Docker image alongside your Workers with automatic
            sleep, on-demand start, and tight integration via Durable Object
            bindings. Levi manages container declarations, Durable Object
            scaffolding, and wrangler configuration from a single TypeScript file.
          </p>
        </header>

        {/* Overview */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Overview
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Containers are long-running Docker workloads deployed to Cloudflare's
            network. Unlike Workers, which run short-lived V8 isolates, Containers
            let you run any language, framework, or binary packaged as a Docker
            image. Each container instance is backed by a{" "}
            <strong className="text-wash-300">Durable Object</strong>, giving you
            addressable, stateful instances with built-in lifecycle management.
          </p>
          <ul className="list-disc list-inside text-denim-300 space-y-1">
            <li>
              Run <strong className="text-wash-300">any Docker image</strong>{" "}
              &mdash; Python ML models, Rust binaries, headless browsers, databases
            </li>
            <li>
              <strong className="text-wash-300">Auto-sleep</strong> after
              configurable idle time (default 15 minutes) to save costs
            </li>
            <li>
              <strong className="text-wash-300">On-demand start</strong> with
              2&ndash;3 second cold start when a request arrives
            </li>
            <li>
              Accessed from Workers via Durable Object bindings and the{" "}
              <code className="inline-code">@cloudflare/containers</code> package
            </li>
            <li>
              Up to <strong className="text-wash-300">10 concurrent instances</strong>{" "}
              per container definition (configurable)
            </li>
            <li>
              Built from Dockerfiles or pulled from container registries
            </li>
          </ul>
        </section>

        {/* Basic Usage */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Basic Usage
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Declare a container in your{" "}
            <code className="inline-code">levi.app.ts</code> using{" "}
            <code className="inline-code">app.addContainer()</code>. The returned
            resource reference is used to bind the container to Workers so they
            can communicate with it at runtime.
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
            <span className="syn-const">gpu</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addContainer</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"gpu-inference"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">image</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"./Dockerfile.inference"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">className</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"InferenceContainer"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">instanceType</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"standard-2"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">maxInstances</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">10</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed">
            This declares a container named{" "}
            <code className="inline-code">gpu-inference</code> built from a local
            Dockerfile, running on a{" "}
            <code className="inline-code">standard-2</code> instance with up to
            10 concurrent instances. Levi will generate the Durable Object class,
            wrangler bindings, and migration configuration during{" "}
            <code className="inline-code">levi build</code>.
          </p>
        </section>

        {/* Instance Types */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Instance Types
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Containers support predefined instance types that map to specific
            vCPU, memory, and disk allocations. Choose a type based on your
            workload's resource requirements.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-denim-700">
                  <th className="py-2 pr-4 text-denim-400 font-medium">Instance Type</th>
                  <th className="py-2 pr-4 text-denim-400 font-medium">vCPU</th>
                  <th className="py-2 pr-4 text-denim-400 font-medium">Memory</th>
                  <th className="py-2 text-denim-400 font-medium">Disk</th>
                </tr>
              </thead>
              <tbody className="text-denim-300">
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">lite</code></td>
                  <td className="py-2 pr-4">0.25</td>
                  <td className="py-2 pr-4">256 MiB</td>
                  <td className="py-2">1 GB</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">basic</code></td>
                  <td className="py-2 pr-4">0.5</td>
                  <td className="py-2 pr-4">512 MiB</td>
                  <td className="py-2">2 GB</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">standard-1</code></td>
                  <td className="py-2 pr-4">1</td>
                  <td className="py-2 pr-4">2048 MiB</td>
                  <td className="py-2">4 GB</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">standard-2</code></td>
                  <td className="py-2 pr-4">2</td>
                  <td className="py-2 pr-4">4096 MiB</td>
                  <td className="py-2">8 GB</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">standard-3</code></td>
                  <td className="py-2 pr-4">4</td>
                  <td className="py-2 pr-4">8192 MiB</td>
                  <td className="py-2">16 GB</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">standard-4</code></td>
                  <td className="py-2 pr-4">8</td>
                  <td className="py-2 pr-4">16384 MiB</td>
                  <td className="py-2">32 GB</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-denim-300 leading-relaxed mt-4 mb-4">
            You can also specify a{" "}
            <strong className="text-wash-300">custom instance type</strong> by
            passing an object with explicit resource values:
          </p>
          <CodeBlock title="Custom instance type" lang="ts">
            <span className="syn-prop">instanceType</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">vcpu</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">2</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">memory_mib</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">8192</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">disk_mb</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">16384</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed">
            Custom types let you fine-tune resources for workloads that
            don't fit neatly into the predefined tiers, such as memory-heavy
            inference models or disk-intensive data processing tasks.
          </p>
        </section>

        {/* Container Options Reference */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Container Options Reference
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            All properties available when calling{" "}
            <code className="inline-code">app.addContainer(name, options)</code>.
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
                  <td className="py-2 pr-4"><code className="inline-code">image</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">required</td>
                  <td className="py-2">Path to a Dockerfile (relative to project root) or a registry image reference</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">className</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">required</td>
                  <td className="py-2">Name of the Durable Object class that wraps the container (PascalCase)</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">instanceType</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string | object</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">"basic"</code></td>
                  <td className="py-2">Predefined type name or custom {"{"} vcpu, memory_mib, disk_mb {"}"}</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">maxInstances</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">number</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">1</code></td>
                  <td className="py-2">Maximum number of concurrent container instances (1&ndash;100)</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">buildContext</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">"."</code></td>
                  <td className="py-2">Docker build context directory (relative to project root)</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">buildArgs</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">Record&lt;string, string&gt;</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">Docker build arguments passed at build time</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">enableInternet</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">boolean</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">true</code></td>
                  <td className="py-2">Whether the container can make outbound network requests</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">defaultPort</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">number</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">8080</code></td>
                  <td className="py-2">The port the container's HTTP server listens on</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">sleepAfter</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">"15m"</code></td>
                  <td className="py-2">Duration of inactivity before the container sleeps (e.g., "5m", "1h")</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Binding to Workers */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Binding to Workers
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Containers are exposed to Workers through{" "}
            <strong className="text-wash-300">Durable Object bindings</strong>.
            Pass the container resource into a Worker's{" "}
            <code className="inline-code">bindings</code> map to create the
            connection. At runtime, the Worker uses the{" "}
            <code className="inline-code">@cloudflare/containers</code> package
            to interact with the container via the binding.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">gpu</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addContainer</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"gpu-inference"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">image</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"./Dockerfile.inference"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">className</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"InferenceContainer"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">instanceType</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"standard-2"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">maxInstances</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">10</span>
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
            <span className="syn-prop">GPU</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">gpu</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed">
            The binding name (<code className="inline-code">GPU</code> in this
            example) becomes the property name on{" "}
            <code className="inline-code">env</code> in your Worker code. Levi
            automatically generates the corresponding{" "}
            <code className="inline-code">durable_objects.bindings</code> entry
            in the Worker's wrangler configuration.
          </p>
        </section>

        {/* Container Class */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Container Class
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Each container is backed by a Durable Object class that extends{" "}
            <code className="inline-code">Container</code> from{" "}
            <code className="inline-code">@cloudflare/containers</code>. The
            class defines the container's runtime configuration and lifecycle
            hooks. Levi generates this class for you, but understanding the
            pattern is important for customization.
          </p>
          <CodeBlock title="containers/inference.ts" lang="ts">
            <span className="syn-kw">import</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-type">Container</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-type">ContainerEvent</span>{" "}
            <span className="syn-punc">{"}"}</span>{" "}
            <span className="syn-kw">from</span>{" "}
            <span className="syn-str">"@cloudflare/containers"</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-kw">export class</span>{" "}
            <span className="syn-type">InferenceContainer</span>{" "}
            <span className="syn-kw">extends</span>{" "}
            <span className="syn-type">Container</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">defaultPort</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-num">8080</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"  "}<span className="syn-prop">sleepAfter</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-str">"15m"</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            {"  "}<span className="syn-cmt">{"// Environment variables injected into the container"}</span>
            {"\n"}
            {"  "}<span className="syn-kw">override</span>{" "}
            <span className="syn-fn">getEnvVars</span>
            <span className="syn-punc">()</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"    "}<span className="syn-kw">return</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"      "}<span className="syn-prop">MODEL_PATH</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"/models/v2"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"      "}<span className="syn-prop">MAX_BATCH</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"32"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"    "}<span className="syn-punc">{"}"}</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"}"}</span>
            {"\n\n"}
            {"  "}<span className="syn-cmt">{"// Called when the container starts"}</span>
            {"\n"}
            {"  "}<span className="syn-kw">override async</span>{" "}
            <span className="syn-fn">onStart</span>
            <span className="syn-punc">()</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"    "}<span className="syn-const">console</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">log</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"Container started, loading model..."</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"}"}</span>
            {"\n\n"}
            {"  "}<span className="syn-cmt">{"// Called before the container sleeps"}</span>
            {"\n"}
            {"  "}<span className="syn-kw">override async</span>{" "}
            <span className="syn-fn">onStop</span>
            <span className="syn-punc">()</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"    "}<span className="syn-const">console</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">log</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"Container stopping, flushing state..."</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"}"}</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed mb-4">
            Key class members:
          </p>
          <ul className="list-disc list-inside text-denim-300 space-y-2">
            <li>
              <code className="inline-code">defaultPort</code> &mdash; The port
              your container's HTTP server listens on. Workers use this port when
              sending requests to the container.
            </li>
            <li>
              <code className="inline-code">sleepAfter</code> &mdash; Duration
              string (e.g., <code className="inline-code">"5m"</code>,{" "}
              <code className="inline-code">"1h"</code>) after which the container
              automatically sleeps if no requests arrive.
            </li>
            <li>
              <code className="inline-code">getEnvVars()</code> &mdash; Returns
              a record of environment variables injected into the running container.
            </li>
            <li>
              <code className="inline-code">onStart()</code> &mdash; Lifecycle
              hook called after the container process starts. Use for initialization
              logging, health checks, or warm-up tasks.
            </li>
            <li>
              <code className="inline-code">onStop()</code> &mdash; Lifecycle
              hook called before the container is put to sleep. Use for cleanup,
              flushing buffers, or persisting state.
            </li>
          </ul>
        </section>

        {/* Generated Config */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Generated Config
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            When you run <code className="inline-code">levi build</code>, Levi
            generates the{" "}
            <code className="inline-code">containers</code>,{" "}
            <code className="inline-code">durable_objects.bindings</code>, and{" "}
            <code className="inline-code">migrations</code> sections in the
            Worker's <code className="inline-code">wrangler.jsonc</code>. The
            container definition includes the image, class name, instance sizing,
            and maximum concurrency.
          </p>
          <CodeBlock title="wrangler.jsonc (api worker)" lang="jsonc">
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">"name"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"api"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">"containers"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">[</span>
            {"\n"}
            {"    "}<span className="syn-punc">{"{"}</span>
            {"\n"}
            {"      "}<span className="syn-prop">"class_name"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"InferenceContainer"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"      "}<span className="syn-prop">"image"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"./Dockerfile.inference"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"      "}<span className="syn-prop">"instance_type"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"standard-2"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"      "}<span className="syn-prop">"max_instances"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">10</span>
            {"\n"}
            {"    "}<span className="syn-punc">{"}"}</span>
            {"\n"}
            {"  "}<span className="syn-punc">]</span>
            <span className="syn-punc">,</span>
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
            <span className="syn-str">"GPU"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"        "}<span className="syn-prop">"class_name"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"InferenceContainer"</span>
            {"\n"}
            {"      "}<span className="syn-punc">{"}"}</span>
            {"\n"}
            {"    "}<span className="syn-punc">]</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">"migrations"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">[</span>
            {"\n"}
            {"    "}<span className="syn-punc">{"{"}</span>
            {"\n"}
            {"      "}<span className="syn-prop">"tag"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"v1"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"      "}<span className="syn-prop">"new_classes"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">[</span>
            <span className="syn-str">"InferenceContainer"</span>
            <span className="syn-punc">]</span>
            {"\n"}
            {"    "}<span className="syn-punc">{"}"}</span>
            {"\n"}
            {"  "}<span className="syn-punc">]</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed">
            The <code className="inline-code">containers</code> array defines
            which Docker images to build and deploy. The{" "}
            <code className="inline-code">durable_objects.bindings</code> entry
            wires the container class to the Worker's environment. The{" "}
            <code className="inline-code">migrations</code> array tracks class
            creation and updates for Cloudflare's Durable Object migration system.
          </p>
        </section>

        {/* Usage in Worker Code */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Usage in Worker Code
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Workers communicate with containers using the{" "}
            <code className="inline-code">@cloudflare/containers</code> package.
            The workflow is: get a container instance by ID, ensure it's running,
            then send HTTP requests to it.
          </p>
          <CodeBlock title="src/index.ts" lang="ts">
            <span className="syn-kw">import</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-type">getContainer</span>{" "}
            <span className="syn-punc">{"}"}</span>{" "}
            <span className="syn-kw">from</span>{" "}
            <span className="syn-str">"@cloudflare/containers"</span>
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
            {"    "}<span className="syn-cmt">{"// Get a container instance by ID (or generate one)"}</span>
            {"\n"}
            {"    "}<span className="syn-kw">const</span>{" "}
            <span className="syn-const">id</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-const">env</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">GPU</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">idFromName</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"default"</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"    "}<span className="syn-kw">const</span>{" "}
            <span className="syn-const">container</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">getContainer</span>
            <span className="syn-punc">(</span>
            <span className="syn-const">env</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">GPU</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-const">id</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            {"    "}<span className="syn-cmt">{"// Start the container and wait for its port to be ready"}</span>
            {"\n"}
            {"    "}<span className="syn-kw">await</span>{" "}
            <span className="syn-const">container</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">startAndWaitForPorts</span>
            <span className="syn-punc">()</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            {"    "}<span className="syn-cmt">{"// Send HTTP request to the container"}</span>
            {"\n"}
            {"    "}<span className="syn-kw">const</span>{" "}
            <span className="syn-const">response</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-kw">await</span>{" "}
            <span className="syn-const">container</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">containerFetch</span>
            <span className="syn-punc">(</span>
            {"\n"}
            {"      "}<span className="syn-kw">new</span>{" "}
            <span className="syn-type">Request</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"http://container/predict"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"        "}<span className="syn-prop">method</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"POST"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"        "}<span className="syn-prop">body</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-kw">await</span>{" "}
            <span className="syn-const">request</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">text</span>
            <span className="syn-punc">()</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"        "}<span className="syn-prop">headers</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-str">"Content-Type"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"application/json"</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"      "}<span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            {"\n"}
            {"    "}<span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            {"    "}<span className="syn-kw">return</span>{" "}
            <span className="syn-const">response</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed mb-4">
            Key functions from{" "}
            <code className="inline-code">@cloudflare/containers</code>:
          </p>
          <ul className="list-disc list-inside text-denim-300 space-y-2">
            <li>
              <code className="inline-code">getContainer(binding, id)</code>{" "}
              &mdash; Returns a container handle from a Durable Object namespace
              binding and ID. If the container is sleeping, it will be woken on
              the next call.
            </li>
            <li>
              <code className="inline-code">startAndWaitForPorts()</code>{" "}
              &mdash; Ensures the container is running and its HTTP port is ready
              to accept connections. Returns immediately if already running.
              Typical cold start is 2&ndash;3 seconds.
            </li>
            <li>
              <code className="inline-code">containerFetch(request)</code>{" "}
              &mdash; Sends an HTTP request to the container. The hostname in the
              URL doesn't matter (use{" "}
              <code className="inline-code">http://container/...</code> by
              convention); the request is routed to the container's{" "}
              <code className="inline-code">defaultPort</code>.
            </li>
          </ul>
        </section>

        {/* Full Example */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Full Example
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            A complete setup with an API Worker that routes inference requests to
            a GPU container. The container runs a Python model server, sleeps
            after 10 minutes of inactivity, and supports up to 5 concurrent
            instances.
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
            <span className="syn-str">"inference-app"</span>
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
            <span className="syn-cmt">{"// GPU inference container"}</span>
            {"\n"}
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">gpu</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addContainer</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"gpu-inference"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">image</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"./Dockerfile.inference"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">className</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"InferenceContainer"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">instanceType</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"standard-2"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">maxInstances</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">5</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">buildContext</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"./containers/inference"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">buildArgs</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">MODEL_VERSION</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"v2"</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">enableInternet</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-kw">false</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">defaultPort</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">8080</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">sleepAfter</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"10m"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-cmt">{"// API Worker — routes requests to the container"}</span>
            {"\n"}
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
            <span className="syn-prop">GPU</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">gpu</span>{" "}
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

          <CodeBlock title="src/index.ts (Worker)" lang="ts">
            <span className="syn-kw">import</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-type">getContainer</span>{" "}
            <span className="syn-punc">{"}"}</span>{" "}
            <span className="syn-kw">from</span>{" "}
            <span className="syn-str">"@cloudflare/containers"</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-kw">interface</span>{" "}
            <span className="syn-type">Env</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">GPU</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-type">DurableObjectNamespace</span>
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
            {"    "}<span className="syn-kw">if</span>{" "}
            <span className="syn-punc">(</span>
            <span className="syn-const">url</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">pathname</span>{" "}
            <span className="syn-op">===</span>{" "}
            <span className="syn-str">"/predict"</span>{" "}
            <span className="syn-op">&&</span>{" "}
            <span className="syn-const">request</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">method</span>{" "}
            <span className="syn-op">===</span>{" "}
            <span className="syn-str">"POST"</span>
            <span className="syn-punc">)</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"      "}<span className="syn-cmt">{"// Route to a named container instance"}</span>
            {"\n"}
            {"      "}<span className="syn-kw">const</span>{" "}
            <span className="syn-const">id</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-const">env</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">GPU</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">idFromName</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"primary"</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"      "}<span className="syn-kw">const</span>{" "}
            <span className="syn-const">container</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">getContainer</span>
            <span className="syn-punc">(</span>
            <span className="syn-const">env</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">GPU</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-const">id</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            {"      "}<span className="syn-cmt">{"// Ensure the container is running"}</span>
            {"\n"}
            {"      "}<span className="syn-kw">await</span>{" "}
            <span className="syn-const">container</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">startAndWaitForPorts</span>
            <span className="syn-punc">()</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            {"      "}<span className="syn-cmt">{"// Forward the prediction request"}</span>
            {"\n"}
            {"      "}<span className="syn-kw">return</span>{" "}
            <span className="syn-const">container</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">containerFetch</span>
            <span className="syn-punc">(</span>
            {"\n"}
            {"        "}<span className="syn-kw">new</span>{" "}
            <span className="syn-type">Request</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"http://container/predict"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"          "}<span className="syn-prop">method</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"POST"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"          "}<span className="syn-prop">body</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-kw">await</span>{" "}
            <span className="syn-const">request</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">text</span>
            <span className="syn-punc">()</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"          "}<span className="syn-prop">headers</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-str">"Content-Type"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"application/json"</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"        "}<span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            {"\n"}
            {"      "}<span className="syn-punc">)</span>
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
        </section>

        {/* Limitations */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Limitations
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Containers are currently in{" "}
            <strong className="text-redtab-400">beta</strong>. Be aware of the
            following constraints:
          </p>
          <ul className="list-disc list-inside text-denim-300 space-y-2">
            <li>
              <strong className="text-wash-300">No autoscaling</strong> &mdash;
              You must set <code className="inline-code">maxInstances</code>{" "}
              manually. Automatic scale-out based on request volume is not
              yet supported.
            </li>
            <li>
              <strong className="text-wash-300">Ephemeral disk</strong> &mdash;
              Container disk storage is not persisted across restarts. Any data
              written to the filesystem is lost when the container sleeps or
              is redeployed. Use R2 or D1 for durable storage.
            </li>
            <li>
              <strong className="text-wash-300">
                Not co-located with Durable Objects
              </strong>{" "}
              &mdash; Containers run in dedicated infrastructure and are not
              guaranteed to be in the same data center as other Durable Objects
              in your account. Network latency between DOs and Containers may
              be higher than between DOs on the same node.
            </li>
            <li>
              <strong className="text-wash-300">Cold start latency</strong>{" "}
              &mdash; Starting a sleeping container takes 2&ndash;3 seconds.
              For latency-sensitive endpoints, consider keeping a minimum number
              of instances warm by setting a longer{" "}
              <code className="inline-code">sleepAfter</code> duration.
            </li>
            <li>
              <strong className="text-wash-300">Image size limits</strong>{" "}
              &mdash; Container images must be under 2 GB compressed. Keep images
              lean with multi-stage builds and minimal base images.
            </li>
            <li>
              <strong className="text-wash-300">Beta API surface</strong>{" "}
              &mdash; The <code className="inline-code">@cloudflare/containers</code>{" "}
              API and configuration options may change before general availability.
              Pin your package versions and review changelogs on upgrade.
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
              <Link href="/docs/workers" className="text-wash-400 hover:text-wash-300 underline">
                Workers
              </Link>{" "}
              &mdash; Learn how Workers work and how they bind to containers
            </li>
            <li>
              <Link href="/docs/durable-objects" className="text-wash-400 hover:text-wash-300 underline">
                Durable Objects
              </Link>{" "}
              &mdash; Understand the DO model that underpins container instances
            </li>
            <li>
              <Link href="/docs/r2" className="text-wash-400 hover:text-wash-300 underline">
                R2 Buckets
              </Link>{" "}
              &mdash; Use R2 for persistent storage alongside ephemeral containers
            </li>
            <li>
              <Link href="/docs/pipelines" className="text-wash-400 hover:text-wash-300 underline">
                Pipelines
              </Link>{" "}
              &mdash; Stream events from Workers and containers to R2 data lakes
            </li>
          </ul>
        </section>
      </div>
    </DocLayout>
  );
}
