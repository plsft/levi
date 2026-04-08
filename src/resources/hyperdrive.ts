import type { ResourceType, HyperdriveOptions } from "../types/index.js";
import { Resource } from "./base.js";

/**
 * A Cloudflare Hyperdrive resource.
 *
 * Hyperdrive accelerates access to existing regional databases by
 * providing connection pooling and caching at the edge.
 */
export class HyperdriveResource extends Resource<HyperdriveOptions> {
  readonly type: ResourceType = "hyperdrive";
}
