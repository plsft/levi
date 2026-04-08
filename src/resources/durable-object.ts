import type { ResourceType, DurableObjectOptions } from "../types/index.js";
import { Resource } from "./base.js";

/**
 * A Cloudflare Durable Object resource.
 *
 * Durable Objects provide strongly consistent, single-threaded
 * compute with co-located storage, ideal for coordination and
 * stateful logic.
 */
export class DurableObjectResource extends Resource<DurableObjectOptions> {
  readonly type: ResourceType = "durable-object";
}
