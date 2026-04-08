import type { ResourceType } from "../types/index.js";
import { Resource } from "./base.js";

/** Configuration options for a secret reference. */
export interface SecretOptions {
  /** The name of the secret as stored in Cloudflare. */
  secretName: string;
}

/**
 * A secret reference resource.
 *
 * Represents a named secret (e.g. an API key or connection string)
 * that is resolved at deploy time from the Cloudflare secrets store.
 * Used for Hyperdrive connection strings, API tokens, and similar
 * sensitive values.
 */
export class SecretResource extends Resource<SecretOptions> {
  readonly type: ResourceType = "secret";

  /** The name of the secret as stored in Cloudflare. */
  get secretName(): string {
    return this.options.secretName;
  }
}
