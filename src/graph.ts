import type { ResourceType } from "./types/index.js";
import { Resource } from "./resources/base.js";
import { WorkerResource } from "./resources/worker.js";

/**
 * The application dependency graph (DAG).
 *
 * Nodes are Cloudflare resources, edges are dependency relationships
 * (e.g., Worker A depends on D1 B because it has a binding to it).
 *
 * The graph is used to:
 * - Validate there are no circular dependencies
 * - Determine deployment order via topological sort
 * - Query resources by type for config generation
 * - Serialize the topology for `.levi/graph.json`
 */
export class AppGraph {
  /** All resources keyed by their unique name (internal). */
  private _nodeMap: Map<string, Resource> = new Map();

  /** Adjacency list: resource name -> set of dependency names (internal). */
  private _edgeMap: Map<string, Set<string>> = new Map();

  /**
   * All resources as an array.
   *
   * CLI commands use this for filtering and iteration.
   */
  get nodes(): Resource[] {
    return Array.from(this._nodeMap.values());
  }

  /**
   * All edges as a map of resource name -> set of dependency names.
   *
   * Exposed for the graph visualization CLI command.
   */
  get edges(): Map<string, Set<string>> {
    return this._edgeMap;
  }

  // ─── Mutation ────────────────────────────────────────────────

  /**
   * Add a resource to the graph.
   *
   * If the resource declares dependencies (via {@link Resource.dependencies}),
   * edges are added automatically. Throws if a resource with the same name
   * already exists.
   */
  add(resource: Resource): void {
    if (this._nodeMap.has(resource.name)) {
      throw new Error(
        `Duplicate resource name "${resource.name}". ` +
          `Every resource in a Levi app must have a unique name.`,
      );
    }

    this._nodeMap.set(resource.name, resource);
    this._edgeMap.set(resource.name, new Set());

    // Wire up any dependencies already declared on the resource
    for (const dep of resource.dependencies) {
      this.addEdge(resource.name, dep.name);
    }
  }

  /**
   * Add a directed edge: `from` depends on `to`.
   *
   * Both resources must already be in the graph, or the edge is stored
   * and validated lazily during {@link validate}.
   */
  addEdge(from: string, to: string): void {
    let deps = this._edgeMap.get(from);
    if (!deps) {
      deps = new Set();
      this._edgeMap.set(from, deps);
    }
    deps.add(to);
  }

  // ─── Queries ─────────────────────────────────────────────────

  /**
   * Get the direct dependencies of a resource by name.
   */
  getDependencies(name: string): Resource[] {
    const deps = this._edgeMap.get(name);
    if (!deps) return [];

    const result: Resource[] = [];
    for (const depName of deps) {
      const resource = this._nodeMap.get(depName);
      if (resource) {
        result.push(resource);
      }
    }
    return result;
  }

  /**
   * Get a resource by name, or `undefined` if not found.
   */
  get(name: string): Resource | undefined {
    return this._nodeMap.get(name);
  }

  /**
   * Get all resources in the graph (insertion order).
   */
  all(): Resource[] {
    return Array.from(this._nodeMap.values());
  }

  /**
   * Get all resources of a specific type.
   *
   * @typeParam T - The concrete resource class to cast results to.
   * @param type - The {@link ResourceType} discriminant to filter by.
   */
  getByType<T extends Resource>(type: ResourceType): T[] {
    const result: T[] = [];
    for (const resource of this._nodeMap.values()) {
      if (resource.type === type) {
        result.push(resource as T);
      }
    }
    return result;
  }

  /**
   * Get all worker resources in the graph.
   */
  getWorkers(): WorkerResource[] {
    return this.getByType<WorkerResource>("worker");
  }

  /** Number of resources in the graph. */
  get size(): number {
    return this._nodeMap.size;
  }

  // ─── Validation ──────────────────────────────────────────────

