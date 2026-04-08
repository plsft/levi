/**
 * Type definitions for Cloudflare Containers in Levi.
 *
 * Containers run Docker images alongside Workers via Durable Objects,
 * enabling containerized workloads on the Cloudflare network.
 *
 * @beta Cloudflare Containers is in open beta.
 * @module
 * @see https://developers.cloudflare.com/containers/
 */

// ---------------------------------------------------------------------------
// Container Instance Type
// ---------------------------------------------------------------------------

/**
 * Instance type for a Cloudflare Container.
 * Predefined: "lite" | "basic" | "standard-1" | "standard-2" | "standard-3" | "standard-4"
 * Or custom: { vcpu: number; memory_mib: number; disk_mb: number }
 * @beta
 */
export type ContainerInstanceType =
  | "lite" | "basic" | "standard-1" | "standard-2" | "standard-3" | "standard-4"
  | { vcpu: number; memory_mib: number; disk_mb: number };

// ---------------------------------------------------------------------------
// Container Options
// ---------------------------------------------------------------------------

/**
 * Configuration options for a Cloudflare Container.
 *
 * Passed to `app.addContainer()` to declare a Container in the app graph.
 * Containers are backed by Durable Objects and run Docker images alongside
 * Workers.
 *
 * @beta Cloudflare Containers is in open beta.
 *
 * @example
 * ```ts
 * const container = app.addContainer("my-container", {
 *   image: "./Dockerfile",
 *   className: "MyContainer",
 *   instanceType: "basic",
 *   maxInstances: 10,
 * });
 * ```
 */
export interface ContainerOptions {
  /** Path to Dockerfile or fully qualified image reference. */
  image: string;

  /** Durable Object class name that backs this container. */
  className: string;

  /** Instance type — predefined tier or custom resources. @default "lite" */
  instanceType?: ContainerInstanceType;

  /** Maximum concurrent container instances. @default 20 */
  maxInstances?: number;

  /** Build context directory (for Dockerfile builds). */
  buildContext?: string;

  /** Build-time variables (docker build --build-arg). */
  buildArgs?: Record<string, string>;

  /** Enable internet access from the container. @default false */
  enableInternet?: boolean;

  /** Default port for fetch communication. */
  defaultPort?: number;

  /** Inactivity timeout before sleep (e.g., "10m", "30s"). @default "10m" */
  sleepAfter?: string;
}
