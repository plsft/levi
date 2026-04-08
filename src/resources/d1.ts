import type { ResourceType, D1Options } from "../types/index.js";
import { Resource } from "./base.js";

/**
 * A Cloudflare D1 SQL database resource.
 *
 * D1 is Cloudflare's serverless SQLite database, accessible from
 * Workers via bindings.
 */
export class D1Resource extends Resource<D1Options> {
  readonly type: ResourceType = "d1";
}
