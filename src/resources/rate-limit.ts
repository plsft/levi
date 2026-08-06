import type { ResourceType } from "../types/index.js";
import type { RateLimitOptions } from "../types/rate-limit.js";
import { Resource } from "./base.js";

/**
 * Workers rate limiting binding resource — a fast per-colo counter with
 * a `limit({ key })` API. Counters sharing a namespace ID are shared
 * across Workers.
 */
export class RateLimitResource extends Resource<RateLimitOptions> {
  constructor(name: string, options: RateLimitOptions) {
    if (options.period !== 10 && options.period !== 60) {
      throw new Error(
        `Rate limit "${name}": period must be 10 or 60 seconds (got ${options.period}).`,
      );
    }
    if (options.namespaceId !== undefined && !/^\d+$/.test(options.namespaceId)) {
      throw new Error(
        `Rate limit "${name}": namespaceId must be a string of digits (got "${options.namespaceId}").`,
      );
    }
    super(name, options);
  }

  readonly type: ResourceType = "rate-limit";
}
