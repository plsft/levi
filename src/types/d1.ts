/**
 * Type definitions for Cloudflare D1 databases in Levi.
 *
 * D1 is Cloudflare's serverless SQL database, built on SQLite. Levi
 * manages D1 database provisioning, migration configuration, and
 * binding generation.
 *
 * @module
 * @see https://developers.cloudflare.com/d1/
 */

// ---------------------------------------------------------------------------
// D1 Options
// ---------------------------------------------------------------------------

/**
 * Configuration options for a Cloudflare D1 database.
 *
 * Passed to `app.addD1()` to declare a D1 database in the app graph.
 *
 * @example
 * ```ts
 * const mainDb = app.addD1("main-db", {
 *   migrations: "./packages/db/migrations",
 *   migrationsTable: "d1_migrations",
 * });
 * ```
 */
export interface D1Options {
  /**
   * Path to the directory containing SQL migration files.
   *
   * Levi uses this path when running `levi provision` to apply pending
   * migrations via `wrangler d1 migrations apply`. Migration files
   * should be named sequentially (e.g., `0001_init.sql`, `0002_users.sql`).
   *
   * Relative paths are resolved from the project root or `basePath`.
   *
   * @example "./packages/db/migrations"
   * @example "./migrations"
   */
  migrations?: string;

  /**
   * Name of the table used by D1 to track applied migrations.
   *
   * Wrangler creates this table automatically on first migration run.
   *
   * @default "d1_migrations"
   */
  migrationsTable?: string;

  /**
   * Existing D1 database ID to use for preview/development environments.
   *
   * When set, `levi dev` uses this database instead of creating a local
   * one. Useful for sharing a dev/staging database across a team.
   *
   * @example "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
   */
  previewDatabaseId?: string;

  /**
   * Existing D1 database ID to bind to in production.
   *
   * When set, Levi skips provisioning and binds directly to this
   * existing database. Useful for importing databases created outside
   * of Levi.
   *
   * @example "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
   */
  databaseId?: string;

  /**
   * Location hint for the D1 database.
   *
   * Suggests a preferred region for the primary database instance.
   * Cloudflare uses this as a hint — actual placement depends on
   * availability and plan.
   *
   * @see https://developers.cloudflare.com/d1/configuration/data-location/
   * @example "weur" — Western Europe
   * @example "enam" — Eastern North America
   * @example "apac" — Asia Pacific
   */
  locationHint?: string;

  /**
   * Enable experimental read replication for this D1 database.
   *
   * When enabled, read queries may be served from read replicas
   * closer to the Worker, reducing latency for read-heavy workloads.
   *
   * @default false
   * @see https://developers.cloudflare.com/d1/configuration/read-replication/
   */
  readReplication?: boolean;
}
