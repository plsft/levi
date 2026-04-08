/**
 * Type definitions for Cloudflare custom domain configuration in Levi.
 *
 * Domains in Levi represent custom domains assigned to Workers. Levi
 * generates the appropriate route/custom domain configuration and can
 * provision DNS records and SSL settings via the Cloudflare API.
 *
 * @module
 * @see https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
 * @see https://developers.cloudflare.com/ssl/
 */

// ---------------------------------------------------------------------------
// SSL Mode
// ---------------------------------------------------------------------------

/**
 * SSL/TLS encryption mode for a custom domain.
 *
 * Controls how Cloudflare handles encryption between visitors and
 * your origin (Worker).
 *
 * - `"off"` — No encryption. Not recommended.
 * - `"flexible"` — Encrypts visitor-to-Cloudflare traffic only.
 *   Origin traffic is unencrypted.
 * - `"full"` — Encrypts all traffic. Origin can use a self-signed cert.
 * - `"full_strict"` — Encrypts all traffic. Origin must use a valid
 *   (CA-signed or Cloudflare Origin CA) certificate.
 *
 * @see https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/
 */
export type SSLMode = "off" | "flexible" | "full" | "full_strict";

// ---------------------------------------------------------------------------
// Domain Options
// ---------------------------------------------------------------------------

/**
 * Configuration options for a custom domain.
 *
 * Passed to `app.addDomain()` to declare a custom domain in the app graph.
 *
 * @example
 * ```ts
 * app.addDomain("acme.com", {
 *   ssl: "full_strict",
 *   redirectWww: true,
 * });
 *
 * app.addDomain("api.acme.com", {
 *   ssl: "full_strict",
 * });
 * ```
 */
export interface DomainOptions {
  /**
   * SSL/TLS encryption mode for this domain.
   *
   * Determines how traffic between visitors, Cloudflare, and the
   * Worker origin is encrypted.
   *
   * @default "full_strict"
   */
  ssl?: SSLMode;

  /**
   * Automatically redirect `www` to the apex domain (or vice versa).
   *
   * When `true` and the domain is `acme.com`, Levi creates a redirect
   * rule so that `www.acme.com` requests are 301-redirected to
   * `acme.com`.
   *
   * @default false
   */
  redirectWww?: boolean;

  /**
   * Configure this domain as a Cloudflare for SaaS custom hostname.
   *
   * When `true`, the domain is provisioned as a custom hostname under
   * Cloudflare for SaaS, allowing your platform's customers to use
   * their own domains.
   *
   * @default false
   * @see https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/
   */
  customHostname?: boolean;

  /**
   * Zone ID of the Cloudflare zone that owns this domain.
   *
   * When omitted, Levi attempts to auto-detect the zone from the
   * account's zones list. Set this explicitly if auto-detection fails
   * or for faster provisioning.
   *
   * @example "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   */
  zoneId?: string;

  /**
   * Automatically provision DNS records for this domain.
   *
   * When `true`, `levi provision` creates the necessary CNAME or A
   * records pointing to the Worker. When `false`, DNS must be
   * configured manually.
   *
   * @default true
   */
  autoDns?: boolean;

  /**
   * Enable Always Use HTTPS for this domain.
   *
   * When `true`, all HTTP requests are automatically redirected to HTTPS.
   *
   * @default true
   * @see https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/
   */
  alwaysUseHttps?: boolean;

  /**
   * Minimum TLS version allowed for this domain.
   *
   * @default "1.2"
   * @see https://developers.cloudflare.com/ssl/edge-certificates/additional-options/minimum-tls/
   */
  minTlsVersion?: "1.0" | "1.1" | "1.2" | "1.3";
}
