import type { ResourceType } from "../types/index.js";
import { Resource } from "./base.js";

/** Configuration options for an mTLS certificate. */
export interface MTLSOptions {
  /** The ID of the uploaded mTLS certificate. */
  certificateId: string;
}

/**
 * A Cloudflare mTLS certificate resource.
 *
 * Represents a mutual TLS certificate used for authenticating
 * outbound requests from Workers to origin servers that require
 * client certificates.
 */
export class MTLSResource extends Resource<MTLSOptions> {
  readonly type: ResourceType = "mtls";
}
