import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ManifestRule } from "../src/types/edge-rules.js";

vi.mock("../src/cloudflare/api.js", () => ({
  cfGet: vi.fn(),
  cfPost: vi.fn(),
  cfPatch: vi.fn(),
  cfPut: vi.fn(),
  cfPutMultipart: vi.fn(),
  cfDelete: vi.fn(),
  resolveAuth: vi.fn(() => ({ apiToken: "test" })),
}));

import { cfGet, cfPost, cfPatch, cfPut, cfDelete } from "../src/cloudflare/api.js";
import {
  planPhaseSync,
  applyPhaseSync,
  leviNameOf,
  type RulesetRule,
  type Ruleset,
} from "../src/cloudflare/rulesets.js";
import { planSnippetRulesSync, type SnippetRule } from "../src/cloudflare/snippets.js";

const AUTH = { apiToken: "test" };

function mrule(name: string, overrides: Partial<ManifestRule> = {}): ManifestRule {
  return {
    leviName: name,
    description: `Managed by Levi: ${name}`,
    expression: "true",
    action: "block",
    enabled: true,
    ...overrides,
  };
}

function lrule(name: string, id: string, overrides: Partial<RulesetRule> = {}): RulesetRule {
  return {
    id,
    description: `Managed by Levi: ${name}`,
    expression: "true",
    action: "block",
    enabled: true,
    ...overrides,
  };
}

