/**
 * Cloudflare Email Routing provisioning for Levi.
 *
 * Enables Email Routing on a zone and registers destination addresses so
 * that `send_email` bindings can deliver. Addresses require one-time
 * verification by the recipient (Cloudflare sends a verification email).
 *
 * Follows the same conventions as `dns.ts`: idempotent operations, all
 * calls through the `cfApi` helpers, auth failures surfaced to the
 * caller for downgrade-to-warning handling.
 *
 * @module
 */

import type { CloudflareAuth } from "./api.js";
import { cfGet, cfPost } from "./api.js";

/** Zone-level Email Routing settings returned by the API. */
export interface EmailRoutingSettings {
  id?: string;
  enabled: boolean;
  name?: string;
  status?: string;
}

/** An account-level Email Routing destination address. */
export interface DestinationAddress {
  id?: string;
  email: string;
  /** ISO timestamp when verified; null/undefined while pending. */
  verified?: string | null;
}

/** Result of provisioning one destination address. */
export interface EmailProvisionResult {
  email: string;
  action: "created" | "unchanged";
  verified: boolean;
}

/** Get the Email Routing settings for a zone. */
export async function getEmailRoutingSettings(
  zoneId: string,
  auth: CloudflareAuth,
): Promise<EmailRoutingSettings> {
  return cfGet<EmailRoutingSettings>(`/zones/${zoneId}/email/routing`, auth);
}

/** Enable Email Routing on a zone (adds the required MX/SPF DNS records). */
export async function enableEmailRouting(
  zoneId: string,
  auth: CloudflareAuth,
): Promise<EmailRoutingSettings> {
  return cfPost<EmailRoutingSettings>(
    `/zones/${zoneId}/email/routing/enable`,
    auth,
    {},
  );
}

/** List the account's Email Routing destination addresses. */
export async function listDestinationAddresses(
  accountId: string,
  auth: CloudflareAuth,
): Promise<DestinationAddress[]> {
  return cfGet<DestinationAddress[]>(
    `/accounts/${accountId}/email/routing/addresses?per_page=50`,
    auth,
  );
}

/** Create a destination address (triggers a verification email). */
export async function createDestinationAddress(
  accountId: string,
  email: string,
  auth: CloudflareAuth,
): Promise<DestinationAddress> {
  return cfPost<DestinationAddress>(
    `/accounts/${accountId}/email/routing/addresses`,
    auth,
    { email },
  );
}

/**
 * Idempotently ensure Email Routing is enabled on the zone (when given)
 * and every destination address is registered.
 *
 * @param addresses - Destination addresses required by `send_email` bindings.
 * @param zoneId - Zone to enable routing on; skipped when undefined.
 * @param accountId - Cloudflare account ID owning the addresses.
 */
export async function provisionEmail(
  addresses: string[],
  zoneId: string | undefined,
  accountId: string,
  auth: CloudflareAuth,
): Promise<{ routingEnabled: boolean | null; addresses: EmailProvisionResult[] }> {
  let routingEnabled: boolean | null = null;

  if (zoneId) {
    const settings = await getEmailRoutingSettings(zoneId, auth);
    if (!settings.enabled) {
      await enableEmailRouting(zoneId, auth);
      routingEnabled = true;
    } else {
      routingEnabled = false; // already enabled
    }
  }

  const results: EmailProvisionResult[] = [];
  if (addresses.length > 0) {
    const existing = await listDestinationAddresses(accountId, auth);
    const byEmail = new Map(existing.map((a) => [a.email.toLowerCase(), a]));

    for (const email of addresses) {
      const found = byEmail.get(email.toLowerCase());
      if (found) {
        results.push({
          email,
          action: "unchanged",
          verified: Boolean(found.verified),
        });
      } else {
        const created = await createDestinationAddress(accountId, email, auth);
        results.push({
          email,
          action: "created",
          verified: Boolean(created.verified),
        });
      }
    }
  }

  return { routingEnabled, addresses: results };
}
