/**
 * Type definitions for Cloudflare Queues in Levi.
 *
 * Queues provide reliable, at-least-once message delivery between
 * Workers. Levi manages queue provisioning, producer bindings, and
 * consumer configuration.
 *
 * @module
 * @see https://developers.cloudflare.com/queues/
 */

// ---------------------------------------------------------------------------
// Queue Options
// ---------------------------------------------------------------------------

/**
 * Configuration options for a Cloudflare Queue.
 *
 * Passed to `app.addQueue()` to declare a queue in the app graph.
 * The queue acts as a producer binding; consumers are declared on the
 * Worker side via `consumers` in {@link import("./worker.js").WorkerOptions}.
 *
 * @example
 * ```ts
 * const jobQueue = app.addQueue("background-jobs", {
 *   deliveryDelay: 0,
 *   retries: 3,
 *   deadLetterQueue: "background-jobs-dlq",
 * });
 * ```
 */
export interface QueueOptions {
  /**
   * Default delivery delay in seconds for messages sent to this queue.
   *
   * When set, messages are held for this duration before becoming
   * visible to consumers. Individual messages can override this at
   * send time.
   *
   * @default 0
   * @minimum 0
   * @maximum 43200 — 12 hours
   * @see https://developers.cloudflare.com/queues/configuration/delivery-delay/
   */
  deliveryDelay?: number;

  /**
   * Maximum number of times a message is retried after a consumer fails
   * to process it.
   *
   * After exhausting retries, the message is either discarded or sent
   * to the dead-letter queue (if configured).
   *
   * @default 3
   * @minimum 0
   * @maximum 100
   */
  retries?: number;

  /**
   * Name of a dead-letter queue that receives messages which have
   * exhausted all retries.
   *
   * This should be the name of another queue declared via `app.addQueue()`.
   * Levi validates that the referenced queue exists in the app graph.
   *
   * @example "background-jobs-dlq"
   */
  deadLetterQueue?: string;

  /**
   * Existing queue ID to bind to.
   *
   * When set, Levi skips provisioning and binds directly to this
   * existing queue. The queue must exist in the configured account.
   *
   * @example "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
   */
  queueId?: string;
}
