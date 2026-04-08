import { DocLayout } from "../../../components/DocLayout";
import { CodeBlock } from "../../../components/CodeBlock";

export default function QueuesPage() {
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
            Queues
          </h1>
          <p className="mt-4 text-denim-300 text-lg leading-relaxed">
            Cloudflare Queues provide reliable, at-least-once message delivery
            between Workers. Use queues for asynchronous processing, background
            jobs, event-driven architectures, and decoupling producers from
            consumers. Levi manages queue provisioning, producer bindings, and
            consumer configuration from a single TypeScript declaration.
          </p>
        </header>

        {/* Overview */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Overview
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Queues sit between Workers: one Worker{" "}
            <strong className="text-wash-300">produces</strong> messages by
            writing to a queue, and another Worker{" "}
            <strong className="text-wash-300">consumes</strong> those messages
            in batches. Messages are retried automatically on failure, and
            undeliverable messages can be routed to a dead-letter queue for
            inspection.
          </p>
          <ul className="list-disc list-inside text-denim-300 space-y-1">
            <li>At-least-once delivery guarantees</li>
            <li>Batched consumption for throughput</li>
            <li>Configurable retries and delivery delay</li>
            <li>Dead-letter queue support for failed messages</li>
            <li>No external infrastructure to manage</li>
          </ul>
        </section>

        {/* Creating a Queue */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Creating a Queue
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Declare a queue in your{" "}
            <code className="inline-code">levi.app.ts</code> using{" "}
            <code className="inline-code">app.addQueue()</code>. The returned
            resource reference is used to bind the queue to workers as a
            producer or consumer.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">jobQueue</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addQueue</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"jobs"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">retries</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">3</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed">
            This declares a queue named{" "}
            <code className="inline-code">jobs</code> with up to 3 retries per
            message. Levi will provision the queue and generate the correct
            wrangler configuration during{" "}
            <code className="inline-code">levi build</code>.
          </p>
        </section>

        {/* Producing Messages */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Producing Messages
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            To produce messages, pass the queue resource into a Worker's{" "}
            <code className="inline-code">bindings</code> map. This creates a
            producer binding so the Worker can send messages to the queue at
            runtime.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">jobQueue</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addQueue</span>
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
            {"    "}<span className="syn-prop">JOBS</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">jobQueue</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed">
            At runtime, the Worker accesses the queue via{" "}
            <code className="inline-code">env.JOBS</code> and calls{" "}
            <code className="inline-code">env.JOBS.send()</code> or{" "}
            <code className="inline-code">env.JOBS.sendBatch()</code> to
            enqueue messages.
          </p>
        </section>

        {/* Consuming Messages */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Consuming Messages
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Consumers are declared on the Worker side using the{" "}
            <code className="inline-code">consumers</code> array. Each consumer
            references a queue and configures batch size, retries, wait time,
            and optional dead-letter routing.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">dlq</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addQueue</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"jobs-dlq"</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-fn">app.addWorker</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"job-runner"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">entrypoint</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"./src/jobs/index.ts"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">consumers</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">[</span>
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"    "}<span className="syn-prop">queue</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">jobQueue</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"    "}<span className="syn-prop">maxBatchSize</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">25</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"    "}<span className="syn-prop">maxRetries</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">5</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"    "}<span className="syn-prop">maxWaitMs</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">10000</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"    "}<span className="syn-prop">deadLetterQueue</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">dlq</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"}"}</span>
            <span className="syn-punc">]</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed">
            The consumer Worker must export a{" "}
            <code className="inline-code">queue</code> handler that receives
            batches of messages. Messages that fail processing are retried up
            to <code className="inline-code">maxRetries</code> times before
            being sent to the dead-letter queue.
          </p>
        </section>

        {/* Dead Letter Queues */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Dead Letter Queues
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            A dead-letter queue (DLQ) catches messages that have exhausted all
            retries. Configure a DLQ to prevent message loss and enable later
            inspection or reprocessing.
          </p>
          <p className="text-denim-300 leading-relaxed mb-4">
            DLQs can be set at two levels:
          </p>
          <ul className="list-disc list-inside text-denim-300 space-y-2 mb-4">
            <li>
              <strong className="text-wash-300">Queue-level</strong> — Set{" "}
              <code className="inline-code">deadLetterQueue</code> in{" "}
              <code className="inline-code">QueueOptions</code> to route all
              failed messages from that queue to a DLQ regardless of consumer.
            </li>
            <li>
              <strong className="text-wash-300">Consumer-level</strong> — Set{" "}
              <code className="inline-code">deadLetterQueue</code> in{" "}
              <code className="inline-code">ConsumerConfig</code> to specify a
              DLQ for a specific consumer. This overrides the queue-level DLQ.
            </li>
          </ul>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-cmt">
              {"// Queue-level DLQ (applies to all consumers)"}
            </span>
            {"\n"}
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">dlq</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addQueue</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"jobs-dlq"</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">jobQueue</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addQueue</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"jobs"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">retries</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">3</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">deadLetterQueue</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"jobs-dlq"</span>
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
            QueueOptions
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
                  <td className="py-2 pr-4"><code className="inline-code">deliveryDelay</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">number</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">0</code></td>
                  <td className="py-2">Default delay in seconds before messages become visible (0-43200)</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">retries</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">number</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">3</code></td>
                  <td className="py-2">Max retry attempts after consumer failure (0-100)</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">deadLetterQueue</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">Name of another queue to receive failed messages</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">queueId</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">Bind to an existing queue ID (skips provisioning)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-medium text-wash-300 mt-6 mb-2">
            ConsumerConfig
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
                  <td className="py-2 pr-4"><code className="inline-code">queue</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">QueueResource</code></td>
                  <td className="py-2 pr-4">required</td>
                  <td className="py-2">The queue to consume messages from</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">maxBatchSize</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">number</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">10</code></td>
                  <td className="py-2">Messages per batch (1-100)</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">maxRetries</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">number</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">3</code></td>
                  <td className="py-2">Retry attempts per message (0-100)</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">maxWaitMs</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">number</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">5000</code></td>
                  <td className="py-2">Max wait to fill a batch in ms (0-30000)</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">deadLetterQueue</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">QueueResource</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">DLQ for messages that exhaust retries</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">maxConcurrency</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">number</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">1</code></td>
                  <td className="py-2">Parallel consumer invocations (1-20)</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">retryDelay</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">number</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">Delay in seconds before a retried message is visible (0-43200)</td>
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
            When you run <code className="inline-code">levi build</code>, Levi
            generates the <code className="inline-code">queues.producers</code>{" "}
            and <code className="inline-code">queues.consumers</code> sections
            in each Worker's{" "}
            <code className="inline-code">wrangler.jsonc</code>.
          </p>
          <CodeBlock title="wrangler.jsonc (api worker)" lang="jsonc">
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">"queues"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"    "}<span className="syn-prop">"producers"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">[</span>
            {"\n"}
            {"      "}<span className="syn-punc">{"{"}</span>
            {"\n"}
            {"        "}<span className="syn-prop">"binding"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"JOBS"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"        "}<span className="syn-prop">"queue"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"jobs"</span>
            {"\n"}
            {"      "}<span className="syn-punc">{"}"}</span>
            {"\n"}
            {"    "}<span className="syn-punc">]</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"}"}</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
          </CodeBlock>
          <CodeBlock title="wrangler.jsonc (job-runner worker)" lang="jsonc">
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">"queues"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"    "}<span className="syn-prop">"consumers"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">[</span>
            {"\n"}
            {"      "}<span className="syn-punc">{"{"}</span>
            {"\n"}
            {"        "}<span className="syn-prop">"queue"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"jobs"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"        "}<span className="syn-prop">"max_batch_size"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">25</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"        "}<span className="syn-prop">"max_retries"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">5</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"        "}<span className="syn-prop">"max_batch_timeout"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">10000</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"        "}<span className="syn-prop">"dead_letter_queue"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"jobs-dlq"</span>
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

        {/* Full Example */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Full Example
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            A complete setup with an API Worker producing messages and a
            job-runner Worker consuming them, including a dead-letter queue
            for failed messages.
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
            <span className="syn-cmt">{"// Dead-letter queue for failed jobs"}</span>
            {"\n"}
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">dlq</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addQueue</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"jobs-dlq"</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-cmt">{"// Main job queue"}</span>
            {"\n"}
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">jobQueue</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addQueue</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"jobs"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">retries</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">3</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">deadLetterQueue</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"jobs-dlq"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-cmt">{"// API Worker — produces messages"}</span>
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
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">JOBS</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">jobQueue</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-cmt">{"// Job runner — consumes messages"}</span>
            {"\n"}
            <span className="syn-fn">app.addWorker</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"job-runner"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">entrypoint</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"./src/jobs/index.ts"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">consumers</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">[{"{"}</span>
            {"\n"}
            {"    "}<span className="syn-prop">queue</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">jobQueue</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"    "}<span className="syn-prop">maxBatchSize</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">25</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"    "}<span className="syn-prop">maxRetries</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">5</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"    "}<span className="syn-prop">maxWaitMs</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">10000</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"    "}<span className="syn-prop">deadLetterQueue</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">dlq</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"}]"}</span>
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

          <CodeBlock title="src/api/index.ts (producer)" lang="ts">
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
            <span className="syn-const">body</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-kw">await</span>{" "}
            <span className="syn-const">request</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">json</span>
            <span className="syn-punc">()</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            {"    "}<span className="syn-cmt">{"// Send a single message"}</span>
            {"\n"}
            {"    "}<span className="syn-kw">await</span>{" "}
            <span className="syn-const">env</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">JOBS</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">send</span>
            <span className="syn-punc">({"{"}</span>
            {"\n"}
            {"      "}<span className="syn-prop">type</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"process-upload"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"      "}<span className="syn-prop">payload</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">body</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"    "}<span className="syn-punc">{"})"}</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            {"    "}<span className="syn-kw">return new</span>{" "}
            <span className="syn-type">Response</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"Job queued"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">status</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">202</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">;</span>
          </CodeBlock>

          <CodeBlock title="src/jobs/index.ts (consumer)" lang="ts">
            <span className="syn-kw">export default</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-kw">async</span>{" "}
            <span className="syn-fn">queue</span>
            <span className="syn-punc">(</span>
            <span className="syn-const">batch</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-const">env</span>
            <span className="syn-punc">)</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"    "}<span className="syn-kw">for</span>{" "}
            <span className="syn-punc">(</span>
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">msg</span>{" "}
            <span className="syn-kw">of</span>{" "}
            <span className="syn-const">batch</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">messages</span>
            <span className="syn-punc">)</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"      "}<span className="syn-kw">try</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"        "}<span className="syn-kw">await</span>{" "}
            <span className="syn-fn">processJob</span>
            <span className="syn-punc">(</span>
            <span className="syn-const">msg</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">body</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"        "}<span className="syn-const">msg</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">ack</span>
            <span className="syn-punc">()</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"      "}<span className="syn-punc">{"}"}</span>{" "}
            <span className="syn-kw">catch</span>{" "}
            <span className="syn-punc">(</span>
            <span className="syn-const">err</span>
            <span className="syn-punc">)</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"        "}<span className="syn-const">msg</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">retry</span>
            <span className="syn-punc">()</span>
            <span className="syn-punc">;</span>
            {"\n"}
            {"      "}<span className="syn-punc">{"}"}</span>
            {"\n"}
            {"    "}<span className="syn-punc">{"}"}</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
        </section>
      </div>
    </DocLayout>
  );
}
