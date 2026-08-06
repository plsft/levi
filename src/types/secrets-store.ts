/**
 * Types for Cloudflare Secrets Store bindings.
 *
 * @module
 */

/**
 * Options for a Secrets Store secret binding.
 *
 * The Secrets Store holds account-level secrets that can be shared
 * across Workers. The binding exposes a single secret to a Worker via
 * `await env.BINDING.get()`.
 *
 * Secret *values* are never written to config; set them with
 * `wrangler secrets-store secret create` after `levi provision` creates
 * the store.
 *
 * @see https://developers.cloudflare.com/secrets-store/
 *
 * @example
 * ```ts
 * const stripeKey = app.addSecretsStoreSecret("stripe-api-key");
 * app.addWorker("billing", {
 *   entrypoint: "./src/index.ts",
 *   bindings: { STRIPE_KEY: stripeKey },
 * });
 * ```
 */
export interface SecretsStoreSecretOptions {
  /**
   * The secret name inside the store.
   *
   * @default the resource name
   */
  secretName?: string;

  /**
   * The store ID (32-char hex). If omitted, `levi provision` creates the
   * store (or finds the existing one) and patches the ID into the
   * generated config.
   */
  storeId?: string;

  /**
   * The store name used when provisioning creates the store.
   * Note: during the Secrets Store beta, accounts are limited to one store.
   *
   * @default "default"
   */
  storeName?: string;
}
