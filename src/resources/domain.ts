import type { ResourceType, DomainOptions } from "../types/index.js";
import { Resource } from "./base.js";

/**
 * A custom domain resource.
 *
 * Represents a domain or subdomain that can be routed to a Worker,
 * enabling custom hostnames for worker-based applications.
 */
export class DomainResource extends Resource<DomainOptions> {
  readonly type: ResourceType = "domain";
}
