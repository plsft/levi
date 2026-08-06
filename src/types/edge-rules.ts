/**
 * Types for the Levi edge rules layer — zone-level Cloudflare
 * configuration (redirects, cache rules, WAF custom rules, rate limiting
 * rules, header transforms) and Snippets, declared in `levi.app.ts` and
 * provisioned via the Cloudflare Rulesets API.
 *
 * Edge rules do not map to wrangler.jsonc — they are API-only zone
 * resources. `levi build` compiles them into
 * `.levi/zones/<zone>.rules.json` manifests, and `levi provision` syncs
 * them against the zone's phase entrypoint rulesets, touching only rules
 * tagged `"Managed by Levi: <name>"`.
 *
 * @module
 */

/** The kind of edge rule, set by the `FlareApp` factory method used. */
export type EdgeRuleKind =
  | "redirect"
  | "cache"
  | "waf"
  | "rate-limit"
  | "request-header"
  | "response-header";

/**
 * Zone-level ruleset phases Levi manages.
 *
 * @see https://developers.cloudflare.com/ruleset-engine/reference/phases-list/
 */
export type RulesetPhase =
  | "http_request_dynamic_redirect"
  | "http_request_cache_settings"
  | "http_request_late_transform"
  | "http_response_headers_transform"
  | "http_request_firewall_custom"
  | "http_ratelimit";

/**
 * Options shared by every edge rule.
 */
export interface EdgeRuleBaseOptions {
  /**
   * Zone name (e.g. `"example.com"`). Resolution order:
   * this option → `app.options.defaultZone` → inferred when all declared
   * domains share a single zone → build error.
   */
  zone?: string;

  /** Zone ID escape hatch — skips the zone name lookup at provision time. */
  zoneId?: string;

  /**
   * Raw Cloudflare Rules-language expression. When provided, it takes
   * precedence over any kind-specific sugar (`from`, `match`, …).
   *
   * @see https://developers.cloudflare.com/ruleset-engine/rules-language/
   */
  expression?: string;

  /** @default true */
  enabled?: boolean;
}

/**
 * Expression sugar shared by cache and header rules. Fields are
 * AND-combined into a Rules-language expression.
 */
export interface MatchSugar {
  /** Match a specific host — `http.host eq "..."`. */
  host?: string;

  /** Match an exact path — `http.request.uri.path eq "..."`. */
  path?: string;

  /** Match a path prefix — `starts_with(http.request.uri.path, "...")`. */
  pathStartsWith?: string;

  /** Match a path wildcard — `http.request.uri.path wildcard "..."`. */
  pathWildcard?: string;
}

/**
 * Options for a URL redirect rule (`app.addRedirect()`), compiled into
 * the `http_request_dynamic_redirect` phase.
 */
export interface RedirectRuleOptions extends EdgeRuleBaseOptions {
  /**
   * Source URL or wildcard pattern, e.g. `"https://old.example.com/*"`.
   * Compiled to a `http.request.full_uri wildcard "..."` expression.
   * Omit when providing a raw `expression`.
   */
  from?: string;

  /**
   * Target URL. May reference wildcard captures from `from` as `${1}`,
   * `${2}`, … — compiled to a `wildcard_replace()` expression.
   */
  to: string;

  /** @default 301 */
  status?: 301 | 302 | 307 | 308;

  /** @default true */
  preserveQueryString?: boolean;
}

/** Edge/browser TTL configuration for cache rules. */
export interface CacheTtl {
  mode: "respect_origin" | "override_origin" | "bypass_by_default" | "bypass";
  /** TTL in seconds; required for `"override_origin"`. */
  seconds?: number;
}

/**
 * Options for a cache rule (`app.addCacheRule()`), compiled into the
 * `http_request_cache_settings` phase.
 */
export interface CacheRuleOptions extends EdgeRuleBaseOptions {
  /** Expression sugar; used when `expression` is omitted. */
  match?: MatchSugar;

  /** `true` = eligible for cache; `false` = bypass cache. */
  cache: boolean;

  /** Edge cache TTL — a number of seconds (override origin) or a full config. */
  edgeTtl?: number | CacheTtl;

  /** Browser cache TTL — a number of seconds (override origin) or a full config. */
  browserTtl?: number | CacheTtl;

  /** Custom cache key configuration. */
  cacheKey?: {
    queryString?: "all" | "none" | { include: string[] } | { exclude: string[] };
    headers?: string[];
    cookies?: string[];
  };
}

/**
 * Options for a WAF custom rule (`app.addWAFRule()`), compiled into the
 * `http_request_firewall_custom` phase.
 *
 * Security predicates must be written explicitly — there is deliberately
 * no expression sugar for WAF rules.
 */
export interface WAFRuleOptions extends EdgeRuleBaseOptions {
  /** Rules-language expression (required for WAF rules). */
  expression: string;

