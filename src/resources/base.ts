import type { ResourceType } from "../types/index.js";

/**
 * Reference to a worker as a service binding, used by other workers
 * to communicate with this worker via the service bindings API.
 */
export class ServiceBindingRef {
  /** The source worker resource that created this ref. */
  readonly source?: Resource;

  constructor(
    public readonly workerName: string,
    source?: Resource,
  ) {
    this.source = source;
  }
}

/**
 * Abstract base class for all Levi resources.
 *
 * Each resource represents a node in the application dependency graph.
 * Resources have a type, a unique name, configuration options, and can
 * declare dependencies on other resources.
 */
export abstract class Resource<TOptions = unknown> {
  /** The resource type identifier (e.g. "worker", "d1", "kv"). */
  abstract readonly type: ResourceType;

  /** Unique name for this resource within the application graph. */
  readonly name: string;

  /** Configuration options for this resource. */
  readonly options: TOptions;

  /** Set of resources that this resource depends on. */
  readonly dependencies: Set<Resource> = new Set();

  constructor(name: string, options: TOptions) {
    this.name = name;
    this.options = options;
  }

  /** Add a dependency — this resource depends on `other`. */
  dependsOn(other: Resource): this {
    this.dependencies.add(other);
    return this;
  }

  /** Return a serializable descriptor for the dependency graph. */
  toGraphNode(): { type: string; name: string; dependencies: string[] } {
    return {
      type: this.type,
      name: this.name,
      dependencies: Array.from(this.dependencies).map((dep) => dep.name),
    };
  }
}
