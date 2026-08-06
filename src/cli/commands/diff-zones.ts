/**
 * Zone-level diff for `levi diff` — compares the app's desired edge
 * rules & snippets against the live Cloudflare zone state.
 *
 * Read-only by construction: only GET requests are issued. Reuses the
 * same `planPhaseSync` / `planSnippetRulesSync` planners as
 * `levi provision`, so diff and provision can never disagree.
 *
 * @module
 */

import consola from "consola";
import type { FlareApp } from "../../app.js";
import type { RulesetPhase } from "../../types/edge-rules.js";
import { generateZoneManifests } from "../../generators/edge-rules.js";
import { resolveAuth, findZone } from "../../cloudflare/index.js";
import { getPhaseEntrypoint, planPhaseSync } from "../../cloudflare/rulesets.js";
import { getSnippetRules, planSnippetRulesSync } from "../../cloudflare/snippets.js";

/** Machine-readable zone diff entry for `--json`. */
export interface ZoneDiffJson {
  zone: string;
  error?: string;
  phases: Partial<
    Record<
      RulesetPhase,
      {
        creates: string[];
        updates: string[];
        deletes: string[];
        unchanged: string[];
        foreignCount: number;
        entrypointMissing: boolean;
      }
    >
  >;
  snippets?: {
    desired: string[];
    rulesInSync: boolean;
    foreignRules: number;
  };
}

/**
 * Diff every zone manifest against live state. Prints human output
 * unless `json` is set; always returns the JSON structure.
 */
export async function diffZones(
  app: FlareApp,
  { json = false }: { json?: boolean } = {},
): Promise<ZoneDiffJson[] | null> {
  const manifests = generateZoneManifests(app);
  if (manifests.size === 0) return null;

  let auth;
  try {
    auth = resolveAuth();
  } catch {
    if (!json) {
      consola.warn(
        "No Cloudflare API token found — skipping edge rules diff. Set CLOUDFLARE_API_TOKEN to enable it.",
      );
    }
    return null;
  }

  const out: ZoneDiffJson[] = [];

  for (const [zoneName, manifest] of manifests) {
    const entry: ZoneDiffJson = { zone: zoneName, phases: {} };
    out.push(entry);

    let zoneId: string | undefined;
    try {
      zoneId = manifest.zoneId ?? (await findZone(zoneName, auth))?.id;
    } catch (error) {
      entry.error = error instanceof Error ? error.message : String(error);
    }

    if (!zoneId) {
      entry.error ??= "zone not found";
      if (!json) consola.warn(`  Zone "${zoneName}" not found — skipping.`);
      continue;
    }

    if (!json) {
      console.log(`  \x1b[1mZone: ${zoneName}\x1b[0m \x1b[2m(edge rules)\x1b[0m`);
    }

    for (const [phase, phaseData] of Object.entries(manifest.phases) as Array<
      [RulesetPhase, { rules: import("../../types/edge-rules.js").ManifestRule[] }]
    >) {
      try {
        const live = await getPhaseEntrypoint(zoneId, phase, auth);
        const plan = planPhaseSync(live, phaseData.rules);

        entry.phases[phase] = {
          creates: plan.creates.map((r) => r.leviName),
          updates: plan.updates.map((u) => u.rule.leviName),
          deletes: plan.deletes.map((d) => d.name),
          unchanged: plan.unchanged,
          foreignCount: plan.foreignCount,
          entrypointMissing: plan.entrypointMissing,
        };

        if (!json) {
          const parts: string[] = [];
          for (const r of plan.creates) parts.push(`\x1b[32m+ ${r.leviName}\x1b[0m`);
          for (const u of plan.updates) parts.push(`\x1b[33m~ ${u.rule.leviName}\x1b[0m`);
          for (const d of plan.deletes) parts.push(`\x1b[31m- ${d.name}\x1b[0m`);
          for (const n of plan.unchanged) parts.push(`\x1b[2m= ${n}\x1b[0m`);
          const foreign =
            plan.foreignCount > 0
              ? ` \x1b[2m(${plan.foreignCount} unmanaged untouched)\x1b[0m`
              : "";
          console.log(`    ${phase}:${foreign}`);
          for (const p of parts) console.log(`      ${p}`);
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        entry.error = msg;
        if (!json) consola.warn(`    ${phase}: ${msg}`);
      }
    }

    if (manifest.snippets.length > 0) {
      try {
        const liveRules = await getSnippetRules(zoneId, auth);
        const plan = planSnippetRulesSync(liveRules, manifest.snippets);
        entry.snippets = {
          desired: manifest.snippets.map((s) => s.snippetName),
          rulesInSync: plan.unchanged,
          foreignRules: plan.foreignCount,
        };
        if (!json) {
          console.log(
            `    snippets: ${manifest.snippets.length} declared, rules ${plan.unchanged ? "\x1b[32min sync\x1b[0m" : "\x1b[33mout of sync\x1b[0m"}` +
              (plan.foreignCount > 0
                ? ` \x1b[2m(${plan.foreignCount} unmanaged preserved)\x1b[0m`
                : ""),
          );
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        if (!json) consola.warn(`    snippets: ${msg}`);
      }
    }

    if (!json) console.log("");
  }

  return out;
}
