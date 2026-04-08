import Link from "next/link";
import { DocLayout } from "../../../components/DocLayout";
import { CodeBlock } from "../../../components/CodeBlock";

export default function AIPage() {
  return (
    <DocLayout>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-denim-50">
            Workers AI & AI Gateway
          </h1>
          <span className="red-tab-h">AI</span>
        </div>
        <p className="text-denim-200 text-lg leading-relaxed max-w-2xl">
          Run machine learning models directly at the edge with Workers AI, and
          route inference traffic through AI Gateway for rate limiting, caching,
          and observability. Levi provisions both with a single function call.
        </p>
      </div>

      <div className="stitch-separator mb-10" />

      {/* Workers AI */}
      <h2>Workers AI</h2>
      <p>
        Workers AI gives your workers access to Cloudflare's catalog of
        pre-trained ML models — text generation, image classification, embeddings,
        translation, and more — without managing infrastructure. Levi binds the
        AI runtime to your worker automatically.
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
        <span className="syn-str">"my-ai-app"</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-cmt">{"// Bind Workers AI to the app"}</span>
        {"\n"}
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">ai</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-const">app</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">addWorkersAI</span>
        <span className="syn-punc">()</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">worker</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-const">app</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">addWorker</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"inference"</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">entrypoint</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"./src/inference.ts"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">bindings</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>{" "}
        <span className="syn-prop">AI</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-const">ai</span>{" "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
      </CodeBlock>

      <p>
        The <span className="inline-code">addWorkersAI()</span> call creates an
        AI binding that is injected into your worker's environment. In your
        worker code, you access it via <span className="inline-code">env.AI</span>:
      </p>

      <CodeBlock title="src/inference.ts" lang="typescript">
        <span className="syn-kw">export default</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"  "}
        <span className="syn-kw">async</span>{" "}
        <span className="syn-fn">fetch</span>
        <span className="syn-punc">(</span>
        <span className="syn-const">req</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-const">env</span>
        <span className="syn-punc">)</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"    "}
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">result</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-kw">await</span>{" "}
        <span className="syn-const">env</span>
        <span className="syn-punc">.</span>
        <span className="syn-const">AI</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">run</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"@cf/meta/llama-3.1-8b-instruct"</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"      "}
        <span className="syn-prop">messages</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">[{"{"}</span>{" "}
        <span className="syn-prop">role</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"user"</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-prop">content</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"Hello!"</span>{" "}
        <span className="syn-punc">{"}]"}</span>
        {"\n"}
        {"    "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        {"    "}
        <span className="syn-kw">return</span>{" "}
        <span className="syn-type">Response</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">json</span>
        <span className="syn-punc">(</span>
        <span className="syn-const">result</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n"}
        {"  "}
        <span className="syn-punc">{"}"}</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">;</span>
      </CodeBlock>

      <div className="stitch-separator my-8" />

      {/* AI Gateway */}
      <h2>AI Gateway</h2>
      <p>
        AI Gateway is a proxy layer that sits between your worker and the AI
        model. It provides rate limiting, response caching, request logging, and
        analytics — critical features for production AI applications. Levi
        configures the gateway alongside Workers AI.
      </p>

      <CodeBlock title="levi.app.ts" lang="typescript">
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">gateway</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-const">app</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">addAIGateway</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"gateway"</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">id</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"my-ai-gateway"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">rateLimiting</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"    "}
        <span className="syn-prop">rps</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-num">100</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"    "}
        <span className="syn-prop">strategy</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"sliding_window"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">caching</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"    "}
        <span className="syn-prop">enabled</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-const">true</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"    "}
        <span className="syn-prop">ttl</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-num">3600</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">logCollection</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-const">true</span>
        <span className="syn-punc">,</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
      </CodeBlock>

      <p>
        When both Workers AI and an AI Gateway are configured, Levi automatically
        routes all AI inference through the gateway. You don't need to change your
        worker code — the binding is transparently updated to use the gateway
        endpoint.
      </p>

      <h3>Gateway Features</h3>
      <ul>
        <li>
          <strong>Rate Limiting</strong> — Protect against runaway inference costs
          with configurable requests-per-second limits and sliding window or fixed
          window strategies.
        </li>
        <li>
          <strong>Response Caching</strong> — Cache identical prompts to reduce
          latency and cost. Set a TTL in seconds to control cache freshness.
        </li>
        <li>
          <strong>Log Collection</strong> — Capture every request and response for
          debugging, analytics, and compliance. Logs are accessible via the
          Cloudflare dashboard.
        </li>
        <li>
          <strong>Analytics</strong> — Track token usage, latency percentiles, error
          rates, and cost estimates across all models.
        </li>
      </ul>

      <div className="stitch-separator my-8" />

      {/* Options Reference */}
      <h2>Options Reference</h2>

      <h3>WorkersAIOptions</h3>
      <p>
        The <span className="inline-code">addWorkersAI()</span> method accepts an
        optional configuration object:
      </p>
      <div className="denim-pocket p-5 mb-6">
        <ul>
          <li>
            <span className="inline-code">binding</span>{" "}
            <span className="text-denim-400 text-sm">(string)</span> — Name of the
            AI binding in the worker environment. Defaults to{" "}
            <span className="inline-code">"AI"</span>.
          </li>
          <li>
            <span className="inline-code">gateway</span>{" "}
            <span className="text-denim-400 text-sm">(string)</span> — Optional AI
            Gateway ID to route through. If an{" "}
            <span className="inline-code">addAIGateway()</span> resource exists,
            Levi links it automatically.
          </li>
        </ul>
      </div>

      <h3>AIGatewayOptions</h3>
      <p>
        The <span className="inline-code">addAIGateway(name, options)</span>{" "}
        method accepts:
      </p>
      <div className="denim-pocket p-5 mb-6">
        <ul>
          <li>
            <span className="inline-code">id</span>{" "}
            <span className="text-denim-400 text-sm">(string, required)</span> —
            Unique identifier for the gateway in your Cloudflare account.
          </li>
          <li>
            <span className="inline-code">rateLimiting</span>{" "}
            <span className="text-denim-400 text-sm">(object)</span> — Rate limit
            configuration.
            <ul>
              <li>
                <span className="inline-code">enabled</span>{" "}
                <span className="text-denim-400 text-sm">(boolean)</span> — Enable
                rate limiting.
              </li>
              <li>
                <span className="inline-code">limit</span>{" "}
                <span className="text-denim-400 text-sm">(number)</span> — Max
                requests per period.
              </li>
              <li>
                <span className="inline-code">period</span>{" "}
                <span className="text-denim-400 text-sm">(number)</span> — Period
                in seconds.
              </li>
            </ul>
          </li>
          <li>
            <span className="inline-code">caching</span>{" "}
            <span className="text-denim-400 text-sm">(object)</span> — Response
            caching configuration.
            <ul>
              <li>
                <span className="inline-code">enabled</span>{" "}
                <span className="text-denim-400 text-sm">(boolean)</span> — Enable
                or disable caching.
              </li>
              <li>
                <span className="inline-code">ttl</span>{" "}
                <span className="text-denim-400 text-sm">(number)</span> — Cache
                time-to-live in seconds.
              </li>
            </ul>
          </li>
          <li>
            <span className="inline-code">logCollection</span>{" "}
            <span className="text-denim-400 text-sm">(object)</span> — Request/response
            logging. Pass{" "}
            <span className="inline-code">{"{ enabled: true }"}</span>.
          </li>
        </ul>
      </div>

      <div className="stitch-separator my-8" />

      {/* Generated Config */}
      <h2>Generated Config</h2>
      <p>
        When you run <span className="inline-code">levi build</span>, Levi
        generates the appropriate bindings in your{" "}
        <span className="inline-code">wrangler.jsonc</span>. Here is what the
        generated configuration looks like for an app with Workers AI and an AI
        Gateway:
      </p>

      <CodeBlock title="wrangler.jsonc (generated)" lang="jsonc">
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">"name"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"my-ai-app-inference"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">"main"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"./src/inference.ts"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">"ai"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"    "}
        <span className="syn-prop">"binding"</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"AI"</span>
        {"\n"}
        {"  "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-cmt">
          {"// AI Gateway is configured at the account level"}
        </span>
        {"\n"}
        {"  "}
        <span className="syn-cmt">
          {"// and referenced by the AI binding automatically"}
        </span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
      </CodeBlock>

      <div className="stitch-separator my-8" />

      {/* RAG Example */}
      <h2>RAG Example</h2>
      <p>
        A common pattern is combining Workers AI with Vectorize and D1 to build
        a Retrieval-Augmented Generation (RAG) application. Levi makes this easy
        to declare:
      </p>

      <CodeBlock title="levi.app.ts — RAG Application" lang="typescript">
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
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-cmt">{"// 1. AI for embeddings and text generation"}</span>
        {"\n"}
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">ai</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-const">app</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">addWorkersAI</span>
        <span className="syn-punc">()</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-cmt">
          {"// 2. AI Gateway for rate limiting and caching"}
        </span>
        {"\n"}
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">gateway</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-const">app</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">addAIGateway</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"gateway"</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">id</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"rag-gateway"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">rateLimiting</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>{" "}
        <span className="syn-prop">rps</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-num">50</span>{" "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">caching</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>{" "}
        <span className="syn-prop">enabled</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-const">true</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-prop">ttl</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-num">1800</span>{" "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">logCollection</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-const">true</span>
        <span className="syn-punc">,</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-cmt">{"// 3. Vectorize for semantic search"}</span>
        {"\n"}
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">vectors</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-const">app</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">addVectorize</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"knowledge-base"</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">dimensions</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-num">768</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">metric</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"cosine"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-cmt">{"// 4. D1 for document metadata"}</span>
        {"\n"}
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">db</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-const">app</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">addD1</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"documents"</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">migrations</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"./migrations"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-cmt">{"// 5. Worker that ties it all together"}</span>
        {"\n"}
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">worker</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-const">app</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">addWorker</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"rag-api"</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">entrypoint</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"./src/rag-api.ts"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">bindings</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>{" "}
        <span className="syn-prop">AI</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-const">ai</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-prop">KNOWLEDGE_BASE</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-const">vectors</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-prop">DOCUMENTS</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-const">db</span>{" "}
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

      <p>
        With this topology, your RAG worker has access to{" "}
        <span className="inline-code">env.AI</span> for generating embeddings and
        completions, <span className="inline-code">env.KNOWLEDGE_BASE</span> for
        querying the vector index, and{" "}
        <span className="inline-code">env.DOCUMENTS</span> for fetching full
        document content from D1. A typical query flow:
      </p>

      <ol className="list-decimal pl-6 mb-6 space-y-2">
        <li className="text-denim-200">
          User sends a question to the RAG API.
        </li>
        <li className="text-denim-200">
          The worker generates an embedding of the question using{" "}
          <span className="inline-code">@cf/baai/bge-base-en-v1.5</span>.
        </li>
        <li className="text-denim-200">
          The embedding is used to query Vectorize for the top-k most similar
          document chunks.
        </li>
        <li className="text-denim-200">
          Full document text is fetched from D1 using the returned IDs.
        </li>
        <li className="text-denim-200">
          The context is passed to{" "}
          <span className="inline-code">@cf/meta/llama-3.1-8b-instruct</span>{" "}
          along with the original question to produce a grounded answer.
        </li>
      </ol>

      <div className="stitch-separator my-8" />

      {/* Next steps */}
      <div className="denim-pocket p-5">
        <h2
          className="text-sm font-bold text-denim-300 uppercase tracking-widest mb-3"
          style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}
        >
          Next Steps
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/docs/vectorize"
            className="px-4 py-2 text-sm bg-wash-600/20 border border-dashed border-wash-500 rounded-md text-wash-300 hover:bg-wash-600/30 transition-colors"
          >
            Vectorize Docs
          </Link>
          <Link
            href="/docs/d1"
            className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
          >
            D1 Databases
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