  /** The action to take when the expression matches. */
  action:
    | "block"
    | "managed_challenge"
    | "js_challenge"
    | "challenge"
    | "log"
    | "skip";

  /** For `action: "skip"` — which products/phases to skip. */
  skip?: { products?: string[]; phases?: string[] };
}

/**
 * Options for a zone rate limiting rule (`app.addRateLimitRule()`),
 * compiled into the `http_ratelimit` phase.
 *
 * This is edge-level HTTP rate limiting (blocks before your Worker runs)
 * — distinct from the Workers rate limiting *binding*
 * (`app.addRateLimit()`), which is an in-Worker counter API.
 */
export interface RateLimitRuleOptions extends EdgeRuleBaseOptions {
  /** Rules-language expression selecting the traffic to rate limit (required). */
  expression: string;

  /** Request threshold per period. */
  requestsPerPeriod: number;

  /**
   * Counting period in seconds. Non-Enterprise plans support
   * 10, 60, 600, or 3600.
   */
  period: number;

  /**
   * Seconds the mitigation stays active after triggering.
   *
   * @default same as period
   */
  mitigationTimeout?: number;

  /**
   * Characteristics the counter is keyed on.
   *
   * @default ["cf.colo.id", "ip.src"]
   */
  characteristics?: string[];

  /** @default "block" */
  action?: "block" | "managed_challenge" | "js_challenge" | "challenge" | "log";

  /** Expression defining when the counter increments (defaults to `expression`). */
  countingExpression?: string;
}

/** A single header operation in a header transform rule. */
export interface HeaderOp {
  operation: "set" | "add" | "remove";

  /** Literal header value (for set/add). */
  value?: string;

  /** Dynamic Rules-language expression producing the value (for set/add). */
  expression?: string;
}

/**
 * Options for a header transform rule (`app.addHeaderRule()`), compiled
 * into `http_request_late_transform` (request) or
 * `http_response_headers_transform` (response).
 */
export interface HeaderRuleOptions extends EdgeRuleBaseOptions {
  /** Whether to transform request headers (seen by origin) or response headers. */
  direction: "request" | "response";

  /** Expression sugar; used when `expression` is omitted. Defaults to all traffic. */
  match?: MatchSugar;

  /**
   * Header name → operation. A plain string value is shorthand for
   * `{ operation: "set", value }`.
   */
  headers: Record<string, HeaderOp | string>;
}

/** Union of all edge rule option shapes (discriminated by resource `kind`). */
export type EdgeRuleOptionsUnion =
  | RedirectRuleOptions
  | CacheRuleOptions
  | WAFRuleOptions
  | RateLimitRuleOptions
  | HeaderRuleOptions;

/**
 * Options for a Cloudflare Snippet (`app.addSnippet()`).
 *
 * Snippets are lightweight JavaScript modules that run at the zone edge
 * before your Workers — free-tier request modification. Levi uploads the
 * module and manages a matching snippet rule.
 *
 * @see https://developers.cloudflare.com/rules/snippets/
 */
export interface SnippetOptions {
  /** Zone name; same resolution order as edge rules. */
  zone?: string;

  /** Zone ID escape hatch. */
  zoneId?: string;

  /** Path to the snippet's JS module, relative to the app file. */
  entrypoint: string;

  /**
   * Rules-language expression controlling when the snippet runs.
   *
   * @default "true" (all requests)
   */
  expression?: string;

  /** @default true */
  enabled?: boolean;
}

// ---------------------------------------------------------------------------
// Zone manifest (build output — `.levi/zones/<zone>.rules.json`)
// ---------------------------------------------------------------------------

/** A fully-compiled, API-shaped rule in a zone manifest. */
export interface ManifestRule {
  /** The Levi resource name (identity within the zone+phase). */
  leviName: string;

  /** Ownership tag: `"Managed by Levi: <leviName>"`. */
  description: string;

  expression: string;
  action: string;
  action_parameters?: unknown;

  /** Rate limit config (http_ratelimit phase only) — rule-level sibling of action_parameters. */
  ratelimit?: {
    characteristics: string[];
    period: number;
    requests_per_period: number;
    mitigation_timeout?: number;
    counting_expression?: string;
  };

  enabled: boolean;
}

/** A compiled snippet entry in a zone manifest. */
export interface ManifestSnippet {
  leviName: string;

  /** Sanitized zone-global snippet name: `levi_<app>_<name>`. */
  snippetName: string;

  /** Entrypoint path relative to the app file. */
  entrypoint: string;

  expression: string;
  enabled: boolean;
}

/** Desired zone state, written by `levi build` to `.levi/zones/<zone>.rules.json`. */
export interface ZoneRulesManifest {
  version: 1;
  app: string;
  zone: string;

  /** Explicit zone ID when provided via `zoneId` options. */
  zoneId?: string;

  phases: Partial<Record<RulesetPhase, { rules: ManifestRule[] }>>;
  snippets: ManifestSnippet[];
}
