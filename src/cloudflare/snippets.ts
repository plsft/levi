/**
 * Cloudflare Snippets API sync for the Levi edge rules layer.
 *
 * Uploads snippet modules (multipart PUT) and reconciles the zone's
 * snippet rules. The snippet_rules endpoint is full-replace, so foreign
 * rules are read and round-tripped verbatim — this is the one place a
 * foreign entry appears in a request body, isolated here and tested hard.
 *
 * Ownership: Levi-managed snippets are named `levi_<app>_<name>`;
 * Levi-managed snippet rules carry the `"Managed by Levi: "` description
 * tag. Nothing else is ever deleted or modified.
 *
 * @module
 */

import { readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import type { ManifestSnippet } from "../types/edge-rules.js";
import { LEVI_TAG_PREFIX, leviTag } from "../generators/edge-rules.js";
import type { CloudflareAuth } from "./api.js";
import { cfDelete, cfGet, cfPut, cfPutMultipart } from "./api.js";

/** A snippet as listed by the API. */
export interface SnippetInfo {
  snippet_name: string;
  created_on?: string;
  modified_on?: string;
}

/** A snippet rule as returned/accepted by the snippet_rules endpoint. */
export interface SnippetRule {
  id?: string;
  last_updated?: string;
  description?: string;
  enabled?: boolean;
  expression: string;
  snippet_name: string;
}

/** List all snippets on a zone. */
export async function listSnippets(
  zoneId: string,
  auth: CloudflareAuth,
): Promise<SnippetInfo[]> {
  return cfGet<SnippetInfo[]>(`/zones/${zoneId}/snippets`, auth);
}

/** Upload (create or update) a snippet module. */
export async function putSnippet(
  zoneId: string,
  name: string,
  fileName: string,
  code: string,
  auth: CloudflareAuth,
): Promise<unknown> {
  const form = new FormData();
  form.append("metadata", JSON.stringify({ main_module: fileName }));
  form.append(
    "files",
    new Blob([code], { type: "application/javascript+module" }),
    fileName,
  );
  return cfPutMultipart(`/zones/${zoneId}/snippets/${name}`, auth, form);
}

/** Delete a snippet. */
export async function deleteSnippet(
  zoneId: string,
  name: string,
  auth: CloudflareAuth,
): Promise<unknown> {
  return cfDelete(`/zones/${zoneId}/snippets/${name}`, auth);
}

/** Get the zone's snippet rules. */
export async function getSnippetRules(
  zoneId: string,
  auth: CloudflareAuth,
): Promise<SnippetRule[]> {
  const result = await cfGet<{ rules?: SnippetRule[] } | SnippetRule[]>(
    `/zones/${zoneId}/snippets/snippet_rules`,
    auth,
  );
  return Array.isArray(result) ? result : (result.rules ?? []);
}

/** Replace the zone's snippet rules (full-replace endpoint). */
export async function putSnippetRules(
  zoneId: string,
  rules: SnippetRule[],
  auth: CloudflareAuth,
): Promise<unknown> {
  return cfPut(`/zones/${zoneId}/snippets/snippet_rules`, auth, { rules });
}

/** Plan for reconciling snippet rules — pure and unit-testable. */
export interface SnippetRulesPlan {
  /** The full rules array to PUT: foreign rules verbatim + Levi rules in order. */
  rules: SnippetRule[];
  /** True when the PUT can be skipped (live already matches). */
  unchanged: boolean;
  foreignCount: number;
}

/**
 * Build the reconciled snippet rules array: foreign rules round-tripped
 * verbatim (order preserved, first), Levi rules appended in declaration
 * order.
 */
export function planSnippetRulesSync(
  live: SnippetRule[],
  desired: ManifestSnippet[],
): SnippetRulesPlan {
  const isLevi = (r: SnippetRule) =>
    (r.description ?? "").startsWith(LEVI_TAG_PREFIX);

  const foreign = live.filter((r) => !isLevi(r));
  const liveLevi = live.filter(isLevi);

  const desiredRules: SnippetRule[] = desired.map((s) => ({
    description: leviTag(s.leviName),
    expression: s.expression,
    snippet_name: s.snippetName,
    enabled: s.enabled,
  }));

  // Preserve IDs of surviving Levi rules so the PUT is an update, not a churn
  const liveByDesc = new Map(liveLevi.map((r) => [r.description ?? "", r]));
  for (const rule of desiredRules) {
    const match = liveByDesc.get(rule.description!);
    if (match?.id) rule.id = match.id;
  }

  const rules = [...foreign, ...desiredRules];

  const key = (r: SnippetRule) =>
    JSON.stringify([r.description ?? "", r.expression, r.snippet_name, r.enabled ?? true]);
  const unchanged =
    live.length === rules.length &&
    live.map(key).join("|") === rules.map(key).join("|");

  return { rules, unchanged, foreignCount: foreign.length };
}

/** Result of syncing a zone's snippets. */
export interface SnippetSyncResult {
  uploaded: string[];
  deleted: string[];
  rulesUpdated: boolean;
  foreignRules: number;
}

/**
 * Sync a zone's snippets: upload modules, reconcile snippet rules, and
 * delete Levi-owned snippets (`levi_<app>_` prefix) absent from the
 * manifest. Foreign snippets are never touched.
 */
export async function syncSnippets(
  zoneId: string,
  appName: string,
  desired: ManifestSnippet[],
  basePath: string,
  auth: CloudflareAuth,
  { dryRun = false }: { dryRun?: boolean } = {},
): Promise<SnippetSyncResult> {
  const result: SnippetSyncResult = {
    uploaded: [],
    deleted: [],
    rulesUpdated: false,
    foreignRules: 0,
  };

  // Upload each desired snippet module
  for (const snippet of desired) {
    if (!dryRun) {
      const path = resolve(basePath, snippet.entrypoint);
      const code = readFileSync(path, "utf-8");
      await putSnippet(zoneId, snippet.snippetName, basename(path), code, auth);
    }
    result.uploaded.push(snippet.snippetName);
  }

  // Reconcile snippet rules (full-replace — foreign rules round-tripped)
  const liveRules = await getSnippetRules(zoneId, auth);
  const plan = planSnippetRulesSync(liveRules, desired);
  result.foreignRules = plan.foreignCount;
  if (!plan.unchanged && !dryRun) {
    await putSnippetRules(zoneId, plan.rules, auth);
    result.rulesUpdated = true;
  }

  // Delete Levi-owned snippets no longer in the manifest
  const prefix = `levi_${appName.toLowerCase().replace(/[^a-z0-9_]/g, "_")}_`;
  const desiredNames = new Set(desired.map((s) => s.snippetName));
  const existing = await listSnippets(zoneId, auth);
  for (const s of existing) {
    if (s.snippet_name.startsWith(prefix) && !desiredNames.has(s.snippet_name)) {
      if (!dryRun) await deleteSnippet(zoneId, s.snippet_name, auth);
      result.deleted.push(s.snippet_name);
    }
  }

  return result;
}
