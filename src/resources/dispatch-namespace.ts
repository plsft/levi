import type { ResourceType } from "../types/index.js";
import type { DispatchNamespaceOptions } from "../types/dispatch-namespace.js";
import { Resource } from "./base.js";

/**
 * Workers for Platforms dispatch namespace resource — runs untrusted,
 * user-uploaded Workers for multi-tenant platforms.
 */
export class DispatchNamespaceResource extends Resource<DispatchNamespaceOptions> {
  constructor(name: string, options: DispatchNamespaceOptions = {}) {
    super(name, options);
    const outbound = options.outbound?.service;
    if (outbound && typeof outbound !== "string" && outbound instanceof Resource) {
      this.dependsOn(outbound);
    }
  }

  readonly type: ResourceType = "dispatch-namespace";

  /** The Cloudflare namespace name (`options.namespace ?? name`). */
  get namespaceName(): string {
    return this.options.namespace ?? this.name;
  }
}
