import { describe, it, expect } from "vitest";
import { FlareApp } from "../src/app.js";
import { WranglerGenerator, deriveRateLimitNamespaceId } from "../src/generators/wrangler.js";
import { WorkerResource } from "../src/resources/worker.js";
import { AnalyticsEngineResource } from "../src/resources/analytics-engine.js";
import { BrowserRenderingResource } from "../src/resources/browser-rendering.js";
import { RateLimitResource } from "../src/resources/rate-limit.js";
import { SecretsStoreSecretResource } from "../src/resources/secrets-store-secret.js";
import { DispatchNamespaceResource } from "../src/resources/dispatch-namespace.js";
import { EmailResource } from "../src/resources/email.js";

function makeApp() {
  return new FlareApp("test-app", { compatibility_date: "2026-04-01" });
}

function generate(app: FlareApp, worker: WorkerResource) {
  return new WranglerGenerator(app).generateForWorker(worker);
}

// ---------------------------------------------------------------------------
// Analytics Engine
// ---------------------------------------------------------------------------

describe("WranglerGenerator — Analytics Engine binding", () => {
  it("emits analytics_engine_datasets with explicit dataset", () => {
    const app = makeApp();
    const ae = app.addAnalyticsEngine("usage-events", { dataset: "usage_events" });
    const w = app.addWorker("api", { entrypoint: "./src/index.ts", bindings: { METRICS: ae } });
    const cfg = generate(app, w);
    expect(cfg.analytics_engine_datasets![0]).toEqual({
      binding: "METRICS",
      dataset: "usage_events",
    });
  });

  it("defaults dataset to the resource name", () => {
    const app = makeApp();
    const ae = app.addAnalyticsEngine("usage-events");
    const w = app.addWorker("api", { entrypoint: "./src/index.ts", bindings: { METRICS: ae } });
    const cfg = generate(app, w);
    expect(cfg.analytics_engine_datasets![0].dataset).toBe("usage-events");
  });

  it("wires the analyticsEngineDatasets worker shorthand", () => {
    const app = makeApp();
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      analyticsEngineDatasets: { EVENTS: "my-dataset" },
    });
    const cfg = generate(app, w);
    expect(cfg.analytics_engine_datasets![0]).toEqual({
      binding: "EVENTS",
      dataset: "my-dataset",
    });
  });

  it("bindings-map resource wins over shorthand on key collision", () => {
    const app = makeApp();
    const ae = app.addAnalyticsEngine("real-dataset");
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { EVENTS: ae },
      analyticsEngineDatasets: { EVENTS: "shorthand-dataset" },
    });
    const cfg = generate(app, w);
    expect(cfg.analytics_engine_datasets).toHaveLength(1);
    expect(cfg.analytics_engine_datasets![0].dataset).toBe("real-dataset");
  });

  it("has the analytics-engine resource type", () => {
    const ae = new AnalyticsEngineResource("x", {});
    expect(ae.type).toBe("analytics-engine");
  });
});

// ---------------------------------------------------------------------------
// Browser Rendering
// ---------------------------------------------------------------------------

describe("WranglerGenerator — Browser Rendering binding", () => {
  it("emits the singleton browser field", () => {
    const app = makeApp();
    const br = app.addBrowserRendering();
    const w = app.addWorker("scraper", { entrypoint: "./src/index.ts", bindings: { BROWSER: br } });
    const cfg = generate(app, w);
    expect(cfg.browser).toEqual({ binding: "BROWSER" });
  });

  it("wires the browser: true worker shorthand", () => {
    const app = makeApp();
    const w = app.addWorker("scraper", { entrypoint: "./src/index.ts", browser: true });
    const cfg = generate(app, w);
    expect(cfg.browser).toEqual({ binding: "BROWSER" });
  });

  it("bindings-map resource wins over the boolean shorthand", () => {
    const app = makeApp();
    const br = app.addBrowserRendering();
    const w = app.addWorker("scraper", {
      entrypoint: "./src/index.ts",
      bindings: { HEADLESS: br },
      browser: true,
    });
    const cfg = generate(app, w);
    expect(cfg.browser).toEqual({ binding: "HEADLESS" });
  });

  it("has the browser-rendering resource type", () => {
    const br = new BrowserRenderingResource("x", {});
    expect(br.type).toBe("browser-rendering");
  });
});

// ---------------------------------------------------------------------------
// Rate Limiting
// ---------------------------------------------------------------------------

