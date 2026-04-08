import type { ResourceType, R2Options } from "../types/index.js";
import { Resource } from "./base.js";

/**
 * A Cloudflare R2 object storage bucket resource.
 *
 * R2 is S3-compatible object storage with zero egress fees,
 * accessible from Workers via bindings.
 */
export class R2Resource extends Resource<R2Options> {
  readonly type: ResourceType = "r2";
}
