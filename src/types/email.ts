/**
 * Types for Cloudflare Email bindings (send_email) and Email Routing.
 *
 * @module
 */

/**
 * Options for an Email sending binding.
 *
 * The `send_email` binding lets a Worker send email via Cloudflare Email
 * Routing to verified destination addresses. `levi provision` can enable
 * Email Routing on the zone and register destination addresses (each
 * address then receives a one-time verification email).
 *
 * The two restriction modes are mutually exclusive: set either
 * `destinationAddress` (single allowed destination) or
 * `allowedDestinationAddresses` (allowlist), or neither (unrestricted —
 * any verified destination).
 *
 * @see https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/
 *
 * @example
 * ```ts
 * const notify = app.addEmail("ops-notify", {
 *   destinationAddress: "ops@example.com",
 *   zone: "example.com",
 * });
 * app.addWorker("api", {
 *   entrypoint: "./src/index.ts",
 *   bindings: { NOTIFY: notify },
 * });
 * ```
 */
export interface EmailOptions {
  /** Restrict sending to a single verified destination address. */
  destinationAddress?: string;

  /** Restrict sending to an allowlist of verified destination addresses. */
  allowedDestinationAddresses?: string[];

  /** Restrict which sender addresses this binding may use. */
  allowedSenderAddresses?: string[];

  /**
   * Use the real Email Routing API during `wrangler dev` instead of the
   * local simulator.
   */
  remote?: boolean;

  /**
   * Zone (domain) to enable Email Routing on during `levi provision`.
   * Falls back to the app's `defaultZone`.
   */
  zone?: string;
}
