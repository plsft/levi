import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

/**
 * Write content to a file, creating intermediate directories as needed.
 *
 * @param path - Absolute or relative file path.
 * @param content - String content to write (UTF-8).
 */
export async function writeOutput(path: string, content: string): Promise<void> {
  await ensureDir(dirname(path));
  await writeFile(path, content, "utf-8");
}

/**
 * Recursively create a directory if it does not already exist.
 *
 * @param path - Directory path to create.
 */
export async function ensureDir(path: string): Promise<void> {
  await mkdir(path, { recursive: true });
}

/**
 * Returns the `.levi` output directory for a given project root.
 *
 * All generated artifacts (wrangler configs, graph.json, etc.) are
 * written under this directory.
 *
 * @param projectRoot - Absolute path to the project root.
 * @returns Absolute path to the `.levi` directory.
 */
export function getLeviOutputDir(projectRoot: string): string {
  return join(projectRoot, ".levi");
}

/**
 * Returns the worker-specific config directory inside `.levi/workers/`.
 *
 * @param projectRoot - Absolute path to the project root.
 * @param workerName - Logical name of the worker.
 * @returns Absolute path to `.levi/workers/<workerName>`.
 */
export function getWorkerConfigDir(projectRoot: string, workerName: string): string {
  return join(getLeviOutputDir(projectRoot), "workers", workerName);
}
