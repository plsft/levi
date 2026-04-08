/**
 * Type definitions for Cloudflare R2 object storage in Levi.
 *
 * R2 is Cloudflare's S3-compatible object storage with zero egress fees.
 * Levi manages R2 bucket provisioning, CORS configuration, lifecycle
 * rules, and binding generation.
 *
 * @module
 * @see https://developers.cloudflare.com/r2/
 */

// ---------------------------------------------------------------------------
// Lifecycle Rules
// ---------------------------------------------------------------------------

/**
 * An R2 lifecycle rule that automatically manages objects based on age
 * or prefix.
 *
 * Lifecycle rules run daily and can expire or transition objects.
 *
 * @see https://developers.cloudflare.com/r2/buckets/object-lifecycles/
 */
export interface R2LifecycleRule {
  /**
   * Optional prefix filter. When set, the rule only applies to objects
   * whose key starts with this prefix.
   *
   * @example "uploads/temp/"
   * @example "logs/"
   */
  prefix?: string;

  /**
   * Expiration settings for matching objects.
   */
  expiration?: {
    /**
     * Number of days after object creation before it is automatically
     * deleted.
     *
     * @minimum 1
     * @example 30 — delete after 30 days
     */
    days: number;
  };

  /**
   * Abort incomplete multipart uploads after a given number of days.
   *
   * Helps reclaim storage from abandoned multipart uploads.
   *
   * @minimum 1
   */
  abortIncompleteMultipartUploadDays?: number;

  /**
   * Transition objects to Infrequent Access storage class after a
   * given number of days.
   *
   * @see https://developers.cloudflare.com/r2/buckets/storage-classes/
   */
  storageClassTransition?: {
    /**
     * Number of days after object creation before transitioning to
     * Infrequent Access.
     *
     * @minimum 1
     */
    days: number;

    /**
     * Target storage class.
     *
     * Currently only `"InfrequentAccess"` is supported.
     */
    storageClass: "InfrequentAccess";
  };
}

// ---------------------------------------------------------------------------
// R2 Options
// ---------------------------------------------------------------------------

/**
 * Configuration options for a Cloudflare R2 bucket.
 *
 * Passed to `app.addR2()` to declare an R2 bucket in the app graph.
 *
 * @example
 * ```ts
 * const uploads = app.addR2("user-uploads", {
 *   allowedOrigins: ["https://acme.com"],
 *   jurisdiction: "eu",
 *   lifecycleRules: [
 *     { prefix: "temp/", expiration: { days: 7 } },
 *   ],
 * });
 * ```
 */
export interface R2Options {
  /**
   * CORS allowed origins for direct browser uploads to this bucket.
   *
   * When set, Levi configures CORS rules on the bucket to allow
   * requests from these origins. Useful for presigned URL uploads.
   *
   * @example ["https://acme.com", "https://staging.acme.com"]
   */
  allowedOrigins?: string[];

  /**
   * Jurisdiction restriction for data storage.
   *
   * When set, all objects in this bucket are guaranteed to be stored
   * only within the specified jurisdiction. This is important for
   * data residency compliance (e.g., GDPR).
   *
   * @see https://developers.cloudflare.com/r2/reference/data-location/#jurisdictional-restrictions
   * @example "eu" — European Union only
   */
  jurisdiction?: string;

  /**
   * Lifecycle rules for automatic object management.
   *
   * Rules are evaluated daily and can expire objects, abort incomplete
   * multipart uploads, or transition objects to different storage classes.
   */
  lifecycleRules?: R2LifecycleRule[];

  /**
   * Existing R2 bucket name to bind to.
   *
   * When set, Levi skips provisioning and binds directly to this
   * existing bucket. The bucket must exist in the configured account.
   */
  bucketName?: string;

  /**
   * Location hint for the R2 bucket.
   *
   * Suggests a preferred region for the bucket's primary storage.
   *
   * @see https://developers.cloudflare.com/r2/reference/data-location/
   * @example "weur" — Western Europe
   * @example "enam" — Eastern North America
   * @example "apac" — Asia Pacific
   */
  locationHint?: string;

  /**
   * Enable public access to this bucket via an R2 custom domain or
   * the `r2.dev` subdomain.
   *
   * When enabled, objects can be accessed via HTTP GET without
   * authentication. Use with caution.
   *
   * @default false
   */
  publicAccess?: boolean;
}
