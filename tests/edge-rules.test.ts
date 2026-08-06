import { describe, it, expect } from "vitest";
import { FlareApp } from "../src/app.js";
import {
  buildRedirectRule,
  buildCacheRule,
  buildWAFRule,
  buildRateLimitRule,
  buildHeaderRule,
  compileMatchSugar,
  generateZoneManifests,
  resolveZone,
  snippetName,
  leviTag,
} from "../src/generators/edge-rules.js";

function makeApp(opts?: Record<string, unknown>) {
  return new FlareApp("test-app", { compatibility_date: "2026-04-01", ...opts });
}

// ---------------------------------------------------------------------------
// Match sugar
// ---------------------------------------------------------------------------

describe("edge rules — match sugar", () => {
  it("compiles individual fields", () => {
    expect(compileMatchSugar({ host: "api.x.com" })).toBe('http.host eq "api.x.com"');
    expect(compileMatchSugar({ path: "/login" })).toBe('http.request.uri.path eq "/login"');
    expect(compileMatchSugar({ pathStartsWith: "/assets/" })).toBe(
      'starts_with(http.request.uri.path, "/assets/")',
    );
    expect(compileMatchSugar({ pathWildcard: "/api/*" })).toBe(
      'http.request.uri.path wildcard "/api/*"',
    );
  });

  it("AND-combines multiple fields", () => {
    expect(compileMatchSugar({ host: "x.com", pathStartsWith: "/a/" })).toBe(
      'http.host eq "x.com" and starts_with(http.request.uri.path, "/a/")',
    );
  });
});

// ---------------------------------------------------------------------------
// Redirect rules
// ---------------------------------------------------------------------------

describe("edge rules — redirect builder", () => {
  it("compiles a wildcard redirect with captures to wildcard_replace", () => {
    const rule = buildRedirectRule("www-to-apex", {
      from: "https://www.x.com/*",
      to: "https://x.com/${1}",
      status: 301,
    });
    expect(rule.expression).toBe('http.request.full_uri wildcard "https://www.x.com/*"');
    expect(rule.action).toBe("redirect");
    expect(rule.action_parameters).toEqual({
      from_value: {
        status_code: 301,
        target_url: {
          expression:
            'wildcard_replace(http.request.full_uri, "https://www.x.com/*", "https://x.com/${1}")',
        },
        preserve_query_string: true,
      },
    });
    expect(rule.description).toBe(leviTag("www-to-apex"));
  });

  it("compiles an exact path redirect to a static target", () => {
    const rule = buildRedirectRule("old-page", { from: "/old", to: "/new", status: 302 });
    expect(rule.expression).toBe('http.request.uri.path eq "/old"');
    const params = rule.action_parameters as { from_value: { target_url: unknown; status_code: number } };
    expect(params.from_value.target_url).toEqual({ value: "/new" });
    expect(params.from_value.status_code).toBe(302);
  });

  it("defaults status to 301 and preserve_query_string to true", () => {
    const rule = buildRedirectRule("r", { from: "/a", to: "/b" });
    const params = rule.action_parameters as { from_value: { status_code: number; preserve_query_string: boolean } };
    expect(params.from_value.status_code).toBe(301);
    expect(params.from_value.preserve_query_string).toBe(true);
  });

  it("throws without from or expression", () => {
    expect(() => buildRedirectRule("r", { to: "/b" })).toThrow(/from.*expression/);
  });

  it("throws when captures are used without a from pattern", () => {
    expect(() =>
      buildRedirectRule("r", { expression: "true", to: "/x/${1}" }),
    ).toThrow(/captures/);
  });
});

// ---------------------------------------------------------------------------
// Cache rules
// ---------------------------------------------------------------------------