describe("WranglerGenerator — Rate Limiting binding", () => {
  it("emits ratelimits with name (not binding) and simple config", () => {
    const app = makeApp();
    const rl = app.addRateLimit("api-limiter", { limit: 100, period: 60, namespaceId: "1001" });
    const w = app.addWorker("api", { entrypoint: "./src/index.ts", bindings: { LIMITER: rl } });
    const cfg = generate(app, w);
    expect(cfg.ratelimits![0]).toEqual({
      name: "LIMITER",
      namespace_id: "1001",
      simple: { limit: 100, period: 60 },
    });
  });

  it("derives a stable namespace_id from the resource name", () => {
    const app = makeApp();
    const rl = app.addRateLimit("api-limiter", { limit: 10, period: 10 });
    const w = app.addWorker("api", { entrypoint: "./src/index.ts", bindings: { L: rl } });
    const cfg = generate(app, w);
    const id = cfg.ratelimits![0].namespace_id;
    expect(id).toMatch(/^\d+$/);
    expect(id).toBe(deriveRateLimitNamespaceId("api-limiter"));
    // Deterministic across calls
    expect(deriveRateLimitNamespaceId("api-limiter")).toBe(id);
  });

  it("throws on invalid period", () => {
    expect(() => new RateLimitResource("x", { limit: 5, period: 30 as unknown as 10 })).toThrow(
      /period must be 10 or 60/,
    );
  });

  it("throws on non-numeric namespaceId", () => {
    expect(
      () => new RateLimitResource("x", { limit: 5, period: 10, namespaceId: "abc" }),
    ).toThrow(/digits/);
  });

  it("shared namespaceId across workers is allowed", () => {
    const app = makeApp();
    const rl = app.addRateLimit("shared", { limit: 5, period: 10, namespaceId: "42" });
    const w1 = app.addWorker("a", { entrypoint: "./a.ts", bindings: { L: rl } });
    const w2 = app.addWorker("b", { entrypoint: "./b.ts", bindings: { L: rl } });
    expect(generate(app, w1).ratelimits![0].namespace_id).toBe("42");
    expect(generate(app, w2).ratelimits![0].namespace_id).toBe("42");
  });
});

// ---------------------------------------------------------------------------
// Secrets Store
// ---------------------------------------------------------------------------

describe("WranglerGenerator — Secrets Store binding", () => {
  it("emits secrets_store_secrets with store_id and secret_name", () => {
    const app = makeApp();
    const s = app.addSecretsStoreSecret("stripe-key", { storeId: "a".repeat(32) });
    const w = app.addWorker("api", { entrypoint: "./src/index.ts", bindings: { STRIPE: s } });
    const cfg = generate(app, w);
    expect(cfg.secrets_store_secrets![0]).toEqual({
      binding: "STRIPE",
      store_id: "a".repeat(32),
      secret_name: "stripe-key",
    });
  });

  it("secretName option overrides the resource name", () => {
    const app = makeApp();
    const s = app.addSecretsStoreSecret("stripe-key", { secretName: "STRIPE_API_KEY" });
    const w = app.addWorker("api", { entrypoint: "./src/index.ts", bindings: { K: s } });
    const cfg = generate(app, w);
    expect(cfg.secrets_store_secrets![0].secret_name).toBe("STRIPE_API_KEY");
  });

  it("has the secrets-store-secret resource type", () => {
    const s = new SecretsStoreSecretResource("x", {});
    expect(s.type).toBe("secrets-store-secret");
  });
});

// ---------------------------------------------------------------------------
// Dispatch Namespaces (Workers for Platforms)
// ---------------------------------------------------------------------------

describe("WranglerGenerator — Dispatch Namespace binding", () => {
  it("emits dispatch_namespaces with the namespace name", () => {
    const app = makeApp();
    const ns = app.addDispatchNamespace("customers-prod");
    const w = app.addWorker("router", { entrypoint: "./src/router.ts", bindings: { DISPATCH: ns } });
    const cfg = generate(app, w);
    expect(cfg.dispatch_namespaces![0]).toEqual({
      binding: "DISPATCH",
      namespace: "customers-prod",
    });
  });

  it("namespace option overrides the resource name", () => {
    const app = makeApp();
    const ns = app.addDispatchNamespace("tenants", { namespace: "customers-prod" });
    expect(ns.namespaceName).toBe("customers-prod");
  });

  it("emits outbound worker config and adds a dependency edge", () => {
    const app = makeApp();
    const guard = app.addWorker("outbound-guard", { entrypoint: "./src/guard.ts" });
    const ns = app.addDispatchNamespace("tenants", {
      outbound: { service: guard, parameters: ["customer_id"] },
      remote: true,
    });
    const w = app.addWorker("router", { entrypoint: "./src/router.ts", bindings: { D: ns } });
    const cfg = generate(app, w);
    expect(cfg.dispatch_namespaces![0].outbound).toEqual({
      service: "outbound-guard",
      parameters: ["customer_id"],
    });
    expect(cfg.dispatch_namespaces![0].remote).toBe(true);
    // Dependency edge: namespace depends on the outbound worker
    expect([...ns.dependencies].map((d) => d.name)).toContain("outbound-guard");
  });

  it("accepts a raw service name for outbound without adding an edge", () => {
    const app = makeApp();
    const ns = app.addDispatchNamespace("tenants", { outbound: { service: "external-guard" } });
    const w = app.addWorker("router", { entrypoint: "./src/router.ts", bindings: { D: ns } });
    const cfg = generate(app, w);
    expect(cfg.dispatch_namespaces![0].outbound!.service).toBe("external-guard");
    expect(ns.dependencies.size).toBe(0);
  });

  it("has the dispatch-namespace resource type", () => {
    const ns = new DispatchNamespaceResource("x");
    expect(ns.type).toBe("dispatch-namespace");
  });
});

