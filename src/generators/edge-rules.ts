/**
 * Pure builders that compile Levi edge rule options into Cloudflare
 * Rulesets API rule objects, and assemble per-zone desired-state
 * manifests (`.levi/zones/<zone>.rules.json`).
 *
 * Everything here is side-effect free — the same builders feed
 * `levi build`, `levi provision`, and `levi diff` so they can never
 * disagree about the desired state.
 *
 * @module
 */

import type { FlareApp } from "../app.js";
import type {
  CacheRuleOptions,
  CacheTtl,
  EdgeRuleBaseOptions,
  HeaderOp,
  HeaderRuleOptions,
  ManifestRule,
  ManifestSnippet,
  MatchSugar,
  RateLimitRuleOptions,
  RedirectRuleOptions,
  SnippetOptions,
  WAFRuleOptions,
  ZoneRulesManifest,
} from "../types/edge-rules.js";
import { EdgeRuleResource } from "../resources/edge-rule.js";
import { SnippetResource } from "../resources/snippet.js";
import { DomainResource } from "../resources/domain.js";

/** Ownership tag prefix — rules whose description starts with this are Levi-managed. */
export const LEVI_TAG_PREFIX = "Managed by Levi: ";

/** Build the ownership description for a rule name. */
export function leviTag(name: string): string {
  return `${LEVI_TAG_PREFIX}${name}`;
}

// ---------------------------------------------------------------------------
// Expression sugar
// ---------------------------------------------------------------------------

/** Escape a string literal for the Rules language. */
function q(value: string): string {
  return `"${value.replace(/(["\\])/g, "\\$1")}"`;
}

/** Compile a {@link MatchSugar} object into an AND-combined expression. */
export function compileMatchSugar(match: MatchSugar): string {
  const parts: string[] = [];
  if (match.host) parts.push(`http.host eq ${q(match.host)}`);
  if (match.path) parts.push(`http.request.uri.path eq ${q(match.path)}`);
  if (match.pathStartsWith) {
    parts.push(`starts_with(http.request.uri.path, ${q(match.pathStartsWith)})`);
  }
  if (match.pathWildcard) {
    parts.push(`http.request.uri.path wildcard ${q(match.pathWildcard)}`);
  }
  return parts.join(" and ");
}

// ---------------------------------------------------------------------------
// Rule builders (options → API-shaped ManifestRule)
// ---------------------------------------------------------------------------

/**
 * Compile a redirect rule. Wildcard `from` patterns with `${n}` capture
 * references in `to` become `wildcard_replace()` expressions.
 */
export function buildRedirectRule(name: string, options: RedirectRuleOptions): ManifestRule {
  const { from, to, status = 301, preserveQueryString = true } = options;

  // Which request field does `from` match against?
  const subject =
    from && from.startsWith("/") ? "http.request.uri.path" : "http.request.full_uri";

  let expression: string;
  if (options.expression) {
    expression = options.expression;
  } else if (from) {
    expression = from.includes("*")
      ? `${subject} wildcard ${q(from)}`
      : `${subject} eq ${q(from)}`;
  } else {
    throw new Error(`Redirect rule "${name}": provide either \`from\` or \`expression\`.`);
  }

  const usesCaptures = /\$\{\d+\}/.test(to);
  const target_url =
    usesCaptures && from
      ? { expression: `wildcard_replace(${subject}, ${q(from)}, ${q(to)})` }
      : { value: to };

  if (usesCaptures && !from) {
    throw new Error(
      `Redirect rule "${name}": \`to\` uses \${n} captures, which require a wildcard \`from\` pattern.`,
    );
  }

  return {
    leviName: name,
    description: leviTag(name),
    expression,
    action: "redirect",
    action_parameters: {
      from_value: {
        status_code: status,
        target_url,
        preserve_query_string: preserveQueryString,
      },
    },
    enabled: options.enabled ?? true,
  };
}

/** Normalize a TTL shorthand (number of seconds) into the API object. */
function compileTtl(ttl: number | CacheTtl): Record<string, unknown> {
  if (typeof ttl === "number") {
    return { mode: "override_origin", default: ttl };
  }
  const out: Record<string, unknown> = { mode: ttl.mode };
  if (ttl.seconds !== undefined) out.default = ttl.seconds;
  return out;
}