describe("edge rules — cache builder", () => {
  it("compiles TTL shorthands to override_origin", () => {
    const rule = buildCacheRule("assets", {
      match: { pathStartsWith: "/assets/" },
      cache: true,
      edgeTtl: 86400,
      browserTtl: 3600,
    });
    expect(rule.action).toBe("set_cache_settings");
    expect(rule.action_parameters).toEqual({
      cache: true,
      edge_ttl: { mode: "override_origin", default: 86400 },
      browser_ttl: { mode: "override_origin", default: 3600 },
    });
  });

  it("compiles bypass and cache key config", () => {
    const rule = buildCacheRule("api-no-cache", {
      expression: 'starts_with(http.request.uri.path, "/api/")',
      cache: false,
      cacheKey: { queryString: "none", headers: ["X-Tenant"] },
    });
    expect(rule.action_parameters).toEqual({
      cache: false,
      cache_key: {
        custom_key: {
          query_string: { exclude: { all: true } },
          header: { include: ["X-Tenant"] },
        },
      },
    });
  });

  it("throws without match or expression", () => {
    expect(() => buildCacheRule("c", { cache: true })).toThrow(/match.*expression/);
  });
});

// ---------------------------------------------------------------------------
// WAF rules
// ---------------------------------------------------------------------------

describe("edge rules — WAF builder", () => {
  it("compiles a block rule with no action parameters", () => {
    const rule = buildWAFRule("block-bots", {
      expression: "cf.client.bot",
      action: "managed_challenge",
    });
    expect(rule.action).toBe("managed_challenge");
    expect(rule.action_parameters).toBeUndefined();
  });

  it("compiles skip rules with defaults and explicit products", () => {
    const def = buildWAFRule("skip-all", { expression: "true", action: "skip" });
    expect(def.action_parameters).toEqual({ ruleset: "current" });

    const explicit = buildWAFRule("skip-waf", {
      expression: "true",
      action: "skip",
      skip: { products: ["waf"] },
    });
    expect(explicit.action_parameters).toEqual({ products: ["waf"] });
  });
});

// ---------------------------------------------------------------------------
// Rate limit rules
// ---------------------------------------------------------------------------

describe("edge rules — rate limit builder", () => {
  it("compiles the ratelimit sibling object with defaults", () => {
    const rule = buildRateLimitRule("login-limit", {
      expression: 'http.request.uri.path eq "/login"',
      requestsPerPeriod: 10,
      period: 60,
    });
    expect(rule.action).toBe("block");
    expect(rule.ratelimit).toEqual({
      characteristics: ["cf.colo.id", "ip.src"],
      period: 60,
      requests_per_period: 10,
      mitigation_timeout: 60,
    });
  });

  it("honors explicit characteristics, action, and counting expression", () => {
    const rule = buildRateLimitRule("l", {
      expression: "true",
      requestsPerPeriod: 100,
      period: 10,
      mitigationTimeout: 600,
      characteristics: ["cf.colo.id", "http.request.headers[\"x-api-key\"]"],
      action: "managed_challenge",
      countingExpression: "http.response.code eq 401",
    });
    expect(rule.action).toBe("managed_challenge");
    expect(rule.ratelimit).toMatchObject({
      mitigation_timeout: 600,
      counting_expression: "http.response.code eq 401",
    });
  });
});

// ---------------------------------------------------------------------------
// Header rules
// ---------------------------------------------------------------------------

describe("edge rules — header builder", () => {
  it("compiles string shorthand to a set operation", () => {
    const rule = buildHeaderRule("security-headers", {
      direction: "response",
      headers: { "X-Frame-Options": "DENY" },
    });
    expect(rule.action).toBe("rewrite");
    expect(rule.expression).toBe("true");
    expect(rule.action_parameters).toEqual({
      headers: { "X-Frame-Options": { operation: "set", value: "DENY" } },
    });
  });

  it("compiles remove and expression operations", () => {
    const rule = buildHeaderRule("h", {
      direction: "request",
      match: { pathStartsWith: "/api/" },
      headers: {
        "X-Powered-By": { operation: "remove" },
        "X-Request-Country": { operation: "set", expression: "ip.src.country" },
      },
    });
    expect(rule.expression).toBe('starts_with(http.request.uri.path, "/api/")');
    expect(rule.action_parameters).toEqual({
      headers: {
        "X-Powered-By": { operation: "remove" },
        "X-Request-Country": { operation: "set", expression: "ip.src.country" },
      },
    });
  });
});

