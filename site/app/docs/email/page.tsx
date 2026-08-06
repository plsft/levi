import { DocLayout } from "../../../components/DocLayout";
import { CodeBlock } from "../../../components/CodeBlock";

export default function EmailPage() {
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
            Email
          </h1>
          <p className="mt-4 text-denim-300 text-lg leading-relaxed">
            Send transactional email directly from your Workers using
            Cloudflare Email Routing -- no third-party email API required.
            Levi declares the binding, generates the{" "}
            <code className="inline-code">send_email</code> wrangler config,
            and <code className="inline-code">levi provision</code> enables
            Email Routing on your zone and registers destination addresses
            through the Cloudflare API.
          </p>
        </header>

        {/* Overview */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Overview
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Cloudflare Email Routing lets a Worker send email to verified
            destination addresses on your account -- ideal for operational
            notifications, alerts, and other transactional mail. Adding email
            to a Levi app involves three pieces, and Levi handles all of
            them:
          </p>
          <ul className="list-disc list-inside text-denim-300 space-y-2">
            <li>
              <strong className="text-wash-300">Binding declaration</strong>{" "}
              -- <code className="inline-code">app.addEmail()</code> declares
              a send-email binding you attach to Workers like any other
              resource
            </li>
            <li>
              <strong className="text-wash-300">Config generation</strong> --
              Levi emits the{" "}
              <code className="inline-code">send_email</code> array in each
              bound Worker's{" "}
              <code className="inline-code">wrangler.jsonc</code>
            </li>
            <li>
              <strong className="text-wash-300">Provisioning</strong> --{" "}
              <code className="inline-code">levi provision</code> enables
              Email Routing on the zone and registers destination addresses
              via the Cloudflare API
            </li>
          </ul>
        </section>

        {/* API */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            API
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Declare an email binding with{" "}
            <code className="inline-code">app.addEmail(name, options?)</code>.
            All options are optional -- with no options, the binding can send
            to any verified destination address on the account.
          </p>
          <h3 className="text-lg font-medium text-wash-300 mt-6 mb-2">
            EmailOptions
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
                  <td className="py-2 pr-4"><code className="inline-code">destinationAddress</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">Single verified destination address the binding may send to</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">allowedDestinationAddresses</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string[]</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">Allowlist of destination addresses. Mutually exclusive with destinationAddress -- Levi throws at build time if both are set</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">allowedSenderAddresses</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string[]</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">Restrict which sender addresses the binding may use</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">remote</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">boolean</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">false</code></td>
                  <td className="py-2">Use the real Email Routing API during wrangler dev instead of the local simulator</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">zone</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">app defaultZone</td>
                  <td className="py-2">Zone to enable Email Routing on; falls back to the app's defaultZone</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Declaring a Binding */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Declaring a Binding
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Declare the email binding in your{" "}
            <code className="inline-code">levi.app.ts</code> and attach it to
            a Worker through{" "}
            <code className="inline-code">bindings</code>. The binding key
            (<code className="inline-code">NOTIFY</code> below) becomes the{" "}
            <code className="inline-code">env</code> accessor at runtime.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">notify</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-fn">app.addEmail</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"ops-notify"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">destinationAddress</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"ops@acme.com"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">zone</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"acme.com"</span>
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
            <span className="syn-prop">NOTIFY</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">notify</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed mb-4">
            Levi generates the{" "}
            <code className="inline-code">send_email</code> fragment in the
            bound Worker's{" "}
            <code className="inline-code">wrangler.jsonc</code>:
          </p>
          <CodeBlock title="wrangler.jsonc" lang="jsonc">
            <span className="syn-prop">"send_email"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">[</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">"name"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"NOTIFY"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-prop">"destination_address"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"ops@acme.com"</span>{" "}
            <span className="syn-punc">{"}"}</span>
            {"\n"}
            <span className="syn-punc">]</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed mt-4">
            Note the binding uses{" "}
            <code className="inline-code">name</code> (the{" "}
            <code className="inline-code">env</code> accessor), matching
            wrangler's schema.
          </p>
        </section>

        {/* Runtime Usage */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Runtime Usage
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            At runtime, construct an{" "}
            <code className="inline-code">EmailMessage</code> from{" "}
            <code className="inline-code">cloudflare:email</code> and pass it
            to the binding's{" "}
            <code className="inline-code">send()</code> method.
          </p>
          <CodeBlock title="src/index.ts" lang="ts">
            <span className="syn-kw">import</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-type">EmailMessage</span>{" "}
            <span className="syn-punc">{"}"}</span>{" "}
            <span className="syn-kw">from</span>{" "}
            <span className="syn-str">"cloudflare:email"</span>
            <span className="syn-punc">;</span>
            {"\n\n"}
            <span className="syn-kw">const</span>{" "}
            <span className="syn-const">msg</span>{" "}
            <span className="syn-op">=</span>{" "}
            <span className="syn-kw">new</span>{" "}
            <span className="syn-type">EmailMessage</span>
            <span className="syn-punc">(</span>
            {"\n"}
            {"  "}<span className="syn-str">"noreply@acme.com"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-str">"ops@acme.com"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-const">rawMimeContent</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
            {"\n"}
            <span className="syn-kw">await</span>{" "}
            <span className="syn-const">env</span>
            <span className="syn-punc">.</span>
            <span className="syn-const">NOTIFY</span>
            <span className="syn-punc">.</span>
            <span className="syn-fn">send</span>
            <span className="syn-punc">(</span>
            <span className="syn-const">msg</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <div className="bg-denim-900/50 border border-denim-700 rounded-md p-4 mt-4">
            <p className="text-denim-300 text-sm">
              <strong className="text-thread-400">Note:</strong> The raw
              content must be a MIME-formatted message. The{" "}
              <code className="inline-code">mimetext</code> npm package is
              the common way to build one -- set the sender, recipient,
              subject, and body, then pass its{" "}
              <code className="inline-code">asRaw()</code> output as the
              third argument.
            </p>
          </div>
        </section>

        {/* Provisioning */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Provisioning
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Running <code className="inline-code">levi provision</code>{" "}
            performs the account-level setup that the binding depends on:
          </p>
          <ul className="list-disc list-inside text-denim-300 space-y-2 mb-4">
            <li>
              <strong className="text-wash-300">Enables Email Routing</strong>{" "}
              on the zone (adding the required MX and SPF records) if it is
              not already enabled
            </li>
            <li>
              <strong className="text-wash-300">Registers each destination
              address</strong> -- Cloudflare emails the recipient a one-time
              verification link
            </li>
            <li>
              <strong className="text-wash-300">Reports pending
              addresses</strong> -- any destination still awaiting
              verification is listed in the provision output
            </li>
          </ul>
          <p className="text-denim-300 leading-relaxed">
            Provisioning requires{" "}
            <code className="inline-code">CLOUDFLARE_API_TOKEN</code> and an
            account ID -- set the{" "}
            <code className="inline-code">account</code> app option or the{" "}
            <code className="inline-code">CLOUDFLARE_ACCOUNT_ID</code>{" "}
            environment variable.
          </p>
          <div className="bg-denim-900/50 border border-denim-700 rounded-md p-4 mt-4">
            <p className="text-denim-300 text-sm">
              <strong className="text-redtab-500">Warning:</strong> Sending
              fails until the destination address is verified. After your
              first provision, check the recipient inbox for Cloudflare's
              verification email and click the link before relying on the
              binding.
            </p>
          </div>
        </section>

        {/* Restriction Modes */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Restriction Modes
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            The options you pass determine which destinations the binding may
            send to. Choose one of three modes:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-denim-700">
                  <th className="py-2 pr-4 text-denim-400 font-medium">Mode</th>
                  <th className="py-2 pr-4 text-denim-400 font-medium">Options</th>
                  <th className="py-2 text-denim-400 font-medium">Behavior</th>
                </tr>
              </thead>
              <tbody className="text-denim-300">
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4">Unrestricted</td>
                  <td className="py-2 pr-4">none</td>
                  <td className="py-2">Send to any verified destination address on the account</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4">Single destination</td>
                  <td className="py-2 pr-4"><code className="inline-code">destinationAddress</code></td>
                  <td className="py-2">Send only to the one configured address</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4">Allowlist</td>
                  <td className="py-2 pr-4"><code className="inline-code">allowedDestinationAddresses</code></td>
                  <td className="py-2">Send only to addresses on the list</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-denim-300 leading-relaxed mt-4">
            <code className="inline-code">destinationAddress</code> and{" "}
            <code className="inline-code">allowedDestinationAddresses</code>{" "}
            are mutually exclusive -- Levi throws at build time if both are
            set.
          </p>
        </section>
      </div>
    </DocLayout>
  );
}
