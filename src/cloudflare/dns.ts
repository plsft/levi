/**
 * Cloudflare DNS record management.
 *
 * Provides CRUD operations for DNS records via the Cloudflare API.
 * Used by `levi provision` to wire up custom domains declared via
 * `app.addDomain()`.
 *
 * @see https://developers.cloudflare.com/api/resources/dns/subresources/records/
 */

import type { CloudflareAuth } from "./api.js";
import { cfGet, cfPost, cfPatch, cfDelete, cfApi } from "./api.js";

// ── Types ──────────────────────────────────────────────────────

export type DnsRecordType =
  | "A"
  | "AAAA"
  | "CNAME"
  | "TXT"
  | "MX"
  | "NS"
  | "SRV"
  | "CAA"
  | "HTTPS"
  | "SVCB";

export interface DnsRecord {
  id: string;
  type: DnsRecordType;
  name: string;
  content: string;
  ttl: number;
  proxied: boolean;
  comment?: string;
  tags?: string[];
  created_on: string;
  modified_on: string;
}

export interface CreateDnsRecordInput {
  type: DnsRecordType;
  name: string;
  content: string;
  ttl?: number;
  proxied?: boolean;
  comment?: string;
}

export interface UpdateDnsRecordInput {
  type?: DnsRecordType;
  name?: string;
  content?: string;
  ttl?: number;
  proxied?: boolean;
  comment?: string;
}

export interface ZoneInfo {
  id: string;
  name: string;
  status: string;
  name_servers: string[];
}

export type SslMode = "off" | "flexible" | "full" | "strict" | "full_strict";

export interface DnsProvisionResult {
  action: "created" | "updated" | "unchanged";
  record: DnsRecord;
  domain: string;
}

// ── Zone Lookup ────────────────────────────────────────────────

/**
 * Find the zone ID for a given domain.
 *
 * For `api.example.com`, looks up the zone for `example.com`.
 * Walks up the domain hierarchy to find the correct zone.
 */
export async function findZone(
  domain: string,
  auth: CloudflareAuth,
): Promise<ZoneInfo> {
  // Try progressively shorter domain suffixes
  const parts = domain.split(".");
  for (let i = 0; i < parts.length - 1; i++) {
    const zoneName = parts.slice(i).join(".");
    const res = await cfApi<ZoneInfo[]>(
      "GET",
      `/zones?name=${encodeURIComponent(zoneName)}&status=active`,
      auth,
    );
    if (res.result.length > 0) {
      return res.result[0];
    }
  }

  throw new Error(
    `No active Cloudflare zone found for "${domain}". ` +
      "Ensure the domain is added to your Cloudflare account.",
  );
}

// ── DNS Records ────────────────────────────────────────────────

/**
 * List all DNS records for a zone, optionally filtered by name and type.
 */
export async function listDnsRecords(
  zoneId: string,
  auth: CloudflareAuth,
  filters?: { name?: string; type?: DnsRecordType },
): Promise<DnsRecord[]> {
  let path = `/zones/${zoneId}/dns_records`;
  const params = new URLSearchParams();
  if (filters?.name) params.set("name", filters.name);
  if (filters?.type) params.set("type", filters.type);
  const query = params.toString();
  if (query) path += `?${query}`;

  return cfGet<DnsRecord[]>(path, auth);
}

/**
 * Create a new DNS record in a zone.
 */
export async function createDnsRecord(
  zoneId: string,
  input: CreateDnsRecordInput,
  auth: CloudflareAuth,
): Promise<DnsRecord> {
  return cfPost<DnsRecord>(
    `/zones/${zoneId}/dns_records`,
    auth,
    {
      type: input.type,
      name: input.name,
      content: input.content,
      ttl: input.ttl ?? 1, // 1 = automatic
      proxied: input.proxied ?? true,
      comment: input.comment,
    },
  );
}

/**
 * Update an existing DNS record.
 */
export async function updateDnsRecord(
  zoneId: string,
  recordId: string,
  input: UpdateDnsRecordInput,
  auth: CloudflareAuth,
): Promise<DnsRecord> {
  return cfPatch<DnsRecord>(
    `/zones/${zoneId}/dns_records/${recordId}`,
    auth,
    input,
  );
}

/**
 * Delete a DNS record.
 */
export async function deleteDnsRecord(
  zoneId: string,
  recordId: string,
  auth: CloudflareAuth,
): Promise<{ id: string }> {
  return cfDelete<{ id: string }>(
    `/zones/${zoneId}/dns_records/${recordId}`,
    auth,
  );
}