// ---------------------------------------------------------------------------
// Zone resolution & manifests
// ---------------------------------------------------------------------------

describe("edge rules — zone resolution", () => {
  it("explicit zone wins", () => {
    const app = makeApp({ defaultZone: "default.com" });
    expect(resolveZone(app, { zone: "explicit.com" }, "r")).toBe("explicit.com");
  });

  it("falls back to defaultZone", () => {
    const app = makeApp({ defaultZone: "default.com" });
    expect(resolveZone(app, {}, "r")).toBe("default.com");
  });

  it("infers from a single domain's registrable zone", () => {
    const app = makeApp();
    app.addDomain("api.example.com");
    app.addDomain("www.example.com");
    expect(resolveZone(app, {}, "r")).toBe("example.com");
  });

  it("errors on ambiguous or missing zones", () => {
    const multi = makeApp();
    multi.addDomain("a.one.com");
    multi.addDomain("b.two.com");
    expect(() => resolveZone(multi, {}, "r")).toThrow(/multiple zones/);

    const none = makeApp();
    expect(() => resolveZone(none, {}, "r")).toThrow(/No domains declared/);
  });
});

describe("edge rules — zone manifests", () => {
  it("groups rules by zone and phase in declaration order", () => {
    const app = makeApp({ defaultZone: "x.com" });
    app.addRedirect("first", { from: "/a", to: "/b" });
    app.addRedirect("second", { from: "/c", to: "/d" });
    app.addWAFRule("waf-1", { expression: "cf.client.bot", action: "block" });
    app.addCacheRule("cache-1", { match: { pathStartsWith: "/s/" }, cache: true });

    const manifests = generateZoneManifests(app);
    expect(manifests.size).toBe(1);
    const m = manifests.get("x.com")!;
    expect(m.phases.http_request_dynamic_redirect!.rules.map((r) => r.leviName)).toEqual([
      "first",
      "second",
    ]);
    expect(m.phases.http_request_firewall_custom!.rules).toHaveLength(1);
    expect(m.phases.http_request_cache_settings!.rules).toHaveLength(1);
  });

  it("splits rules across zones", () => {
    const app = makeApp();
    app.addRedirect("a", { zone: "one.com", from: "/a", to: "/b" });
    app.addRedirect("b", { zone: "two.com", from: "/a", to: "/b" });
    const manifests = generateZoneManifests(app);
    expect([...manifests.keys()].sort()).toEqual(["one.com", "two.com"]);
  });

  it("routes header rules to the right phases", () => {
    const app = makeApp({ defaultZone: "x.com" });
    app.addHeaderRule("req", { direction: "request", headers: { A: "1" } });
    app.addHeaderRule("res", { direction: "response", headers: { B: "2" } });
    const m = generateZoneManifests(app).get("x.com")!;
    expect(m.phases.http_request_late_transform!.rules[0].leviName).toBe("req");
    expect(m.phases.http_response_headers_transform!.rules[0].leviName).toBe("res");
  });

  it("includes snippets with sanitized names", () => {
    const app = makeApp({ defaultZone: "x.com" });
    app.addSnippet("ab-test", { entrypoint: "./snippets/ab.js" });
    const m = generateZoneManifests(app).get("x.com")!;
    expect(m.snippets[0].snippetName).toBe("levi_test_app_ab_test");
    expect(m.snippets[0].expression).toBe("true");
  });

  it("records explicit zoneId on the manifest", () => {
    const app = makeApp();
    app.addRedirect("a", { zone: "x.com", zoneId: "z123", from: "/a", to: "/b" });
    expect(generateZoneManifests(app).get("x.com")!.zoneId).toBe("z123");
  });

  it("snippetName sanitizes arbitrary names", () => {
    expect(snippetName("My App", "A/B Test!")).toBe("levi_my_app_a_b_test_");
  });
});
