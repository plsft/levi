import type { ResourceType } from "../types/index.js";
import type { SecretsStoreSecretOptions } from "../types/secrets-store.js";
import { Resource } from "./base.js";

/**
 * Secrets Store secret resource — an account-level secret shared across
 * Workers, read at runtime via `await env.BINDING.get()`.
 */
export class SecretsStoreSecretResource extends Resource<SecretsStoreSecretOptions> {
  readonly type: ResourceType = "secrets-store-secret";
}
