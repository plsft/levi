import type { ResourceType, QueueOptions } from "../types/index.js";
import { Resource } from "./base.js";

/**
 * A Cloudflare Queue resource.
 *
 * Queues enable asynchronous message passing between Workers,
 * supporting reliable at-least-once delivery.
 */
export class QueueResource extends Resource<QueueOptions> {
  readonly type: ResourceType = "queue";
}