function foreignRule(id: string, desc = "a dashboard rule"): RulesetRule {
  return { id, description: desc, expression: "ip.src eq 1.1.1.1", action: "block" };
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// planPhaseSync (pure)
// ---------------------------------------------------------------------------

describe("planPhaseSync", () => {
  it("plans full creation when the entrypoint is missing", () => {
    const plan = planPhaseSync(null, [mrule("a"), mrule("b")]);
    expect(plan.entrypointMissing).toBe(true);
    expect(plan.creates).toHaveLength(2);
    expect(plan.updates).toHaveLength(0);
    expect(plan.deletes).toHaveLength(0);
  });

  it("never plans operations against foreign rules", () => {
    const live: Ruleset = {
      id: "rs1",
      rules: [foreignRule("f1"), foreignRule("f2", ""), lrule("mine", "l1")],
    };
    const plan = planPhaseSync(live, []);
    expect(plan.foreignCount).toBe(2);
    // "mine" is no longer desired → deleted; foreign rules untouched
    expect(plan.deletes).toEqual([{ ruleId: "l1", name: "mine" }]);
    expect(plan.leviLiveIds.has("f1")).toBe(false);
    expect(plan.leviLiveIds.has("f2")).toBe(false);
  });

  it("classifies unchanged, updated, created, and deleted rules", () => {
    const live: Ruleset = {
      id: "rs1",
      rules: [
        lrule("same", "l1"),
        lrule("drifted", "l2", { expression: "old-expression" }),
        lrule("removed", "l3"),
      ],
    };
    const desired = [mrule("same"), mrule("drifted"), mrule("brand-new")];
    const plan = planPhaseSync(live, desired);
    expect(plan.unchanged).toEqual(["same"]);
    expect(plan.updates.map((u) => u.rule.leviName)).toEqual(["drifted"]);
    expect(plan.creates.map((r) => r.leviName)).toEqual(["brand-new"]);
    expect(plan.deletes.map((d) => d.name)).toEqual(["removed"]);
  });

  it("treats action_parameters differences as drift (order-insensitive keys)", () => {
    const live: Ruleset = {
      id: "rs1",
      rules: [
        lrule("r", "l1", {
          action: "redirect",
          action_parameters: { from_value: { status_code: 301, preserve_query_string: true } },
        }),
      ],
    };
    const same = mrule("r", {
      action: "redirect",
      action_parameters: { from_value: { preserve_query_string: true, status_code: 301 } },
    });
    expect(planPhaseSync(live, [same]).unchanged).toEqual(["r"]);

    const changed = mrule("r", {
      action: "redirect",
      action_parameters: { from_value: { status_code: 302, preserve_query_string: true } },
    });
    expect(planPhaseSync(live, [changed]).updates).toHaveLength(1);
  });

  it("detects order drift among Levi rules only", () => {
    const live: Ruleset = {
      id: "rs1",
      rules: [foreignRule("f1"), lrule("b", "l2"), lrule("a", "l1")],
    };
    const plan = planPhaseSync(live, [mrule("a"), mrule("b")]);
    expect(plan.needsReorder).toBe(true);

    const ordered: Ruleset = {
      id: "rs1",
      rules: [lrule("a", "l1"), foreignRule("f1"), lrule("b", "l2")],
    };
    expect(planPhaseSync(ordered, [mrule("a"), mrule("b")]).needsReorder).toBe(false);
  });

  it("second run after sync produces zero operations", () => {
    const desired = [mrule("a"), mrule("b", { expression: "cf.client.bot" })];
    const live: Ruleset = {
      id: "rs1",
      rules: desired.map((d, i) =>
        lrule(d.leviName, `l${i}`, {
          expression: d.expression,
          action: d.action,
          action_parameters: d.action_parameters,
        }),
      ),
    };
    const plan = planPhaseSync(live, desired);
    expect(plan.creates).toHaveLength(0);
    expect(plan.updates).toHaveLength(0);
    expect(plan.deletes).toHaveLength(0);
    expect(plan.unchanged).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// applyPhaseSync (mocked API)
// ---------------------------------------------------------------------------

describe("applyPhaseSync", () => {
  it("uses a full PUT only when the entrypoint is missing", async () => {
    const desired = [mrule("a")];
    const plan = planPhaseSync(null, desired);
    const result = await applyPhaseSync("z1", "http_request_firewall_custom", plan, desired, AUTH);

    expect(cfPut).toHaveBeenCalledTimes(1);
    expect(cfPost).not.toHaveBeenCalled();
    expect(result.created).toBe(1);

    const [path, , body] = vi.mocked(cfPut).mock.calls[0];
    expect(path).toBe("/zones/z1/rulesets/phases/http_request_firewall_custom/entrypoint");
    // leviName must not leak into the API payload
    expect(JSON.stringify(body)).not.toContain("leviName");
  });

  it("steady state uses per-rule POST/PATCH/DELETE — foreign rules never in a body", async () => {
    const live: Ruleset = {
      id: "rs1",
      rules: [
        foreignRule("f1"),
        lrule("drifted", "l1", { expression: "old" }),
        lrule("gone", "l2"),
      ],
    };
    const desired = [mrule("drifted"), mrule("added")];
    const plan = planPhaseSync(live, desired);

    // The refresh after creates
    vi.mocked(cfGet).mockResolvedValue({
      id: "rs1",
      rules: [foreignRule("f1"), lrule("drifted", "l1"), lrule("added", "l9")],
    });

    await applyPhaseSync("z1", "http_request_firewall_custom", plan, desired, AUTH);

    expect(cfPut).not.toHaveBeenCalled();
    expect(vi.mocked(cfDelete).mock.calls[0][0]).toBe("/zones/z1/rulesets/rs1/rules/l2");
    expect(vi.mocked(cfPatch).mock.calls[0][0]).toBe("/zones/z1/rulesets/rs1/rules/l1");
    expect(vi.mocked(cfPost).mock.calls[0][0]).toBe("/zones/z1/rulesets/rs1/rules");

    // No request body anywhere may contain a foreign rule id or content
    const allBodies = [
      ...vi.mocked(cfPost).mock.calls,
      ...vi.mocked(cfPatch).mock.calls,
      ...vi.mocked(cfPut).mock.calls,
    ].map((c) => JSON.stringify(c[2] ?? ""));
    for (const body of allBodies) {
      expect(body).not.toContain("1.1.1.1");
      expect(body).not.toContain("dashboard rule");
    }
  });

  it("refuses to mutate rule IDs outside the Levi partition", async () => {
    const plan = planPhaseSync({ id: "rs1", rules: [lrule("a", "l1")] }, [mrule("a")]);
    plan.updates.push({ ruleId: "foreign-id", rule: mrule("a") });
    await expect(
      applyPhaseSync("z1", "http_request_firewall_custom", plan, [mrule("a")], AUTH),
    ).rejects.toThrow(/not Levi-managed/);
  });

  it("does nothing when the plan is empty", async () => {
    const live: Ruleset = { id: "rs1", rules: [lrule("a", "l1")] };
    const desired = [mrule("a")];
    const plan = planPhaseSync(live, desired);
    const result = await applyPhaseSync("z1", "http_ratelimit", plan, desired, AUTH);
    expect(result.created + result.updated + result.deleted).toBe(0);
    expect(cfPost).not.toHaveBeenCalled();
    expect(cfPatch).not.toHaveBeenCalled();
    expect(cfPut).not.toHaveBeenCalled();
    expect(cfDelete).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// leviNameOf
// ---------------------------------------------------------------------------

describe("leviNameOf", () => {
  it("extracts the name from tagged rules and rejects others", () => {
    expect(leviNameOf(lrule("my-rule", "x"))).toBe("my-rule");
    expect(leviNameOf(foreignRule("x"))).toBeNull();
    expect(leviNameOf({ expression: "true", action: "block" })).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// planSnippetRulesSync (pure)
// ---------------------------------------------------------------------------

describe("planSnippetRulesSync", () => {
  const desired = [
    {
      leviName: "ab-test",
      snippetName: "levi_app_ab_test",
      entrypoint: "./ab.js",
      expression: 'http.request.uri.path eq "/"',
      enabled: true,
    },
  ];

  it("round-trips foreign rules verbatim, first", () => {
    const foreign: SnippetRule = {
      id: "f1",
      description: "user's own rule",
      expression: "true",
      snippet_name: "user_snippet",
    };
    const plan = planSnippetRulesSync([foreign], desired);
    expect(plan.foreignCount).toBe(1);
    expect(plan.rules[0]).toEqual(foreign);
    expect(plan.rules[1].snippet_name).toBe("levi_app_ab_test");
    expect(plan.unchanged).toBe(false);
  });

  it("preserves IDs of surviving Levi rules", () => {
    const liveLevi: SnippetRule = {
      id: "l1",
      description: "Managed by Levi: ab-test",
      expression: "old",
      snippet_name: "levi_app_ab_test",
    };
    const plan = planSnippetRulesSync([liveLevi], desired);
    expect(plan.rules[0].id).toBe("l1");
    expect(plan.rules[0].expression).toBe('http.request.uri.path eq "/"');
  });

  it("reports unchanged when live already matches", () => {
    const live: SnippetRule[] = [
      {
        id: "l1",
        description: "Managed by Levi: ab-test",
        expression: 'http.request.uri.path eq "/"',
        snippet_name: "levi_app_ab_test",
        enabled: true,
      },
    ];
    expect(planSnippetRulesSync(live, desired).unchanged).toBe(true);
  });

  it("drops Levi rules absent from the manifest but keeps foreign ones", () => {
    const live: SnippetRule[] = [
      { id: "f1", description: "", expression: "true", snippet_name: "user_snippet" },
      {
        id: "l1",
        description: "Managed by Levi: old-one",
        expression: "true",
        snippet_name: "levi_app_old_one",
      },
    ];
    const plan = planSnippetRulesSync(live, desired);
    expect(plan.rules.map((r) => r.snippet_name)).toEqual([
      "user_snippet",
      "levi_app_ab_test",
    ]);
  });
});
