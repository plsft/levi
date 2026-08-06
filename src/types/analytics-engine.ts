/**
 * Types for Workers Analytics Engine datasets.
 *
 * @module
 */

/**
 * Options for an Analytics Engine dataset.
 *
 * Analytics Engine provides unlimited-cardinality analytics at scale via
 * a `writeDataPoint()` binding in your Worker. Datasets are created
 * automatically on first write — nothing needs to be provisioned.
 *
 * @see https://developers.cloudflare.com/analytics/analytics-engine/
 *
 * @example
 * ```ts
 * const metrics = app.addAnalyticsEngine("usage-events", {
 *   dataset: "usage_events",
 * });
 * app.addWorker("api", {
 *   entrypoint: "./src/index.ts",
 *   bindings: { METRICS: metrics },
 * });
 * ```
 */
export interface AnalyticsEngineOptions {
  /**
   * The dataset name to write data points to.
   *
   * Defaults to the resource name, so the dataset stays stable even if
   * you rename the binding key.
   */
  dataset?: string;
}