// ── SSL Settings ───────────────────────────────────────────────

/**
 * Get the current SSL/TLS mode for a zone.
 */
export async function getSslMode(
  zoneId: string,
  auth: CloudflareAuth,
): Promise<SslMode> {
  const result = await cfGet<{ value: string }>(
    `/zones/${zoneId}/settings/ssl`,
    auth,
  );
  return result.value as SslMode;
}

/**
 * Set the SSL/TLS mode for a zone.
 */
export async function setSslMode(
  zoneId: string,
  mode: SslMode,
  auth: CloudflareAuth,
): Promise<void> {
  await cfPatch(
    `/zones/${zoneId}/settings/ssl`,
    auth,
    { value: mode === "full_strict" ? "strict" : mode },
  );
}

// ── High-Level Domain Provisioning ─────────────────────────────

/**
 * Provision a domain for a Cloudflare Worker.
 *
 * Creates or updates the DNS record needed to route traffic to a Worker.
 * For Worker routing, we create a proxied AAAA record pointing to `100::`
 * (Cloudflare's reserved address for proxied Workers).
 *
 * @param domain - Full domain (e.g., "api.example.com" or "example.com")
 * @param auth - Cloudflare authentication
 * @param options - SSL mode and other settings
 */
export async function provisionDomain(
  domain: string,
  auth: CloudflareAuth,
  options?: {
    ssl?: "off" | "flexible" | "full" | "full_strict";
    redirectWww?: boolean;
    comment?: string;
  },
): Promise<DnsProvisionResult[]> {
  const zone = await findZone(domain, auth);
  const results: DnsProvisionResult[] = [];

  // ── Main domain record ───────────────────────────────────────
  const mainResult = await ensureDnsRecord(zone.id, {
    type: "AAAA",
    name: domain,
    content: "100::",
    proxied: true,
    comment: options?.comment ?? `Managed by Levi — ${domain}`,
  }, auth);
  results.push({ ...mainResult, domain });

  // ── WWW redirect ─────────────────────────────────────────────
  if (options?.redirectWww) {
    const wwwDomain = domain.startsWith("www.")
      ? domain
      : `www.${domain}`;
    // Only add www record if the main domain is not already www
    if (!domain.startsWith("www.")) {
      const wwwResult = await ensureDnsRecord(zone.id, {
        type: "AAAA",
        name: wwwDomain,
        content: "100::",
        proxied: true,
        comment: `Managed by Levi — www redirect for ${domain}`,
      }, auth);
      results.push({ ...wwwResult, domain: wwwDomain });
    }
  }

  // ── SSL mode ─────────────────────────────────────────────────
  if (options?.ssl) {
    await setSslMode(zone.id, options.ssl as SslMode, auth);
  }

  return results;
}

/**
 * Ensure a DNS record exists with the specified configuration.
 * Creates if missing, updates if different, skips if identical.
 */
async function ensureDnsRecord(
  zoneId: string,
  input: CreateDnsRecordInput,
  auth: CloudflareAuth,
): Promise<{ action: "created" | "updated" | "unchanged"; record: DnsRecord }> {
  // Check for existing record
  const existing = await listDnsRecords(zoneId, auth, {
    name: input.name,
    type: input.type,
  });

  if (existing.length > 0) {
    const record = existing[0];

    // Check if update is needed
    if (
      record.content === input.content &&
      record.proxied === (input.proxied ?? true)
    ) {
      return { action: "unchanged", record };
    }

    // Update existing record
    const updated = await updateDnsRecord(
      zoneId,
      record.id,
      {
        content: input.content,
        proxied: input.proxied ?? true,
        comment: input.comment,
      },
      auth,
    );
    return { action: "updated", record: updated };
  }

  // Create new record
  const created = await createDnsRecord(zoneId, input, auth);
  return { action: "created", record: created };
}

// ── Domain Teardown ────────────────────────────────────────────

/**
 * Remove DNS records managed by Levi for a domain.
 *
 * Only removes records that have the "Managed by Levi" comment to
 * avoid accidentally deleting user-managed records.
 */
export async function teardownDomain(
  domain: string,
  auth: CloudflareAuth,
): Promise<string[]> {
  const zone = await findZone(domain, auth);
  const records = await listDnsRecords(zone.id, auth, { name: domain });

  const removed: string[] = [];
  for (const record of records) {
    if (record.comment?.startsWith("Managed by Levi")) {
      await deleteDnsRecord(zone.id, record.id, auth);
      removed.push(`${record.type} ${record.name} → ${record.content}`);
    }
  }

  return removed;
}
