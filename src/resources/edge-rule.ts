import type { ResourceType } from "../types/index.js";
import type {
  EdgeRuleKind,
  EdgeRuleOptionsUnion,
  RulesetPhase,
} from "../types/edge-rules.js";
import { Resource } from "./base.js";

/** Maps each edge rule kind to its Cloudflare ruleset phase. */
export const KIND_TO_PHASE: Record<EdgeRuleKind, RulesetPhase> = {
  redirect: "http_request_dynamic_redirect",
  cache: "http_request_cache_settings",
  waf: "http_request_firewall_custom",
  "rate-limit": "http_ratelimit",
  "request-header": "http_request_late_transform",
  "response-header": "http_response_headers_transform",
};

/**
 * A zone-level edge rule — redirect, cache, WAF, rate limiting, or
 * header transform — provisioned via the Cloudflare Rulesets API.
 *
 * All kinds share one resource type; `kind` discriminates and determines
 * the ruleset phase. Created via `app.addRedirect()`, `app.addCacheRule()`,
 * `app.addWAFRule()`, `app.addRateLimitRule()`, or `app.addHeaderRule()`.
 */
export class EdgeRuleResource extends Resource<EdgeRuleOptionsUnion> {
  readonly type: ResourceType = "edge-rule";

  /** The rule kind, set by the `FlareApp` factory method used. */
  readonly kind: EdgeRuleKind;

  /** Declaration order within the app (the ordering contract per zone+phase). */
  readonly declarationIndex: number;

  constructor(
    name: string,
    kind: EdgeRuleKind,
    options: EdgeRuleOptionsUnion,
    declarationIndex: number,
  ) {
    super(name, options);
    this.kind = kind;
    this.declarationIndex = declarationIndex;
  }

  /** The Cloudflare ruleset phase this rule belongs to. */
  get phase(): RulesetPhase {
    return KIND_TO_PHASE[this.kind];
  }

  override toGraphNode(): {
    type: string;
    name: string;
    dependencies: string[];
    subtype?: string;
  } {
    return { ...super.toGraphNode(), subtype: this.kind };
  }
}
