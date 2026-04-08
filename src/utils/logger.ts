import { consola } from "consola";

/**
 * Shared logger instance for the Levi framework.
 *
 * Uses consola for structured, leveled output with a `[levi]` tag.
 * Import this instead of calling `console.*` directly so that
 * verbosity and output formatting can be controlled centrally.
 */
export const logger = consola.withTag("levi");
