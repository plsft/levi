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
    return new ServiceBindingRef(this.name);
  }

  /** Whether this worker uses the Vinext framework. */
  isVinext(): boolean {
    return this.options.framework === "vinext";
  }

  /**
   * Scans the bindings map and automatically adds each bound resource
   * as a dependency of this worker.
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
