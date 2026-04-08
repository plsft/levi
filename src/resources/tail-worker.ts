import type { ResourceType } from "../types/index.js";
import { Resource } from "./base.js";

/** Configuration options for a tail worker. */
export interface TailWorkerOptions {
  /** The entrypoint script for the tail worker. */
  entrypoint: string;
  /** Optional bindings to other resources. */
  bindings?: Record<string, Resource>;
}

/**
 * A Cloudflare Tail Worker resource.
 *
 * Tail Workers receive log and trace data from other Workers,
 * enabling custom logging, alerting, and observability pipelines.
 */
export class TailWorkerResource extends Resource<TailWorkerOptions> {
  readonly type: ResourceType = "tail-worker";

  constructor(name: string, options: TailWorkerOptions) {
    super(name, options);
    this.collectBindingDependencies();
  }

  /**
   * Scans the bindings map and automatically adds each bound resource
   * as a dependency of this tail worker.
   */
  private collectBindingDependencies(): void {
    if (!this.options.bindings) return;

    for (const resource of Object.values(this.options.bindings)) {
      if (resource instanceof Resource) {
        this.dependsOn(resource);
      }
    }
  }
}
