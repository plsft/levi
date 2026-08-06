/**
 * Types for Workers for Platforms dispatch namespaces.
 *
 * @module
 */

/**
 * Outbound Worker configuration for a dispatch namespace.
 *
 * An outbound Worker intercepts `fetch()` calls made by user Workers in
 * the namespace — the platform's egress control point.
 *
 * @see https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/configuration/outbound-workers/
 */
export interface DispatchNamespaceOutbound {
  /**
   * The outbound Worker: a Levi `WorkerResource` (preferred — adds a
   * dependency edge so it deploys first) or a raw service name.
   */
  service: string | { readonly name: string };

  /**
   * Names of parameters passed from the dispatch Worker to the
   * outbound Worker.
   *
   * @example ["customer_id"]
   */
  parameters?: string[];
}

/**
 * Options for a Workers for Platforms dispatch namespace.
 *
 * Dispatch namespaces let you run untrusted, user-uploaded Workers at
 * scale — the multi-tenant SaaS platform primitive. Your dispatch
 * (router) Worker binds to the namespace and calls
 * `env.DISPATCH.get(scriptName)` to route requests to tenant Workers.
 *
 * Requires a Workers for Platforms subscription.
 *
 * @see https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/
 *
 * @example
 * ```ts
 * const tenants = app.addDispatchNamespace("customers-prod");
 * app.addWorker("router", {
 *   entrypoint: "./src/router.ts",
 *   bindings: { DISPATCH: tenants },
 * });
 * ```
 */
export interface DispatchNamespaceOptions {
  /**
   * The Cloudflare namespace name.
   *
   * @default the resource name
   */
  namespace?: string;

  /** Outbound Worker that intercepts egress from tenant Workers. */
  outbound?: DispatchNamespaceOutbound;

  /**
   * Connect to the remote namespace during `wrangler dev`.
   */
  remote?: boolean;
}