/** Compile a cache rule. */
export function buildCacheRule(name: string, options: CacheRuleOptions): ManifestRule {
  const expression =
    options.expression ?? (options.match ? compileMatchSugar(options.match) : "");
  if (!expression) {
    throw new Error(`Cache rule "${name}": provide either \`match\` or \`expression\`.`);
  }

  const params: Record<string, unknown> = { cache: options.cache };
  if (options.edgeTtl !== undefined) params.edge_ttl = compileTtl(options.edgeTtl);
  if (options.browserTtl !== undefined) params.browser_ttl = compileTtl(options.browserTtl);

  if (options.cacheKey) {
    const customKey: Record<string, unknown> = {};
    const qs = options.cacheKey.queryString;
    if (qs === "all") customKey.query_string = { include: { all: true } };
    else if (qs === "none") customKey.query_string = { exclude: { all: true } };
    else if (qs && "include" in qs) customKey.query_string = { include: { list: qs.include } };
    else if (qs && "exclude" in qs) customKey.query_string = { exclude: { list: qs.exclude } };
    if (options.cacheKey.headers) customKey.header = { include: options.cacheKey.headers };
    if (options.cacheKey.cookies) customKey.cookie = { include: options.cacheKey.cookies };
    params.cache_key = { custom_key: customKey };
  }

  return {
    leviName: name,
    description: leviTag(name),
    expression,
    action: "set_cache_settings",
    action_parameters: params,
    enabled: options.enabled ?? true,
  };
}

/** Compile a WAF custom rule. */
export function buildWAFRule(name: string, options: WAFRuleOptions): ManifestRule {
  const rule: ManifestRule = {
    leviName: name,
    description: leviTag(name),
    expression: options.expression,
    action: options.action,
    enabled: options.enabled ?? true,
  };

  if (options.action === "skip") {
    rule.action_parameters = options.skip
      ? {
          ...(options.skip.products ? { products: options.skip.products } : {}),
          ...(options.skip.phases ? { phases: options.skip.phases } : {}),
        }
      : { ruleset: "current" };
  }

  return rule;
}

/** Compile a zone HTTP rate limiting rule. */
export function buildRateLimitRule(
  name: string,
  options: RateLimitRuleOptions,
): ManifestRule {
  return {
    leviName: name,
    description: leviTag(name),
    expression: options.expression,
    action: options.action ?? "block",
    ratelimit: {
      characteristics: options.characteristics ?? ["cf.colo.id", "ip.src"],
      period: options.period,
      requests_per_period: options.requestsPerPeriod,
      mitigation_timeout: options.mitigationTimeout ?? options.period,
      ...(options.countingExpression
        ? { counting_expression: options.countingExpression }
        : {}),
    },
    enabled: options.enabled ?? true,
  };
}

/** Compile a header transform rule (request or response). */
export function buildHeaderRule(name: string, options: HeaderRuleOptions): ManifestRule {
  const expression =
    options.expression ?? (options.match ? compileMatchSugar(options.match) : "true");

  const headers: Record<string, Record<string, unknown>> = {};
  for (const [headerName, op] of Object.entries(options.headers)) {
    const norm: HeaderOp = typeof op === "string" ? { operation: "set", value: op } : op;
    const entry: Record<string, unknown> = { operation: norm.operation };
    if (norm.value !== undefined) entry.value = norm.value;
    if (norm.expression !== undefined) entry.expression = norm.expression;
    headers[headerName] = entry;
  }

  return {
    leviName: name,
    description: leviTag(name),
    expression,
    action: "rewrite",
    action_parameters: { headers },
    enabled: options.enabled ?? true,
  };
}

// ---------------------------------------------------------------------------
// Zone resolution
// ---------------------------------------------------------------------------

/** Extract the naive registrable zone (last two labels) from a hostname. */
function registrableZone(hostname: string): string {
  const labels = hostname.split(".").filter(Boolean);
  return labels.slice(-2).join(".");
}

/**
 * Resolve the zone for an edge rule or snippet.
 *
 * Order: explicit `zone` option → app `defaultZone` → inference when all
 * declared domains share a single registrable zone → error.
 */
