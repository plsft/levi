/**
 * Type definitions for Cloudflare Workflows in Levi.
 *
 * Workflows provide durable, step-based execution on Cloudflare Workers.
 * Each step is independently retryable and the workflow survives crashes
 * and restarts. Ideal for multi-step processes like order fulfillment,
 * data pipelines, and orchestration.
 *
 * @module
 * @see https://developers.cloudflare.com/workflows/
 */

// ---------------------------------------------------------------------------
// Workflow Options
// ---------------------------------------------------------------------------

/**
 * Configuration options for a Cloudflare Workflow.
 *
 * Passed to `app.addWorkflow()` to declare a Workflow in the app graph.
 * The Workflow class is hosted inside a Worker, similar to Durable Objects.
 *
 * @example
 * ```ts
 * const orderFlow = app.addWorkflow("order-processing", {
 *   className: "OrderWorkflow",
 * });
 *
 * // External workflow reference
 * const externalFlow = app.addWorkflow("external-flow", {
 *   className: "PaymentWorkflow",
 *   scriptName: "payments-worker",
 * });
 * ```
 */
export interface WorkflowOptions {
  /**
   * The exported class name that implements the Workflow.
   *
   * This must match the name of a class exported from a Worker's
   * entrypoint that extends `WorkflowEntrypoint`.
   *
   * @example "OrderWorkflow"
   * @example "DataPipelineWorkflow"
   */
  className: string;

  /**
   * Name of an external Worker script that hosts this Workflow class.
   *
   * When set, the Workflow binding references a class defined in a
   * different Worker (possibly outside of this Levi app). The hosting
   * Worker must export the specified `className`.
   *
   * Omit this to indicate the Workflow is hosted in the Worker that
   * binds to it.
   *
   * @example "payments-worker"
   */
  scriptName?: string;
}