  /**
   * Validate the graph:
   * 1. Every dependency edge points to a resource that exists in the graph.
   * 2. There are no circular dependencies.
   *
   * @throws {Error} If a dangling dependency or cycle is detected.
   */
  validate(): void {
    // Check for dangling dependencies
    for (const [name, deps] of this.edges) {
      for (const dep of deps) {
        if (!this._nodeMap.has(dep)) {
          throw new Error(
            `Resource "${name}" depends on "${dep}", which is not in the graph. ` +
              `Did you forget to add it with app.add*()?`,
          );
        }
      }
    }

    // Detect cycles using Kahn's algorithm (same as topologicalSort but
    // we throw on cycle detection rather than returning the order).
    this.topologicalSort();
  }

  // ─── Topological Sort ────────────────────────────────────────

  /**
   * Return all resources in dependency order (topological sort).
   *
   * Resources with no dependencies come first. If resource A depends on
   * resource B, B appears before A in the returned array.
   *
   * Uses Kahn's algorithm (BFS-based) for cycle detection.
   *
   * @throws {Error} If a circular dependency is found.
   */
  topologicalSort(): Resource[] {
    // Build in-degree map
    const inDegree = new Map<string, number>();
    for (const name of this._nodeMap.keys()) {
      inDegree.set(name, 0);
    }
    for (const [, deps] of this.edges) {
      for (const dep of deps) {
        if (this._nodeMap.has(dep)) {
          // dep is depended upon, but in-degree counts incoming edges
          // For topological sort: if A depends on B, edge is A -> B
          // B should come first. In-degree of A gets incremented for each dep.
        }
      }
    }
    // A depends on B means B must come first. We model edges as:
    // edges[A] = {B} meaning A -> B (A needs B).
    // In a topological sort, this means B before A.
    // So the "reverse" adjacency: B is a prerequisite for A.
    // In-degree of A = number of deps A has.
    for (const [name, deps] of this.edges) {
      inDegree.set(name, deps.size);
    }

    // Seed the queue with resources that have zero in-degree (no deps)
    const queue: string[] = [];
    for (const [name, degree] of inDegree) {
      if (degree === 0) {
        queue.push(name);
      }
    }

    // Build reverse adjacency: for each dep, which resources depend on it?
    const dependents = new Map<string, string[]>();
    for (const [name, deps] of this.edges) {
      for (const dep of deps) {
        let list = dependents.get(dep);
        if (!list) {
          list = [];
          dependents.set(dep, list);
        }
        list.push(name);
      }
    }

    const sorted: Resource[] = [];

    while (queue.length > 0) {
      const name = queue.shift()!;
      const resource = this._nodeMap.get(name);
      if (resource) {
        sorted.push(resource);
      }

      // For every resource that depends on `name`, decrement in-degree
      const deps = dependents.get(name);
      if (deps) {
        for (const dependent of deps) {
          const newDegree = (inDegree.get(dependent) ?? 1) - 1;
          inDegree.set(dependent, newDegree);
          if (newDegree === 0) {
            queue.push(dependent);
          }
        }
      }
    }

    if (sorted.length !== this._nodeMap.size) {
      // Find the cycle for a helpful error message
      const remaining = new Set<string>();
      for (const [name] of this._nodeMap) {
        if (!sorted.some((r) => r.name === name)) {
          remaining.add(name);
        }
      }

      throw new Error(
        `Circular dependency detected involving: ${Array.from(remaining).join(", ")}. ` +
          `Levi requires an acyclic resource graph.`,
      );
    }

    return sorted;
  }

  // ─── Serialization ───────────────────────────────────────────

  /**
   * Serialize the graph to a JSON-safe object suitable for writing to
   * `.levi/graph.json`.
   *
   * The output includes every resource as a node with its type, name,
   * and list of dependency names.
   */
  serialize(): object {
    const nodes: Array<{ type: string; name: string; dependencies: string[] }> = [];

    for (const resource of this._nodeMap.values()) {
      nodes.push(resource.toGraphNode());
    }

    return {
      version: 1,
      resources: nodes,
      edges: Object.fromEntries(
        Array.from(this._edgeMap.entries()).map(([name, deps]) => [
          name,
          Array.from(deps),
        ]),
      ),
    };
  }
}
