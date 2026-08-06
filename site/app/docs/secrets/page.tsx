import { DocLayout } from "../../../components/DocLayout";
import { Code } from "../../../components/Code";
import Link from "next/link";

export default function SecretsPage() {
  return (
    <DocLayout>
      <div className="space-y-10">
        <header>
          <div className="flex items-center gap-3 mb-4">
            <span className="red-tab-h">config</span>
            <span className="text-xs text-denim-500 font-mono">Network</span>
          </div>
          <h1 className="text-4xl font-bold text-denim-50 stitch-border-b pb-4">
            Secrets &amp; Configuration
          </h1>
          <p className="mt-4 text-denim-300 text-lg leading-relaxed">
            Levi gives you three ways to get configuration into a Worker:
            plain-text vars, per-worker secrets, and the account-level
            Secrets Store. Secret <em>values</em> never touch your app file
            or any generated config — only names are recorded.
          </p>
        </header>

        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Plain-text vars — <code className="inline-code">app.var()</code>
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            For non-sensitive configuration. The value is written into the
            generated <code className="inline-code">wrangler.jsonc</code>{" "}
            <code className="inline-code">vars</code> block and is visible to
            anyone who can read your repo.
          </p>
          <Code>{`const app = new FlareApp("my-app", { compatibility_date: "2026-04-01" });

app.var("LOG_LEVEL", "info");
app.var("PUBLIC_APP_URL", "https://app.example.com");

// Worker runtime: env.LOG_LEVEL, env.PUBLIC_APP_URL`}</Code>
          <p className="text-denim-300 leading-relaxed mb-4">
            Workers can also declare their own vars with the{" "}
            <code className="inline-code">vars</code> option, which override
            app-level vars of the same name.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Worker secrets — <code className="inline-code">app.secret()</code>
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            For sensitive values scoped to your Workers. Calling{" "}
            <code className="inline-code">app.secret(name)</code> registers
            the <em>name</em> in the app graph — Levi never stores, generates,
            or logs the value. You set values out of band with wrangler:
          </p>
          <Code>{`// levi.app.ts — declares that the secret exists
app.secret("STRIPE_SECRET_KEY");
app.secret("JWT_SIGNING_KEY");`}</Code>
          <Code lang="bash">{`# Set the values once, per worker (never committed anywhere)
npx wrangler secret put STRIPE_SECRET_KEY --config .levi/workers/api/wrangler.jsonc
npx wrangler secret put JWT_SIGNING_KEY --config .levi/workers/api/wrangler.jsonc`}</Code>
          <p className="text-denim-300 leading-relaxed mb-4">
            At runtime the secret is available as{" "}
            <code className="inline-code">env.STRIPE_SECRET_KEY</code> like any
            other binding. Per-environment secrets can be listed in{" "}
            <code className="inline-code">environments.&#123;name&#125;.secrets</code>{" "}
            so each environment declares what it needs — see{" "}
            <Link href="/docs/environments" className="text-wash-400 hover:text-wash-300">
              Environments
            </Link>
            .
          </p>
          <div className="bg-denim-900/50 border border-denim-700 rounded-md p-4 mt-4">
            <p className="text-sm text-denim-300">
              <strong className="text-redtab-500">Warning:</strong> never pass
              a secret value through <code className="inline-code">app.var()</code>{" "}
              or hardcode it in <code className="inline-code">levi.app.ts</code>.
              Vars are written to generated configs in plain text.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Secrets Store —{" "}
            <code className="inline-code">app.addSecretsStoreSecret()</code>
          </h2>
          <p className="text-denim-300 leading-relaxed mb-4">
            Account-level secrets shared across Workers — one value, many
            consumers, centrally rotated. The binding exposes a single secret
            read at runtime via{" "}
            <code className="inline-code">await env.BINDING.get()</code>.
          </p>
          <Code>{`const stripeKey = app.addSecretsStoreSecret("stripe-api-key");

const billing = app.addWorker("billing", {
  entrypoint: "./src/billing.ts",
  bindings: { STRIPE_KEY: stripeKey },
});

const invoicer = app.addWorker("invoicer", {
  entrypoint: "./src/invoicer.ts",
  bindings: { STRIPE_KEY: stripeKey },   // same secret, second worker
});

// Worker runtime: const key = await env.STRIPE_KEY.get();`}</Code>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-denim-700 text-left">
                  <th className="py-2 pr-4 text-denim-400 font-medium">Option</th>
                  <th className="py-2 pr-4 text-denim-400 font-medium">Type</th>
                  <th className="py-2 pr-4 text-denim-400 font-medium">Default</th>
                  <th className="py-2 pr-4 text-denim-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-denim-300">
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">secretName</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">resource name</td>
                  <td className="py-2 pr-4">Secret name inside the store</td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">storeId</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4">provisioned</td>
                  <td className="py-2 pr-4">
                    32-hex store ID; patched into configs by{" "}
                    <code className="inline-code">levi provision</code>
                  </td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">storeName</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">string</code></td>
                  <td className="py-2 pr-4"><code className="inline-code">"default"</code></td>
                  <td className="py-2 pr-4">Store created during provisioning</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="text-lg font-medium text-wash-300 mt-6 mb-2">
            Provisioning flow
          </h3>
          <p className="text-denim-300 leading-relaxed mb-4">
            <code className="inline-code">levi provision</code> creates the
            store (or finds the existing one) and writes its ID into every
            generated config that binds a store secret. Values are set once,
            out of band:
          </p>
          <Code lang="bash">{`npx levi provision
# ✔ Secrets Store "default" ready (2e2a8231...)

npx wrangler secrets-store secret create 2e2a8231... \\
  --name stripe-api-key --scopes workers --remote`}</Code>
          <div className="bg-denim-900/50 border border-denim-700 rounded-md p-4 mt-4">
            <p className="text-sm text-denim-300">
              <strong className="text-thread-400">Note:</strong> during the
              Secrets Store beta, Cloudflare allows one store per account.
              Levi warns at provision time if your app declares more than one{" "}
              <code className="inline-code">storeName</code>.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-denim-100 mb-3">
            Which one should I use?
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-denim-700 text-left">
                  <th className="py-2 pr-4 text-denim-400 font-medium">Use</th>
                  <th className="py-2 pr-4 text-denim-400 font-medium">When</th>
                  <th className="py-2 pr-4 text-denim-400 font-medium">Runtime access</th>
                </tr>
              </thead>
              <tbody className="text-denim-300">
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">app.var()</code></td>
                  <td className="py-2 pr-4">Non-sensitive config, safe in git</td>
                  <td className="py-2 pr-4"><code className="inline-code">env.NAME</code></td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">app.secret()</code></td>
                  <td className="py-2 pr-4">Sensitive, one worker (or a few), simplest setup</td>
                  <td className="py-2 pr-4"><code className="inline-code">env.NAME</code></td>
                </tr>
                <tr className="border-b border-denim-800">
                  <td className="py-2 pr-4"><code className="inline-code">addSecretsStoreSecret()</code></td>
                  <td className="py-2 pr-4">Shared across many workers, central rotation</td>
                  <td className="py-2 pr-4"><code className="inline-code">await env.NAME.get()</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
