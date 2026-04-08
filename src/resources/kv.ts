import type { ResourceType, KVOptions } from "../types/index.js";
import { Resource } from "./base.js";

/**
 * A Cloudflare Workers KV namespace resource.
 *
 * KV provides a global, low-latency key-value store accessible
 * from Workers via bindings.
 */
export class KVResource extends Resource<KVOptions> {
  readonly type: ResourceType = "kv";
}
