import Link from "next/link";
import { DocLayout } from "../../../components/DocLayout";
import { CodeBlock } from "../../../components/CodeBlock";

export default function EnvironmentsPage() {
  return (
    <DocLayout>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-denim-50">Environments</h1>
          <span className="red-tab-h">Network</span>
        </div>
        <p className="text-denim-200 text-lg leading-relaxed max-w-2xl">
          Deploy your application to multiple environments — staging, production,
          preview — each with isolated configuration, secrets, and resource
          instances. Levi makes environment management a first-class concern in
          your app definition.
        </p>
      </div>

      <div className="stitch-separator mb-10" />

      {/* Overview */}
      <h2>Overview</h2>
      <p>
        Real-world applications need more than one deployment target. You need a
        staging environment for testing, a production environment for live
        traffic, and possibly preview environments for pull requests. Each
        environment typically has different API keys, database instances, feature
        flags, and domain names.
      </p>
      <p>
        Levi supports this through the{" "}
        <span className="inline-code">environments</span> configuration in the{" "}
        <span className="inline-code">FlareApp</span> constructor. Each
        environment gets its own set of variables, secrets, and can override
        resource configuration. When you deploy, Levi provisions the correct
        resources for the target environment.
      </p>
      <ul>
        <li>
          <strong>Isolated resources</strong> — Each environment gets its own D1
          databases, KV namespaces, R2 buckets, etc. No shared state between
          staging and production.
        </li>
        <li>
          <strong>Per-environment secrets</strong> — API keys, tokens, and
          credentials are scoped to the environment. Staging never sees
          production secrets.
        </li>
        <li>
          <strong>Same codebase</strong> — Your worker code is identical across
          environments. Only configuration changes.
        </li>
        <li>
          <strong>CLI-driven</strong> — Deploy to any environment with a single{" "}
          <span className="inline-code">--env</span> flag.
        </li>
      </ul>

      <div className="stitch-separator my-8" />

      {/* Configuration */}
      <h2>Configuration</h2>
      <p>
        Define environments in the{" "}
        <span className="inline-code">FlareApp</span> constructor using the{" "}
        <span className="inline-code">environments</span> map. Each key is the
        environment name, and the value is the environment-specific
        configuration.
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
        <span className="syn-str">"my-app"</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">environments</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"    "}
        <span className="syn-prop">staging</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"      "}
        <span className="syn-prop">vars</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"        "}
        <span className="syn-prop">LOG_LEVEL</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"debug"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"        "}
        <span className="syn-prop">API_URL</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"https://staging-api.example.com"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"      "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"    "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"    "}
        <span className="syn-prop">production</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"      "}
        <span className="syn-prop">vars</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"        "}
        <span className="syn-prop">LOG_LEVEL</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"warn"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"        "}
        <span className="syn-prop">API_URL</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"https://api.example.com"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"      "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"    "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
      </CodeBlock>

      <div className="stitch-separator my-8" />

      {/* Per-Environment Vars */}
      <h2>Per-Environment Variables & Secrets</h2>
      <p>
        Each environment can define its own{" "}
        <span className="inline-code">vars</span> (plain text environment
        variables) and <span className="inline-code">secrets</span> (encrypted
        values that are never logged or exposed). Environment-specific values
        are passed to workers when deploying to that environment.
      </p>

      <CodeBlock title="levi.app.ts" lang="typescript">
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
        {"  "}
        <span className="syn-prop">environments</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"    "}
        <span className="syn-prop">staging</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"      "}
        <span className="syn-prop">vars</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"        "}
        <span className="syn-prop">LOG_LEVEL</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"debug"</span>
        <span className="syn-punc">,</span>
        {"  "}
        <span className="syn-cmt">{"// overrides default"}</span>
        {"\n"}
        {"      "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"      "}
        <span className="syn-prop">secrets</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">[</span>
        <span className="syn-str">"STRIPE_KEY"</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-str">"DB_PASSWORD"</span>
        <span className="syn-punc">]</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"    "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"    "}
        <span className="syn-prop">production</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"      "}
        <span className="syn-prop">vars</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"        "}
        <span className="syn-prop">LOG_LEVEL</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"warn"</span>
        <span className="syn-punc">,</span>
        {"  "}
        <span className="syn-cmt">{"// overrides default"}</span>
        {"\n"}
        {"      "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"      "}
        <span className="syn-prop">secrets</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">[</span>
        <span className="syn-str">"STRIPE_KEY"</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-str">"DB_PASSWORD"</span>
        <span className="syn-punc">]</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"    "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
      </CodeBlock>

      <p>
        Secrets are declared by name in the app definition but their values are
        set via the CLI. This ensures secret values never appear in your source
        code:
      </p>

      <CodeBlock title="Terminal" lang="bash">
        <span className="syn-cmt">{"# Set secrets for staging"}</span>
        {"\n"}
        <span className="syn-fn">levi</span>{" "}
        <span className="syn-const">secret set</span>{" "}
        <span className="syn-const">STRIPE_KEY</span>{" "}
        <span className="syn-str">--env staging</span>
        {"\n\n"}
        <span className="syn-cmt">{"# Set secrets for production"}</span>
        {"\n"}
        <span className="syn-fn">levi</span>{" "}
        <span className="syn-const">secret set</span>{" "}
        <span className="syn-const">STRIPE_KEY</span>{" "}
        <span className="syn-str">--env production</span>
      </CodeBlock>

      <div className="stitch-separator my-8" />

      {/* Deploying to Environments */}
      <h2>Deploying to Environments</h2>
      <p>
        Use the <span className="inline-code">--env</span> flag with any Levi
        CLI command to target a specific environment. Levi will provision
        resources with environment-specific names and apply the correct
        configuration.
      </p>

      <CodeBlock title="Terminal" lang="bash">
        <span className="syn-cmt">{"# Deploy to staging"}</span>
        {"\n"}
        <span className="syn-fn">levi</span>{" "}
        <span className="syn-const">deploy</span>{" "}
        <span className="syn-str">--env staging</span>
        {"\n\n"}
        <span className="syn-cmt">{"# Deploy to production"}</span>
        {"\n"}
        <span className="syn-fn">levi</span>{" "}
        <span className="syn-const">deploy</span>{" "}
        <span className="syn-str">--env production</span>
        {"\n\n"}
        <span className="syn-cmt">{"# Build for staging (without deploying)"}</span>
        {"\n"}
        <span className="syn-fn">levi</span>{" "}
        <span className="syn-const">build</span>{" "}
        <span className="syn-str">--env staging</span>
        {"\n\n"}
        <span className="syn-cmt">{"# View the app graph for production"}</span>
        {"\n"}
        <span className="syn-fn">levi</span>{" "}
        <span className="syn-const">graph</span>{" "}
        <span className="syn-str">--env production</span>
      </CodeBlock>

      <p>
        When deploying to an environment, Levi appends the environment name to
        resource identifiers. For example, a D1 database named{" "}
        <span className="inline-code">"main"</span> in the{" "}
        <span className="inline-code">staging</span> environment becomes{" "}
        <span className="inline-code">"my-app-main-staging"</span> on
        Cloudflare. This ensures complete isolation between environments.
      </p>

      <div className="denim-pocket p-5 mb-6">
        <p className="text-sm text-denim-300" style={{ marginBottom: 0 }}>
          <strong>Default environment:</strong> If you don't specify{" "}
          <span className="inline-code">--env</span>, Levi deploys using the
          top-level configuration (no environment suffix). This is useful for
          single-environment projects or when you want to set up environments
          later.
        </p>
      </div>

      <div className="stitch-separator my-8" />

      {/* Environment Detection */}
      <h2>Environment Detection</h2>
      <p>
        Your worker code can detect which environment it's running in using the{" "}
        <span className="inline-code">LEVI_ENV</span> environment variable,
        which Levi automatically injects during deployment.
      </p>

      <CodeBlock title="src/worker.ts" lang="typescript">
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
        <span className="syn-const">currentEnv</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-const">env</span>
        <span className="syn-punc">.</span>
        <span className="syn-const">LEVI_ENV</span>
        <span className="syn-punc">;</span>{" "}
        <span className="syn-cmt">{"// \"staging\" | \"production\""}</span>
        {"\n\n"}
        {"    "}
        <span className="syn-kw">if</span>{" "}
        <span className="syn-punc">(</span>
        <span className="syn-const">currentEnv</span>{" "}
        <span className="syn-op">===</span>{" "}
        <span className="syn-str">"staging"</span>
        <span className="syn-punc">)</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"      "}
        <span className="syn-const">console</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">log</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"Running in staging mode"</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n"}
        {"    "}
        <span className="syn-punc">{"}"}</span>
        {"\n\n"}
        {"    "}
        <span className="syn-cmt">
          {"// Use env vars that differ per environment"}
        </span>
        {"\n"}
        {"    "}
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">apiUrl</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-const">env</span>
        <span className="syn-punc">.</span>
        <span className="syn-const">API_URL</span>
        <span className="syn-punc">;</span>
        {"\n"}
        {"    "}
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">logLevel</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-const">env</span>
        <span className="syn-punc">.</span>
        <span className="syn-const">LOG_LEVEL</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        {"    "}
        <span className="syn-kw">return new</span>{" "}
        <span className="syn-type">Response</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">{"`Running in ${currentEnv}`"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n"}
        {"  "}
        <span className="syn-punc">{"}"}</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">;</span>
      </CodeBlock>

      <p>
        Additionally, the <span className="inline-code">app.env</span> getter in
        your app definition returns the current target environment during build
        time, which is useful for conditional resource configuration:
      </p>

      <CodeBlock title="levi.app.ts" lang="typescript">
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">app</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-kw">new</span>{" "}
        <span className="syn-type">FlareApp</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"my-app"</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-punc">{"{"}</span>{" "}
        <span className="syn-cmt">{"/* ... */"}</span>{" "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-cmt">
          {"// Only add expensive resources in production"}
        </span>
        {"\n"}
        <span className="syn-kw">if</span>{" "}
        <span className="syn-punc">(</span>
        <span className="syn-const">app</span>
        <span className="syn-punc">.</span>
        <span className="syn-const">env</span>{" "}
        <span className="syn-op">===</span>{" "}
        <span className="syn-str">"production"</span>
        <span className="syn-punc">)</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"  "}
        <span className="syn-const">app</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">addAIGateway</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"gateway"</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"    "}
        <span className="syn-prop">id</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"prod-gateway"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"    "}
        <span className="syn-prop">logCollection</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-const">true</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
      </CodeBlock>

      <div className="stitch-separator my-8" />

      {/* Full Example */}
      <h2>Full Example</h2>
      <p>
        Here is a complete application with staging and production environments,
        each with different variables, secrets, and domain configuration:
      </p>

      <CodeBlock title="levi.app.ts — Multi-environment App" lang="typescript">
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
        <span className="syn-str">"saas-app"</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">vars</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"    "}
        <span className="syn-prop">APP_NAME</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"SaaSApp"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n\n"}
        {"  "}
        <span className="syn-prop">environments</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"    "}
        <span className="syn-prop">staging</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"      "}
        <span className="syn-prop">vars</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"        "}
        <span className="syn-prop">LOG_LEVEL</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"debug"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"        "}
        <span className="syn-prop">FEATURE_FLAGS</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"experimental,beta"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"      "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"      "}
        <span className="syn-prop">secrets</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">[</span>
        <span className="syn-str">"STRIPE_KEY"</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-str">"SENDGRID_KEY"</span>
        <span className="syn-punc">]</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"    "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"    "}
        <span className="syn-prop">production</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"      "}
        <span className="syn-prop">vars</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"        "}
        <span className="syn-prop">LOG_LEVEL</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"warn"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"        "}
        <span className="syn-prop">FEATURE_FLAGS</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"stable"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"      "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"      "}
        <span className="syn-prop">secrets</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">[</span>
        <span className="syn-str">"STRIPE_KEY"</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-str">"SENDGRID_KEY"</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-str">"DATADOG_KEY"</span>
        <span className="syn-punc">]</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"    "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">,</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-cmt">{"// Resources"}</span>
        {"\n"}
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">db</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-const">app</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">addD1</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"main"</span>
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
        <span className="syn-const">kv</span>{" "}
        <span className="syn-op">=</span>{" "}
        <span className="syn-const">app</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">addKV</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"cache"</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n\n"}
        <span className="syn-cmt">
          {"// Domain only in production"}
        </span>
        {"\n"}
        <span className="syn-kw">if</span>{" "}
        <span className="syn-punc">(</span>
        <span className="syn-const">app</span>
        <span className="syn-punc">.</span>
        <span className="syn-const">env</span>{" "}
        <span className="syn-op">===</span>{" "}
        <span className="syn-str">"production"</span>
        <span className="syn-punc">)</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"  "}
        <span className="syn-const">app</span>
        <span className="syn-punc">.</span>
        <span className="syn-fn">addDomain</span>
        <span className="syn-punc">(</span>
        <span className="syn-str">"saasapp.com"</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-punc">{"{"}</span>
        {"\n"}
        {"    "}
        <span className="syn-prop">ssl</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"full_strict"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"    "}
        <span className="syn-prop">redirectWww</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-const">true</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-punc">{"}"}</span>
        <span className="syn-punc">)</span>
        <span className="syn-punc">;</span>
        {"\n"}
        <span className="syn-punc">{"}"}</span>
        {"\n\n"}
        <span className="syn-cmt">{"// Worker"}</span>
        {"\n"}
        <span className="syn-kw">const</span>{" "}
        <span className="syn-const">worker</span>{" "}
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
        <span className="syn-prop">entrypoint</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-str">"./src/api.ts"</span>
        <span className="syn-punc">,</span>
        {"\n"}
        {"  "}
        <span className="syn-prop">bindings</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-punc">{"{"}</span>{" "}
        <span className="syn-prop">DB</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-const">db</span>
        <span className="syn-punc">,</span>{" "}
        <span className="syn-prop">KV</span>
        <span className="syn-punc">:</span>{" "}
        <span className="syn-const">kv</span>{" "}
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

      <h3>Deploying Both Environments</h3>

      <CodeBlock title="Terminal" lang="bash">
        <span className="syn-cmt">{"# Deploy staging first, test, then production"}</span>
        {"\n"}
        <span className="syn-fn">levi</span>{" "}
        <span className="syn-const">deploy</span>{" "}
        <span className="syn-str">--env staging</span>
        {"\n\n"}
        <span className="syn-cmt">{"# Run tests against staging..."}</span>
        {"\n"}
        <span className="syn-fn">curl</span>{" "}
        <span className="syn-str">https://saas-app-api-staging.workers.dev/health</span>
        {"\n\n"}
        <span className="syn-cmt">{"# All good — promote to production"}</span>
        {"\n"}
        <span className="syn-fn">levi</span>{" "}
        <span className="syn-const">deploy</span>{" "}
        <span className="syn-str">--env production</span>
      </CodeBlock>

      <div className="stitch-separator my-8" />

      {/* Next Steps */}
      <div className="denim-pocket p-5">
        <h2
          className="text-sm font-bold text-denim-300 uppercase tracking-widest mb-3"
          style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}
        >
          Next Steps
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/docs/domains"
            className="px-4 py-2 text-sm bg-wash-600/20 border border-dashed border-wash-500 rounded-md text-wash-300 hover:bg-wash-600/30 transition-colors"
          >
            Domains & SSL
          </Link>
          <Link
            href="/docs/cli"
            className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
          >
            CLI Reference
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
