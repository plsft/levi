import type { ResourceType, WorkflowOptions } from "../types/index.js";
import { Resource } from "./base.js";

/**
 * A Cloudflare Workflow resource.
 *
 * Workflows provide durable execution for multi-step processes,
 * with automatic retries and persistent state across steps.
 */
export class WorkflowResource extends Resource<WorkflowOptions> {
  readonly type: ResourceType = "workflow";
}
