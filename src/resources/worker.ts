import type { ResourceType, WorkerOptions, WorkerFramework } from "../types/index.js";
import { Resource, ServiceBindingRef } from "./base.js";

/**
 * A Cloudflare Worker resource.
 *
 * Workers are the primary compute primitive. They can reference other
 * resources via bindings and expose themselves as service bindings
 * for inter-worker communication.
 */
export class WorkerResource extends Resource<WorkerOptions> {
  readonly type: ResourceType = "worker";

  /** The detected or configured framework for this worker. */
  get framework(): WorkerFramework | undefined {
    return this.options.framework;
  }

  constructor(name: string, options: WorkerOptions) {
    super(name, options);
    this.collectBindingDependencies();
  }

  /**
   * Returns a {@link ServiceBindingRef} that other workers can use
   * to bind to this worker via the service bindings API.
   */
  asService(): ServiceBindingRef {
    return new ServiceBindingRef(this.name, this);
  }

  /** Whether this worker uses the Vinext framework. */
  isVinext(): boolean {
    return this.options.framework === "vinext";
  }

  /** Whether this worker uses the TanStack SPA framework. */
  isTanstack(): boolean {
    return this.options.framework === "tanstack";
  }

  /**
   * Scans the bindings map and automatically adds each bound resource
   * as a dependency of this worker.
   */
  private collectBindingDependencies(): void {
    if (this.options.bindings) {
      for (const resource of Object.values(this.options.bindings)) {
        if (resource instanceof Resource) {
          this.dependsOn(resource);
        } else if (resource instanceof ServiceBindingRef && resource.source) {
          this.dependsOn(resource.source);
        }
      }
    }

    // Tail workers referenced as resources must deploy before this worker
    if (this.options.tailConsumers) {
      for (const t of this.options.tailConsumers) {
        if (typeof t !== "string" && t instanceof Resource) {
          this.dependsOn(t);
        }
      }
    }

    if (this.options.consumers) {
      for (const consumer of this.options.consumers) {
        if (consumer.queue && typeof consumer.queue === "object" && "name" in consumer.queue) {
          this.dependsOn(consumer.queue as any);
        }
        if (consumer.deadLetterQueue && typeof consumer.deadLetterQueue === "object" && "name" in consumer.deadLetterQueue) {
          this.dependsOn(consumer.deadLetterQueue as any);
        }
      }
    }
  }
}