// ---------------------------------------------------------------------------
// Email (send_email)
// ---------------------------------------------------------------------------

describe("WranglerGenerator — Email binding", () => {
  it("emits send_email with name (not binding)", () => {
    const app = makeApp();
    const email = app.addEmail("ops-notify", { destinationAddress: "ops@acme.com" });
    const w = app.addWorker("api", { entrypoint: "./src/index.ts", bindings: { NOTIFY: email } });
    const cfg = generate(app, w);
    expect(cfg.send_email![0]).toEqual({
      name: "NOTIFY",
      destination_address: "ops@acme.com",
    });
  });

  it("emits allowlist and sender restrictions", () => {
    const app = makeApp();
    const email = app.addEmail("notify", {
      allowedDestinationAddresses: ["a@x.com", "b@x.com"],
      allowedSenderAddresses: ["noreply@x.com"],
      remote: true,
    });
    const w = app.addWorker("api", { entrypoint: "./src/index.ts", bindings: { M: email } });
    const cfg = generate(app, w);
    expect(cfg.send_email![0]).toEqual({
      name: "M",
      allowed_destination_addresses: ["a@x.com", "b@x.com"],
      allowed_sender_addresses: ["noreply@x.com"],
      remote: true,
    });
  });

  it("throws when both restriction modes are set", () => {
    expect(
      () =>
        new EmailResource("x", {
          destinationAddress: "a@x.com",
          allowedDestinationAddresses: ["b@x.com"],
        }),
    ).toThrow(/mutually exclusive/);
  });

  it("unrestricted binding emits only the name", () => {
    const app = makeApp();
    const email = app.addEmail("any");
    const w = app.addWorker("api", { entrypoint: "./src/index.ts", bindings: { M: email } });
    const cfg = generate(app, w);
    expect(cfg.send_email![0]).toEqual({ name: "M" });
  });
});

// ---------------------------------------------------------------------------
// Tail consumers
// ---------------------------------------------------------------------------

describe("WranglerGenerator — tail consumers", () => {
  it("emits tail_consumers from string names", () => {
    const app = makeApp();
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      tailConsumers: ["log-sink"],
    });
    const cfg = generate(app, w);
    expect(cfg.tail_consumers).toEqual([{ service: "log-sink" }]);
  });

  it("emits tail_consumers from TailWorkerResource refs and adds a dependency", () => {
    const app = makeApp();
    const tw = app.addTailWorker("log-sink", { entrypoint: "./src/sink.ts" });
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      tailConsumers: [tw],
    });
    const cfg = generate(app, w);
    expect(cfg.tail_consumers).toEqual([{ service: "log-sink" }]);
    expect([...w.dependencies].map((d) => d.name)).toContain("log-sink");
  });

  it("auto-wires a TailWorkerResource passed in the bindings map (deduped)", () => {
    const app = makeApp();
    const tw = app.addTailWorker("log-sink", { entrypoint: "./src/sink.ts" });
    const w = app.addWorker("api", {
      entrypoint: "./src/index.ts",
      bindings: { SINK: tw },
      tailConsumers: [tw],
    });
    const cfg = generate(app, w);
    expect(cfg.tail_consumers).toEqual([{ service: "log-sink" }]);
  });

  it("generateAll produces a config for tail workers", () => {
    const app = makeApp();
    app.addTailWorker("log-sink", { entrypoint: "./src/sink.ts" });
    app.addWorker("api", { entrypoint: "./src/index.ts" });
    const configs = new WranglerGenerator(app).generateAll();
    expect(configs.has("log-sink")).toBe(true);
    expect(configs.get("log-sink")!.main).toContain("src/sink.ts");
  });
});
