/**
 * Type definitions for Cloudflare Hyperdrive in Levi.
 *
 * Hyperdrive accelerates access to existing databases by maintaining
 * connection pools close to the database origin and caching query results
 * at the edge. It supports PostgreSQL, MySQL, and any database reachable
 * over TCP.
 *
 * @module
 * @see https://developers.cloudflare.com/hyperdrive/
 */

import type { SecretRef } from "./common.js";

// ---------------------------------------------------------------------------
// Hyperdrive Caching
// ---------------------------------------------------------------------------

/**
 * Caching configuration for a Hyperdrive connection.
 *
 * Hyperdrive can cache query results at the edge to reduce load on
 * the origin database and improve read latency.
 *
 * @see https://developers.cloudflare.com/hyperdrive/configuration/caching/
 */
export interface HyperdriveCachingConfig {
  /**
   * Disable all query result caching.
   *
   * When `true`, every query is forwarded to the origin database.
   * Use this for workloads where stale reads are unacceptable.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Maximum age in seconds for cached query results.
   *
   * After this duration, cached results are evicted and the next
   * matching query fetches fresh data from the origin.
   *
   * @default 60
   * @minimum 1
   */
  maxAge?: number;

  /**
   * Duration in seconds that stale cached results can be served while
   * a background revalidation fetches fresh data.
   *
   * This reduces latency spikes caused by cache misses. Set to `0`
   * to disable stale-while-revalidate behavior.
   *
   * @default 15
   * @minimum 0
   */
  staleWhileRevalidate?: number;
}

// ---------------------------------------------------------------------------
// Hyperdrive Options
// ---------------------------------------------------------------------------

/**
 * Configuration options for a Cloudflare Hyperdrive connection.
 *
 * Passed to `app.addHyperdrive()` to declare a Hyperdrive config in the
 * app graph.
 *
 * @example
 * ```ts
 * const legacyDb = app.addHyperdrive("legacy-postgres", {
 *   connectionString: app.secret("LEGACY_PG_URL"),
 *   caching: { maxAge: 120, staleWhileRevalidate: 30 },
 * });
 * ```
 */
export interface HyperdriveOptions {
  /**
   * Connection string for the origin database.
   *
   * Supports PostgreSQL and MySQL connection strings. Can be a plain
   * string (for non-sensitive connection strings pointing to localhost
   * or test databases) or a {@link SecretRef} for production credentials.
   *
   * The connection string format depends on the database type:
   * - PostgreSQL: `postgres://user:password@host:port/database`
   * - MySQL: `mysql://user:password@host:port/database`
   *
   * @example "postgres://user:pass@db.example.com:5432/mydb"
   * @example app.secret("DATABASE_URL")
   */
  connectionString: string | SecretRef;

  /**
   * Query result caching configuration.
   *
   * Controls how Hyperdrive caches query results at the edge.
   * Omit to use Cloudflare's default caching settings.
   */
  caching?: HyperdriveCachingConfig;

  /**
   * Connection string to use for local development.
   *
   * During `levi dev`, this connection string is used instead of the
   * production `connectionString`. Typically points to a local database.
   *
   * @example "postgres://postgres:postgres@localhost:5432/mydb_dev"
   */
  localConnectionString?: string;

  /**
   * Existing Hyperdrive configuration ID to bind to.
   *
   * When set, Levi skips provisioning and binds directly to this
   * existing Hyperdrive config.
   *
   * @example "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
   */
  configId?: string;

  /**
   * Access scheme for connecting to the origin database.
   *
   * - `"access"` — Connect through Cloudflare Access (for databases
   *   behind Access policies).
   *
   * @see https://developers.cloudflare.com/hyperdrive/configuration/connect-to-private-database/
   */
  originAccess?: "access";
}