export function resolveZone(
  app: FlareApp,
  options: Pick<EdgeRuleBaseOptions, "zone" | "zoneId">,
  resourceName: string,
): string {
  if (options.zone) return options.zone;
  if (app.options.defaultZone) return app.options.defaultZone;

  const domains = app.graph.nodes.filter(
    (n): n is DomainResource => n.type === "domain",
  );
  const zones = new Set(domains.map((d) => registrableZone(d.name)));
  if (zones.size === 1) return [...zones][0];

  throw new Error(
    `Edge rule "${resourceName}": cannot resolve a zone. ` +
      (zones.size > 1
        ? `Declared domains span multiple zones (${[...zones].join(", ")}). `
        : `No domains declared. `) +
      `Set \`zone\` on the rule or \`defaultZone\` on the app.`,
  );
}

// ---------------------------------------------------------------------------
// Manifest assembly
// ---------------------------------------------------------------------------

/** Sanitize a snippet name: zone-global, immutable, `[A-Za-z0-9_]` only. */
export function snippetName(appName: string, resourceName: string): string {
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9_]/g, "_");
  return `levi_${clean(appName)}_${clean(resourceName)}`;
}

/** Compile one EdgeRuleResource into its API-shaped manifest rule. */
export function buildRule(resource: EdgeRuleResource): ManifestRule {
  const opts = resource.options;
  switch (resource.kind) {
    case "redirect":
      return buildRedirectRule(resource.name, opts as RedirectRuleOptions);
    case "cache":
      return buildCacheRule(resource.name, opts as CacheRuleOptions);
    case "waf":
      return buildWAFRule(resource.name, opts as WAFRuleOptions);
    case "rate-limit":
      return buildRateLimitRule(resource.name, opts as RateLimitRuleOptions);
    case "request-header":
    case "response-header":
      return buildHeaderRule(resource.name, opts as HeaderRuleOptions);
  }
}

/**
 * Assemble per-zone desired-state manifests from the app graph.
 *
 * Rules appear in declaration order within each phase — the ordering
 * contract that provisioning maintains for Levi-managed rules.
 *
 * @throws {Error} On unresolvable zones or duplicate rule names within
 *   a zone+phase.
 */
export function generateZoneManifests(app: FlareApp): Map<string, ZoneRulesManifest> {
  const manifests = new Map<string, ZoneRulesManifest>();

  const getManifest = (zone: string, zoneId?: string): ZoneRulesManifest => {
    let m = manifests.get(zone);
    if (!m) {
      m = { version: 1, app: app.name, zone, phases: {}, snippets: [] };
      manifests.set(zone, m);
    }
    if (zoneId && !m.zoneId) m.zoneId = zoneId;
    return m;
  };

  const edgeRules = app.graph.nodes
    .filter((n): n is EdgeRuleResource => n.type === "edge-rule")
    .sort((a, b) => a.declarationIndex - b.declarationIndex);

  for (const rule of edgeRules) {
    const zone = resolveZone(app, rule.options, rule.name);
    const manifest = getManifest(zone, rule.options.zoneId);
    const phase = rule.phase;

    if (!manifest.phases[phase]) manifest.phases[phase] = { rules: [] };
    const phaseRules = manifest.phases[phase]!.rules;

    if (phaseRules.some((r) => r.leviName === rule.name)) {
      throw new Error(
        `Duplicate edge rule name "${rule.name}" in zone ${zone}, phase ${phase}.`,
      );
    }

    phaseRules.push(buildRule(rule));
  }

  const snippets = app.graph.nodes
    .filter((n): n is SnippetResource => n.type === "snippet")
    .sort((a, b) => a.declarationIndex - b.declarationIndex);

  for (const snippet of snippets) {
    const opts = snippet.options as SnippetOptions;
    const zone = resolveZone(app, opts, snippet.name);
    const manifest = getManifest(zone, opts.zoneId);

    if (manifest.snippets.some((s) => s.leviName === snippet.name)) {
      throw new Error(`Duplicate snippet name "${snippet.name}" in zone ${zone}.`);
    }

    manifest.snippets.push({
      leviName: snippet.name,
      snippetName: snippetName(app.name, snippet.name),
      entrypoint: opts.entrypoint,
      expression: opts.expression ?? "true",
      enabled: opts.enabled ?? true,
    });
  }

  return manifests;
}
