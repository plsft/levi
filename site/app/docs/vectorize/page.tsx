import { DocLayout } from "../../../components/DocLayout";
import { CodeBlock } from "../../../components/CodeBlock";

export default function VectorizePage() {
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
            Vectorize
          </h1>
          <p className="mt-4 text-denim-300 text-lg leading-relaxed">
            Cloudflare Vectorize is a globally distributed vector database
            purpose-built for AI and embedding workloads. Use it for semantic
            search, retrieval-augmented generation (RAG), recommendation
            engines, and any application that needs fast similarity lookups
            across high-dimensional vectors. Levi manages index provisioning,
            dimension configuration, and binding generation.
          </p>
        </header>

        {/* Overview */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Overview
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Vectorize stores vectors (numerical arrays) alongside metadata and
            enables fast approximate nearest-neighbor (ANN) queries. The
            typical workflow is:
          </p>
          <ol className="list-decimal list-inside text-denim-300 space-y-2 mb-4">
            <li>
              <strong className="text-wash-300">Embed</strong> — Convert text,
              images, or other data into vectors using an embedding model
              (Workers AI, OpenAI, Cohere, etc.)
            </li>
            <li>
              <strong className="text-wash-300">Store</strong> — Insert vectors
              into a Vectorize index with an ID and optional metadata
            </li>
            <li>
              <strong className="text-wash-300">Query</strong> — Search for the
              most similar vectors given a query vector, with optional metadata
              filtering
            </li>
          </ol>
          <p className="text-denim-300 leading-relaxed">
            Each index is configured with a fixed number of{" "}
            <strong className="text-wash-300">dimensions</strong> (matching
            your embedding model's output size) and a{" "}
            <strong className="text-wash-300">distance metric</strong> that
            determines how similarity is calculated.
          </p>
        </section>

        {/* Creating an Index */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Creating an Index
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Declare a Vectorize index in your{" "}
            <code className="inline-code">levi.app.ts</code> using{" "}
            <code className="inline-code">app.addVectorize()</code>. Both{" "}
            <code className="inline-code">dimensions</code> and{" "}
            <code className="inline-code">metric</code> are required and
            cannot be changed after the index is created.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">embeddings</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addVectorize</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"embeddings"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">dimensions</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">1536</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">metric</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"cosine"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed">
            This creates an index optimized for 1536-dimensional vectors (the
            output of OpenAI's{" "}
            <code className="inline-code">text-embedding-3-small</code>) using
            cosine similarity.
          </p>
        </section>

        {/* Metrics */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Distance Metrics
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            The distance metric determines how Vectorize calculates similarity
            between vectors. Choose the metric that matches your embedding
            model's vector space.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-denim-700">
                  <th className="py-2 pr-4 text-denim-400 font-medium">Metric</th>
                  <th className="py-2 pr-4 text-denim-400 font-medium">Best For</th>
                  <th className="py-2 text-denim-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-denim-300">
                <tr className="border-b border-denim-800">
                  <td className="py-3 pr-4">
                    <code className="inline-code">"cosine"</code>
                  </td>
                  <td className="py-3 pr-4">Normalized embeddings (OpenAI, Cohere)</td>
                  <td className="py-3">
                    Measures the angle between vectors, ignoring magnitude.
                    Most commonly used for text embeddings. Returns values
                    between -1 (opposite) and 1 (identical).
                  </td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-3 pr-4">
                    <code className="inline-code">"euclidean"</code>
                  </td>
                  <td className="py-3 pr-4">When magnitude matters</td>
                  <td className="py-3">
                    Measures the straight-line distance between vectors in
                    N-dimensional space (L2 distance). Lower values indicate
                    greater similarity.
                  </td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-3 pr-4">
                    <code className="inline-code">"dot-product"</code>
                  </td>
                  <td className="py-3 pr-4">Pre-normalized vectors, performance</td>
                  <td className="py-3">
                    Computes the dot product between vectors. Fastest metric
                    but requires normalized vectors for meaningful similarity
                    scores. Higher values indicate greater similarity.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-denim-900/50 border border-denim-700 rounded-md p-4 mt-4">
            <p className="text-denim-300 text-sm">
              <strong className="text-thread-400">Tip:</strong> When in doubt,
              use <code className="inline-code">"cosine"</code>. It works
              correctly with both normalized and unnormalized vectors and is
              the default for most popular embedding models.
            </p>
          </div>
        </section>

        {/* Binding to Workers */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Binding to Workers
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Pass the Vectorize resource into a Worker's{" "}
            <code className="inline-code">bindings</code> map. The Worker can
            then insert, query, and manage vectors at runtime through the
            binding.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-fn">app.addWorker</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"search-api"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">entrypoint</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"./src/search/index.ts"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">bindings</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"    "}<span className="syn-prop">EMBEDDINGS</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">embeddings</span>
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

        {/* Options Reference */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Options Reference
          </h2>
          <h3 className="text-lg font-medium text-wash-300 mt-6 mb-2">
            VectorizeOptions
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
                  <td className="py-2 pr-4"><code className="inline-code">dimensions</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">number</code></td>
                  <td className="py-2 pr-4">required</td>
                  <td className="py-2">Vector dimensions (1-65536). Must match your embedding model output.</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">metric</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">VectorizeMetric</code></td>
                  <td className="py-2 pr-4">required</td>
                  <td className="py-2">"cosine" | "euclidean" | "dot-product". Cannot be changed after creation.</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">description</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">Human-readable description shown in the Cloudflare dashboard</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">indexId</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">Bind to an existing index ID (skips provisioning)</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">previewIndexId</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">Existing index ID for local dev (used by levi dev)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-medium text-wash-300 mt-6 mb-2">
            Common Embedding Dimensions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-denim-700">
                  <th className="py-2 pr-4 text-denim-400 font-medium">Model</th>
                  <th className="py-2 pr-4 text-denim-400 font-medium">Dimensions</th>
                  <th className="py-2 text-denim-400 font-medium">Provider</th>
                </tr>
              </thead>
              <tbody className="text-denim-300">
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">@cf/baai/bge-base-en-v1.5</code></td>
                  <td className="py-2 pr-4">768</td>
                  <td className="py-2">Workers AI</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">@cf/baai/bge-large-en-v1.5</code></td>
                  <td className="py-2 pr-4">1024</td>
                  <td className="py-2">Workers AI</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">text-embedding-3-small</code></td>
                  <td className="py-2 pr-4">1536</td>
                  <td className="py-2">OpenAI</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">text-embedding-3-large</code></td>
                  <td className="py-2 pr-4">3072</td>
                  <td className="py-2">OpenAI</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">all-MiniLM-L6-v2</code></td>
                  <td className="py-2 pr-4">384</td>
                  <td className="py-2">Sentence Transformers</td>
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
            <code className="inline-code">vectorize</code> array in each
            bound Worker's{" "}
            <code className="inline-code">wrangler.jsonc</code>.
          </p>
          <CodeBlock title="wrangler.jsonc" lang="jsonc">
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">"vectorize"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">[</span>
            {"\n"}
            {"    "}<span className="syn-punc">{"{"}</span>
            {"\n"}
            {"      "}<span className="syn-prop">"binding"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"EMBEDDINGS"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"      "}<span className="syn-prop">"index_name"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"embeddings"</span>
            {"\n"}
            {"    "}<span className="syn-punc">{"}"}</span>
            {"\n"}
            {"  "}<span className="syn-punc">]</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
          </CodeBlock>
        </section>

        {/* Usage with Workers AI */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Usage with Workers AI
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            The most common Vectorize pattern is RAG (Retrieval-Augmented
            Generation): embed a user's query, search for similar documents,
            then pass those documents as context to an LLM. Here is a full
            example using Workers AI for both embedding and generation.
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
            <span className="syn-str">"rag-app"</span>
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
            <span className="syn-const">ai</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addWorkersAI</span>
            <span className="syn-punc">()</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">embeddings</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addVectorize</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"doc-embeddings"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">dimensions</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">768</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">metric</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"cosine"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">description</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"Documentation embeddings via bge-base-en-v1.5"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-fn">app.addWorker</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"search"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">entrypoint</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"./src/search/index.ts"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">bindings</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"    "}<span className="syn-prop">AI</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">ai</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"    "}<span className="syn-prop">VECTORS</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">embeddings</span>
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

          <CodeBlock title="src/search/index.ts (RAG worker)" lang="ts">
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
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-const">query</span>{" "}
            <span className="syn-punc">{"}"}</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-kw">await</span>{" "}
            <span className="syn-const">request</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">json</span>
            <span className="syn-punc">()</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            {"    "}<span className="syn-cmt">{"// 1. Embed the query"}</span>
            {"\n"}
            {"    "}<span className="syn-kw">const</span>{" "}
            <span className="syn-const">embResult</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-kw">await</span>{" "}
            <span className="syn-const">env</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">AI</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">run</span>
            <span className="syn-punc">(</span>
            {"\n"}
            {"      "}<span className="syn-str">"@cf/baai/bge-base-en-v1.5"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"      "}<span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">text</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">[</span>
            <span className="syn-const">query</span>
            <span className="syn-punc">]</span>{" "}
            <span className="syn-punc">{"}"}</span>
            {"\n"}
            {"    "}<span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"    "}<span className="syn-kw">const</span>{" "}
            <span className="syn-const">queryVector</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-const">embResult</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">data</span>
            <span className="syn-punc">[</span>
            <span className="syn-num">0</span>
            <span className="syn-punc">]</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            {"    "}<span className="syn-cmt">{"// 2. Search for similar documents"}</span>
            {"\n"}
            {"    "}<span className="syn-kw">const</span>{" "}
            <span className="syn-const">matches</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-kw">await</span>{" "}
            <span className="syn-const">env</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">VECTORS</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">query</span>
            <span className="syn-punc">(</span>
            <span className="syn-const">queryVector</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"      "}<span className="syn-prop">topK</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">5</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"      "}<span className="syn-prop">returnMetadata</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"all"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"    "}<span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            {"    "}<span className="syn-cmt">{"// 3. Build context from matched documents"}</span>
            {"\n"}
            {"    "}<span className="syn-kw">const</span>{" "}
            <span className="syn-const">context</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-const">matches</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">matches</span>
            {"\n"}
            {"      "}<span className="syn-punc">.</span>
            <span className="syn-fn">map</span>
            <span className="syn-punc">(</span>
            <span className="syn-const">m</span>{" "}
            <span className="syn-op">=&gt;</span>{" "}
            <span className="syn-const">m</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">metadata</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">text</span>
            <span className="syn-punc">)</span>
            {"\n"}
            {"      "}<span className="syn-punc">.</span>
            <span className="syn-fn">join</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"\\n\\n"</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            {"    "}<span className="syn-cmt">{"// 4. Generate a response with context"}</span>
            {"\n"}
            {"    "}<span className="syn-kw">const</span>{" "}
            <span className="syn-const">answer</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-kw">await</span>{" "}
            <span className="syn-const">env</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">AI</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">run</span>
            <span className="syn-punc">(</span>
            {"\n"}
            {"      "}<span className="syn-str">"@cf/meta/llama-3.1-8b-instruct"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"      "}<span className="syn-punc">{"{"}</span>
            {"\n"}
            {"        "}<span className="syn-prop">messages</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">[</span>
            {"\n"}
            {"          "}<span className="syn-punc">{"{"}</span>
            {"\n"}
            {"            "}<span className="syn-prop">role</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"system"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"            "}<span className="syn-prop">content</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">{"`Use this context to answer:\\n${"}</span>
            <span className="syn-const">context</span>
            <span className="syn-str">{"`"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"          "}<span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"          "}<span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">role</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"user"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-prop">content</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">query</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"        "}<span className="syn-punc">]</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"      "}<span className="syn-punc">{"}"}</span>
            {"\n"}
            {"    "}<span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            {"    "}<span className="syn-kw">return</span>{" "}
            <span className="syn-type">Response</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">json</span>
            <span className="syn-punc">({"{"}</span>
            {"\n"}
            {"      "}<span className="syn-prop">answer</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">answer</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">response</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"      "}<span className="syn-prop">sources</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">matches</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">matches</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">map</span>
            <span className="syn-punc">(</span>
            <span className="syn-const">m</span>{" "}
            <span className="syn-op">=&gt;</span>{" "}
            <span className="syn-punc">({"{"}</span>
            {"\n"}
            {"        "}<span className="syn-prop">id</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">m</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">id</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"        "}<span className="syn-prop">score</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">m</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">score</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"      "}<span className="syn-punc">{"})"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"    "}<span className="syn-punc">{"})"}</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">;</span>
          </CodeBlock>

          <h3 className="text-lg font-medium text-wash-300 mt-6 mb-2">
            Inserting Vectors
          </h3>
          <p className="text-denim-300 leading-relaxed mb-4">
            Use <code className="inline-code">env.VECTORS.upsert()</code> to
            insert or update vectors with their associated metadata.
          </p>
          <CodeBlock title="Inserting vectors" lang="ts">
            <span className="syn-cmt">{"// Embed documents"}</span>
            {"\n"}
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">texts</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-punc">[</span>
            <span className="syn-str">"First document..."</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-str">"Second document..."</span>
            <span className="syn-punc">]</span>
            <span className="syn-punc">;</span>
            {"\n"}
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">embResult</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-kw">await</span>{" "}
            <span className="syn-const">env</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">AI</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">run</span>
            <span className="syn-punc">(</span>
            {"\n"}
            {"  "}<span className="syn-str">"@cf/baai/bge-base-en-v1.5"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">text</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">texts</span>{" "}
            <span className="syn-punc">{"}"}</span>
            {"\n"}
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-cmt">{"// Upsert into Vectorize"}</span>
            {"\n"}
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">vectors</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-const">texts</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">map</span>
            <span className="syn-punc">(</span>
            <span className="syn-punc">(</span>
            <span className="syn-const">text</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-const">i</span>
            <span className="syn-punc">)</span>{" "}
            <span className="syn-op">=&gt;</span>{" "}
            <span className="syn-punc">({"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">id</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">{"`doc-${"}</span>
            <span className="syn-const">i</span>
            <span className="syn-str">{"`"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">values</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">embResult</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">data</span>
            <span className="syn-punc">[</span>
            <span className="syn-const">i</span>
            <span className="syn-punc">]</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">metadata</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">text</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"})"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-kw">await</span>{" "}
            <span className="syn-const">env</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">VECTORS</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">upsert</span>
            <span className="syn-punc">(</span>
            <span className="syn-const">vectors</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
        </section>
      </div>
    </DocLayout>
  );
}
