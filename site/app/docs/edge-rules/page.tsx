import { DocLayout } from "../../../components/DocLayout";
import { CodeBlock } from "../../../components/CodeBlock";

export default function EdgeRulesPage() {
  return (
    <DocLayout>
      <div className="space-y-10">
        {/* Header */}
        <header>
          <div className="flex items-center gap-3 mb-4">
            <span className="red-tab-h">new</span>
            <span className="text-xs text-denim-500 font-mono">
              Edge
            </span>
          </div>
          <h1 className="text-4xl font-bold text-denim-50 stitch-border-b pb-4">
            Edge Rules
          </h1>
          <p className="mt-4 text-denim-300 text-lg leading-relaxed">
            Edge Rules let you declare zone-level Cloudflare configuration --
            redirects, cache rules, WAF custom rules, rate limiting, header
            transforms, and Snippets -- in your{" "}
            <code className="inline-code">levi.app.ts</code>, right alongside
            your Workers. This is territory that SST, Alchemy, and wrangler
            don't cover: these rules live on the zone, not on a Worker, and
            Levi provisions them through the Cloudflare Rulesets API rather
            than <code className="inline-code">wrangler.jsonc</code>.
          </p>
        </header>

        {/* Overview */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Overview
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Zone-level configuration usually ends up in the Cloudflare
            dashboard or a separate Terraform stack, drifting away from the
            code it protects. Edge Rules bring it into the same declaration as
            your Workers:
          </p>
          <ul className="list-disc list-inside text-denim-300 space-y-2 mb-4">
            <li>
              <strong className="text-wash-300">Declare</strong> -- Call{" "}
              <code className="inline-code">app.addRedirect()</code>,{" "}
              <code className="inline-code">app.addCacheRule()</code>,{" "}
              <code className="inline-code">app.addWAFRule()</code>,{" "}
              <code className="inline-code">app.addRateLimitRule()</code>,{" "}
              <code className="inline-code">app.addHeaderRule()</code>, or{" "}
              <code className="inline-code">app.addSnippet()</code> in{" "}
              <code className="inline-code">levi.app.ts</code>
            </li>
            <li>
              <strong className="text-wash-300">Build</strong> --{" "}
              <code className="inline-code">levi build</code> compiles your
              rules to{" "}
              <code className="inline-code">
                .levi/zones/&lt;zone&gt;.rules.json
              </code>
              , one file per zone
            </li>
            <li>
              <strong className="text-wash-300">Diff</strong> --{" "}
              <code className="inline-code">levi diff</code> compares the
              compiled rules against the live zone and shows exactly what
              would change
            </li>
            <li>
              <strong className="text-wash-300">Provision</strong> --{" "}
              <code className="inline-code">levi provision</code> syncs the
              rules to Cloudflare via the Rulesets API
            </li>
          </ul>
          <p className="text-denim-300 leading-relaxed">
            Every rule Levi creates is tagged so it can be tracked, updated,
            and deleted safely without touching anything you or your team
            created in the dashboard. See{" "}
            <a href="#safety" className="text-thread-400 hover:underline">
              Safety Model
            </a>{" "}
            below.
          </p>
        </section>

        {/* Zone Resolution */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Zone Resolution
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Every edge rule accepts an optional{" "}
            <code className="inline-code">zone</code> (a zone name like{" "}
            <code className="inline-code">"example.com"</code>) and{" "}
            <code className="inline-code">zoneId</code>. Levi resolves the
            target zone for each rule in this order:
          </p>
          <ol className="list-decimal list-inside text-denim-300 space-y-2 mb-4">
            <li>
              The rule's own <code className="inline-code">zone</code> /{" "}
              <code className="inline-code">zoneId</code> option
            </li>
            <li>
              The app-level <code className="inline-code">defaultZone</code>{" "}
              (a new <code className="inline-code">AppOptions</code> field)
            </li>
            <li>
              Inference -- if every domain declared in the app shares a single
              registrable zone, Levi uses it
            </li>
            <li>
              Otherwise, <code className="inline-code">levi build</code> fails
              with an error asking you to specify the zone
            </li>
          </ol>
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
            <span className="syn-str">"acme"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">compatibility_date</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"2026-04-01"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">defaultZone</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"acme.com"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed mt-4">
            With <code className="inline-code">defaultZone</code> set, none of
            the rules below need to repeat the zone. Multi-zone apps simply
            pass <code className="inline-code">zone</code> per rule and Levi
            compiles one rules file per zone.
          </p>
        </section>

        {/* Redirects */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Redirects
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Declare zone-level redirects with{" "}
            <code className="inline-code">app.addRedirect(name, options)</code>
            . The <code className="inline-code">from</code> URL supports
            wildcards (<code className="inline-code">*</code>), and{" "}
            <code className="inline-code">to</code> can reference wildcard
            captures with{" "}
            <code className="inline-code">{"${1}"}</code> -- Levi compiles
            these to Cloudflare's{" "}
            <code className="inline-code">wildcard_replace()</code> function.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-fn">app.addRedirect</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"www-to-apex"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">from</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"https://www.acme.com/*"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">to</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">{'"https://acme.com/${1}"'}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">status</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">301</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <div className="overflow-x-auto mt-4">
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
                  <td className="py-2 pr-4"><code className="inline-code">from</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">Source URL or path to match; wildcard <code className="inline-code">*</code> supported</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">to</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">required</td>
                  <td className="py-2">Target URL; may use <code className="inline-code">{"${1}"}</code> captures from wildcards</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">status</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">301 | 302 | 307 | 308</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">301</code></td>
                  <td className="py-2">HTTP redirect status code</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">preserveQueryString</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">boolean</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">true</code></td>
                  <td className="py-2">Carry the original query string to the target</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">expression</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">Raw Cloudflare filter expression; overrides <code className="inline-code">from</code></td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">enabled</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">boolean</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">true</code></td>
                  <td className="py-2">Deploy the rule in a disabled state when <code className="inline-code">false</code></td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">zone</code> / <code className="inline-code">zoneId</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">Target zone; falls back to zone resolution</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Cache Rules */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Cache Rules
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Control edge and browser caching per URL pattern with{" "}
            <code className="inline-code">app.addCacheRule(name, options)</code>
            . The <code className="inline-code">match</code> object is
            AND-combined sugar over the underlying filter expression; use the{" "}
            <code className="inline-code">expression</code> escape hatch for
            anything it doesn't cover.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-fn">app.addCacheRule</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"static-assets"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">match</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">pathStartsWith</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"/assets/"</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">cache</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-const">true</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">edgeTtl</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">86400</span>
            <span className="syn-punc">,</span>
            {"   "}
            <span className="syn-cmt">{"// 1 day at the edge"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">browserTtl</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">3600</span>
            <span className="syn-punc">,</span>
            {"  "}
            <span className="syn-cmt">{"// 1 hour in the browser"}</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <div className="overflow-x-auto mt-4">
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
                  <td className="py-2 pr-4"><code className="inline-code">match</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">{"{ host?, path?, pathStartsWith?, pathWildcard? }"}</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">AND-combined matching sugar; all provided fields must match</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">cache</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">boolean</code></td>
                  <td className="py-2 pr-4">required</td>
                  <td className="py-2">Whether matched requests are eligible for caching</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">edgeTtl</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">{"number | { mode, seconds? }"}</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">Edge cache TTL in seconds, or a mode object (e.g. respect origin)</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">browserTtl</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">{"number | { mode, seconds? }"}</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">Browser cache TTL in seconds, or a mode object</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">cacheKey</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">{"{ queryString?, headers?, cookies? }"}</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">Custom cache key; <code className="inline-code">queryString</code> accepts <code className="inline-code">"all"</code>, <code className="inline-code">"none"</code>, <code className="inline-code">{"{ include }"}</code>, or <code className="inline-code">{"{ exclude }"}</code></td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">expression</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">Raw filter expression; overrides <code className="inline-code">match</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* WAF Custom Rules */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            WAF Custom Rules
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Declare WAF custom rules with{" "}
            <code className="inline-code">app.addWAFRule(name, options)</code>.
            Unlike the other rule types, there is deliberately no matching
            sugar here: security rules take a raw{" "}
            <code className="inline-code">expression</code> so what you review
            is exactly what runs at the edge.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-fn">app.addWAFRule</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"challenge-unverified-bots"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">expression</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"cf.client.bot and not cf.verified_bot"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">action</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"managed_challenge"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <div className="overflow-x-auto mt-4">
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
                  <td className="py-2 pr-4"><code className="inline-code">expression</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">required</td>
                  <td className="py-2">Cloudflare filter expression the rule matches against</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">action</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">"block" | "managed_challenge" | "js_challenge" | "challenge" | "log" | "skip"</code></td>
                  <td className="py-2 pr-4">required</td>
                  <td className="py-2">What to do when the expression matches</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">skip</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">{"{ products?, phases? }"}</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">For <code className="inline-code">action: "skip"</code>: which security products or phases to bypass</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Rate Limiting Rules */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Rate Limiting Rules
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            <code className="inline-code">
              app.addRateLimitRule(name, options)
            </code>{" "}
            declares edge HTTP rate limiting: excess requests are blocked at
            the Cloudflare edge before your Worker ever runs. This is
            distinct from the Workers rate limiting{" "}
            <em>binding</em> (<code className="inline-code">app.addRateLimit()</code>,
            documented on the Bindings page), which your Worker code calls at
            runtime.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-fn">app.addRateLimitRule</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"login-throttle"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">expression</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">{'"http.request.uri.path eq \\"/api/login\\""'}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">requestsPerPeriod</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">10</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">period</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">60</span>
            <span className="syn-punc">,</span>
            {"            "}
            <span className="syn-cmt">{"// 10 requests per minute"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">mitigationTimeout</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-num">600</span>
            <span className="syn-punc">,</span>
            {"  "}
            <span className="syn-cmt">{"// block for 10 minutes"}</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <div className="overflow-x-auto mt-4">
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
                  <td className="py-2 pr-4"><code className="inline-code">expression</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">required</td>
                  <td className="py-2">Filter expression selecting the requests to rate limit</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">requestsPerPeriod</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">number</code></td>
                  <td className="py-2 pr-4">required</td>
                  <td className="py-2">Request count that triggers mitigation within the period</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">period</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">number</code></td>
                  <td className="py-2 pr-4">required</td>
                  <td className="py-2">Counting window in seconds; <code className="inline-code">10</code>, <code className="inline-code">60</code>, <code className="inline-code">600</code>, or <code className="inline-code">3600</code> on non-Enterprise plans</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">mitigationTimeout</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">number</code></td>
                  <td className="py-2 pr-4">= <code className="inline-code">period</code></td>
                  <td className="py-2">How long the action applies after the limit is exceeded, in seconds</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">characteristics</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string[]</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">["cf.colo.id", "ip.src"]</code></td>
                  <td className="py-2">Dimensions the counter is keyed on (per IP by default)</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">action</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">"block"</code></td>
                  <td className="py-2">Mitigation action when the limit is exceeded</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">countingExpression</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">Separate expression for counting (e.g. only count 401 responses)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Header Rules */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Header Rules
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Transform request or response headers at the edge with{" "}
            <code className="inline-code">app.addHeaderRule(name, options)</code>
            . A plain string value is shorthand for{" "}
            <code className="inline-code">{'{ operation: "set" }'}</code>; use
            the object form for <code className="inline-code">add</code>,{" "}
            <code className="inline-code">remove</code>, or dynamic{" "}
            <code className="inline-code">expression</code> values.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-fn">app.addHeaderRule</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"security-headers"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">direction</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"response"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">headers</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"    "}<span className="syn-str">"X-Frame-Options"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"DENY"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"    "}<span className="syn-str">"X-Content-Type-Options"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"nosniff"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"    "}<span className="syn-str">"Referrer-Policy"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"strict-origin-when-cross-origin"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"    "}<span className="syn-str">"Server"</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-punc">{"{"}</span>{" "}
            <span className="syn-prop">operation</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"remove"</span>{" "}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-punc">{"}"}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <div className="overflow-x-auto mt-4">
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
                  <td className="py-2 pr-4"><code className="inline-code">direction</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">"request" | "response"</code></td>
                  <td className="py-2 pr-4">required</td>
                  <td className="py-2">Whether headers are transformed on the way in or out</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">match</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">{"{ host?, path?, pathStartsWith?, pathWildcard? }"}</code></td>
                  <td className="py-2 pr-4">--</td>
                  <td className="py-2">Same AND-combined matching sugar as cache rules; omit to match all traffic</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">headers</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">{"Record<string, string | { operation, value?, expression? }>"}</code></td>
                  <td className="py-2 pr-4">required</td>
                  <td className="py-2">Header operations; <code className="inline-code">operation</code> is <code className="inline-code">"set"</code>, <code className="inline-code">"add"</code>, or <code className="inline-code">"remove"</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Snippets */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Snippets
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Cloudflare Snippets are lightweight JavaScript modules that run at
            the edge <em>before</em> Workers -- useful for tiny rewrites,
            A/B bucketing, or header logic that doesn't warrant a full Worker.{" "}
            <code className="inline-code">app.addSnippet()</code> uploads the
            module (named{" "}
            <code className="inline-code">levi_&lt;app&gt;_&lt;name&gt;</code>)
            and manages the snippet rule that routes traffic to it.
          </p>
          <CodeBlock title="levi.app.ts" lang="ts">
            <span className="syn-fn">app.addSnippet</span>
            <span className="syn-punc">(</span>
            <span className="syn-str">"ab-test"</span>
            <span className="syn-punc">,</span>{" "}
            <span className="syn-punc">{"{"}</span>
            {"\n"}
            {"  "}<span className="syn-prop">entrypoint</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">"./src/snippets/ab-test.js"</span>
            <span className="syn-punc">,</span>
            {"\n"}
            {"  "}<span className="syn-prop">expression</span>
            <span className="syn-punc">:</span>{" "}
            <span className="syn-str">{'"http.request.uri.path eq \\"/\\""'}</span>
            <span className="syn-punc">,</span>
            {"\n"}
            <span className="syn-punc">{"}"}</span>
            <span className="syn-punc">)</span>
            <span className="syn-punc">;</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed mt-4">
            Snippets also accept{" "}
            <code className="inline-code">enabled</code> and{" "}
            <code className="inline-code">zone</code> like every other rule
            type. Omit <code className="inline-code">expression</code> to run
            the snippet on all zone traffic.
          </p>
        </section>

        {/* Safety Model */}
        <section id="safety">
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Safety Model
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Zones are shared surfaces: your team may have rules created in the
            dashboard, by other tools, or by other Levi apps. Levi is designed
            to coexist with all of them.
          </p>
          <ul className="list-disc list-inside text-denim-300 space-y-2 mb-4">
            <li>
              <strong className="text-wash-300">Tagged ownership</strong> --
              Every rule Levi creates carries the description tag{" "}
              <code className="inline-code">
                Managed by Levi: &lt;name&gt;
              </code>
              . Provisioning touches only tagged rules, via per-rule API
              calls.
            </li>
            <li>
              <strong className="text-wash-300">Foreign rules untouched</strong>{" "}
              -- Rules created in the dashboard or by other tools are never
              modified, reordered, or deleted. Levi guarantees the relative
              order of its own rules (declaration order in{" "}
              <code className="inline-code">levi.app.ts</code>) without
              touching foreign rule positions.
            </li>
            <li>
              <strong className="text-wash-300">Scoped deletion</strong> --
              Removing a rule from{" "}
              <code className="inline-code">levi.app.ts</code> deletes only
              that tagged rule on the next provision, nothing else.
            </li>
            <li>
              <strong className="text-wash-300">Honest dry-runs</strong> --{" "}
              <code className="inline-code">levi diff</code> is a read-only
              preview of exactly the same plan{" "}
              <code className="inline-code">levi provision</code> executes.
              What you see is what gets applied.
            </li>
          </ul>
        </section>

        {/* CLI Flow */}
        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            CLI Flow
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Edge rules follow the same build / diff / provision cycle as the
            rest of your app:
          </p>
          <CodeBlock title="Terminal" lang="sh">
            <span className="syn-fn">levi</span>{" "}
            <span className="syn-const">build</span>
            {"        "}
            <span className="syn-cmt"># compiles .levi/zones/acme.com.rules.json</span>
            {"\n"}
            <span className="syn-fn">levi</span>{" "}
            <span className="syn-const">diff</span>
            {"         "}
            <span className="syn-cmt"># preview: + create / ~ update / - delete / N unmanaged untouched</span>
            {"\n"}
            <span className="syn-fn">levi</span>{" "}
            <span className="syn-const">provision</span>
            {"    "}
            <span className="syn-cmt"># applies the plan via the Rulesets API</span>
          </CodeBlock>
          <p className="text-denim-300 leading-relaxed mt-4 mb-4">
            Provisioning requires a{" "}
            <code className="inline-code">CLOUDFLARE_API_TOKEN</code> with
            permissions for each rule phase you use:
          </p>
          <ul className="list-disc list-inside text-denim-300 space-y-2 mb-4">
            <li>
              <code className="inline-code">Zone WAF Write</code> -- WAF custom
              rules and rate limiting rules
            </li>
            <li>
              <code className="inline-code">Cache Settings Write</code> --
              cache rules
            </li>
            <li>
              <code className="inline-code">Dynamic URL Redirects Write</code>{" "}
              -- redirects
            </li>
            <li>
              <code className="inline-code">Transform Rules Write</code> --
              header rules
            </li>
            <li>
              <code className="inline-code">Zone Snippets Write</code> --
              snippets
            </li>
          </ul>
          <p className="text-denim-300 leading-relaxed">
            <code className="inline-code">levi diff</code> only needs the read
            counterparts, so you can grant CI a read-only token for pull
            request checks and reserve write access for deploys.
          </p>
          <div className="bg-denim-900/50 border border-denim-700 rounded-md p-4 mt-4">
            <p className="text-denim-300 text-sm">
              <strong className="text-thread-400">Tip:</strong> If your stack
              is Cloudflare-only, Edge Rules can replace the zone-config
              Terraform you were keeping around just for redirects, cache
              rules, and WAF. One{" "}
              <code className="inline-code">levi.app.ts</code>, one{" "}
              <code className="inline-code">levi provision</code>, no separate
              state file to babysit.
            </p>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
