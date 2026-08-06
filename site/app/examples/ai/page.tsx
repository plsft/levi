import { Code } from "../../../components/Code";
import Link from "next/link";

export default function AIExamplesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 prose-denim">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-denim-50">AI Applications on Cloudflare</h1>
          <span className="red-tab-h">AI Cookbook</span>
        </div>
        <p className="text-denim-200 text-lg leading-relaxed max-w-3xl">
          Cloudflare gives you the full AI stack at the edge — model inference with Workers AI, vector
          search with Vectorize, headless browsers with Browser Rendering, and usage metering with
          Analytics Engine. With Levi, an entire AI application — inference, vectors, browser automation,
          and metering — is declared in a single levi.app.ts, with no external services to stitch together.
        </p>
      </div>

      <div className="stitch-separator mb-12" />

      <section className="mb-12">
        <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>RAG Chatbot — Vectorize + Workers AI + AI Gateway + D1</h2>
        <p className="text-denim-200 leading-relaxed max-w-3xl">
          A retrieval-augmented chatbot over your own documentation. Document chunks are embedded into a
          Vectorize index, questions are answered by a Workers AI model routed through an AI Gateway (which
          caches repeated prompts), and conversation history lands in D1. Four resources, one worker, one file.
        </p>
        <Code>{`import { FlareApp } from "@flarefound/levi";

const app = new FlareApp("docs-chat", {
  compatibility_date: "2026-04-01",
});

const ai = app.addWorkersAI();
const gateway = app.addAIGateway("llm-gateway", {
  id: "docs-chat-gateway",
  caching: { enabled: true, ttl: 3600 },
});
const embeddings = app.addVectorize("doc-chunks", {
  dimensions: 768,
  metric: "cosine",
});
const history = app.addD1("chat-history");

const chat = app.addWorker("chat", {
  framework: "hono",
  entrypoint: "./src/chat.ts",
  bindings: { AI: gateway, VECTORS: embeddings, HISTORY: history },
});

export default app;`}</Code>
        <Code>{`// src/chat.ts — the /ask handler
app.post("/ask", async (c) => {
  const { question, sessionId } = await c.req.json();

  // 1. Embed the question
  const { data } = await c.env.AI.run("@cf/baai/bge-base-en-v1.5", {
    text: [question],
  });

  // 2. Find the most relevant doc chunks
  const results = await c.env.VECTORS.query(data[0], {
    topK: 5,
    returnMetadata: "all",
  });
  const context = results.matches
    .map((m) => m.metadata?.text)
    .join("\\n---\\n");

  // 3. Answer with the context stuffed into the system prompt
  const answer = await c.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
    messages: [
      { role: "system", content: \`Answer using only this context:\\n\${context}\` },
      { role: "user", content: question },
    ],
  });

  // 4. Persist the turn
  await c.env.HISTORY.prepare(
    "INSERT INTO turns (session_id, question, answer) VALUES (?, ?, ?)"
  ).bind(sessionId, question, answer.response).run();

  return c.json({ answer: answer.response });
});`}</Code>
        <p className="text-denim-300 text-sm leading-relaxed max-w-3xl">
          Why it works: embeddings, vector search, and generation all run inside Cloudflare&apos;s network, so
          there are no round trips to external vector databases or LLM providers — and the AI Gateway cache
          means repeated questions never hit the model twice.
        </p>
      </section>

      <div className="stitch-separator mb-12" />

      <section className="mb-12">
        <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>Browser-Powered Research Agent — Browser Rendering + Queues + R2</h2>
        <p className="text-denim-200 leading-relaxed max-w-3xl">
          An agent that researches topics by actually browsing the web. The agent worker enqueues crawl jobs;
          a consumer worker picks them up in batches, drives a real headless browser via Browser Rendering
          (new in 0.4.0), screenshots each page into R2, and summarizes the extracted text with Workers AI.
        </p>
        <Code>{`import { FlareApp } from "@flarefound/levi";

const app = new FlareApp("research-agent", {
  compatibility_date: "2026-04-01",
});

const browser = app.addBrowserRendering();
const ai = app.addWorkersAI();
const jobs = app.addQueue("crawl-jobs");
const snapshots = app.addR2("snapshots");

const agent = app.addWorker("agent", {
  framework: "hono",
  entrypoint: "./src/agent.ts",
  bindings: { BROWSER: browser, AI: ai, JOBS: jobs, SNAPSHOTS: snapshots },
});

const crawler = app.addWorker("crawler", {
  entrypoint: "./src/crawler.ts",
  bindings: { BROWSER: browser, AI: ai, SNAPSHOTS: snapshots },
  consumers: [{ queue: jobs, maxBatchSize: 5 }],
});

export default app;`}</Code>
        <Code>{`// src/crawler.ts — queue consumer
import puppeteer from "@cloudflare/puppeteer";

export default {
  async queue(batch, env) {
    const browser = await puppeteer.launch(env.BROWSER);

    for (const msg of batch.messages) {
      const { url, jobId } = msg.body;
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "networkidle0" });

      // Extract readable text and snapshot the page
      const text = await page.evaluate(() => document.body.innerText);
      const shot = await page.screenshot({ fullPage: true });
      await env.SNAPSHOTS.put(\`\${jobId}/screenshot.png\`, shot);

      // Summarize with Workers AI
      const summary = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: [
          { role: "system", content: "Summarize this page in 5 bullet points." },
          { role: "user", content: text.slice(0, 12000) },
        ],
      });
      await env.SNAPSHOTS.put(\`\${jobId}/summary.txt\`, summary.response);

      await page.close();
      msg.ack();
    }
    await browser.close();
  },
};`}</Code>
        <p className="text-denim-300 text-sm leading-relaxed max-w-3xl">
          Why it works: the queue decouples user requests from slow browser sessions, and because Browser
          Rendering runs headless Chrome inside Cloudflare, there is no fleet of browser VMs to manage —
          the crawler scales down to zero between jobs.
        </p>
      </section>

      <div className="stitch-separator mb-12" />

      <section className="mb-12">
        <h2 style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>Metered AI API — AI Gateway + Analytics Engine + Rate Limiting</h2>
        <p className="text-denim-200 leading-relaxed max-w-3xl">
          A public inference API with per-key rate limits and usage-based billing. API keys live in KV, the
          Rate Limiting binding (new in 0.4.0) enforces 60 requests per minute per key, inference is routed
          through an AI Gateway with logging enabled, and every request writes a data point to Analytics
          Engine (new in 0.4.0) that your billing pipeline reads back over the SQL API.
        </p>
        <Code>{`import { FlareApp } from "@flarefound/levi";

const app = new FlareApp("inference-api", {
  compatibility_date: "2026-04-01",
});

const gateway = app.addAIGateway("metered-gateway", {
  id: "inference-gateway",
  rateLimiting: { enabled: true, limit: 1000, period: 3600 },
  logging: { enabled: true },
});
const usage = app.addAnalyticsEngine("llm-usage");
const limiter = app.addRateLimit("per-key", { limit: 60, period: 60 });
const keys = app.addKV("api-keys");

const api = app.addWorker("inference-api", {
  framework: "hono",
  entrypoint: "./src/api.ts",
  bindings: { AI: gateway, USAGE: usage, LIMITER: limiter, KEYS: keys },
});

export default app;`}</Code>
        <Code>{`// src/api.ts — metered inference endpoint
app.post("/v1/generate", async (c) => {
  const apiKey = c.req.header("Authorization")?.replace("Bearer ", "");
  const account = apiKey && (await c.env.KEYS.get(apiKey, "json"));
  if (!account) return c.json({ error: "invalid key" }, 401);

  // Per-key rate limit: 60 req/min
  const { success } = await c.env.LIMITER.limit({ key: apiKey });
  if (!success) return c.json({ error: "rate limit exceeded" }, 429);

  const { prompt, model = "@cf/meta/llama-3.1-8b-instruct" } = await c.req.json();
  const result = await c.env.AI.run(model, {
    messages: [{ role: "user", content: prompt }],
  });

  // Meter usage — billing reads this via the Analytics Engine SQL API
  const tokensUsed = result.usage?.total_tokens ?? 0;
  c.env.USAGE.writeDataPoint({
    blobs: [apiKey, model],
    doubles: [tokensUsed],
    indexes: [apiKey],
  });

  return c.json({ output: result.response, tokens: tokensUsed });
});`}</Code>
        <p className="text-denim-300 text-sm leading-relaxed max-w-3xl">
          Why it works: rate limiting and metering happen in-process with the request — no Redis for
          counters, no metrics pipeline to operate. Analytics Engine absorbs millions of writes and your
          billing job simply queries it with SQL.
        </p>
      </section>

      <div className="stitch-separator mb-12" />

      <div className="denim-pocket p-5">
        <h2 className="text-sm font-bold text-denim-300 uppercase tracking-widest mb-3">
          Ready to Build?
        </h2>
        <p className="text-sm text-denim-300 mb-4">
          Every binding used here is one method call in levi.app.ts. Explore the full catalog.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/docs/ai"
            className="px-4 py-2 text-sm bg-wash-600/20 border border-dashed border-wash-500 rounded-md text-wash-300 hover:bg-wash-600/30 transition-colors"
          >
            Workers AI Docs
          </Link>
          <Link
            href="/docs/bindings"
            className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
          >
            More Bindings
          </Link>
        </div>
      </div>
    </div>
  );
}
